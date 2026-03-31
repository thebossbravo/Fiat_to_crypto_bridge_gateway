package auth

import (
	db "bridge-gateway-backend/db/sqlc"
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

// SQLCRepository implements Repository using sqlc generated types
type SQLCRepository struct {
	queries *db.Queries
}

func NewSQLCRepository(pool *pgxpool.Pool) *SQLCRepository {
	return &SQLCRepository{
		queries: db.New(pool),
	}
}

func (r *SQLCRepository) CreateUser(ctx context.Context, params CreateUserParams) (*User, error) {
	var passwordText pgtype.Text
	if params.Password != "" {
		passwordText = pgtype.Text{String: params.Password, Valid: true}
	}

	result, err := r.queries.CreateUser(ctx, db.CreateUserParams{
		Email:    params.Email,
		Password: passwordText,
	})
	if err != nil {
		return nil, err
	}

	return convertCreateUserRow(result), nil
}

func (r *SQLCRepository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	row, err := r.queries.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	return convertGetUserByEmailRow(row), nil
}

func (r *SQLCRepository) GetUserByID(ctx context.Context, id string) (*User, error) {
	var uuid pgtype.UUID
	if err := uuid.Scan(id); err != nil {
		return nil, err
	}

	row, err := r.queries.GetUserByID(ctx, uuid)
	if err != nil {
		return nil, err
	}

	return convertGetUserByIDRow(row), nil
}

func (r *SQLCRepository) UpdateUserWallet(ctx context.Context, params UpdateUserWalletParams) error {
	var uuid pgtype.UUID
	if err := uuid.Scan(params.ID); err != nil {
		return err
	}

	walletAddr := pgtype.Text{String: params.WalletAddr, Valid: true}

	return r.queries.UpdateUserWallet(ctx, db.UpdateUserWalletParams{
		ID:            uuid,
		WalletAddress: walletAddr,
	})
}

func uuidToString(u pgtype.UUID) string {
	if u.Valid {
		b := u.Bytes
		return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
	}
	return ""
}

func convertCreateUserRow(row db.CreateUserRow) *User {
	var password string
	if row.Password.Valid {
		password = row.Password.String
	}
	var wallet string
	if row.WalletAddress.Valid {
		wallet = row.WalletAddress.String
	}
	var createdAt, updatedAt string
	if row.CreatedAt.Valid {
		createdAt = row.CreatedAt.Time.String()
	}
	if row.UpdatedAt.Valid {
		updatedAt = row.UpdatedAt.Time.String()
	}
	return &User{
		ID:            uuidToString(row.ID),
		Email:         row.Email,
		Password:      password,
		WalletAddress: wallet,
		CreatedAt:     createdAt,
		UpdatedAt:     updatedAt,
	}
}

func convertGetUserByEmailRow(row db.GetUserByEmailRow) *User {
	var password string
	if row.Password.Valid {
		password = row.Password.String
	}
	var wallet string
	if row.WalletAddress.Valid {
		wallet = row.WalletAddress.String
	}
	var createdAt, updatedAt string
	if row.CreatedAt.Valid {
		createdAt = row.CreatedAt.Time.String()
	}
	if row.UpdatedAt.Valid {
		updatedAt = row.UpdatedAt.Time.String()
	}
	return &User{
		ID:            uuidToString(row.ID),
		Email:         row.Email,
		Password:      password,
		WalletAddress: wallet,
		CreatedAt:     createdAt,
		UpdatedAt:     updatedAt,
	}
}

func convertGetUserByIDRow(row db.GetUserByIDRow) *User {
	var password string
	if row.Password.Valid {
		password = row.Password.String
	}
	var wallet string
	if row.WalletAddress.Valid {
		wallet = row.WalletAddress.String
	}
	var createdAt, updatedAt string
	if row.CreatedAt.Valid {
		createdAt = row.CreatedAt.Time.String()
	}
	if row.UpdatedAt.Valid {
		updatedAt = row.UpdatedAt.Time.String()
	}
	return &User{
		ID:            uuidToString(row.ID),
		Email:         row.Email,
		Password:      password,
		WalletAddress: wallet,
		CreatedAt:     createdAt,
		UpdatedAt:     updatedAt,
	}
}
