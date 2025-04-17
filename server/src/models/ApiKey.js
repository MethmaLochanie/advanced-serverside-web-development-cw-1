const { db } = require('../database/init');
const crypto = require('crypto');

class ApiKey {
  static generate(userId, callback) {
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    db.run(
      'INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)',
      [userId, apiKey],
      function(err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, apiKey });
      }
    );
  }

  static findByUserId(userId, callback) {
    db.all(
      `SELECT id, api_key, is_active, created_at, last_used, revoked_at,
       (SELECT COUNT(*) FROM api_usage WHERE api_key_id = api_keys.id) as usage_count
       FROM api_keys WHERE user_id = ? AND is_active = 1`,
      [userId],
      callback
    );
  }

  static findActiveByKey(apiKey, callback) {
    db.get(
      'SELECT * FROM api_keys WHERE api_key = ? AND is_active = 1',
      [apiKey],
      callback
    );
  }

  static revoke(keyId, userId, callback) {
    db.run(
      'UPDATE api_keys SET is_active = 0, revoked_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [keyId, userId],
      function(err) {
        if (err) return callback(err);
        callback(null, this.changes > 0);
      }
    );
  }

  static updateLastUsed(keyId, callback) {
    db.run(
      'UPDATE api_keys SET last_used = CURRENT_TIMESTAMP WHERE id = ?',
      [keyId],
      callback
    );
  }
}

module.exports = ApiKey; 