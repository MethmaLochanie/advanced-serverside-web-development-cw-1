import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    CircularProgress,
    Divider,
    Link
} from '@mui/material';
import { getFollowers, getFollowing } from '../api/followApi';

const FollowLists = ({ userId }) => {
    const [value, setValue] = useState(0);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (value === 0) {
                    const data = await getFollowers(userId);
                    setFollowers(data.followers || []);
                } else {
                    const data = await getFollowing(userId);
                    setFollowing(data.following || []);
                }
            } catch (error) {
                console.error('Error fetching follow data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, value]);

    const renderList = (items) => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                </Box>
            );
        }

        if (items.length === 0) {
            return (
                <Typography align="center" color="textSecondary" sx={{ py: 3 }}>
                    {value === 0 ? 'No followers yet' : 'Not following anyone yet'}
                </Typography>
            );
        }

        return (
            <List>
                {items.map((user, index) => (
                    <React.Fragment key={user.id}>
                        <ListItem 
                            button 
                            onClick={() => handleUserClick(user.id)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <ListItemAvatar>
                                <Avatar>{user.username[0].toUpperCase()}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Link
                                        component="span"
                                        sx={{ 
                                            cursor: 'pointer',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        {user.username}
                                    </Link>
                                }
                                secondary={user.email}
                            />
                        </ListItem>
                        {index < items.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        );
    };

    return (
        <Box>
            <Tabs
                value={value}
                onChange={handleTabChange}
                centered
                sx={{ mb: 2 }}
            >
                <Tab label={`Followers (${followers.length})`} />
                <Tab label={`Following (${following.length})`} />
            </Tabs>
            {value === 0 ? renderList(followers) : renderList(following)}
        </Box>
    );
};

export default FollowLists; 