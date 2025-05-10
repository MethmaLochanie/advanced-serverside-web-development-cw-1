import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
};

// Follow a user
export const followUser = async (followingId) => {
    const response = await axios.post(`${API_URL}/follow/follow`, {
        followingId
    }, {
        headers: {
            Authorization: getAuthToken()
        }
    });
    return response.data;
};

// Unfollow a user
export const unfollowUser = async (followingId) => {
    const response = await axios.post(`${API_URL}/follow/unfollow`, {
        followingId
    }, {
        headers: {
            Authorization: getAuthToken()
        }
    });
    return response.data;
};

// Get user's followers
export const getFollowers = async (userId) => {
    const response = await axios.get(`${API_URL}/follow/followers/${userId}`, {
        headers: {
            Authorization: getAuthToken()
        }
    });
    return response.data;
};

// Get user's following
export const getFollowing = async (userId) => {
    const response = await axios.get(`${API_URL}/follow/following/${userId}`, {
        headers: {
            Authorization: getAuthToken()
        }
    });
    return response.data;
};

// Get followed users' posts
export const getFollowedUsersPosts = async (userId, page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}/follow/feed/${userId}`, {
        params: { page, limit },
        headers: {
            Authorization: getAuthToken()
        }
    });
    return response.data;
}; 