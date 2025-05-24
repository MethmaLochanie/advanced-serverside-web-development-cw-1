const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection with verbose mode for debugging
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
});

// Enable verbose mode for debugging
db.on('trace', (sql) => {
});

// Promisify db.run
const run = (sql) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Promisify db.get
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const initializeDatabase = async () => {
  
  try {
    // Enable foreign keys
    await run('PRAGMA foreign_keys = ON');

    // Create users table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // Create API keys table
    await run(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        api_key TEXT UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used TIMESTAMP,
        revoked_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Add revoked_at column if it doesn't exist
    try {
      await run('ALTER TABLE api_keys ADD COLUMN revoked_at TIMESTAMP');
    } catch (err) {
      if (!err.message.includes('duplicate column name')) {
        console.error('Error adding revoked_at column:', err);
      }
    }

    // Create API usage table
    await run(`
      CREATE TABLE IF NOT EXISTS api_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_key_id INTEGER NOT NULL,
        endpoint TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (api_key_id) REFERENCES api_keys (id)
      )
    `);

    // Create admin logs table
    await run(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        target_id INTEGER,
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users (id)
      )
    `);

    // Create indexes
    await run('CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_api_usage_key ON api_usage(api_key_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id)');

    // Verify JWT secret
    if (!process.env.JWT_SECRET) {
      console.error('WARNING: JWT_SECRET is not set in environment variables');
      process.exit(1);
    }

    // Check for existing admin user
    const adminUser = await get('SELECT id, username, email, role FROM users WHERE email = ?', ['admin@example.com']);
    
    if (adminUser) {
    } else {
      // Create default admin user
      const defaultAdmin = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'adminpassword',
        role: 'admin'
      };

      const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
      
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          [defaultAdmin.username, defaultAdmin.email, hashedPassword, defaultAdmin.role],
          function(err) {
            if (err) {
              console.error('Error creating admin user:', err);
              reject(err);
            } else {
              console.log('Default admin user created');
              resolve();
            }
          }
        );
      });
    }

  } catch (error) {
    process.exit(1);
  }
};

module.exports = {
  db,
  initializeDatabase
};