import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { blogPostService } from '../api/blogPosts';
import BlogPostCard from '../components/BlogPostCard';
import { useAuth } from '../context/AuthContext';
import { fetchCountriesByName } from '../api/countries';

const BlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countryData, setCountryData] = useState({});
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchPostsAndCountries();
        // eslint-disable-next-line
    }, []);

    const fetchPostsAndCountries = async () => {
        try {
            const data = await blogPostService.getAllPosts();
            setPosts(data);
            // Fetch country info for each unique country
            const uniqueCountries = [...new Set(data.map(post => post.country_name))];
            const countryInfoMap = {};
            const apiKey = user?.apiKeys && user.apiKeys[0];
            for (const country of uniqueCountries) {
                try {
                    if (apiKey) {
                        const countryArr = await fetchCountriesByName(apiKey, country);
                        if (countryArr && countryArr.length > 0) {
                            countryInfoMap[country] = countryArr[0];
                        }
                    }
                } catch (e) {
                    // skip if error
                }
            }
            setCountryData(countryInfoMap);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch blog posts');
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await blogPostService.deletePost(postId);
                setPosts(posts.filter(post => post.id !== postId));
            } catch (err) {
                setError('Failed to delete post');
            }
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Travel Stories
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    Discover amazing travel experiences shared by our community
                </Typography>
                {!user && (
                    <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="h6" gutterBottom>
                            Join Our Travel Community
                        </Typography>
                        <Typography paragraph>
                            Share your own travel stories and connect with fellow travelers. Sign up now to start sharing your adventures!
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/register')}
                            >
                                Sign Up
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Paper>
                )}
                {user && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/posts/create')}
                        sx={{ mb: 4 }}
                    >
                        Share Your Story
                    </Button>
                )}
            </Box>

            {posts.length === 0 ? (
                <Typography>No blog posts yet. Be the first to share your travel story!</Typography>
            ) : (
                posts.map(post => (
                    <BlogPostCard
                        key={post.id}
                        post={post}
                        onDelete={handleDelete}
                        isOwner={user && user.id === post.user_id}
                        countryInfo={countryData[post.country_name]}
                    />
                ))
            )}
        </Container>
    );
};

export default BlogPosts; 