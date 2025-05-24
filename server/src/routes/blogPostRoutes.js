const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { verifyToken } = require('../middleware/auth');
const { validations, validate } = require('../middleware/validator');

// Recent posts route
router.get('/recent', blogPostController.getRecentPosts);
// Popular posts route
router.get('/popular', blogPostController.getPopularPosts);
// All posts route
router.get('/all', blogPostController.getFeed);

// Public routes
router.get('/', validate(validations.pagination), blogPostController.getFeed);
router.get('/search/country', validate(validations.searchByCountry), blogPostController.searchByCountry);
router.get('/search/username', validate(validations.searchByUsername), blogPostController.searchByUsername);
router.get('/mine', verifyToken, blogPostController.getMyPosts);
router.get('/:id', validate(validations.getPost), blogPostController.getPost);

// Protected routes (require authentication)
router.post('/', verifyToken, validate(validations.createPost), blogPostController.createPost);
router.put('/:id', verifyToken, validate(validations.updatePost), blogPostController.updatePost);
router.delete('/:id', verifyToken, validate(validations.deletePost), blogPostController.deletePost);

// Dislike routes (require authentication)
router.post('/:id/dislike', verifyToken, blogPostController.toggleDislike);
router.get('/:id/dislike', verifyToken, blogPostController.getDislikeStatus);
router.get('/:id/dislike/count', blogPostController.getDislikeCount);

// Like routes (require authentication)
router.post('/:id/like', verifyToken, blogPostController.toggleLike);
router.get('/:id/like', verifyToken, blogPostController.getLikeStatus);
router.get('/:id/like/count', blogPostController.getLikeCount);

// Comment routes (require authentication)
router.post('/:id/comments', verifyToken, blogPostController.addComment);
router.get('/:id/comments', blogPostController.getComments);
router.delete('/:id/comments/:commentId', verifyToken, blogPostController.deleteComment);

module.exports = router; 