const User = require('../database/models/User');
const Follow = require('../database/models/Follow');

const followUser = async (followerId, followingId) => {
    const [follower, following] = await Promise.all([
        User.findById(followerId),
        User.findById(followingId)
    ]);

    if (!follower || !following) {
        throw new Error('User Not Found');
    }

    const isFollowing = await Follow.exists(followerId, followingId);
    if (isFollowing) {
        throw new Error('Already Following');
    }

    await Follow.create(followerId, followingId);
    return {
        followingId: following.id,
        username: following.username
    };
};

const unfollowUser = async (followerId, followingId) => {
    const isFollowing = await Follow.exists(followerId, followingId);
    if (!isFollowing) {
        throw new Error('Follow Relationship Not Found');
    }

    const following = await User.findById(followingId);
    if (!following) {
        throw new Error('User Not Found');
    }

    await Follow.delete(followerId, followingId);
    return {
        followingId: following.id,
        username: following.username
    };
};

const getFollowers = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User Not Found');
    }

    const followers = await Follow.getFollowers(userId);
    return {
        followers,
        username: user.username
    };
};

const getFollowing = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User Not Found');
    }

    const following = await Follow.getFollowing(userId);
    return {
        following,
        username: user.username
    };
};

const getFollowedUsersPosts = async (userId, page = 1, limit = 10) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User Not Found');
    }

    const result = await Follow.getFollowedUsersPosts(userId, page, limit);
    return {
        posts: result.posts,
        total: result.total,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.total / parseInt(limit)),
            totalItems: result.total,
            itemsPerPage: parseInt(limit)
        }
    };
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowedUsersPosts
}; 