const express = require('express');
const router = express.Router();
const { followUser, unfollowUser, getFollowers, getFollowing, getFollowedUsersPosts } = require('../controllers/followController');
const { verifyToken } = require('../middleware/auth');

// Follow a user
router.post('/follow', verifyToken, followUser);

// Unfollow a user
router.post('/unfollow', verifyToken, unfollowUser);

// Get user's followers
router.get('/followers/:userId', verifyToken, getFollowers);

// Get user's following
router.get('/following/:userId', verifyToken, getFollowing);

// Get blog posts from followed users
router.get('/feed/:userId', verifyToken, getFollowedUsersPosts);

module.exports = router; 