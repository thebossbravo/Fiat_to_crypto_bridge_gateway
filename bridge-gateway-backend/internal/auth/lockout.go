package auth

import (
	"fmt"
	"sync"
	"time"
)

// AccountLockout tracks failed login attempts and locks accounts after too many failures.
type AccountLockout struct {
	mu            sync.RWMutex
	attempts      map[string]*attemptInfo
	maxAttempts   int
	lockDuration  time.Duration
}

type attemptInfo struct {
	count    int
	lockedAt time.Time
}

func NewAccountLockout() *AccountLockout {
	al := &AccountLockout{
		attempts:     make(map[string]*attemptInfo),
		maxAttempts:  5,
		lockDuration: 15 * time.Minute,
	}

	go al.cleanup()
	return al
}

// RecordFailedAttempt increments the failed attempt counter. Returns error if account becomes locked.
func (al *AccountLockout) RecordFailedAttempt(identifier string) error {
	al.mu.Lock()
	defer al.mu.Unlock()

	info, exists := al.attempts[identifier]
	if !exists {
		info = &attemptInfo{}
		al.attempts[identifier] = info
	}

	// Already locked?
	if !info.lockedAt.IsZero() && time.Now().Before(info.lockedAt.Add(al.lockDuration)) {
		remaining := time.Until(info.lockedAt.Add(al.lockDuration)).Round(time.Second)
		return fmt.Errorf("account locked, try again in %s", remaining)
	}

	// Reset if lock expired
	if !info.lockedAt.IsZero() {
		info.count = 0
		info.lockedAt = time.Time{}
	}

	info.count++

	if info.count >= al.maxAttempts {
		info.lockedAt = time.Now()
		return fmt.Errorf("account locked for %v due to too many failed attempts", al.lockDuration)
	}

	return nil
}

// RecordSuccess clears attempt history on successful login.
func (al *AccountLockout) RecordSuccess(identifier string) {
	al.mu.Lock()
	defer al.mu.Unlock()
	delete(al.attempts, identifier)
}

// IsLocked returns true if the identifier is currently locked out.
func (al *AccountLockout) IsLocked(identifier string) bool {
	al.mu.RLock()
	defer al.mu.RUnlock()

	info, exists := al.attempts[identifier]
	if !exists {
		return false
	}
	if info.lockedAt.IsZero() {
		return false
	}
	return time.Now().Before(info.lockedAt.Add(al.lockDuration))
}

func (al *AccountLockout) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		al.mu.Lock()
		now := time.Now()
		for id, info := range al.attempts {
			if !info.lockedAt.IsZero() && now.After(info.lockedAt.Add(al.lockDuration)) {
				delete(al.attempts, id)
			}
		}
		al.mu.Unlock()
	}
}
