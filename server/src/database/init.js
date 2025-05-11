// db.js
const sqlite3 = require('sqlite3').verbose();     // verbose mode for debugging
const path    = require('path');
const fs      = require('fs');
const config  = require('../config/config');

// Resolve the database path
const dbPath = path.isAbsolute(config.database.path)
  ? config.database.path
  : path.join(__dirname, config.database.path);

console.log('Database path:', dbPath);

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  console.log('Creating database directory:', dbDir);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Open the database (read/write + create if missing)
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Successfully connected to database');
});

// Debug handlers
db.on('trace', sql => console.log('[SQL TRACE]', sql));
db.on('error', err => console.error('[SQLite ERROR]', err));

// Promise-wrapped run() and get()
const run = sql => new Promise((resolve, reject) => {
  db.run(sql, function(err) {
    if (err) {
      console.error('Error executing query:', sql, err);
      return reject(err);
    }
    resolve(this);  // so you can inspect lastID if needed
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) {
      console.error('Error executing query:', sql, err);
      return reject(err);
    }
    resolve(row);
  });
});

// Initialize schema inside a serialize block
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('Initializing database schema…');
    db.serialize(async () => {
      try {
        await run('PRAGMA foreign_keys = ON');
        console.log('Foreign keys enabled');

        await run(`
          CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            username    TEXT UNIQUE NOT NULL,
            email       TEXT UNIQUE NOT NULL,
            password    TEXT NOT NULL,
            role        TEXT DEFAULT 'user' CHECK(role IN ('user','admin')),
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login  TIMESTAMP
          )
        `);
        console.log('Users table ready');

        await run(`
          CREATE TABLE IF NOT EXISTS api_keys (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL,
            api_key    TEXT UNIQUE NOT NULL,
            is_active  BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_used  TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `);
        console.log('API keys table ready');

        await run(`
          CREATE TABLE IF NOT EXISTS api_usage (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            api_key_id INTEGER NOT NULL,
            endpoint   TEXT NOT NULL,
            timestamp  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (api_key_id) REFERENCES api_keys (id)
          )
        `);
        console.log('API usage table ready');

        await run(`
          CREATE TABLE IF NOT EXISTS blog_posts (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            title         TEXT NOT NULL,
            content       TEXT NOT NULL,
            country_name  TEXT NOT NULL,
            date_of_visit TEXT NOT NULL,
            user_id       INTEGER NOT NULL,
            created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
          )
        `);
        console.log('Blog posts table ready');

        await run(`
          CREATE TABLE IF NOT EXISTS followers (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            follower_id   INTEGER NOT NULL,
            following_id  INTEGER NOT NULL,
            created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (follower_id) REFERENCES users(id),
            FOREIGN KEY (following_id) REFERENCES users(id),
            UNIQUE(follower_id, following_id)
          )
        `);
        console.log('Followers table ready');

        // Indexes
        await run('CREATE INDEX IF NOT EXISTS idx_api_keys_user    ON api_keys(user_id)');
        await run('CREATE INDEX IF NOT EXISTS idx_api_usage_key     ON api_usage(api_key_id)');
        await run('CREATE INDEX IF NOT EXISTS idx_blog_posts_user   ON blog_posts(user_id)');
        console.log('Indexes created');

        console.log('✅ Database initialization completed');
        resolve();
      } catch (err) {
        console.error('❌ Error during database initialization:', err);
        reject(err);
      }
    });
  });
};

module.exports = {
  db,
  run,
  get,
  initializeDatabase
};