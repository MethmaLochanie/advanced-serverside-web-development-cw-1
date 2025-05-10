import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    Avatar,
    Grid,
    Divider,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Link,
    Button
} from '@mui/material';
import FollowButton from '../components/FollowButton';
import FollowLists from '../components/FollowLists';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getFollowers, getFollowing } from '../api/followApi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Profile = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [showSuggestedUsers, setShowSuggestedUsers] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [listsLoading, setListsLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfileUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

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
    }, [userId]);

    useEffect(() => {
        refreshLists();
    }, [refreshLists]);

    const fetchSuggestedUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/users/suggested`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuggestedUsers(response.data.users);
            setShowSuggestedUsers(true);
        } catch (error) {
            console.error('Error fetching suggested users:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!profileUser) {
        return (
            <Container>
                <Typography variant="h5" color="error" align="center">
                    User not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ width: 100, height: 100, mr: 3 }}>
                        {profileUser.username[0].toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                        <Typography variant="h4" gutterBottom>
                            {profileUser.username}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {profileUser.email}
                        </Typography>
                    </Box>
                    {currentUser && currentUser.id !== profileUser.id && (
                        <FollowButton
                            targetUserId={profileUser.id}
                            initialIsFollowing={!!following.find(u => u.id === profileUser.id)}
                            onFollowChange={refreshLists}
                        />
                    )}
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box sx={{ width: '100%', maxWidth: 600 }}>
                        <FollowLists
                            userId={profileUser.id}
                            followers={followers}
                            following={following}
                            loading={listsLoading}
                            refreshLists={refreshLists}
                        />
                    </Box>
                    {currentUser && currentUser.id === profileUser.id && (
                        <Box
                            sx={{
                                background: "#fafafa",
                                borderRadius: 2,
                                p: 3,
                                boxShadow: 1,
                                width: '100%',
                                maxWidth: 600,
                                mt: 3,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Discover Users
                            </Typography>
                            {!showSuggestedUsers ? (
                                <Button
                                    variant="outlined"
                                    onClick={fetchSuggestedUsers}
                                    sx={{ mb: 2, mx: 'auto' }}
                                >
                                    Show Suggested Users
                                </Button>
                            ) : (
                                <List sx={{ textAlign: 'left' }}>
                                    {suggestedUsers.length === 0 && (
                                        <Typography color="textSecondary" align="center">
                                            No users to suggest.
                                        </Typography>
                                    )}
                                    {suggestedUsers.map((user) => (
                                        <ListItem
                                            key={user.id}
                                            secondaryAction={
                                                <FollowButton
                                                    targetUserId={user.id}
                                                    initialIsFollowing={false}
                                                    onFollowChange={refreshLists}
                                                />
                                            }
                                            sx={{ px: 0 }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {user.username[0].toUpperCase()}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Link
                                                        component="span"
                                                        sx={{
                                                            cursor: "pointer",
                                                            "&:hover": { textDecoration: "underline" },
                                                        }}
                                                        onClick={() => window.location.href = `/profile/${user.id}`}
                                                    >
                                                        {user.username}
                                                    </Link>
                                                }
                                                secondary={user.email}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;