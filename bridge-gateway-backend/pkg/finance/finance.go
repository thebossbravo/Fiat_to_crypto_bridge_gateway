package finance

import (
	"fmt"
	"time"

	"github.com/shopspring/decimal"
)

// ExchangeRate represents a currency exchange rate
type ExchangeRate struct {
	FromCurrency string          `json:"from_currency"`
	ToCurrency   string          `json:"to_currency"`
	Rate         decimal.Decimal `json:"rate"`
	UpdatedAt    time.Time       `json:"updated_at"`
}

// ConversionResult represents a currency conversion result
type ConversionResult struct {
	OriginalAmount    decimal.Decimal `json:"original_amount"`
	OriginalCurrency  string          `json:"original_currency"`
	ConvertedAmount   decimal.Decimal `json:"converted_amount"`
	ConvertedCurrency string          `json:"converted_currency"`
	Rate              decimal.Decimal `json:"rate"`
	ConvertedAt       time.Time       `json:"converted_at"`
}

// FeeCalculation represents fee breakdown
type FeeCalculation struct {
	BaseAmount    decimal.Decimal `json:"base_amount"`
	PercentageFee decimal.Decimal `json:"percentage_fee"`
	FixedFee      decimal.Decimal `json:"fixed_fee"`
	TotalFee      decimal.Decimal `json:"total_fee"`
	NetAmount     decimal.Decimal `json:"net_amount"`
	FeePercentage decimal.Decimal `json:"fee_percentage"`
}

// ReconciliationEntry represents a reconciliation record
type ReconciliationEntry struct {
	ID              string          `json:"id"`
	TransactionID   string          `json:"transaction_id"`
	ExpectedAmount  decimal.Decimal `json:"expected_amount"`
	ActualAmount    decimal.Decimal `json:"actual_amount"`
	Variance        decimal.Decimal `json:"variance"`
	VariancePercent decimal.Decimal `json:"variance_percent"`
	Status          string          `json:"status"` // "matched", "mismatch", "missing"
	ReconciledAt    time.Time       `json:"reconciled_at"`
	Notes           string          `json:"notes"`
}

// ExchangeRateProvider interface for rate providers
type ExchangeRateProvider interface {
	GetRate(fromCurrency, toCurrency string) (*ExchangeRate, error)
	RefreshRates() error
}

// MockExchangeRateProvider for testing/development
type MockExchangeRateProvider struct {
	rates map[string]decimal.Decimal
}

func NewMockExchangeRateProvider() *MockExchangeRateProvider {
	return &MockExchangeRateProvider{
		rates: map[string]decimal.Decimal{
			"USD-EUR": decimal.NewFromFloat(0.85),
			"EUR-USD": decimal.NewFromFloat(1.18),
			"USD-USD": decimal.NewFromInt(1),
			"EUR-EUR": decimal.NewFromInt(1),
		},
	}
}

func (p *MockExchangeRateProvider) GetRate(fromCurrency, toCurrency string) (*ExchangeRate, error) {
	key := fmt.Sprintf("%s-%s", fromCurrency, toCurrency)
	rate, exists := p.rates[key]
	if !exists {
		return nil, fmt.Errorf("exchange rate not found for %s to %s", fromCurrency, toCurrency)
	}

	return &ExchangeRate{
		FromCurrency: fromCurrency,
		ToCurrency:   toCurrency,
		Rate:         rate,
		UpdatedAt:    time.Now(),
	}, nil
}

func (p *MockExchangeRateProvider) RefreshRates() error {
	// In production, this would call an API like Fixer.io, OpenExchangeRates, etc.
	// For now, simulate rate updates
	p.rates["USD-EUR"] = decimal.NewFromFloat(0.851)
	p.rates["EUR-USD"] = decimal.NewFromFloat(1.175)
	return nil
}

// ConvertCurrency converts amount from one currency to another
func ConvertCurrency(amount decimal.Decimal, fromCurrency, toCurrency string, provider ExchangeRateProvider) (*ConversionResult, error) {
	if fromCurrency == toCurrency {
		return &ConversionResult{
			OriginalAmount:    amount,
			OriginalCurrency:  fromCurrency,
			ConvertedAmount:   amount,
			ConvertedCurrency: toCurrency,
			Rate:              decimal.NewFromInt(1),
			ConvertedAt:       time.Now(),
		}, nil
	}

	rate, err := provider.GetRate(fromCurrency, toCurrency)
	if err != nil {
		return nil, fmt.Errorf("failed to get exchange rate: %w", err)
	}

	convertedAmount := amount.Mul(rate.Rate)

	return &ConversionResult{
		OriginalAmount:    amount,
		OriginalCurrency:  fromCurrency,
		ConvertedAmount:   convertedAmount,
		ConvertedCurrency: toCurrency,
		Rate:              rate.Rate,
		ConvertedAt:       rate.UpdatedAt,
	}, nil
}

// CalculateFees calculates percentage and fixed fees
func CalculateFees(baseAmount, percentageRate, fixedFee decimal.Decimal) *FeeCalculation {
	percentageFee := baseAmount.Mul(percentageRate).Div(decimal.NewFromInt(100))
	totalFee := percentageFee.Add(fixedFee)
	netAmount := baseAmount.Sub(totalFee)

	return &FeeCalculation{
		BaseAmount:    baseAmount,
		PercentageFee: percentageFee,
		FixedFee:      fixedFee,
		TotalFee:      totalFee,
		NetAmount:     netAmount,
		FeePercentage: percentageRate,
	}
}

// ReconcileTransaction reconciles expected vs actual amounts
func ReconcileTransaction(transactionID string, expectedAmount, actualAmount decimal.Decimal, tolerancePercent decimal.Decimal) *ReconciliationEntry {
	variance := actualAmount.Sub(expectedAmount)
	variancePercent := decimal.Zero

	if !expectedAmount.IsZero() {
		variancePercent = variance.Div(expectedAmount).Mul(decimal.NewFromInt(100))
	}

	status := "matched"
	tolerance := expectedAmount.Mul(tolerancePercent).Div(decimal.NewFromInt(100))

	if variance.Abs().GreaterThan(tolerance) {
		status = "mismatch"
	} else if actualAmount.IsZero() && !expectedAmount.IsZero() {
		status = "missing"
	}

	return &ReconciliationEntry{
		ID:              fmt.Sprintf("rec_%s_%d", transactionID, time.Now().Unix()),
		TransactionID:   transactionID,
		ExpectedAmount:  expectedAmount,
		ActualAmount:    actualAmount,
		Variance:        variance,
		VariancePercent: variancePercent,
		Status:          status,
		ReconciledAt:    time.Now(),
	}
}

// CalculateAPR calculates Annual Percentage Rate
func CalculateAPR(principal, interest decimal.Decimal, days int) decimal.Decimal {
	if days <= 0 {
		return decimal.Zero
	}

	dailyRate := interest.Div(principal).Div(decimal.NewFromInt(int64(days)))
	apr := dailyRate.Mul(decimal.NewFromInt(365)).Mul(decimal.NewFromInt(100))
	return apr
}

// CompoundInterest calculates compound interest
func CompoundInterest(principal, rate decimal.Decimal, periods int) decimal.Decimal {
	if periods <= 0 {
		return principal
	}

	// A = P(1 + r)^n
	onePlusRate := decimal.NewFromInt(1).Add(rate)
	result := principal

	for i := 0; i < periods; i++ {
		result = result.Mul(onePlusRate)
	}

	return result
}

// DiscountedCashFlow calculates discounted cash flow
func DiscountedCashFlow(cashFlow decimal.Decimal, discountRate decimal.Decimal, periods int) decimal.Decimal {
	if periods <= 0 {
		return decimal.Zero
	}

	// PV = FV / (1 + r)^n
	onePlusRate := decimal.NewFromInt(1).Add(discountRate)
	denominator := decimal.NewFromInt(1)

	for i := 0; i < periods; i++ {
		denominator = denominator.Mul(onePlusRate)
	}

	return cashFlow.Div(denominator)
}

// FinancialMetrics holds key financial metrics
type FinancialMetrics struct {
	TotalVolume        decimal.Decimal `json:"total_volume"`
	TotalFees          decimal.Decimal `json:"total_fees"`
	TotalTransactions  int64           `json:"total_transactions"`
	AverageTransaction decimal.Decimal `json:"average_transaction"`
	SuccessRate        decimal.Decimal `json:"success_rate"`
	Period             string          `json:"period"` // "daily", "weekly", "monthly"
}

// CalculateMetrics calculates financial metrics from transaction data
func CalculateMetrics(transactions []TransactionData, period string) *FinancialMetrics {
	var totalVolume, totalFees decimal.Decimal
	var successfulTx int64
	var totalTx int64 = int64(len(transactions))

	for _, tx := range transactions {
		totalVolume = totalVolume.Add(tx.Amount)
		totalFees = totalFees.Add(tx.Fee)
		if tx.Status == "completed" {
			successfulTx++
		}
	}

	averageTransaction := decimal.Zero
	if totalTx > 0 {
		averageTransaction = totalVolume.Div(decimal.NewFromInt(totalTx))
	}

	successRate := decimal.Zero
	if totalTx > 0 {
		successRate = decimal.NewFromInt(successfulTx).Div(decimal.NewFromInt(totalTx)).Mul(decimal.NewFromInt(100))
	}

	return &FinancialMetrics{
		TotalVolume:        totalVolume,
		TotalFees:          totalFees,
		TotalTransactions:  totalTx,
		AverageTransaction: averageTransaction,
		SuccessRate:        successRate,
		Period:             period,
	}
}

// TransactionData represents transaction data for metrics calculation
type TransactionData struct {
	ID     string          `json:"id"`
	Amount decimal.Decimal `json:"amount"`
	Fee    decimal.Decimal `json:"fee"`
	Status string          `json:"status"`
	Date   time.Time       `json:"date"`
}
