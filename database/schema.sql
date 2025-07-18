-- P2P USDT Trading Platform Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    telegram_username VARCHAR(50) UNIQUE,
    telegram_id VARCHAR(20) UNIQUE,
    type VARCHAR(10) CHECK (type IN ('buyer', 'seller', 'both')) DEFAULT 'both',
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type VARCHAR(10) CHECK (type IN ('buy', 'sell')) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    rate DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    contact VARCHAR(200) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'completed', 'cancelled')) DEFAULT 'active',
    min_amount DECIMAL(10, 2),
    max_amount DECIMAL(10, 2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    usdt_amount DECIMAL(10, 2) NOT NULL,
    etb_amount DECIMAL(10, 2) NOT NULL,
    trade_code VARCHAR(20) UNIQUE NOT NULL,
    escrow_wallet VARCHAR(100) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'escrowed', 'paid', 'released', 'cancelled', 'disputed')) DEFAULT 'pending',
    payment_method VARCHAR(100) NOT NULL,
    commission_amount DECIMAL(10, 2) DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings (id),
    FOREIGN KEY (buyer_id) REFERENCES users (id),
    FOREIGN KEY (seller_id) REFERENCES users (id)
);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deal_id INTEGER,
    user_id INTEGER,
    action VARCHAR(50) NOT NULL,
    notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deal_id) REFERENCES deals (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_type_status ON listings (type, status);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings (user_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals (status);
CREATE INDEX IF NOT EXISTS idx_deals_trade_code ON deals (trade_code);
CREATE INDEX IF NOT EXISTS idx_deals_buyer_id ON deals (buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_seller_id ON deals (seller_id);
CREATE INDEX IF NOT EXISTS idx_logs_deal_id ON logs (deal_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs (timestamp);

-- Insert default admin user
INSERT OR IGNORE INTO users (id, name, telegram_username, telegram_id, type, verified) 
VALUES (1, 'Admin', 'admin', '123456789', 'both', TRUE);

