const { body, query, param, validationResult } = require('express-validator');

// Validation rules
const validations = {
    register: [
        body('username')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
    ],
    login: [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    pagination: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ],
    searchByCountry: [
        query('country')
            .trim()
            .notEmpty()
            .withMessage('Country name is required')
    ],
    searchByUsername: [
        query('username')
            .trim()
            .notEmpty()
            .withMessage('Username is required')
    ],
    getPost: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid post ID')
    ],
    createPost: [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ max: 200 })
            .withMessage('Title must be less than 200 characters'),
        body('content')
            .trim()
            .notEmpty()
            .withMessage('Content is required'),
        body('country_name')
            .trim()
            .notEmpty()
            .withMessage('Country is required')
    ],
    updatePost: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid post ID'),
        body('title')
            .optional()
            .trim()
            .isLength({ max: 200 })
            .withMessage('Title must be less than 200 characters'),
        body('content')
            .optional()
            .trim(),
        body('country_name')
            .optional()
            .trim()
    ],
    deletePost: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid post ID')
    ]
};

// Validation middleware
const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // If there are validation errors, return them
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: 'Invalid input data',
            errors: errors.array()
        });
    };
};

module.exports = {
    validations,
    validate
}; 