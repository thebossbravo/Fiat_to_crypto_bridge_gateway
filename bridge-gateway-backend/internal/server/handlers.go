package server

import (
	db "bridge-gateway-backend/db/sqlc"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"bridge-gateway-backend/internal/auth"
	"bridge-gateway-backend/internal/transactions"
	"bridge-gateway-backend/pkg/money"

	"github.com/jackc/pgx/v5/pgtype"
)

func apiError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// handleGetWallet returns the authenticated user's wallet info
func (s *Server) handleGetWallet(w http.ResponseWriter, r *http.Request) {
	user, ok := auth.GetUserFromContext(r)
	if !ok {
		apiError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"address": user.WalletAddress,
		"balance": "0.00",
	})
}

// pgUUIDToString converts a pgtype.UUID to a string
func pgUUIDToString(u pgtype.UUID) string {
	if u.Valid {
		b := u.Bytes
		return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
	}
	return ""
}

// pgTextToString converts a pgtype.Text to a string pointer (nil if not valid)
func pgTextToStringPtr(t pgtype.Text) *string {
	if t.Valid {
		return &t.String
	}
	return nil
}

// handleGetTransactions returns the authenticated user's transactions
func (s *Server) handleGetTransactions(w http.ResponseWriter, r *http.Request) {
	user, ok := auth.GetUserFromContext(r)
	if !ok {
		apiError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	rows, err := s.transactionService.ListUserTransactions(r.Context(), user.ID, 50, 0)
	if err != nil {
		log.Printf("Error fetching transactions for user %s: %v", user.ID, err)
		apiError(w, "Failed to fetch transactions", http.StatusInternalServerError)
		return
	}

	type TransactionJSON struct {
		ID               string  `json:"id"`
		FiatAmountCents  int64   `json:"fiat_amount_cents"`
		FiatCurrency     string  `json:"fiat_currency"`
		CryptoAmountUSDC *string `json:"crypto_amount_usdc"`
		State            string  `json:"state"`
		BlockchainTxHash *string `json:"blockchain_tx_hash"`
		CreatedAt        string  `json:"created_at"`
	}

	txList := make([]TransactionJSON, 0, len(rows))
	for _, row := range rows {
		var cryptoStr *string
		if row.CryptoAmountUsdc.Valid {
			s := row.CryptoAmountUsdc.Int.String()
			cryptoStr = &s
		}
		txList = append(txList, TransactionJSON{
			ID:               pgUUIDToString(row.ID),
			FiatAmountCents:  row.FiatAmountCents,
			FiatCurrency:     row.FiatCurrency.String,
			CryptoAmountUSDC: cryptoStr,
			State:            string(row.State.TransactionState),
			BlockchainTxHash: pgTextToStringPtr(row.BlockchainTxHash),
			CreatedAt:        row.CreatedAt.Time.String(),
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"transactions": txList,
	})
}

// PaymentInitRequest represents a payment initialization request
type PaymentInitRequest struct {
	AmountCents    int64  `json:"amount_cents" validate:"required,min=1000,max=10000000"`
	Currency       string `json:"currency" validate:"required,oneof=USD EUR, currency"`
	IdempotencyKey string `json:"idempotency_key" validate:"required,idempotency_key"`
}

// handlePaymentInit creates a new pending transaction
func (s *Server) handlePaymentInit(w http.ResponseWriter, r *http.Request) {
	user, ok := auth.GetUserFromContext(r)
	if !ok {
		apiError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req PaymentInitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		apiError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate and sanitize input
	if err := ValidateAndSanitize(&req); err != nil {
		if validationErr, ok := err.(ValidationError); ok {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(validationErr)
			return
		}
		apiError(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Currency validation
	if req.Currency == "" {
		req.Currency = "USD"
	}
	if req.Currency != "USD" && req.Currency != "EUR" {
		apiError(w, "Only USD and EUR are supported", http.StatusBadRequest)
		return
	}

	// Financial amount validation using proper money package
	if err := money.ValidatePaymentAmount(req.AmountCents, req.Currency); err != nil {
		apiError(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Create transaction using sqlc service
	transaction, err := s.transactionService.CreateTransaction(r.Context(), transactions.CreateTransactionParams{
		UserID:          user.ID,
		FiatAmountCents: req.AmountCents,
		FiatCurrency:    req.Currency,
		ClientIP:        r.RemoteAddr,
		UserAgent:       r.UserAgent(),
		IdempotencyKey:  req.IdempotencyKey,
	})

	if err != nil {
		log.Printf("Error creating transaction for user %s: %v", user.ID, err)
		apiError(w, "Failed to create transaction", http.StatusInternalServerError)
		return
	}

	txID := pgUUIDToString(transaction.ID)

	// Log to audit using sqlc service
	err = s.auditService.LogStateChange(r.Context(), txID, user.ID, "payment_initiated", db.TransactionStatePending, db.TransactionStatePending, map[string]interface{}{
		"source":   "api",
		"amount":   req.AmountCents,
		"currency": req.Currency,
	})
	if err != nil {
		log.Printf("Failed to create audit log for transaction %s: %v", txID, err)
		// Don't fail the request if audit logging fails
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"transaction_id": txID,
		"status":         "pending",
	})
}
