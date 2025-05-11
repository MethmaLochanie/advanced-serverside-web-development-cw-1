import React, { useState } from 'react';
import { Container, Typography, Alert, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlogPostForm from '../components/BlogPostForm';
import { useBlogPosts } from '../hooks/useBlogPosts';

const CreateBlogPost = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { 
        createPost,
        loading: postLoading,
        error: postError 
    } = useBlogPosts();

    const handleSubmit = async (formData) => {
        setError(null);
        try {
            const response = await createPost(formData);
            if (response.success) {
                navigate('/posts');
            } else {
                setError(response.error || 'Failed to create blog post');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create blog post. Please try again.');
        }
    };

    if (postLoading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Share Your Travel Story
            </Typography>

            {(error || postError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || postError}
                </Alert>
            )}

            <BlogPostForm onSubmit={handleSubmit} />
        </Container>
    );
};

export default CreateBlogPost; 