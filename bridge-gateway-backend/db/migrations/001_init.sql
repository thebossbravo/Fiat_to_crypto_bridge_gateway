-- Custom types
CREATE TYPE transaction_state AS ENUM (
    'pending',
    'fiat_received',
    'aml_checking',
    'aml_passed',
    'swapping',
    'swap_complete',
    'completed',
    'failed',
    'refund_pending',
    'refunded'
);

CREATE TYPE user_status AS ENUM (
    'active',
    'suspended',
    'kyc_required'
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE,
    email VARCHAR(320) UNIQUE NOT NULL,
    password TEXT,
    blockradar_child_wallet_address VARCHAR(42) UNIQUE,
    wallet_address TEXT DEFAULT '',
    user_status user_status DEFAULT 'active',
    kyc_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(blockradar_child_wallet_address);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Amounts
    fiat_amount_cents BIGINT NOT NULL CHECK (fiat_amount_cents > 0),
    fiat_currency VARCHAR(3) DEFAULT 'USD',
    crypto_amount_usdc NUMERIC(18, 6),

    -- State tracking
    state transaction_state DEFAULT 'pending',

    -- External references
    card_payment_id VARCHAR(255),
    blockradar_swap_id VARCHAR(255) UNIQUE,
    blockchain_tx_hash VARCHAR(66),

    -- Timestamps for state transitions
    initiated_at TIMESTAMPTZ DEFAULT NOW(),
    fiat_received_at TIMESTAMPTZ,
    aml_completed_at TIMESTAMPTZ,
    swap_completed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,

    -- Metadata
    failure_reason TEXT,
    client_ip INET,
    user_agent TEXT,
    idempotency_key VARCHAR(255) UNIQUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_state ON transactions(state);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_card_payment_id ON transactions(card_payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_idempotency_key ON transactions(idempotency_key);

-- Audit log for compliance
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    transaction_id UUID REFERENCES transactions(id),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    old_state transaction_state,
    new_state transaction_state,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_transaction_id ON audit_log(transaction_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- Auto-update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
