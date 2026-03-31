package auth

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"unicode"

	"golang.org/x/crypto/argon2"
)

// jsonError writes a structured JSON error response.
func jsonError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// validatePasswordPolicy enforces password strength requirements.
func validatePasswordPolicy(password string) string {
	if len(password) < 8 {
		return "Password must be at least 8 characters"
	}
	var hasUpper, hasLower, hasDigit bool
	for _, ch := range password {
		switch {
		case unicode.IsUpper(ch):
			hasUpper = true
		case unicode.IsLower(ch):
			hasLower = true
		case unicode.IsDigit(ch):
			hasDigit = true
		}
	}
	if !hasUpper {
		return "Password must contain at least one uppercase letter"
	}
	if !hasLower {
		return "Password must contain at least one lowercase letter"
	}
	if !hasDigit {
		return "Password must contain at least one digit"
	}
	return ""
}

// hashPassword hashes a password using Argon2id with recommended parameters.
func hashPassword(password string) (string, error) {
	// Use Argon2id with recommended parameters
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)

	// Store salt and hash together
	saltAndHash := append(salt, hash...)
	return base64.StdEncoding.EncodeToString(saltAndHash), nil
}

// verifyPassword verifies a password against its hash.
func verifyPassword(hashedPassword, password string) bool {
	saltAndHash, err := base64.StdEncoding.DecodeString(hashedPassword)
	if err != nil || len(saltAndHash) < 16 {
		return false
	}

	salt := saltAndHash[:16]
	storedHash := saltAndHash[16:]

	computedHash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)

	return subtle.ConstantTimeCompare(storedHash, computedHash) == 1
}
