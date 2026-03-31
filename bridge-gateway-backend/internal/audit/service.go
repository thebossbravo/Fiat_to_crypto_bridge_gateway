package audit

import (
	db "bridge-gateway-backend/db/sqlc"
	"context"
	"encoding/json"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository interface for audit logs
type Repository interface {
	CreateAuditLog(ctx context.Context, params CreateAuditLogParams) (db.CreateAuditLogRow, error)
	ListAuditLogByTransaction(ctx context.Context, transactionID string) ([]db.AuditLog, error)
	ListAuditLogByUser(ctx context.Context, userID string, limit, offset int32) ([]db.ListAuditLogByUserRow, error)
}

// CreateAuditLogParams represents parameters for creating an audit log
type CreateAuditLogParams struct {
	TransactionID string
	UserID        string
	EventType     string
	OldState      *db.TransactionState
	NewState      *db.TransactionState
	Metadata      map[string]any
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

func (r *SQLCRepository) CreateAuditLog(ctx context.Context, params CreateAuditLogParams) (db.CreateAuditLogRow, error) {
	var transactionID, userID pgtype.UUID
	if err := transactionID.Scan(params.TransactionID); err != nil {
		return db.CreateAuditLogRow{}, err
	}
	if err := userID.Scan(params.UserID); err != nil {
		return db.CreateAuditLogRow{}, err
	}

	var oldState, newState db.NullTransactionState
	if params.OldState != nil {
		oldState = db.NullTransactionState{
			TransactionState: *params.OldState,
			Valid:            true,
		}
	}
	if params.NewState != nil {
		newState = db.NullTransactionState{
			TransactionState: *params.NewState,
			Valid:            true,
		}
	}

	var metadata []byte
	if params.Metadata != nil {
		var err error
		metadata, err = json.Marshal(params.Metadata)
		if err != nil {
			return db.CreateAuditLogRow{}, err
		}
	}

	return r.queries.CreateAuditLog(ctx, db.CreateAuditLogParams{
		TransactionID: transactionID,
		UserID:        userID,
		EventType:     params.EventType,
		OldState:      oldState,
		NewState:      newState,
		Metadata:      metadata,
	})
}

func (r *SQLCRepository) ListAuditLogByTransaction(ctx context.Context, transactionID string) ([]db.AuditLog, error) {
	var uuid pgtype.UUID
	if err := uuid.Scan(transactionID); err != nil {
		return nil, err
	}

	return r.queries.ListAuditLogByTransaction(ctx, uuid)
}

func (r *SQLCRepository) ListAuditLogByUser(ctx context.Context, userID string, limit, offset int32) ([]db.ListAuditLogByUserRow, error) {
	var uuid pgtype.UUID
	if err := uuid.Scan(userID); err != nil {
		return nil, err
	}

	return r.queries.ListAuditLogByUser(ctx, db.ListAuditLogByUserParams{
		UserID: uuid,
		Limit:  limit,
		Offset: offset,
	})
}

// Service provides business logic for audit logs
type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateAuditLog(ctx context.Context, params CreateAuditLogParams) (db.CreateAuditLogRow, error) {
	return s.repo.CreateAuditLog(ctx, params)
}

func (s *Service) ListTransactionAuditLogs(ctx context.Context, transactionID string) ([]db.AuditLog, error) {
	return s.repo.ListAuditLogByTransaction(ctx, transactionID)
}

func (s *Service) ListUserAuditLogs(ctx context.Context, userID string, limit, offset int32) ([]db.ListAuditLogByUserRow, error) {
	return s.repo.ListAuditLogByUser(ctx, userID, limit, offset)
}

func (s *Service) LogStateChange(ctx context.Context, transactionID, userID, eventType string, oldState, newState db.TransactionState, metadata map[string]interface{}) error {
	_, err := s.CreateAuditLog(ctx, CreateAuditLogParams{
		TransactionID: transactionID,
		UserID:        userID,
		EventType:     eventType,
		OldState:      &oldState,
		NewState:      &newState,
		Metadata:      metadata,
	})
	return err
}
