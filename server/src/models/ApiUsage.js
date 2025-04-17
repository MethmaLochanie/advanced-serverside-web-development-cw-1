const { db } = require('../database/init');

class ApiUsage {
  static track(keyId, endpoint, callback) {
    db.run(
      'INSERT INTO api_usage (api_key_id, endpoint) VALUES (?, ?)',
      [keyId, endpoint],
      callback
    );
  }

  static getUsageByKeyId(keyId, callback) {
    db.all(
      `SELECT endpoint, COUNT(*) as count, MAX(timestamp) as last_used
       FROM api_usage
       WHERE api_key_id = ?
       GROUP BY endpoint`,
      [keyId],
      callback
    );
  }

  static getTotalUsageByUserId(userId, callback) {
    db.get(
      `SELECT COUNT(*) as total_requests
       FROM api_usage
       WHERE api_key_id IN (SELECT id FROM api_keys WHERE user_id = ?)`,
      [userId],
      callback
    );
  }

  static getPopularEndpoints(userId, limit = 5, callback) {
    db.all(
      `SELECT endpoint, COUNT(*) as count
       FROM api_usage
       WHERE api_key_id IN (SELECT id FROM api_keys WHERE user_id = ?)
       GROUP BY endpoint
       ORDER BY count DESC
       LIMIT ?`,
      [userId, limit],
      callback
    );
  }
}

module.exports = ApiUsage; 