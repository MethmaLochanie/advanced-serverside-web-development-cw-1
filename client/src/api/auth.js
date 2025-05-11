import api from './api';

export const authService = {
    validateToken: async (token) => {
        try {
            const response = await api.get('/auth/validate', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (username, email, password) => {
        try {
            const response = await api.post('/auth/register', {
                username,
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 