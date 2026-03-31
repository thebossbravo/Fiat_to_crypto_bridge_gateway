package auth

import (
	"sync"
	"time"
)

// TokenBlacklist manages revoked JWT tokens with automatic cleanup.
type TokenBlacklist struct {
	mu     sync.RWMutex
	tokens map[string]time.Time // token -> expiresAt
}

func NewTokenBlacklist() *TokenBlacklist {
	tb := &TokenBlacklist{
		tokens: make(map[string]time.Time),
	}

	// Cleanup expired tokens every hour
	go tb.cleanupExpired()

	return tb
}

// Revoke adds a token to the blacklist until its natural expiration.
func (tb *TokenBlacklist) Revoke(tokenString string, expiresAt time.Time) {
	tb.mu.Lock()
	defer tb.mu.Unlock()
	tb.tokens[tokenString] = expiresAt
}

// IsRevoked checks if a token has been blacklisted.
func (tb *TokenBlacklist) IsRevoked(tokenString string) bool {
	tb.mu.RLock()
	defer tb.mu.RUnlock()
	_, exists := tb.tokens[tokenString]
	return exists
}

func (tb *TokenBlacklist) cleanupExpired() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for range ticker.C {
		tb.mu.Lock()
		now := time.Now()
		for token, expiresAt := range tb.tokens {
			if now.After(expiresAt) {
				delete(tb.tokens, token)
			}
		}
		tb.mu.Unlock()
	}
}
