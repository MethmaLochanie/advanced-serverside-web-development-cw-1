const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  listUsers,
  updateUserStatus,
  updateUserRole,
  getSystemStats,
  getAdminLogs
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require both authentication and admin privileges
router.use(verifyToken, isAdmin);

// User Management
router.get('/users', listUsers);
router.patch('/users/:userId/status', updateUserStatus);
router.patch('/users/:userId/role', updateUserRole);

// System Statistics
router.get('/stats', getSystemStats);

// Admin Logs
router.get('/logs', getAdminLogs);

module.exports = router; 