const crypto = require('crypto');
const { db } = require('../database/init');

const generateApiKey = (req, res) => {
  const userId = req.user.id;
  const apiKey = crypto.randomBytes(32).toString('hex');

  db.run(
    'INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)',
    [userId, apiKey],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error generating API key' });
      }

      // Fetch the newly created API key with all fields
      db.get(
        `SELECT id, api_key, is_active, created_at, last_used, revoked_at,
         (SELECT COUNT(*) FROM api_usage WHERE api_key_id = api_keys.id) as usage_count
         FROM api_keys WHERE id = ?`,
        [this.lastID],
        (err, key) => {
          if (err) {
            console.error('Error fetching generated API key:', err);
            return res.status(500).json({ message: 'Error retrieving API key details' });
          }
          res.status(201).json(key);
        }
      );
    }
  );
};

const listApiKeys = (req, res) => {
  const userId = req.user.id;
  
  //  verify the user exists
  db.get('SELECT id FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch API keys
    db.all(
      `SELECT id, api_key, is_active, created_at, last_used,
       (SELECT COUNT(*) FROM api_usage WHERE api_key_id = api_keys.id) as usage_count
       FROM api_keys WHERE user_id = ? AND is_active = 1`,
      [userId],
      (err, keys) => {
        if (err) {
          return res.status(500).json({ message: 'Error retrieving API keys' });
        }
        res.json(keys);
      }
    );
  });
};

const revokeApiKey = (req, res) => {
  const userId = req.user.id;
  const keyId = req.params.id;

  // First verify the key belongs to the user
  db.get(
    'SELECT id FROM api_keys WHERE id = ? AND user_id = ?',
    [keyId, userId],
    (err, key) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!key) {
        return res.status(404).json({ message: 'API key not found or unauthorized' });
      }

      // Revoke the key by setting is_active to 0 and adding revocation timestamp
      db.run(
        'UPDATE api_keys SET is_active = 0, revoked_at = CURRENT_TIMESTAMP WHERE id = ?',
        [keyId],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Error revoking API key' });
          }
          res.json({ message: 'API key revoked successfully' });
        }
      );
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