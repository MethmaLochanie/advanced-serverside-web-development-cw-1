const jwt = require('jsonwebtoken');
const { db } = require('../database/init');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
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
  verifyApiKey
}; 