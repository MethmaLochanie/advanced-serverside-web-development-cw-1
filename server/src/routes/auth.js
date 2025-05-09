const express = require('express');
const { register, login, validateToken } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../utils/validator');
const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/validate', verifyToken, validateToken);

module.exports = router; 