const express = require('express');
const router = express.Router();
const { followUser, unfollowUser, getFollowers, getFollowing, getFollowedUsersPosts } = require('../controllers/followController');
const { verifyToken } = require('../middleware/auth');

router.post('/follow', verifyToken, followUser);
router.post('/unfollow', verifyToken, unfollowUser);
router.get('/followers/:userId', verifyToken, getFollowers);
router.get('/following/:userId', verifyToken, getFollowing);
router.get('/feed/:userId', verifyToken, getFollowedUsersPosts);

module.exports = router; 