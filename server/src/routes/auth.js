const express = require('express');
const { register, login, validateToken } = require('../controllers/authController');
const { loginLimiter, registerLimiter } = require('../middleware/auth');
const { verifyToken } = require('../middleware/auth');
const { validations, validate } = require('../middleware/validation');
const router = express.Router();

router.post('/register',validate(validations.register), register);
router.post('/login',validate(validations.login), login);

module.exports = router; 