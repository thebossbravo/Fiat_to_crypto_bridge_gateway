package transactions

import (
	db "bridge-gateway-backend/db/sqlc"
	"context"
	"net/netip"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository interface for transactions
type Repository interface {
	CreateTransaction(ctx context.Context, params CreateTransactionParams) (db.CreateTransactionRow, error)
	GetTransactionByID(ctx context.Context, id string) (db.GetTransactionByIDRow, error)
	ListTransactionsByUser(ctx context.Context, params ListTransactionsByUserParams) ([]db.ListTransactionsByUserRow, error)
	UpdateTransactionState(ctx context.Context, params UpdateTransactionStateParams) error
	GetPendingTransactions(ctx context.Context) ([]db.GetPendingTransactionsRow, error)
}

// CreateTransactionParams represents parameters for creating a transaction
type CreateTransactionParams struct {
	UserID          string
	FiatAmountCents int64
	FiatCurrency    string
	ClientIP        string
	UserAgent       string
	IdempotencyKey  string
}

// ListTransactionsByUserParams represents parameters for listing user transactions
type ListTransactionsByUserParams struct {
	UserID string
	Limit  int32
	Offset int32
}

// UpdateTransactionStateParams represents parameters for updating transaction state
type UpdateTransactionStateParams struct {
	ID    string
	State db.TransactionState
}

// SQLCRepository implements Repository using sqlc generated types
type SQLCRepository struct {
	queries *db.Queries
}

func NewSQLCRepository(pool *pgxpool.Pool) *SQLCRepository {
	return &SQLCRepository{
		queries: db.New(pool),
	}
}

func (r *SQLCRepository) CreateTransaction(ctx context.Context, params CreateTransactionParams) (db.CreateTransactionRow, error) {
	var userID pgtype.UUID
	if err := userID.Scan(params.UserID); err != nil {
		return db.CreateTransactionRow{}, err
	}

	var clientIP *netip.Addr
	if params.ClientIP != "" {
		addr, err := netip.ParseAddr(params.ClientIP)
		if err == nil {
			clientIP = &addr
		}
	}

	return r.queries.CreateTransaction(ctx, db.CreateTransactionParams{
		UserID:          userID,
		FiatAmountCents: params.FiatAmountCents,
		FiatCurrency:    pgtype.Text{String: params.FiatCurrency, Valid: true},
		ClientIp:        clientIP,
		UserAgent:       pgtype.Text{String: params.UserAgent, Valid: true},
		IdempotencyKey:  pgtype.Text{String: params.IdempotencyKey, Valid: true},
	})
}

func (r *SQLCRepository) GetTransactionByID(ctx context.Context, id string) (db.GetTransactionByIDRow, error) {
	var uuid pgtype.UUID
	if err := uuid.Scan(id); err != nil {
		return db.GetTransactionByIDRow{}, err
	}

	return r.queries.GetTransactionByID(ctx, uuid)
}

func (r *SQLCRepository) ListTransactionsByUser(ctx context.Context, params ListTransactionsByUserParams) ([]db.ListTransactionsByUserRow, error) {
	var userID pgtype.UUID
	if err := userID.Scan(params.UserID); err != nil {
		return nil, err
	}

	return r.queries.ListTransactionsByUser(ctx, db.ListTransactionsByUserParams{
		UserID: userID,
		Limit:  params.Limit,
		Offset: params.Offset,
	})
}

func (r *SQLCRepository) UpdateTransactionState(ctx context.Context, params UpdateTransactionStateParams) error {
	var uuid pgtype.UUID
	if err := uuid.Scan(params.ID); err != nil {
		return err
	}

	return r.queries.UpdateTransactionState(ctx, db.UpdateTransactionStateParams{
		ID: uuid,
		State: db.NullTransactionState{
			TransactionState: params.State,
			Valid:            true,
		},
	})
}

func (r *SQLCRepository) GetPendingTransactions(ctx context.Context) ([]db.GetPendingTransactionsRow, error) {
	return r.queries.GetPendingTransactions(ctx)
}

// Service provides business logic for transactions
type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateTransaction(ctx context.Context, params CreateTransactionParams) (db.CreateTransactionRow, error) {
	return s.repo.CreateTransaction(ctx, params)
}

func (s *Service) GetTransaction(ctx context.Context, id string) (db.GetTransactionByIDRow, error) {
	return s.repo.GetTransactionByID(ctx, id)
}

func (s *Service) ListUserTransactions(ctx context.Context, userID string, limit, offset int32) ([]db.ListTransactionsByUserRow, error) {
	return s.repo.ListTransactionsByUser(ctx, ListTransactionsByUserParams{
		UserID: userID,
		Limit:  limit,
		Offset: offset,
	})
}

func (s *Service) UpdateTransactionState(ctx context.Context, id string, state db.TransactionState) error {
	return s.repo.UpdateTransactionState(ctx, UpdateTransactionStateParams{
		ID:    id,
		State: state,
	})
}

func (s *Service) GetPendingTransactions(ctx context.Context) ([]db.GetPendingTransactionsRow, error) {
	return s.repo.GetPendingTransactions(ctx)
}
