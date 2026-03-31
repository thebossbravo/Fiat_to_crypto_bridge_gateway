package auth

import (
	"bridge-gateway-backend/internal/blockradar"
	"context"
)

type Repository interface {
	CreateUser(ctx context.Context, params CreateUserParams) (*User, error)
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	GetUserByID(ctx context.Context, id string) (*User, error)
	UpdateUserWallet(ctx context.Context, params UpdateUserWalletParams) error
}

type CreateUserParams struct {
	Email    string
	Password string
}

type UpdateUserWalletParams struct {
	ID         string
	WalletAddr string
}

type User struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	Password      string `json:"-"` // Don't include in JSON
	WalletAddress string `json:"wallet_address"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}

type BlockradarClient interface {
	CreateChildWallet(userID, chain string) (*CreateChildWalletResponse, error)
}

type CreateChildWalletResponse struct {
	WalletAddress string `json:"wallet_address"`
	WalletID      string `json:"wallet_id"`
}

type Service struct {
	repo       Repository
	blockradar BlockradarClient
	jwtSecret  string
	blacklist  *TokenBlacklist
	lockout    *AccountLockout
}

func NewService(repo Repository, blockradar BlockradarClient, jwtSecret string) *Service {
	return &Service{
		repo:       repo,
		blockradar: blockradar,
		jwtSecret:  jwtSecret,
		blacklist:  NewTokenBlacklist(),
		lockout:    NewAccountLockout(),
	}
}

// BlockradarClientAdapter wraps the real blockradar.Client to satisfy the BlockradarClient interface.
type BlockradarClientAdapter struct {
	client *blockradar.Client
}

func NewBlockradarClient(apiKey, baseURL string) *BlockradarClientAdapter {
	return &BlockradarClientAdapter{
		client: blockradar.NewClient(apiKey, baseURL),
	}
}

func (b *BlockradarClientAdapter) CreateChildWallet(userID, chain string) (*CreateChildWalletResponse, error) {
	resp, err := b.client.CreateChildWallet(userID, chain)
	if err != nil {
		return nil, err
	}
	return &CreateChildWalletResponse{
		WalletAddress: resp.WalletAddress,
		WalletID:      resp.WalletID,
	}, nil
}
