const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { verifyToken } = require('../middleware/auth');
const { validations, validate } = require('../middleware/validation');

// Public routes
router.get('/', validate(validations.pagination), blogPostController.getFeed);
router.get('/search/country', validate(validations.searchByCountry), blogPostController.searchByCountry);
router.get('/search/username', validate(validations.searchByUsername), blogPostController.searchByUsername);
router.get('/:id', validate(validations.getPost), blogPostController.getPost);

// Protected routes (require authentication)
router.post('/', verifyToken, validate(validations.createPost), blogPostController.createPost);
router.put('/:id', verifyToken, validate(validations.updatePost), blogPostController.updatePost);
router.delete('/:id', verifyToken, validate(validations.deletePost), blogPostController.deletePost);

module.exports = router; 
