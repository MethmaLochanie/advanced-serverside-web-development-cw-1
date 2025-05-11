import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFollow } from '../hooks/useFollow';
import { useUsers } from '../hooks/useUsers';
import UserProfile from '../components/UserProfile';
import FollowLists from '../components/FollowLists';

const Profile = () => {
    const [profileUser, setProfileUser] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [showSuggestedUsers, setShowSuggestedUsers] = useState(false);
    const [listsLoading, setListsLoading] = useState(false);
    const { userId } = useParams();
    const { user } = useAuth();
    const { getFollowers, getFollowing } = useFollow();
    const { 
        getUserProfile, 
        getSuggestedUsers: getSuggestedUsersFromHook, 
        loading: profileLoading, 
        error: profileError 
    } = useUsers();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const data = await getUserProfile(userId);
                setProfileUser(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [userId, getUserProfile]);

    const refreshLists = useCallback(async () => {
        setListsLoading(true);
        try {
            const followersData = await getFollowers(userId);
            setFollowers(followersData.followers || []);
            const followingData = await getFollowing(userId);
            setFollowing(followingData.following || []);
        } catch (error) {
            console.error('Error refreshing follow data:', error);
        } finally {
            setListsLoading(false);
        }
    }, [userId, getFollowers, getFollowing]);

    useEffect(() => {
        refreshLists();
    }, [refreshLists]);

    const fetchSuggestedUsers = async () => {
        try {
            const data = await getSuggestedUsersFromHook();
            setSuggestedUsers(data.users);
            setShowSuggestedUsers(true);
        } catch (error) {
            console.error('Error fetching suggested users:', error);
        }
    };

    if (profileLoading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (profileError) {
        return (
            <Container>
                <Alert severity="error">{profileError}</Alert>
            </Container>
        );
    }

    if (!profileUser) {
        return (
            <Container>
                <Alert severity="error">User not found</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <UserProfile 
                profileUser={profileUser} 
                currentUser={user}
                onRefreshLists={refreshLists}
            />
            
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Followers
                </Typography>
                <FollowLists 
                    users={followers} 
                    loading={listsLoading}
                    onRefresh={refreshLists}
                />
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Following
                </Typography>
                <FollowLists 
                    users={following} 
                    loading={listsLoading}
                    onRefresh={refreshLists}
                />
            </Box>

            {!showSuggestedUsers && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography 
                        variant="body1" 
                        color="primary" 
                        sx={{ cursor: 'pointer' }}
                        onClick={fetchSuggestedUsers}
                    >
                        Find people to follow
                    </Typography>
                </Box>
            )}

            {showSuggestedUsers && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Suggested Users
                    </Typography>
                    <FollowLists 
                        users={suggestedUsers} 
                        loading={listsLoading}
                        onRefresh={refreshLists}
                    />
                </Box>
            )}
        </Container>
    );
};

export default Profile;