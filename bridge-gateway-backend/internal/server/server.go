package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"

	"bridge-gateway-backend/internal/audit"
	"bridge-gateway-backend/internal/auth"
	"bridge-gateway-backend/internal/database"
	"bridge-gateway-backend/internal/transactions"
	"bridge-gateway-backend/internal/webhooks"
)

type Server struct {
	port int

	db                 database.Service
	authService        *auth.Service
	transactionService *transactions.Service
	auditService       *audit.Service
	webhookHandler     *webhooks.Handler
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))

	// Initialize custom validators
	RegisterCustomValidators()

	db := database.New()

	// Run database migrations
	if err := db.RunMigrations("db/migrations"); err != nil {
		log.Printf("Warning: migrations failed: %v", err)
	}

	// Initialize dependencies
	pool := db.GetPool()

	// Initialize repositories with sqlc (using pgxpool for native pgx compatibility)
	authRepo := auth.NewSQLCRepository(pool)
	transactionRepo := transactions.NewSQLCRepository(pool)
	auditRepo := audit.NewSQLCRepository(pool)

	blockradarAPIKey := os.Getenv("BLOCKRADAR_API_KEY")
	blockradarBaseURL := os.Getenv("BLOCKRADAR_BASE_URL")
	blockradarClient := auth.NewBlockradarClient(blockradarAPIKey, blockradarBaseURL)

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "bridge-protocol-dev-secret-change-in-production"
	}

	authSvc := auth.NewService(authRepo, blockradarClient, jwtSecret)

	// Initialize other services
	transactionSvc := transactions.NewService(transactionRepo)
	auditSvc := audit.NewService(auditRepo)

	// Initialize webhook handler
	blockradarWebhookSecret := os.Getenv("BLOCKRADAR_WEBHOOK_SECRET")
	stripeWebhookSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")
	_ = stripeWebhookSecret // used when wiring Stripe middleware
	webhookVerifier := webhooks.NewSignatureVerifier(blockradarWebhookSecret)
	webhookHandler := webhooks.NewHandler(pool, webhookVerifier)

	newServer := &Server{
		port:               port,
		db:                 db,
		authService:        authSvc,
		transactionService: transactionSvc,
		auditService:       auditSvc,
		webhookHandler:     webhookHandler,
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", newServer.port),
		Handler:      newServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
