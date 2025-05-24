import api from './api';

export const blogPostService = {
    // Get all blog posts
    getAllPosts: async () => {
        const response = await api.get('/posts/all');
        return response.data;
    },

    // Get a single blog post
    getPost: async (id) => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    // Create a new blog post
    createPost: async (postData) => {
        const response = await api.post('/posts', postData);
        return response.data;
    },

    // Update a blog post
    updatePost: async (id, postData) => {
        const response = await api.put(`/posts/${id}`, postData);
        return response.data;
    },

    // Delete a blog post
    deletePost: async (id) => {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    },

    // Search blog posts by country
    searchByCountry: async (country, page = 1, limit = 10) => {
        const response = await api.get('/posts/search/country', {
            params: { country, page, limit }
        });
        return response.data;
    },

    // Search blog posts by username
    searchByUsername: async (username, page = 1, limit = 10) => {
        const response = await api.get('/posts/search/username', {
            params: { username, page, limit }
        });
        return response.data;
    },

    // Add a comment to a post
    addComment: async (postId, comment) => {
        const response = await api.post(`/posts/${postId}/comments`, { content: comment });
        return response.data;
    },

    // Get comments for a post
    getComments: async (postId) => {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    },

    // Delete a comment
    deleteComment: async (postId, commentId) => {
        const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
        return response.data;
    },

    // Toggle dislike on a post
    toggleDislike: async (postId) => {
        const response = await api.post(`/posts/${postId}/dislike`);
        return response.data;
    },

    // Get dislike status for a post
    getDislikeStatus: async (postId) => {
        const response = await api.get(`/posts/${postId}/dislike`);
        return response.data;
    },

    // Get dislike count for a post
    getDislikeCount: async (postId) => {
        const response = await api.get(`/posts/${postId}/dislike/count`);
        return response.data;
    },

    // Toggle like on a post
    toggleLike: async (postId) => {
        const response = await api.post(`/posts/${postId}/like`);
        return response.data;
    },

    // Get like status for a post
    getLikeStatus: async (postId) => {
        const response = await api.get(`/posts/${postId}/like`);
        return response.data;
    },

    // Get like count for a post
    getLikeCount: async (postId) => {
        const response = await api.get(`/posts/${postId}/like/count`);
        return response.data;
    },

    // Get recent posts
    getRecentPosts: async (limit = 10) => {
        const response = await api.get('/posts/recent', { params: { limit } });
        return response.data;
    },

    // Get popular posts
    getPopularPosts: async (limit = 10) => {
        const response = await api.get('/posts/popular', { params: { limit } });
        return response.data;
    },

    // Get my blog posts
    getMyPosts: async (page = 1, limit = 10, search = '') => {
        const response = await api.get('/posts/mine', {
            params: { page, limit, search }
        });
        return response.data;
    }
}; 