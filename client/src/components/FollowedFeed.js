import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Avatar,
    CircularProgress,
    Pagination,
    Divider,
    Link,
    Alert,
    Snackbar,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFollow } from '../hooks/useFollow';
import { useAuth } from '../context/AuthContext';

const FollowedFeed = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getFollowedFeed } = useFollow();

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const fetchPosts = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getFollowedFeed(user.id, page);
            
            if (response.success) {
                setPosts(response.data || []);
                setTotalPages(response.pagination?.totalPages || 1);
                if (!response.data || response.data.length === 0) {
                    setSuccessMessage('No posts found from users you follow');
                }
            } else {
                setError(response.error || 'Failed to fetch posts');
                setPosts([]);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while fetching posts');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user, page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setSuccessMessage(null);
    };

    if (!user) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                Please log in to view your feed
            </Alert>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    severity="error" 
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnackbar}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    severity="info" 
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleCloseSnackbar}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {successMessage}
                </Alert>
            </Snackbar>

            {(!posts || posts.length === 0) ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No posts found from users you follow
                </Alert>
            ) : (
                <>
                    {posts.map((post) => (
                        <Card key={post.id} sx={{ mb: 2 }}>
                            <CardHeader
                                avatar={
                                    <Avatar>{post.username[0].toUpperCase()}</Avatar>
                                }
                                title={
                                    <Link
                                        component="button"
                                        variant="body2"
                                        onClick={() => handleUserClick(post.user_id)}
                                        sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                    >
                                        {post.username}
                                    </Link>
                                }
                                subheader={new Date(post.created_at).toLocaleDateString()}
                            />
                            <Divider />
                            <CardContent>
                                {post.country_name && (
                                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {post.country_flag && (
                                            <img 
                                                src={post.country_flag} 
                                                alt={post.country_name} 
                                                style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 4 }} 
                                            />
                                        )}
                                        <Box>
                                            <Typography variant="body2">
                                                <strong>Country:</strong> {post.country_name}
                                            </Typography>
                                            {post.country_capital && (
                                                <Typography variant="body2">
                                                    <strong>Capital:</strong> {post.country_capital}
                                                </Typography>
                                            )}
                                            {post.country_currency && (
                                                <Typography variant="body2">
                                                    <strong>Currency:</strong> {post.country_currency}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                                <Typography variant="h6" gutterBottom>
                                    {post.title}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {post.content}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Visit Date: {new Date(post.date_of_visit).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default FollowedFeed; 