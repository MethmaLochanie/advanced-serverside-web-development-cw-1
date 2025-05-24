const express = require('express');
const { register, login, validateToken } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate', verifyToken, validateToken);

module.exports = router; 