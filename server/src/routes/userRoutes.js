const express = require('express');
const router = express.Router();
const { getProfile, getSuggestedUsers } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.get('/suggested', verifyToken, getSuggestedUsers);
router.get('/:userId', verifyToken, getProfile);

module.exports = router; 