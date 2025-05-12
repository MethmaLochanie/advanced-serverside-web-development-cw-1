const User = require('../database/models/User');
const Follow = require('../database/models/Follow');

const getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User Not Found');
    }
    const followerCount = await Follow.getFollowerCount(userId);
    const followingCount = await Follow.getFollowingCount(userId);
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        country: user.country,
        createdAt: user.createdAt,
        followerCount,
        followingCount
    };
};

const getSuggestedUsers = async (userId, limit = 5) => {
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 20) {
        throw new Error('Invalid Limit');
    }

    const suggestedUsers = await Follow.getSuggestedUsers(userId, parsedLimit);
    return suggestedUsers;
};

const updateProfile = async (userId, { username, email, country }) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User Not Found');
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (country) user.country = country;

    await user.save();

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        country: user.country,
        updatedAt: user.updatedAt
    };
};

const deleteAccount = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User Not Found');
    }

    await user.delete();

    return {
        username: user.username,
        deletedAt: new Date()
    };
};

module.exports = {
    getProfile,
    getSuggestedUsers,
    updateProfile,
    deleteAccount
}; 