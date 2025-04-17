const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // API Keys table
    db.run(`CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      api_key TEXT UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_used DATETIME,
      revoked_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users (id),
      CHECK (is_active IN (0, 1)),
      CHECK ((revoked_at IS NULL) OR (revoked_at >= created_at))
    )`);

    // API Usage tracking table
    db.run(`CREATE TABLE IF NOT EXISTS api_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      api_key_id INTEGER NOT NULL,
      endpoint TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (api_key_id) REFERENCES api_keys (id)
    )`);

    // Create indexes for better query performance
    db.run('CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active)');
    db.run('CREATE INDEX IF NOT EXISTS idx_api_usage_api_key_id ON api_usage(api_key_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp ON api_usage(timestamp)');
    db.run('CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint)');
  });
}

module.exports = {
  db,
  initializeDatabase
};