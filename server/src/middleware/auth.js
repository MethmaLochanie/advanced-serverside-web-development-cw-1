const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../database/models/User');
const rateLimit = require('express-rate-limit');

// Simple rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many registration attempts'
});

// Simple token verification
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ 
      message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
    });
  }
};

module.exports = { verifyToken, loginLimiter, registerLimiter };