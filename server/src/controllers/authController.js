const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/init');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed: users.email')) {
            return res.status(409).json({ message: 'Email already exists' });
          }
          if (err.message.includes('UNIQUE constraint failed: users.username')) {
            return res.status(409).json({ message: 'Username already exists' });
          }
          return res.status(500).json({ message: 'Internal server error' });
        }

        // Generate initial API key
        const apiKey = require('crypto').randomBytes(32).toString('hex');
        db.run(
          'INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)',
          [this.lastID, apiKey],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Error generating API key' });
            }

            res.status(201).json({
              message: 'User registered successfully',
              apiKey
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ message: 'No account found with this email address' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Update last login
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Get user's API keys
    const apiKeys = await new Promise((resolve, reject) => {
      db.all(
        'SELECT api_key FROM api_keys WHERE user_id = ? AND is_active = 1',
        [user.id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const userData = {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        apiKeys: apiKeys.map(k => k.api_key)
      }
    };
    res.json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

const validateToken = (req, res) => {
  // The user object is already attached to req by the verifyToken middleware
  const userId = req.user.id;

  // Get fresh user data
  db.get(
    'SELECT id, username, email, role FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get user's API keys
      db.all(
        'SELECT api_key FROM api_keys WHERE user_id = ? AND is_active = 1',
        [userId],
        (err, apiKeys) => {
          if (err) {
            return res.status(500).json({ message: 'Error retrieving API keys' });
          }

          res.json({
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              apiKeys: apiKeys.map(k => k.api_key)
            }
          });
        }
      );
    }
  );
};

module.exports = {
  register,
  login,
  validateToken
}; 