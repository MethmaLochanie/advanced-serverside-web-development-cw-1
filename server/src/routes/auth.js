const express = require('express');
const { register, login, validateToken, resetPassword, verifyEmail } = require('../controllers/authController');
const { verifyToken, loginLimiter, registerLimiter } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../utils/validator');
const router = express.Router();

// Apply rate limiters
router.post('/register', registerLimiter, validateRegistration, register);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/reset-password', loginLimiter, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/validate', verifyToken, validateToken);

module.exports = router; 