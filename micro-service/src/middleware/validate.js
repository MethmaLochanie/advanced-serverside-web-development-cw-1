const { validationResult, body, param, query } = require('express-validator');

// Middleware to check for validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Common validation rules
const commonValidations = {
  // User-related validations
  userId: param('id')
    .isInt()
    .withMessage('User ID must be a number'),
  
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
  
  // Pagination validations
  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive number'),
  
  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  // API key validations
  apiKey: body('apiKey')
    .isString()
    .trim()
    .isLength({ min: 32, max: 64 })
    .withMessage('API key must be between 32 and 64 characters'),
  
  // Role validation
  role: body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
};

// Validation chains for different routes
const validations = {
  // User registration validation
  register: [
    commonValidations.email,
    commonValidations.password,
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    validateRequest
  ],

  // Login validation
  login: [
    commonValidations.email,
    body('password').exists().withMessage('Password is required'),
    validateRequest
  ],

  // Update user validation
  updateUser: [
    commonValidations.userId,
    body('email').optional().isEmail().normalizeEmail(),
    body('name').optional().trim().isLength({ min: 2, max: 50 }),
    validateRequest
  ],

  // API key creation validation
  createApiKey: [
    body('name')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('API key name must be between 1 and 50 characters'),
    validateRequest
  ],

  // Pagination validation
  pagination: [
    commonValidations.page,
    commonValidations.limit,
    validateRequest
  ],

  // Update user role validation
  updateRole: [
    commonValidations.userId,
    commonValidations.role,
    validateRequest
  ]
};

module.exports = {
  validateRequest,
  commonValidations,
  validations
}; 