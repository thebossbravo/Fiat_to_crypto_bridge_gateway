package money

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

// Money represents a monetary amount with currency
type Money struct {
	AmountCents int64   // Amount in smallest currency unit (cents)
	Currency   string  // ISO 4217 currency code (USD, EUR)
}

// NewMoney creates a Money instance from amount in major units (e.g., dollars)
func NewMoney(amount float64, currency string) Money {
	// Convert to cents with proper rounding
	cents := int64(math.Round(amount * 100))
	return Money{AmountCents: cents, Currency: currency}
}

// NewMoneyFromCents creates Money from cents directly
func NewMoneyFromCents(cents int64, currency string) Money {
	return Money{AmountCents: cents, Currency: currency}
}

// ToMajor converts cents back to major units (e.g., dollars)
func (m Money) ToMajor() float64 {
	return float64(m.AmountCents) / 100.0
}

// String returns a formatted string representation
func (m Money) String() string {
	symbol := m.GetSymbol()
	return fmt.Sprintf("%s%.2f", symbol, m.ToMajor())
}

// GetSymbol returns the currency symbol
func (m Money) GetSymbol() string {
	switch m.Currency {
	case "USD":
		return "$"
	case "EUR":
		return "€"
	default:
		return m.Currency + " "
	}
}

// ValidateAmount checks if amount is within acceptable limits
func (m Money) ValidateAmount(minCents, maxCents int64) error {
	if m.AmountCents < minCents {
		return fmt.Errorf("amount %s is below minimum %s", 
			m.String(), 
			NewMoneyFromCents(minCents, m.Currency).String())
	}
	if m.AmountCents > maxCents {
		return fmt.Errorf("amount %s exceeds maximum %s", 
			m.String(), 
			NewMoneyFromCents(maxCents, m.Currency).String())
	}
	return nil
}

// ParseMoney parses a string amount with currency
func ParseMoney(amountStr string, currency string) (Money, error) {
	// Remove currency symbols and whitespace
	cleanStr := strings.ReplaceAll(amountStr, "$", "")
	cleanStr = strings.ReplaceAll(cleanStr, "€", "")
	cleanStr = strings.ReplaceAll(cleanStr, " ", "")
	
	amount, err := strconv.ParseFloat(cleanStr, 64)
	if err != nil {
		return Money{}, fmt.Errorf("invalid amount format: %s", amountStr)
	}
	
	return NewMoney(amount, currency), nil
}

// Add adds two Money values (must be same currency)
func (m Money) Add(other Money) Money {
	if m.Currency != other.Currency {
		panic("cannot add different currencies")
	}
	return Money{AmountCents: m.AmountCents + other.AmountCents, Currency: m.Currency}
}

// Subtract subtracts two Money values (must be same currency)
func (m Money) Subtract(other Money) Money {
	if m.Currency != other.Currency {
		panic("cannot subtract different currencies")
	}
	return Money{AmountCents: m.AmountCents - other.AmountCents, Currency: m.Currency}
}

// Multiply multiplies Money by a factor
func (m Money) Multiply(factor float64) Money {
	newCents := int64(math.Round(float64(m.AmountCents) * factor))
	return Money{AmountCents: newCents, Currency: m.Currency}
}

// Equals checks if two Money values are equal
func (m Money) Equals(other Money) bool {
	return m.AmountCents == other.AmountCents && m.Currency == other.Currency
}

// IsZero checks if amount is zero
func (m Money) IsZero() bool {
	return m.AmountCents == 0
}

// IsPositive checks if amount is positive
func (m Money) IsPositive() bool {
	return m.AmountCents > 0
}

// IsNegative checks if amount is negative
func (m Money) IsNegative() bool {
	return m.AmountCents < 0
}

// Constants for common limits
const (
	MinPaymentCents = 1000    // $10.00 / €10.00
	MaxPaymentCents = 10000000 // $100,000.00 / €100,000.00
)

// GetPaymentLimits returns min/max for a currency
func GetPaymentLimits(currency string) (minCents, maxCents int64) {
	// Same limits for USD and EUR for now
	return MinPaymentCents, MaxPaymentCents
}

// ValidatePaymentAmount checks if payment amount is valid
func ValidatePaymentAmount(cents int64, currency string) error {
	minCents, maxCents := GetPaymentLimits(currency)
	money := NewMoneyFromCents(cents, currency)
	return money.ValidateAmount(minCents, maxCents)
}
