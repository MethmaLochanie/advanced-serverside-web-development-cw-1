import { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { followUser, unfollowUser } from '../api/followApi';
import { useAuth } from '../context/AuthContext';

const FollowButton = ({ targetUserId, initialIsFollowing = false, onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

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

    if (!user || !targetUserId || user.id === targetUserId) return null;

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"}
            color={isFollowing ? "error" : "primary"}
            onClick={handleFollowToggle}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            sx={{
                minWidth: '100px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: isFollowing ? '0 0 8px rgba(211, 47, 47, 0.4)' : '0 0 8px rgba(25, 118, 210, 0.4)'
                }
            }}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    );
};

export default FollowButton; 