const { db } = require('../database/init');

// User Management
const listUsers = (req, res) => {
  db.all(
    `SELECT id, username, email, role, is_active, created_at, last_login,
     (SELECT COUNT(*) FROM api_keys WHERE user_id = users.id) as api_key_count
     FROM users ORDER BY created_at DESC`,
    (err, users) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving users' });
      }
      res.json(users);
    }
  );
};

const updateUserStatus = (req, res) => {
  const { userId } = req.params;
  const { is_active } = req.body;

  db.run(
    'UPDATE users SET is_active = ? WHERE id = ?',
    [is_active, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating user status' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log admin action
      db.run(
        'INSERT INTO admin_logs (admin_id, action, target_id, details) VALUES (?, ?, ?, ?)',
        [req.user.id, 'update_user_status', userId, `Set is_active to ${is_active}`]
      );

      res.json({ message: 'User status updated successfully' });
    }
  );
};

const updateUserRole = (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  db.run(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating user role' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log admin action
      db.run(
        'INSERT INTO admin_logs (admin_id, action, target_id, details) VALUES (?, ?, ?, ?)',
        [req.user.id, 'update_user_role', userId, `Set role to ${role}`]
      );

      res.json({ message: 'User role updated successfully' });
    }
  );
};

// System Statistics
const getSystemStats = (req, res) => {
  const stats = {};

  // Get total users count
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) return res.status(500).json({ message: 'Error getting user count' });
    stats.totalUsers = row.count;

    // Get active users count
    db.get('SELECT COUNT(*) as count FROM users WHERE is_active = 1', (err, row) => {
      if (err) return res.status(500).json({ message: 'Error getting active user count' });
      stats.activeUsers = row.count;

      // Get total API keys count
      db.get('SELECT COUNT(*) as count FROM api_keys', (err, row) => {
        if (err) return res.status(500).json({ message: 'Error getting API key count' });
        stats.totalApiKeys = row.count;

        // Get active API keys count
        db.get('SELECT COUNT(*) as count FROM api_keys WHERE is_active = 1', (err, row) => {
          if (err) return res.status(500).json({ message: 'Error getting active API key count' });
          stats.activeApiKeys = row.count;

          // Get API usage by endpoint
          db.all(
            `SELECT endpoint, COUNT(*) as count 
             FROM api_usage 
             GROUP BY endpoint 
             ORDER BY count DESC 
             LIMIT 10`,
            (err, rows) => {
              if (err) return res.status(500).json({ message: 'Error getting API usage stats' });
              stats.topEndpoints = rows;

              res.json(stats);
            }
          );
        });
      });
    });
  });
};

// Admin Logs
const getAdminLogs = (req, res) => {
  const { limit = 100, offset = 0 } = req.query;

  db.all(
    `SELECT al.*, u.username as admin_username 
     FROM admin_logs al 
     JOIN users u ON al.admin_id = u.id 
     ORDER BY al.timestamp DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, logs) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving admin logs' });
      }
      res.json(logs);
    }
  );
};

module.exports = {
  listUsers,
  updateUserStatus,
  updateUserRole,
  getSystemStats,
  getAdminLogs
}; 