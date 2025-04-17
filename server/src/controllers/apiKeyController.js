const crypto = require('crypto');
const { db } = require('../database/init');

const generateApiKey = (req, res) => {
  const userId = req.user.id;
  const apiKey = crypto.randomBytes(32).toString('hex');

  db.run(
    'INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)',
    [userId, apiKey],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating API key' });
      }
      res.status(201).json({ apiKey });
    }
  );
};

const listApiKeys = (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT id, api_key, is_active, created_at, last_used,
     (SELECT COUNT(*) FROM api_usage WHERE api_key_id = api_keys.id) as usage_count
     FROM api_keys WHERE user_id = ?`,
    [userId],
    (err, keys) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving API keys' });
      }
      res.json(keys);
    }
  );
};

const revokeApiKey = (req, res) => {
  const userId = req.user.id;
  const keyId = req.params.id;

  db.run(
    'UPDATE api_keys SET is_active = 0 WHERE id = ? AND user_id = ?',
    [keyId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error revoking API key' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'API key not found or unauthorized' });
      }
      res.json({ message: 'API key revoked successfully' });
    }
  );
};

const getApiKeyUsage = (req, res) => {
  const userId = req.user.id;
  const keyId = req.params.id;

  db.all(
    `SELECT endpoint, COUNT(*) as count, MAX(timestamp) as last_used
     FROM api_usage
     WHERE api_key_id = ? AND api_key_id IN (SELECT id FROM api_keys WHERE user_id = ?)
     GROUP BY endpoint`,
    [keyId, userId],
    (err, usage) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving API key usage' });
      }
      res.json(usage);
    }
  );
};

module.exports = {
  generateApiKey,
  listApiKeys,
  revokeApiKey,
  getApiKeyUsage
}; 