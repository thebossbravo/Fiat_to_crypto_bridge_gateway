-- name: CreateUser :one
INSERT INTO users (email, password, created_at, updated_at)
VALUES ($1, $2, NOW(), NOW())
RETURNING id, email, password, wallet_address, blockradar_child_wallet_address, user_status, kyc_verified, created_at, updated_at;

-- name: GetUserByEmail :one
SELECT id, email, password, wallet_address, blockradar_child_wallet_address, user_status, kyc_verified, created_at, updated_at
FROM users
WHERE email = $1;

-- name: GetUserByID :one
SELECT id, email, password, wallet_address, blockradar_child_wallet_address, user_status, kyc_verified, created_at, updated_at
FROM users
WHERE id = $1;

-- name: GetUserByGoogleID :one
SELECT id, email, password, wallet_address, blockradar_child_wallet_address, user_status, kyc_verified, created_at, updated_at
FROM users
WHERE google_id = $1;

-- name: UpdateUserWallet :exec
UPDATE users
SET wallet_address = $2, blockradar_child_wallet_address = $2, updated_at = NOW()
WHERE id = $1;

-- name: UpdateUserGoogleID :exec
UPDATE users
SET google_id = $2, updated_at = NOW()
WHERE id = $1;

-- name: UpdateLastLogin :exec
UPDATE users
SET last_login_at = NOW(), updated_at = NOW()
WHERE id = $1;

-- name: ListUsers :many
SELECT id, email, wallet_address, user_status, kyc_verified, created_at
FROM users
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;
