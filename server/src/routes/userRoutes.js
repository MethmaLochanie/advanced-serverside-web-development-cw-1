const express = require('express');
const router = express.Router();
const { getUserProfile, getSuggestedUsers } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Get suggested users to follow (must come before /:userId route)
router.get('/suggested', verifyToken, getSuggestedUsers);

// Get user profile
router.get('/:userId', verifyToken, getUserProfile);

module.exports = router; 