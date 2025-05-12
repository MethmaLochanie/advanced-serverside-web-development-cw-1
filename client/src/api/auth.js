import api from './api';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            // Handle specific error cases
            if (error.response?.data?.error === 'Account Inactive') {
                return {
                    success: false,
                    error: 'Account Inactive',
                    message: error.response.data.message
                };
            }
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