const jwt = require('jsonwebtoken');
const { db } = require('../database/init');
const config = require('../config/config');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.log('No authorization header provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Invalid authorization header format');
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('Token decoded:', { userId: decoded.id, username: decoded.username });

    // Verify user exists and is active
    db.get(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ?',
      [decoded.id],
      (err, user) => {
        if (err) {
          console.error('Database error during token verification:', err);
          return res.status(500).json({ message: 'Error verifying token' });
        }
        if (!user) {
          console.log('User not found for token:', decoded.id);
          return res.status(401).json({ message: 'User not found' });
        }
        if (!user.is_active) {
          console.log('User account is inactive:', decoded.id);
          return res.status(401).json({ message: 'Account is inactive' });
        }

        req.user = user;
        next();
      }
    );
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  const userId = req.user.id;
  
  db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ message: 'API key is required' });
  }

  db.get(
    'SELECT ak.*, u.id as user_id FROM api_keys ak JOIN users u ON ak.user_id = u.id WHERE ak.api_key = ? AND ak.is_active = 1',
    [apiKey],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!row) {
        return res.status(401).json({ message: 'Invalid API key' });
      }

      // Update last used timestamp
      db.run('UPDATE api_keys SET last_used = CURRENT_TIMESTAMP WHERE id = ?', [row.id]);
      
      // Track API usage
      db.run(
        'INSERT INTO api_usage (api_key_id, endpoint) VALUES (?, ?)',
        [row.id, req.originalUrl]
      );

      req.apiKey = row;
      req.user = { id: row.user_id };
      next();
    }
  );
};

module.exports = {
  verifyToken,
  verifyApiKey,
  isAdmin
}; 
