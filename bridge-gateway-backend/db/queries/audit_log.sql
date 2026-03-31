-- name: CreateAuditLog :one
INSERT INTO audit_log (transaction_id, user_id, event_type, old_state, new_state, metadata)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, created_at;

-- name: ListAuditLogByTransaction :many
SELECT id, transaction_id, user_id, event_type, old_state, new_state, metadata, created_at
FROM audit_log
WHERE transaction_id = $1
ORDER BY created_at ASC;

-- name: ListAuditLogByUser :many
SELECT id, transaction_id, event_type, old_state, new_state, metadata, created_at
FROM audit_log
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;
