import api from './api';

export const authService = {
    validateToken: async (token) => {
        const response = await api.get('/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },

    register: async (username, email, password) => {
        const response = await api.post('/auth/register', {
            username,
            email,
            password
        });
        return response.data;
    }
}; 