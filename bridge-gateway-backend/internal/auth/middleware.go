package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserContextKey contextKey = "user"

// JWTMiddleware validates JWT tokens and adds user to context
func (s *Service) JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			jsonError(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Extract token from "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			jsonError(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		tokenString := tokenParts[1]

		// Check if token has been revoked
		if s.blacklist.IsRevoked(tokenString) {
			jsonError(w, "Token has been revoked", http.StatusUnauthorized)
			return
		}

		// Parse and validate token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
			// Validate signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(s.jwtSecret), nil
		})

		if err != nil || !token.Valid {
			jsonError(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			jsonError(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Get user ID from claims
		userID, ok := claims["user_id"].(string)
		if !ok {
			jsonError(w, "Invalid user ID in token", http.StatusUnauthorized)
			return
		}

		// Get user from database
		user, err := s.repo.GetUserByID(r.Context(), userID)
		if err != nil {
			jsonError(w, "User not found", http.StatusUnauthorized)
			return
		}

		// Add user to context
		ctx := context.WithValue(r.Context(), UserContextKey, user)

		// Continue with request
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserFromContext retrieves user from request context
func GetUserFromContext(r *http.Request) (*User, bool) {
	user, ok := r.Context().Value(UserContextKey).(*User)
	return user, ok
}

// OptionalAuthMiddleware is like JWTMiddleware but doesn't fail if no token
func (s *Service) OptionalAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			next.ServeHTTP(w, r)
			return
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			next.ServeHTTP(w, r)
			return
		}

		tokenString := tokenParts[1]

		// Check blacklist
		if s.blacklist.IsRevoked(tokenString) {
			next.ServeHTTP(w, r)
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(s.jwtSecret), nil
		})

		if err != nil || !token.Valid {
			next.ServeHTTP(w, r)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			next.ServeHTTP(w, r)
			return
		}

		userID, ok := claims["user_id"].(string)
		if !ok {
			next.ServeHTTP(w, r)
			return
		}

		user, err := s.repo.GetUserByID(r.Context(), userID)
		if err != nil {
			next.ServeHTTP(w, r)
			return
		}

		ctx := context.WithValue(r.Context(), UserContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
