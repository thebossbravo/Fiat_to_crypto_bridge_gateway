package webhooks

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	db "bridge-gateway-backend/db/sqlc"
	"bridge-gateway-backend/internal/audit"
	"bridge-gateway-backend/internal/transactions"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	transactionService *transactions.Service
	auditService       *audit.Service
	verifier           *SignatureVerifier
}

func NewHandler(pool *pgxpool.Pool, verifier *SignatureVerifier) *Handler {
	transactionRepo := transactions.NewSQLCRepository(pool)
	auditRepo := audit.NewSQLCRepository(pool)
	return &Handler{
		transactionService: transactions.NewService(transactionRepo),
		auditService:       audit.NewService(auditRepo),
		verifier:           verifier,
	}
}

// BlockradarWebhookPayload represents the incoming Blockradar webhook
type BlockradarWebhookPayload struct {
	Event string          `json:"event"`
	Data  json.RawMessage `json:"data"`
}

type BlockradarSwapData struct {
	SwapID        string `json:"swap_id"`
	Status        string `json:"status"`
	TxHash        string `json:"tx_hash"`
	AmountUSDC    string `json:"amount_usdc"`
	WalletAddress string `json:"wallet_address"`
}

// HandleBlockradarWebhook processes Blockradar webhook events
func (h *Handler) HandleBlockradarWebhook(w http.ResponseWriter, r *http.Request) {
	var payload BlockradarWebhookPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received Blockradar webhook: event=%s", payload.Event)

	switch payload.Event {
	case "swap.completed":
		var data BlockradarSwapData
		if err := json.Unmarshal(payload.Data, &data); err != nil {
			log.Printf("Error parsing swap data: %v", err)
			http.Error(w, "Invalid swap data", http.StatusBadRequest)
			return
		}
		h.handleSwapCompleted(r, data)

	case "swap.failed":
		var data BlockradarSwapData
		if err := json.Unmarshal(payload.Data, &data); err != nil {
			log.Printf("Error parsing swap data: %v", err)
			http.Error(w, "Invalid swap data", http.StatusBadRequest)
			return
		}
		h.handleSwapFailed(r, data)

	default:
		log.Printf("Unhandled Blockradar event: %s", payload.Event)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "received"})
}

func (h *Handler) handleSwapCompleted(r *http.Request, data BlockradarSwapData) {
	ctx := r.Context()

	// Find transaction by swap_id - get pending transactions and search
	pendingTxs, err := h.transactionService.GetPendingTransactions(ctx)
	if err != nil {
		log.Printf("Error getting pending transactions for swap %s: %v", data.SwapID, err)
		return
	}

	var targetTxID string
	for _, tx := range pendingTxs {
		if tx.BlockradarSwapID.Valid && tx.BlockradarSwapID.String == data.SwapID {
			targetTxID = pgUUIDToString(tx.ID)
			break
		}
	}

	if targetTxID == "" {
		log.Printf("No pending transaction found for swap %s", data.SwapID)
		return
	}

	// Update transaction to completed
	err = h.transactionService.UpdateTransactionState(ctx, targetTxID, db.TransactionStateCompleted)
	if err != nil {
		log.Printf("Error updating transaction %s to completed: %v", targetTxID, err)
		return
	}

	// Log audit
	_ = h.auditService.LogStateChange(ctx, targetTxID, "", "swap_completed", db.TransactionStateSwapping, db.TransactionStateCompleted, map[string]interface{}{
		"source":      "blockradar_webhook",
		"swap_id":     data.SwapID,
		"tx_hash":     data.TxHash,
		"amount_usdc": data.AmountUSDC,
	})

	log.Printf("Swap completed: %s -> tx %s", data.SwapID, data.TxHash)
}

func pgUUIDToString(u pgtype.UUID) string {
	if u.Valid {
		b := u.Bytes
		return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
	}
	return ""
}

func (h *Handler) handleSwapFailed(r *http.Request, data BlockradarSwapData) {
	ctx := r.Context()

	// Find transaction by swap_id
	pendingTxs, err := h.transactionService.GetPendingTransactions(ctx)
	if err != nil {
		log.Printf("Error getting pending transactions for swap %s: %v", data.SwapID, err)
		return
	}

	var targetTxID string
	for _, tx := range pendingTxs {
		if tx.BlockradarSwapID.Valid && tx.BlockradarSwapID.String == data.SwapID {
			targetTxID = pgUUIDToString(tx.ID)
			break
		}
	}

	if targetTxID == "" {
		log.Printf("No pending transaction found for swap %s", data.SwapID)
		return
	}

	// Update transaction to failed
	err = h.transactionService.UpdateTransactionState(ctx, targetTxID, db.TransactionStateFailed)
	if err != nil {
		log.Printf("Error updating transaction %s to failed: %v", targetTxID, err)
		return
	}

	// Log audit
	_ = h.auditService.LogStateChange(ctx, targetTxID, "", "swap_failed", db.TransactionStateSwapping, db.TransactionStateFailed, map[string]interface{}{
		"source":  "blockradar_webhook",
		"swap_id": data.SwapID,
		"reason":  "Swap failed on Blockradar",
	})

	log.Printf("Swap failed: %s", data.SwapID)
}

// StripeWebhookPayload represents the incoming Stripe webhook
type StripeWebhookPayload struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type StripePaymentData struct {
	Object struct {
		ID       string `json:"id"`
		Amount   int64  `json:"amount"`
		Currency string `json:"currency"`
		Status   string `json:"status"`
		Metadata struct {
			TransactionID string `json:"transaction_id"`
		} `json:"metadata"`
	} `json:"object"`
}

// HandleStripeWebhook processes Stripe webhook events
func (h *Handler) HandleStripeWebhook(w http.ResponseWriter, r *http.Request) {
	var payload StripeWebhookPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received Stripe webhook: type=%s", payload.Type)

	switch payload.Type {
	case "payment_intent.succeeded":
		var data StripePaymentData
		if err := json.Unmarshal(payload.Data, &data); err != nil {
			log.Printf("Error parsing payment data: %v", err)
			http.Error(w, "Invalid payment data", http.StatusBadRequest)
			return
		}

		txID := data.Object.Metadata.TransactionID
		if txID == "" {
			log.Printf("Missing transaction_id in Stripe metadata")
			break
		}

		// Update transaction to fiat_received
		err := h.transactionService.UpdateTransactionState(r.Context(), txID, db.TransactionStateFiatReceived)
		if err != nil {
			log.Printf("Error updating transaction %s: %v", txID, err)
			break
		}

		// Log audit
		_ = h.auditService.LogStateChange(r.Context(), txID, "", "fiat_received", db.TransactionStatePending, db.TransactionStateFiatReceived, map[string]interface{}{
			"source":          "stripe_webhook",
			"card_payment_id": data.Object.ID,
			"amount":          data.Object.Amount,
			"currency":        data.Object.Currency,
		})

		log.Printf("Payment received for transaction %s: %s", txID, data.Object.ID)

	default:
		log.Printf("Unhandled Stripe event: %s", payload.Type)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "received"})
}
