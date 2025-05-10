import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const blogPostService = {
    // Get all blog posts
    getAllPosts: async () => {
        const response = await axios.get(`${API_URL}/posts`);
        return response.data;
    },

    // Get a single blog post
    getPost: async (id) => {
        const response = await axios.get(`${API_URL}/posts/${id}`);
        return response.data;
    },

    // Create a new blog post
    createPost: async (postData) => {
        const response = await axios.post(`${API_URL}/posts`, postData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Update a blog post
    updatePost: async (id, postData) => {
        const response = await axios.put(`${API_URL}/posts/${id}`, postData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Delete a blog post
    deletePost: async (id) => {
        const response = await axios.delete(`${API_URL}/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    // Search blog posts by country
    searchByCountry: async (country, page = 1, limit = 10) => {
        const response = await axios.get(`${API_URL}/posts/search/country`, {
            params: { country, page, limit }
        });
        return response.data;
    },

    // Search blog posts by username
    searchByUsername: async (username, page = 1, limit = 10) => {
        const response = await axios.get(`${API_URL}/posts/search/username`, {
            params: { username, page, limit }
        });
        return response.data;
    }
}; 