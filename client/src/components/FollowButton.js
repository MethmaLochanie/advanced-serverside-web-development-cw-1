import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { followUser, unfollowUser } from '../api/followApi';
import { useAuth } from '../context/AuthContext';

const FollowButton = ({ targetUserId, initialIsFollowing = false, onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const handleFollowToggle = async () => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(targetUserId);
            } else {
                await followUser(targetUserId);
            }
            setIsFollowing(!isFollowing);
            if (onFollowChange) onFollowChange();
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || user.id === targetUserId) return null;

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"}
            color={isFollowing ? "secondary" : "primary"}
            onClick={handleFollowToggle}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    );
};

export default FollowButton; 