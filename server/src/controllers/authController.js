const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/init');
const crypto = require('crypto');

const register = (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    // Insert user
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Username or email already exists' });
          }
          return res.status(500).json({ message: 'Error creating user' });
        }

        // Generate initial API key
        const apiKey = crypto.randomBytes(32).toString('hex');
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
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error verifying password' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Get user's API keys
      db.all(
        'SELECT api_key FROM api_keys WHERE user_id = ? AND is_active = 1',
        [user.id],
        (err, apiKeys) => {
          if (err) {
            return res.status(500).json({ message: 'Error retrieving API keys' });
          }

          res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              apiKeys: apiKeys.map(k => k.api_key)
            }
          });
        }
      );
    });
  });
};

const validateToken = (req, res) => {
  // The user object is already attached to req by the verifyToken middleware
  const userId = req.user.id;

  // Get fresh user data
  db.get('SELECT id, username, email FROM users WHERE id = ?', [userId], (err, user) => {
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
            ...user,
            apiKeys: apiKeys.map(k => k.api_key)
          }
        });
      }
    );
  });
};

module.exports = {
  register,
  login,
  validateToken
}; 