package server

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"bridge-gateway-backend/pkg/finance"

	"github.com/shopspring/decimal"
)

// Type alias for decimal.Decimal
type Decimal = decimal.Decimal

// ReconciliationRequest represents a reconciliation request
type ReconciliationRequest struct {
	TransactionID  string `json:"transaction_id" validate:"required"`
	ExpectedAmount string `json:"expected_amount" validate:"required"`
	ActualAmount   string `json:"actual_amount" validate:"required"`
	Currency       string `json:"currency" validate:"required,oneof=USD EUR"`
	Tolerance      string `json:"tolerance,omitempty"` // Percentage tolerance
}

// ReconciliationResponse represents a reconciliation response
type ReconciliationResponse struct {
	Entry  *finance.ReconciliationEntry `json:"entry"`
	Status string                       `json:"status"`
}

// MetricsRequest represents a metrics request
type MetricsRequest struct {
	Period    string `json:"period" validate:"required,oneof=daily weekly monthly"`
	StartDate string `json:"start_date" validate:"required"`
	EndDate   string `json:"end_date" validate:"required"`
}

// MetricsResponse represents metrics response
type MetricsResponse struct {
	Metrics *finance.FinancialMetrics `json:"metrics"`
	Period  string                    `json:"period"`
}

// handleReconcileTransaction reconciles a single transaction
func (s *Server) handleReconcileTransaction(w http.ResponseWriter, r *http.Request) {
	var req ReconciliationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		apiError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
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

	// Parse amounts using decimal for precision
	expectedAmount, err := parseAmount(req.ExpectedAmount)
	if err != nil {
		apiError(w, "Invalid expected amount", http.StatusBadRequest)
		return
	}

	actualAmount, err := parseAmount(req.ActualAmount)
	if err != nil {
		apiError(w, "Invalid actual amount", http.StatusBadRequest)
		return
	}

	// Parse tolerance (default to 1%)
	tolerance := decimal.NewFromFloat(0.01) // 1% default
	if req.Tolerance != "" {
		tolerance, err = parseAmount(req.Tolerance)
		if err != nil {
			apiError(w, "Invalid tolerance amount", http.StatusBadRequest)
			return
		}
	}

	// Perform reconciliation
	entry := finance.ReconcileTransaction(req.TransactionID, expectedAmount, actualAmount, tolerance)

	log.Printf("Reconciliation completed for transaction %s: status=%s, variance=%s",
		req.TransactionID, entry.Status, entry.Variance.String())

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ReconciliationResponse{
		Entry:  entry,
		Status: "completed",
	})
}

// handleGetMetrics retrieves financial metrics for a period
func (s *Server) handleGetMetrics(w http.ResponseWriter, r *http.Request) {
	var req MetricsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		apiError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
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

	// Parse dates
	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		apiError(w, "Invalid start date format", http.StatusBadRequest)
		return
	}

	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		apiError(w, "Invalid end date format", http.StatusBadRequest)
		return
	}

	// Get transactions for the period
	transactions, err := s.getTransactionsForPeriod(startDate, endDate)
	if err != nil {
		log.Printf("Error fetching transactions for metrics: %v", err)
		apiError(w, "Failed to fetch transaction data", http.StatusInternalServerError)
		return
	}

	// Calculate metrics
	metrics := finance.CalculateMetrics(transactions, req.Period)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(MetricsResponse{
		Metrics: metrics,
		Period:  req.Period,
	})
}

// handleExchangeRates retrieves current exchange rates
func (s *Server) handleExchangeRates(w http.ResponseWriter, r *http.Request) {
	provider := finance.NewMockExchangeRateProvider()

	// Refresh rates
	if err := provider.RefreshRates(); err != nil {
		log.Printf("Error refreshing exchange rates: %v", err)
		apiError(w, "Failed to refresh rates", http.StatusInternalServerError)
		return
	}

	// Get common rates
	rates := make(map[string]interface{})

	usdToEur, _ := provider.GetRate("USD", "EUR")
	eurToUsd, _ := provider.GetRate("EUR", "USD")

	rates["USD_EUR"] = map[string]interface{}{
		"rate":       usdToEur.Rate.String(),
		"updated_at": usdToEur.UpdatedAt,
	}
	rates["EUR_USD"] = map[string]interface{}{
		"rate":       eurToUsd.Rate.String(),
		"updated_at": eurToUsd.UpdatedAt,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"rates":     rates,
		"timestamp": time.Now(),
	})
}

// handleCurrencyConversion performs currency conversion
func (s *Server) handleCurrencyConversion(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Amount       string `json:"amount" validate:"required"`
		FromCurrency string `json:"from_currency" validate:"required,oneof=USD EUR"`
		ToCurrency   string `json:"to_currency" validate:"required,oneof=USD EUR"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		apiError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
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

	// Parse amount
	amount, err := parseAmount(req.Amount)
	if err != nil {
		apiError(w, "Invalid amount", http.StatusBadRequest)
		return
	}

	// Perform conversion
	provider := finance.NewMockExchangeRateProvider()
	result, err := finance.ConvertCurrency(amount, req.FromCurrency, req.ToCurrency, provider)
	if err != nil {
		apiError(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// Helper function to parse amount string to decimal
func parseAmount(amountStr string) (Decimal, error) {
	return decimal.NewFromString(amountStr)
}

// Helper function to get transactions for a period (mock implementation)
func (s *Server) getTransactionsForPeriod(startDate, endDate time.Time) ([]finance.TransactionData, error) {
	// Mock data - in production, this would query the database
	transactions := []finance.TransactionData{
		{
			ID:     "tx_1",
			Amount: decimal.NewFromFloat(100.50),
			Fee:    decimal.NewFromFloat(2.50),
			Status: "completed",
			Date:   startDate.AddDate(0, 0, 1),
		},
		{
			ID:     "tx_2",
			Amount: decimal.NewFromFloat(250.00),
			Fee:    decimal.NewFromFloat(5.00),
			Status: "completed",
			Date:   startDate.AddDate(0, 0, 3),
		},
		{
			ID:     "tx_3",
			Amount: decimal.NewFromFloat(75.25),
			Fee:    decimal.NewFromFloat(1.50),
			Status: "failed",
			Date:   startDate.AddDate(0, 0, 5),
		},
	}

	return transactions, nil
}
