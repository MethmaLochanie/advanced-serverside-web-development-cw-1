import api from './api';

export const userService = {
    getUserProfile: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    getSuggestedUsers: async () => {
        const response = await api.get('/users/suggested');
        return response.data;
    }
}; 