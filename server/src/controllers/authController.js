const authService = require('../services/authService');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
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

module.exports = {
  register,
  login
}; 