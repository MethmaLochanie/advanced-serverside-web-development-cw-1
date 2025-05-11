import api from './api';

// Follow a user
export const followUser = async (followingId) => {
    const response = await api.post('/follow/follow', {
        followingId
    });
    return response.data;
};

// Unfollow a user
export const unfollowUser = async (followingId) => {
    const response = await api.post('/follow/unfollow', {
        followingId
    });
    return response.data;
};

// Get user's followers
export const getFollowers = async (userId) => {
    const response = await api.get(`/follow/followers/${userId}`);
    return response.data;
};

// Get user's following
export const getFollowing = async (userId) => {
    const response = await api.get(`/follow/following/${userId}`);
    return response.data;
};

// Get followed users' posts
export const getFollowedUsersPosts = async (userId, page = 1, limit = 10) => {
    const response = await api.get(`/follow/feed/${userId}`, {
        params: { page, limit }
    });
    return response.data;
}; 