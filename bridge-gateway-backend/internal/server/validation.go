package server

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
)

// Validator instance for struct validation
var validate = validator.New()

// ValidationError represents a collection of validation errors
type ValidationError struct {
	Errors map[string]string `json:"errors"`
}

func (v ValidationError) Error() string {
	var messages []string
	for field, message := range v.Errors {
		messages = append(messages, fmt.Sprintf("%s: %s", field, message))
	}
	return strings.Join(messages, "; ")
}

// ValidateStruct validates a struct and returns detailed errors
func ValidateStruct(s interface{}) error {
	if err := validate.Struct(s); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			errors := make(map[string]string)
			for _, e := range validationErrors {
				errors[e.Field()] = getErrorMessage(e)
			}
			return ValidationError{Errors: errors}
		}
		return err
	}
	return nil
}

// getErrorMessage converts validation tag to user-friendly message
func getErrorMessage(e validator.FieldError) string {
	field := e.Field()
	tag := e.Tag()
	param := e.Param()

	switch tag {
	case "required":
		return fmt.Sprintf("%s is required", field)
	case "min":
		return fmt.Sprintf("%s must be at least %s", field, param)
	case "max":
		return fmt.Sprintf("%s must be at most %s", field, param)
	case "email":
		return fmt.Sprintf("%s must be a valid email address", field)
	case "oneof":
		return fmt.Sprintf("%s must be one of: %s", field, param)
	case "numeric":
		return fmt.Sprintf("%s must contain only numbers", field)
	case "len":
		return fmt.Sprintf("%s must be exactly %s characters", field, param)
	default:
		return fmt.Sprintf("%s is invalid", field)
	}
}

// RegisterCustomValidators adds custom validation rules
func RegisterCustomValidators() {
	// Custom validator for currency codes
	validate.RegisterValidation("currency", validateCurrency)

	// Custom validator for idempotency keys
	validate.RegisterValidation("idempotency_key", validateIdempotencyKey)
}

// validateCurrency checks if the value is a valid ISO 4217 currency code
func validateCurrency(fl validator.FieldLevel) bool {
	currency := fl.Field().String()
	validCurrencies := map[string]bool{
		"USD": true, "EUR": true, "GBP": true, "JPY": true,
		"AUD": true, "CAD": true, "CHF": true, "CNY": true,
	}
	return validCurrencies[currency]
}

// validateIdempotencyKey checks if the idempotency key format is valid
func validateIdempotencyKey(fl validator.FieldLevel) bool {
	key := fl.Field().String()
	// Basic validation: non-empty, reasonable length, alphanumeric with some allowed chars
	if len(key) < 8 || len(key) > 255 {
		return false
	}

	// Allow alphanumeric, dash, underscore
	for _, r := range key {
		if !((r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') ||
			(r >= '0' && r <= '9') || r == '-' || r == '_') {
			return false
		}
	}
	return true
}

// SanitizeInput cleans and sanitizes string inputs
func SanitizeInput(input string) string {
	// Trim whitespace
	input = strings.TrimSpace(input)

	// Remove potential SQL injection patterns
	dangerousPatterns := []string{
		"DROP", "DELETE", "INSERT", "UPDATE", "SELECT",
		"'", "\"", ";", "--", "/*", "*/", "xp_", "sp_",
	}

	for _, pattern := range dangerousPatterns {
		input = strings.ReplaceAll(strings.ToUpper(input), pattern, "")
	}

	return input
}

// ValidateAndSanitize validates and sanitizes input structs
func ValidateAndSanitize(s interface{}) error {
	// First sanitize string fields
	sanitizeStructFields(s)

	// Then validate
	return ValidateStruct(s)
}

// sanitizeStructFields recursively sanitizes string fields in a struct
func sanitizeStructFields(s interface{}) {
	v := reflect.ValueOf(s)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}

	if v.Kind() != reflect.Struct {
		return
	}

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)

		// Skip unexported fields
		if !field.CanSet() {
			continue
		}

		switch field.Kind() {
		case reflect.String:
			sanitized := SanitizeInput(field.String())
			field.SetString(sanitized)
		case reflect.Struct:
			sanitizeStructFields(field.Addr().Interface())
		case reflect.Slice:
			for j := 0; j < field.Len(); j++ {
				elem := field.Index(j)
				if elem.Kind() == reflect.String {
					sanitized := SanitizeInput(elem.String())
					elem.SetString(sanitized)
				} else if elem.Kind() == reflect.Struct {
					sanitizeStructFields(elem.Addr().Interface())
				}
			}
		}
	}
}
