package webhooks

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type SignatureVerifier struct {
	webhookSecret []byte
}

func NewSignatureVerifier(secret string) *SignatureVerifier {
	return &SignatureVerifier{
		webhookSecret: []byte(secret),
	}
}

// VerifyStripeSignature validates the Stripe webhook signature header.
func (v *SignatureVerifier) VerifyStripeSignature(payload []byte, signatureHeader string) error {
	if signatureHeader == "" {
		return fmt.Errorf("missing signature header")
	}

	var timestamp int64
	var sig string

	parts := strings.SplitSeq(signatureHeader, ",")
	for part := range parts {
		kv := strings.SplitN(part, "=", 2)
		if len(kv) != 2 {
			continue
		}
		switch kv[0] {
		case "t":
			timestamp, _ = strconv.ParseInt(kv[1], 10, 64)
		case "v1":
			sig = kv[1]
		}
	}

	if timestamp == 0 || sig == "" {
		return fmt.Errorf("invalid signature format")
	}

	// Validate timestamp (prevent replay attacks — max 5 min skew)
	if time.Now().Unix()-timestamp > 300 {
		return fmt.Errorf("timestamp too old: %d seconds", time.Now().Unix()-timestamp)
	}

	// Compute expected signature
	signedPayload := fmt.Sprintf("%d.%s", timestamp, payload)
	mac := hmac.New(sha256.New, v.webhookSecret)
	mac.Write([]byte(signedPayload))
	expectedSig := hex.EncodeToString(mac.Sum(nil))

	if !hmac.Equal([]byte(sig), []byte(expectedSig)) {
		return fmt.Errorf("signature mismatch")
	}

	return nil
}

// VerifyBlockradarSignature validates Blockradar webhook signatures.
func (v *SignatureVerifier) VerifyBlockradarSignature(payload []byte, signatureHeader string) error {
	if signatureHeader == "" {
		return fmt.Errorf("missing signature header")
	}

	mac := hmac.New(sha256.New, v.webhookSecret)
	mac.Write(payload)
	expectedSig := hex.EncodeToString(mac.Sum(nil))

	if !hmac.Equal([]byte(signatureHeader), []byte(expectedSig)) {
		return fmt.Errorf("signature mismatch")
	}

	return nil
}

// StripMiddleware is HTTP middleware that verifies Stripe webhook signatures.
func (v *SignatureVerifier) StripeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "cannot read body", http.StatusBadRequest)
			return
		}
		r.Body = io.NopCloser(bytes.NewBuffer(payload))

		signature := r.Header.Get("Stripe-Signature")
		if err := v.VerifyStripeSignature(payload, signature); err != nil {
			http.Error(w, "invalid signature", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// BlockradarMiddleware is HTTP middleware that verifies Blockradar webhook signatures.
func (v *SignatureVerifier) BlockradarMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "cannot read body", http.StatusBadRequest)
			return
		}
		r.Body = io.NopCloser(bytes.NewBuffer(payload))

		signature := r.Header.Get("X-Blockradar-Signature")
		if err := v.VerifyBlockradarSignature(payload, signature); err != nil {
			http.Error(w, "invalid signature", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
