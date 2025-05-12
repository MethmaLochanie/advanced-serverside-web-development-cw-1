import { useState, useCallback } from 'react';
import { followUser, unfollowUser, getFollowers, getFollowing, getFollowedUsersPosts } from '../api/followApi';
import { useAuth } from '../context/AuthContext';

export const useFollow = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const validateUser = useCallback(() => {
        if (!user) {
            throw new Error('You must be logged in to perform this action');
        }
        return user;
    }, [user]);

    const follow = useCallback(async (followingId) => {
        if (!followingId) {
            throw new Error('User ID to follow is required');
        }
        if (followingId === user?.id) {
            throw new Error('You cannot follow yourself');
        }

        validateUser();
        setLoading(true);
        setError(null);

        try {
            const data = await followUser(followingId);
            return data;
        } catch (err) {
            setError('Failed to follow user');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user, validateUser]);

    const unfollow = useCallback(async (followingId) => {
        if (!followingId) {
            throw new Error('User ID to unfollow is required');
        }

        validateUser();
        setLoading(true);
        setError(null);

        try {
            const data = await unfollowUser(followingId);
            return data;
        } catch (err) {
            setError('Failed to unfollow user');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [validateUser]);

    const getFollowersList = useCallback(async (userId) => {
        if (!userId) {
            throw new Error('User ID is required');
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getFollowers(userId);
            return data;
        } catch (err) {
            setError('Failed to fetch followers');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getFollowingList = useCallback(async (userId) => {
        if (!userId) {
            throw new Error('User ID is required');
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getFollowing(userId);
            return data;
        } catch (err) {
            setError('Failed to fetch following list');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getFollowedFeed = useCallback(async (userId, page = 1, limit = 10) => {
        if (!userId) {
            throw new Error('User ID is required');
        }

        validateUser();
        setLoading(true);
        setError(null);

        try {
            const data = await getFollowedUsersPosts(userId, page, limit);
            return data;
        } catch (err) {
            setError('Failed to fetch followed users posts');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [validateUser]);

    return {
        loading,
        error,
        follow,
        unfollow,
        getFollowers: getFollowersList,
        getFollowing: getFollowingList,
        getFollowedFeed
    };
}; 