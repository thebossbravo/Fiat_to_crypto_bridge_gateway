package auth

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
)

// Handler for user registration
func (s *Service) HandleRegister(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Email == "" || req.Password == "" {
		jsonError(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	// Password policy
	if msg := validatePasswordPolicy(req.Password); msg != "" {
		jsonError(w, msg, http.StatusBadRequest)
		return
	}

	// Hash password with Argon2
	hashedPassword, err := hashPassword(req.Password)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		jsonError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Create user in database
	user, err := s.repo.CreateUser(r.Context(), CreateUserParams{
		Email:    req.Email,
		Password: string(hashedPassword),
	})
	if err != nil {
		// security: don't leak whether email exists
		log.Printf("Error creating user: %v", err)
		jsonError(w, "Failed to create user", http.StatusConflict)
		return
	}

	// Generate JWT token
	token, err := s.generateJWT(user)
	if err != nil {
		log.Printf("Error generating JWT: %v", err)
		jsonError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Create child wallet via Blockradar
	walletResp, err := s.blockradar.CreateChildWallet(user.ID, "base")
	if err != nil {
		// Log error but don't block registration
		log.Printf("Warning: Blockradar wallet creation failed for user %s: %v", user.ID, err)
	}

	walletAddr := ""
	if walletResp != nil {
		walletAddr = walletResp.WalletAddress
	}

	// Update user with wallet address
	if walletAddr != "" {
		err = s.repo.UpdateUserWallet(r.Context(), UpdateUserWalletParams{
			ID:         user.ID,
			WalletAddr: walletAddr,
		})
		if err != nil {
			log.Printf("Warning: Failed to update wallet for user %s: %v", user.ID, err)
		}
		user.WalletAddress = walletAddr
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(AuthResponse{
		Token:     token,
		User:      *user,
		ExpiresIn: 86400,
	})
}

// Handler for user login
func (s *Service) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check account lockout
	if s.lockout.IsLocked(req.Email) {
		jsonError(w, "Account temporarily locked due to too many failed attempts", http.StatusTooManyRequests)
		return
	}

	// Get user from database
	user, err := s.repo.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		_ = s.lockout.RecordFailedAttempt(req.Email)
		jsonError(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Verify password
	if !verifyPassword(user.Password, req.Password) {
		if lockErr := s.lockout.RecordFailedAttempt(req.Email); lockErr != nil {
			jsonError(w, lockErr.Error(), http.StatusTooManyRequests)
			return
		}
		jsonError(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Successful login — clear lockout
	s.lockout.RecordSuccess(req.Email)

	// Generate JWT token
	token, err := s.generateJWT(user)
	if err != nil {
		log.Printf("Error generating JWT: %v", err)
		jsonError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(AuthResponse{
		Token:     token,
		User:      *user,
		ExpiresIn: 86400,
	})
}

// HandleGoogleAuthURL returns the Google OAuth URL for the frontend to redirect to
func (s *Service) HandleGoogleAuthURL(w http.ResponseWriter, r *http.Request) {
	googleOAuth := NewGoogleOAuth()
	if googleOAuth == nil {
		jsonError(w, "Google OAuth not configured", http.StatusServiceUnavailable)
		return
	}

	state, err := generateStateToken()
	if err != nil {
		jsonError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	url := googleOAuth.Config.AuthCodeURL(state)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"url":   url,
		"state": state,
	})
}

// HandleGoogleAuth handles the Google OAuth callback with authorization code
func (s *Service) HandleGoogleAuth(w http.ResponseWriter, r *http.Request) {
	googleOAuth := NewGoogleOAuth()
	if googleOAuth == nil {
		jsonError(w, "Google OAuth not configured", http.StatusServiceUnavailable)
		return
	}

	var req struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Code == "" {
		jsonError(w, "Authorization code is required", http.StatusBadRequest)
		return
	}

	// Exchange code for user info
	googleUser, err := googleOAuth.GetUserInfo(r.Context(), req.Code)
	if err != nil {
		log.Printf("Google OAuth error: %v", err)
		jsonError(w, "Failed to authenticate with Google", http.StatusUnauthorized)
		return
	}

	// Check if user exists
	user, err := s.repo.GetUserByEmail(r.Context(), googleUser.Email)
	if err != nil {
		// User doesn't exist — create one (no password for OAuth users)
		user, err = s.repo.CreateUser(r.Context(), CreateUserParams{
			Email:    googleUser.Email,
			Password: "", // No password for Google OAuth users
		})
		if err != nil {
			log.Printf("Error creating Google OAuth user: %v", err)
			jsonError(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		// Create Blockradar wallet
		walletResp, walletErr := s.blockradar.CreateChildWallet(user.ID, "base")
		if walletErr != nil {
			log.Printf("Warning: Blockradar wallet creation failed for Google user %s: %v", user.ID, walletErr)
		}
		if walletResp != nil {
			_ = s.repo.UpdateUserWallet(r.Context(), UpdateUserWalletParams{
				ID:         user.ID,
				WalletAddr: walletResp.WalletAddress,
			})
			user.WalletAddress = walletResp.WalletAddress
		}
	}

	// Generate JWT
	token, err := s.generateJWT(user)
	if err != nil {
		log.Printf("Error generating JWT for Google user: %v", err)
		jsonError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(AuthResponse{
		Token:     token,
		User:      *user,
		ExpiresIn: 86400,
	})
}

// Handler for logout — revokes the current JWT
func (s *Service) HandleLogout(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		jsonError(w, "Authorization header required", http.StatusUnauthorized)
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		jsonError(w, "Invalid authorization header format", http.StatusUnauthorized)
		return
	}

	// Parse token to get expiry
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(s.jwtSecret), nil
	})
	if err != nil || !token.Valid {
		jsonError(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		jsonError(w, "Invalid token claims", http.StatusUnauthorized)
		return
	}

	// Get expiry from claims
	exp, ok := claims["exp"].(float64)
	expiresAt := time.Now().Add(24 * time.Hour) // fallback
	if ok {
		expiresAt = time.Unix(int64(exp), 0)
	}

	// Revoke token
	s.blacklist.Revoke(tokenString, expiresAt)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Logged out successfully",
	})
}

// Handler for getting current user info
func (s *Service) HandleMe(w http.ResponseWriter, r *http.Request) {
	user, ok := GetUserFromContext(r)
	if !ok {
		jsonError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Generate JWT token
func (s *Service) generateJWT(user *User) (string, error) {
	claims := jwt.MapClaims{
		"user_id":        user.ID,
		"email":          user.Email,
		"wallet_address": user.WalletAddress,
		"exp":            time.Now().Add(24 * time.Hour).Unix(),
		"iat":            time.Now().Unix(),
		"iss":            "bridge-protocol",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

// Register auth routes
func (s *Service) RegisterRoutes(r chi.Router) {
	r.Route("/auth", func(r chi.Router) {
		r.Post("/register", s.HandleRegister)
		r.Post("/login", s.HandleLogin)
		r.Get("/google/url", s.HandleGoogleAuthURL)
		r.Post("/google", s.HandleGoogleAuth)
		r.Post("/logout", s.HandleLogout)
		r.Get("/me", s.HandleMe)
	})
}
