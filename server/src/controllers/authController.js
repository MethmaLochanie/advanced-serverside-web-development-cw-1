const authService = require('../services/authService');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing Required Fields',
        message: 'Username, email, and password are required'
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Email',
        message: 'Please provide a valid email address'
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Weak Password',
        message: 'Password must be at least 8 characters long'
      });
    }

    const userData = await authService.register({ username, email, password });

    res.status(201).json({
      success: true,
      message: `Account created successfully for ${username}`,
      data: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message.includes('UNIQUE constraint failed: users.email')) {
      return res.status(409).json({
        success: false,
        error: 'Email Already Exists',
        message: 'An account with this email already exists'
      });
    }
    if (error.message.includes('UNIQUE constraint failed: users.username')) {
      return res.status(409).json({
        success: false,
        error: 'Username Already Exists',
        message: 'This username is already taken'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Registration Failed',
      message: 'An error occurred during registration'
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing Required Fields',
        message: 'Email and password are required'
      });
    }

    const result = await authService.login({ email, password });

    res.json({
      success: true,
      message: `Welcome back, ${result.user.username}!`,
      data: result
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.message === 'Authentication Failed') {
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      });
    }
    if (error.message === 'Account Inactive') {
      return res.status(401).json({
        success: false,
        error: 'Account Inactive',
        message: 'Your account has been deactivated. Please contact support'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Login Failed',
      message: 'An error occurred during login'
    });
  }
};

const validateToken = async (req, res) => {
  try {
    const user = await authService.validateToken(req.user.id);
    
    res.json({
      success: true,
      message: 'Session validated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    if (error.message === 'User Not Found') {
      return res.status(404).json({
        success: false,
        error: 'User Not Found',
        message: 'The user associated with this token no longer exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Token Validation Failed',
      message: 'An error occurred while validating your session'
    });
  }
};

module.exports = {
  register,
  login,
  validateToken
}; 