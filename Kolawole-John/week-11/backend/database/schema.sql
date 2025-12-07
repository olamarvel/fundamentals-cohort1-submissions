-- PayVerse Database Schema
-- PostgreSQL version 14+

-- ============================================
-- EXTENSIONS
-- ============================================

-- Enable UUID support (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING TABLES (for clean reinstall)
-- ============================================

DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- bcrypt hashed
    full_name VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups (used in login)
CREATE INDEX idx_users_email ON users(email);

-- Index for active users
CREATE INDEX idx_users_active ON users(is_active);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Prevent self-transfers
    CONSTRAINT no_self_transfer CHECK (sender_id != recipient_id)
);

-- Indexes for faster queries
CREATE INDEX idx_transactions_sender ON transactions(sender_id);
CREATE INDEX idx_transactions_recipient ON transactions(recipient_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Composite index for user transaction history
CREATE INDEX idx_transactions_user_history ON transactions(sender_id, created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for transactions table
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (for testing)
-- ============================================

-- Insert test users
-- Password for all: "Password123" (hashed with bcrypt, 10 rounds)
INSERT INTO users (email, password, full_name, balance) VALUES
('john@example.com', '$2a$10$rN8YZZZZZZZZZZZZZZZZZeuVxHJ5Mc5ELJQk7Yj4X8Xp0YZK1mYqG', 'John Doe', 1000.00),
('jane@example.com', '$2a$10$rN8YZZZZZZZZZZZZZZZZZeuVxHJ5Mc5ELJQk7Yj4X8Xp0YZK1mYqG', 'Jane Smith', 2500.00),
('alice@example.com', '$2a$10$rN8YZZZZZZZZZZZZZZZZZeuVxHJ5Mc5ELJQk7Yj4X8Xp0YZK1mYqG', 'Alice Johnson', 500.00),
('bob@example.com', '$2a$10$rN8YZZZZZZZZZZZZZZZZZeuVxHJ5Mc5ELJQk7Yj4X8Xp0YZK1mYqG', 'Bob Williams', 750.00)
ON CONFLICT (email) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (sender_id, recipient_id, amount, currency, status, description) VALUES
(1, 2, 100.00, 'USD', 'completed', 'Payment for lunch'),
(2, 3, 250.00, 'USD', 'completed', 'Rent contribution'),
(1, 4, 50.00, 'USD', 'completed', 'Book purchase'),
(3, 1, 75.00, 'USD', 'completed', 'Refund'),
(4, 2, 150.00, 'USD', 'pending', 'Pending transfer')
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS (optional, for reporting)
-- ============================================

-- User transaction summary
CREATE OR REPLACE VIEW user_transaction_summary AS
SELECT
    u.id AS user_id,
    u.email,
    u.full_name,
    u.balance,
    COUNT(DISTINCT t1.id) AS sent_count,
    COALESCE(SUM(t1.amount), 0) AS total_sent,
    COUNT(DISTINCT t2.id) AS received_count,
    COALESCE(SUM(t2.amount), 0) AS total_received
FROM users u
LEFT JOIN transactions t1 ON u.id = t1.sender_id AND t1.status = 'completed'
LEFT JOIN transactions t2 ON u.id = t2.recipient_id AND t2.status = 'completed'
GROUP BY u.id, u.email, u.full_name, u.balance;

-- ============================================
-- PERMISSIONS (if using separate DB user)
-- ============================================

-- Grant permissions to application user (optional)
-- CREATE USER payverse_app WITH PASSWORD 'your_app_password';
-- GRANT CONNECT ON DATABASE payverse TO payverse_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO payverse_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO payverse_app;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check seed data
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS transaction_count FROM transactions;

-- Display sample data
SELECT id, email, full_name, balance FROM users;
SELECT id, sender_id, recipient_id, amount, status, description FROM transactions;

-- ============================================
-- NOTES
-- ============================================

/*
KEY DESIGN DECISIONS:

1. SERIAL vs UUID for Primary Keys
   - SERIAL: Simpler, sequential, better performance
   - UUID: Better for distributed systems, prevents ID prediction
   - Choice: SERIAL (simpler for learning, can migrate to UUID later)

2. DECIMAL(15,2) for Money
   - NEVER use FLOAT for money (rounding errors!)
   - DECIMAL(15,2) = 15 total digits, 2 after decimal
   - Max value: 9,999,999,999,999.99 (10 trillion)

3. ON DELETE CASCADE
   - If user deleted, all their transactions also deleted
   - Alternative: ON DELETE SET NULL (keep transaction history)
   - Choice: CASCADE (simplifies cleanup)

4. CHECK Constraints
   - balance >= 0: Prevent negative balances
   - amount > 0: Prevent zero/negative transactions
   - no_self_transfer: Prevent sending money to yourself
   - Database-level validation (better than app-only)

5. Indexes
   - Speed up queries but slow down inserts
   - Index foreign keys (sender_id, recipient_id)
   - Index frequently filtered columns (status, created_at)
   - Index email (used in login queries)

6. Triggers
   - Auto-update updated_at timestamp
   - Alternative: Handle in application code
   - Choice: Database trigger (guaranteed to run)

PERFORMANCE TIPS:

1. Use prepared statements (prevents SQL injection)
   Example: pool.query('SELECT * FROM users WHERE id = $1', [userId])

2. Use transactions for money transfers
   BEGIN → UPDATE sender → UPDATE recipient → INSERT transaction → COMMIT
   If any step fails, ROLLBACK (prevents lost money)

3. Use LIMIT and OFFSET for pagination
   SELECT * FROM transactions ORDER BY created_at DESC LIMIT 20 OFFSET 0;

4. Use indexes wisely
   Every index speeds up reads but slows down writes
   Monitor slow queries and add indexes as needed

SECURITY NOTES:

1. NEVER store plaintext passwords
   Use bcrypt with 10+ rounds

2. NEVER use string concatenation for queries
   BAD:  'SELECT * FROM users WHERE email = ' + email
   GOOD: pool.query('SELECT * FROM users WHERE email = $1', [email])

3. Use database user with limited permissions
   Don't use 'postgres' superuser in production
   Create app-specific user with only needed permissions

4. Regular backups
   Use pg_dump for backups
   Test restores regularly
*/
