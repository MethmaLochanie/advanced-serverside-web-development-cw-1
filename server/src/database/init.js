const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
console.log('Database path:', dbPath);

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  console.log('Creating database directory:', dbDir);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection with verbose mode for debugging
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Successfully connected to database');
});

// Enable verbose mode for debugging
db.on('trace', (sql) => {
  console.log('SQL:', sql);
});

// Promisify db.run
const run = (sql) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        console.error('Error executing query:', sql, err);
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
        console.error('Error executing query:', sql, err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const initializeDatabase = async () => {
  console.log('Initializing database...');
  
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);
    console.log('Users table ready');

    // Create API keys table
    await run(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        api_key TEXT UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    console.log('API keys table ready');

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
    console.log('API usage table ready');

    // Create blog posts table
    await run(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        country_name TEXT NOT NULL,
        date_of_visit TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Blog posts table ready');

    // Create indexes
    await run('CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_api_usage_key ON api_usage(api_key_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_blog_posts_user ON blog_posts(user_id)');
    console.log('Indexes created');

    // Check for existing admin user
    const adminUser = await get('SELECT id, username, email, role FROM users WHERE email = ?', ['admin@example.com']);
    
    if (adminUser) {
      console.log('Admin user exists:', { id: adminUser.id, username: adminUser.username, role: adminUser.role });
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

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
};

module.exports = {
  db,
  initializeDatabase
};