const followService = require('../services/followService');

const followUser = async (req, res) => {
    const followerId = req.user.id;
    const { followingId } = req.body;

    if (!followingId) {
        return res.status(400).json({
            success: false,
            error: 'Missing Required Fields',
            message: 'User ID to follow is required'
        });
    }

    if (followerId === followingId) {
        return res.status(400).json({
            success: false,
            error: 'Invalid Operation',
            message: 'Users cannot follow themselves'
        });
    }

    try {
        const result = await followService.followUser(followerId, followingId);
        res.status(201).json({
            success: true,
            message: `You are now following ${result.username}`,
            data: result
        });
    } catch (error) {
        console.error('Error following user:', error);
        if (error.message === 'User Not Found') {
            return res.status(404).json({
                success: false,
                error: 'User Not Found',
                message: 'One or both users do not exist'
            });
        }
        if (error.message === 'Already Following') {
            return res.status(409).json({
                success: false,
                error: 'Already Following',
                message: 'You are already following this user'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Follow Operation Failed',
            message: 'An error occurred while following the user'
        });
    }
};

const unfollowUser = async (req, res) => {
    const followerId = req.user.id;
    const { followingId } = req.params;

    if (!followingId) {
        return res.status(400).json({
            success: false,
            error: 'Missing Required Fields',
            message: 'User ID to unfollow is required'
        });
    }

    try {
        const result = await followService.unfollowUser(followerId, followingId);
        res.json({
            success: true,
            message: `You have unfollowed ${result.username}`,
            data: result
        });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        if (error.message === 'Follow Relationship Not Found') {
            return res.status(404).json({
                success: false,
                error: 'Follow Relationship Not Found',
                message: 'You are not following this user'
            });
        }
        if (error.message === 'User Not Found') {
            return res.status(404).json({
                success: false,
                error: 'User Not Found',
                message: 'The specified user does not exist'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Unfollow Operation Failed',
            message: 'An error occurred while unfollowing the user'
        });
    }
};

const getFollowers = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await followService.getFollowers(userId);
        res.json({
            success: true,
            message: `Retrieved ${result.followers.length} followers for ${result.username}`,
            data: result.followers
        });
    } catch (error) {
        console.error('Error getting followers:', error);
        if (error.message === 'User Not Found') {
            return res.status(404).json({
                success: false,
                error: 'User Not Found',
                message: 'The specified user does not exist'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Fetch Operation Failed',
            message: 'An error occurred while fetching followers'
        });
    }
};

const getFollowing = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await followService.getFollowing(userId);
        res.json({
            success: true,
            message: `Retrieved ${result.following.length} users that ${result.username} is following`,
            data: result.following
        });
    } catch (error) {
        console.error('Error getting following:', error);
        if (error.message === 'User Not Found') {
            return res.status(404).json({
                success: false,
                error: 'User Not Found',
                message: 'The specified user does not exist'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Fetch Operation Failed',
            message: 'An error occurred while fetching following users'
        });
    }
};

const getFollowedUsersPosts = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const result = await followService.getFollowedUsersPosts(userId, page, limit);
        
        if (!result.posts.length) {
            return res.status(200).json({
                success: true,
                message: 'No posts found from users you follow',
                data: [],
                pagination: result.pagination
            });
        }

        res.json({
            success: true,
            message: `Retrieved ${result.posts.length} posts from users you follow`,
            data: result.posts,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Error getting followed users posts:', error);
        if (error.message === 'User Not Found') {
            return res.status(404).json({
                success: false,
                error: 'User Not Found',
                message: 'The specified user does not exist'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Fetch Operation Failed',
            message: 'An error occurred while fetching posts from followed users',
            details: error.message
        });
    }
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowedUsersPosts
}; 