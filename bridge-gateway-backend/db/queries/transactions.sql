-- name: CreateTransaction :one
INSERT INTO transactions (user_id, fiat_amount_cents, fiat_currency, state, client_ip, user_agent, idempotency_key)
VALUES ($1, $2, $3, 'pending', $4, $5, $6)
RETURNING id, user_id, fiat_amount_cents, fiat_currency, crypto_amount_usdc, state, blockchain_tx_hash, created_at;

-- name: GetTransactionByID :one
SELECT id, user_id, fiat_amount_cents, fiat_currency, crypto_amount_usdc, state,
       card_payment_id, blockradar_swap_id, blockchain_tx_hash,
       initiated_at, fiat_received_at, aml_completed_at, swap_completed_at, completed_at, failed_at,
       failure_reason, created_at, updated_at
FROM transactions
WHERE id = $1;

-- name: ListTransactionsByUser :many
SELECT id, fiat_amount_cents, fiat_currency, crypto_amount_usdc, state, blockchain_tx_hash, created_at
FROM transactions
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: UpdateTransactionState :exec
UPDATE transactions
SET state = $2, updated_at = NOW()
WHERE id = $1;

-- name: UpdateTransactionFiatReceived :exec
UPDATE transactions
SET state = 'fiat_received', card_payment_id = $2, fiat_received_at = NOW(), updated_at = NOW()
WHERE id = $1;

-- name: UpdateTransactionAMLPassed :exec
UPDATE transactions
SET state = 'aml_passed', aml_completed_at = NOW(), updated_at = NOW()
WHERE id = $1;

-- name: UpdateTransactionSwapping :exec
UPDATE transactions
SET state = 'swapping', blockradar_swap_id = $2, updated_at = NOW()
WHERE id = $1;

-- name: UpdateTransactionCompleted :exec
UPDATE transactions
SET state = 'completed', crypto_amount_usdc = $2, blockchain_tx_hash = $3, completed_at = NOW(), swap_completed_at = NOW(), updated_at = NOW()
WHERE id = $1;

-- name: UpdateTransactionFailed :exec
UPDATE transactions
SET state = 'failed', failure_reason = $2, failed_at = NOW(), updated_at = NOW()
WHERE id = $1;

-- name: GetPendingTransactions :many
SELECT id, user_id, fiat_amount_cents, fiat_currency, state, card_payment_id, blockradar_swap_id, created_at
FROM transactions
WHERE state IN ('pending', 'fiat_received', 'aml_checking', 'aml_passed', 'swapping')
ORDER BY created_at ASC;
