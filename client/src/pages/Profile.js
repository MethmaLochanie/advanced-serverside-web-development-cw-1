import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Button, Paper, Avatar, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFollow } from '../hooks/useFollow';
import { useUsers } from '../hooks/useUsers';
import UserProfile from '../components/UserProfile';
import FollowLists from '../components/FollowLists';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

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

    // Fetch user profile
    useEffect(() => {
        let isMounted = true;
        const fetchUserProfile = async () => {
            if (!userId) return;
            try {
                const response = await getUserProfile(userId);
                if (isMounted && response?.data) {
                    setProfileUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
        return () => {
            isMounted = false;
        };
    }, [userId, getUserProfile]);

    // Fetch followers and following
    const fetchFollowData = useCallback(async () => {
        if (!userId) return;
        
        setListsLoading(true);
        try {
            const [followersData, followingData] = await Promise.all([
                getFollowers(userId),
                getFollowing(userId)
            ]);
            
            setFollowers(followersData.data || []);
            setFollowing(followingData.data || []);
        } catch (error) {
            console.error('Error refreshing follow data:', error);
        } finally {
            setListsLoading(false);
        }
    }, [userId, getFollowers, getFollowing]);

    // Initial fetch of follow data
    useEffect(() => {
        if (userId) {
            fetchFollowData();
        }
    }, [userId, fetchFollowData]);

    const fetchSuggestedUsers = useCallback(async () => {
        try {
            const data = await getSuggestedUsersFromHook();
            setSuggestedUsers(data.users || []);
            setShowSuggestedUsers(true);
        } catch (error) {
            console.error('Error fetching suggested users:', error);
        }
    }, [getSuggestedUsersFromHook]);

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
        <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: 4, background: '#f8fafc' }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar sx={{ width: 90, height: 90, fontSize: 40, bgcolor: '#bdbdbd', border: '4px solid #fff' }}>
                        {profileUser.username ? profileUser.username[0].toUpperCase() : <PersonOutlineIcon fontSize="large" />}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            {profileUser.username}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {profileUser.email}
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            <Box sx={{ mt: 4, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Paper elevation={2} sx={{ flex: 1, minWidth: 280, p: 3, borderRadius: 3, background: '#fff' }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Followers
                    </Typography>
                    <FollowLists 
                        users={followers}
                        loading={listsLoading}
                        onRefresh={fetchFollowData}
                        emptyMessage={
                            <Stack alignItems="center" spacing={1}>
                                <PersonOutlineIcon color="disabled" fontSize="large" />
                                <Typography color="text.secondary">No followers yet</Typography>
                            </Stack>
                        }
                    />
                </Paper>
                <Paper elevation={2} sx={{ flex: 1, minWidth: 280, p: 3, borderRadius: 3, background: '#fff' }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Following
                    </Typography>
                    <FollowLists 
                        users={following}
                        loading={listsLoading}
                        onRefresh={fetchFollowData}
                        emptyMessage={
                            <Stack alignItems="center" spacing={1}>
                                <PersonOutlineIcon color="disabled" fontSize="large" />
                                <Typography color="text.secondary">Not following anyone</Typography>
                            </Stack>
                        }
                    />
                </Paper>
            </Box>

            {!showSuggestedUsers && (
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large" 
                        sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, boxShadow: 2 }}
                        onClick={fetchSuggestedUsers}
                    >
                        Find people to follow
                    </Button>
                </Box>
            )}

            {showSuggestedUsers && (
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Suggested Users
                    </Typography>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 3, background: '#f4f6fa' }}>
                        <FollowLists 
                            users={suggestedUsers}
                            loading={listsLoading}
                            onRefresh={fetchFollowData}
                            emptyMessage={
                                <Stack alignItems="center" spacing={1}>
                                    <PersonOutlineIcon color="disabled" fontSize="large" />
                                    <Typography color="text.secondary">No suggestions right now</Typography>
                                </Stack>
                            }
                        />
                    </Paper>
                </Box>
            )}
        </Container>
    );
};

export default Profile;