const User = require('../database/models/User');
const Follow = require('../database/models/Follow');
const { enrichPostWithCountryDetails } = require('./blogPostService');

const followUser = async (followerId, followingId) => {
    const [follower, following] = await Promise.all([
        User.findById(followerId),
        User.findById(followingId)
    ]);

    if (!follower || !following) {
        throw new Error('User Not Found');
    }

    const isFollowing = await Follow.isFollowing(followerId, followingId);
    if (isFollowing) {
        throw new Error('Already Following');
    }

    await Follow.follow(followerId, followingId);
    return {
        followingId: following.id,
        username: following.username
    };
};

const unfollowUser = async (followerId, followingId) => {
    const isFollowing = await Follow.isFollowing(followerId, followingId);
    if (!isFollowing) {
        throw new Error('Follow Relationship Not Found');
    }

    const following = await User.findById(followingId);
    if (!following) {
        throw new Error('User Not Found');
    }

    await Follow.unfollow(followerId, followingId);
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
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User Not Found');
        }

        const offset = (page - 1) * limit;
        const posts = await Follow.getFollowedUsersPosts(userId, limit, offset);
        const total = await Follow.getFollowedPostsCount(userId);

        if (!posts.length) {
            return {
                posts: [],
                total,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            };
        }

        // Enrich posts with country details
        try {
            const enrichedPosts = await Promise.all(
                posts.map(post => enrichPostWithCountryDetails(post))
            );

            return {
                posts: enrichedPosts,
                total,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: parseInt(limit)
                }
            };
        } catch (enrichError) {
            console.error('Error enriching posts:', enrichError);
            throw new Error(`Failed to enrich posts: ${enrichError.message}`);
        }
    } catch (error) {
        console.error('Error in getFollowedUsersPosts:', error);
        throw error;
    }
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowedUsersPosts
}; 