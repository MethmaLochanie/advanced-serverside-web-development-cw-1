import api from './api';

export const blogPostService = {
    // Get all blog posts
    getAllPosts: async () => {
        const response = await api.get('/posts');
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
    }
}; 