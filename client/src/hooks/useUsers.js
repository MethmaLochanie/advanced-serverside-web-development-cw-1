import { useState } from 'react';
import { userService } from '../api/users';

export const useUsers = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUserProfile = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getUserProfile(userId);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch user profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getSuggestedUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getSuggestedUsers();
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch suggested users');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        getUserProfile,
        getSuggestedUsers,
        loading,
        error
    };
}; 