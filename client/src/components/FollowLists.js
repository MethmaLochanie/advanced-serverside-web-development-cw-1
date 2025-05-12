import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
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

const FollowLists = ({ users = [], loading, onRefresh }) => {
    const navigate = useNavigate();

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const getInitial = (username) => {
        return username ? username[0].toUpperCase() : '?';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (!users || users.length === 0) {
        return (
            <Typography align="center" color="textSecondary" sx={{ py: 3 }}>
                No users found
            </Typography>
        );
    }

    return (
        <List>
            {users.map((user, index) => (
                <React.Fragment key={user.id}>
                    <ListItem
                        secondaryAction={
                            <FollowButton
                                targetUserId={user.id}
                                onFollowChange={onRefresh}
                            />
                        }
                    >
                        <ListItemAvatar>
                            <Avatar
                                sx={{ cursor: 'pointer' }}
                                onClick={() => handleUserClick(user.id)}
                            >
                                {getInitial(user.username)}
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
                                    {user.username || 'Unknown User'}
                                </Link>
                            }
                            secondary={user.email || 'No email provided'}
                        />
                    </ListItem>
                    {index < users.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </List>
    );
};

export default FollowLists; 