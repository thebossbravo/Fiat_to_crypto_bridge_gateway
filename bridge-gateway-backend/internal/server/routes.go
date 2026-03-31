package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Throttle(100)) // rate limit: max 100 concurrent requests
	r.Use(SecurityHeaders)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/", s.HelloWorldHandler)
	r.Get("/health", s.healthHandler)

	r.Route("/api", func(api chi.Router) {
		// Public auth routes (no JWT required)
		s.authService.RegisterRoutes(api)

		// Protected routes (JWT required)
		api.Group(func(protected chi.Router) {
			protected.Use(s.authService.JWTMiddleware)

			protected.Get("/wallet", s.handleGetWallet)
			protected.Get("/transactions", s.handleGetTransactions)
			protected.Post("/payments/init", s.handlePaymentInit)

			// Analytics and reconciliation endpoints
			protected.Post("/reconcile", s.handleReconcileTransaction)
			protected.Post("/metrics", s.handleGetMetrics)
			protected.Get("/exchange-rates", s.handleExchangeRates)
			protected.Post("/convert", s.handleCurrencyConversion)
		})

		// Webhook routes (signature-verified, no JWT)
		api.Route("/webhooks", func(wh chi.Router) {
			wh.Post("/blockradar", s.webhookHandler.HandleBlockradarWebhook)
			wh.Post("/stripe", s.webhookHandler.HandleStripeWebhook)
		})
	})

	return r
}

func (s *Server) HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(s.db.Health())
	_, _ = w.Write(jsonResp)
}
