const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.get('/', blogPostController.getAllPosts);
router.get('/:id', blogPostController.getPost);

// Protected routes (require authentication)
router.post('/', verifyToken, blogPostController.create);
router.put('/:id', verifyToken, blogPostController.updatePost);
router.delete('/:id', verifyToken, blogPostController.deletePost);

module.exports = router; 