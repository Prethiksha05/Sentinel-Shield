-- Sentinel Shield Database Schema
-- SQLite / MySQL Compatible

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'analyst',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Media files table
CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    media_type VARCHAR(10) NOT NULL,
    file_size INTEGER,
    duration FLOAT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Analysis results table
CREATE TABLE IF NOT EXISTS analysis_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_id INTEGER NOT NULL,
    result VARCHAR(20) NOT NULL,
    confidence FLOAT NOT NULL,
    attack_type VARCHAR(50),
    risk_level VARCHAR(20) NOT NULL,
    analysis_details TEXT,
    model_version VARCHAR(50) DEFAULT 'v1.0.0',
    processing_time FLOAT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (media_id) REFERENCES media(id)
);

-- Evidence ledger table (blockchain-like)
CREATE TABLE IF NOT EXISTS evidence_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_id INTEGER NOT NULL,
    media_hash VARCHAR(64) NOT NULL,
    result_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64),
    entry_hash VARCHAR(64) NOT NULL,
    analyst_id INTEGER,
    action VARCHAR(50) DEFAULT 'ANALYSIS_COMPLETE',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (analysis_id) REFERENCES analysis_results(id),
    FOREIGN KEY (analyst_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_user ON media(user_id);
CREATE INDEX IF NOT EXISTS idx_media_hash ON media(file_hash);
CREATE INDEX IF NOT EXISTS idx_analysis_media ON analysis_results(media_id);
CREATE INDEX IF NOT EXISTS idx_analysis_result ON analysis_results(result);
CREATE INDEX IF NOT EXISTS idx_ledger_analysis ON evidence_ledger(analysis_id);

-- Default admin user (password: admin123)
-- Note: In production, change this password immediately
INSERT OR IGNORE INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@sentinel-shield.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.L0X6Y1z5Z6z', 'admin');
