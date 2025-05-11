import React from 'react';
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
import FollowButton from './FollowButton';

const FollowLists = ({ userId, followers, following, loading, refreshLists }) => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const renderList = (items, isFollowingTab) => {
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

        // Get a set of user IDs user is following
        const followingIds = new Set(following.map(u => u.id));

        return (
            <List>
                {items.map((user, index) => (
                    <React.Fragment key={user.id}>
                        <ListItem
                            secondaryAction={
                                <FollowButton
                                    targetUserId={user.id}
                                    initialIsFollowing={
                                        isFollowingTab
                                            ? true
                                            : followingIds.has(user.id)
                                    }
                                    onFollowChange={refreshLists}
                                />
                            }
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    {user.username[0].toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Link
                                        component="span"
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                        onClick={() => handleUserClick(user.id)}
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
            {value === 0
                ? renderList(followers, false)
                : renderList(following, true)
            }
        </Box>
    );
};

export default FollowLists; 