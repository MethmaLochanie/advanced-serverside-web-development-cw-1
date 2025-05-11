import React, { useState } from 'react';
import { Container, Typography, Alert, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlogPostForm from '../components/BlogPostForm';
import { useAuth } from '../context/AuthContext';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useCountries } from '../hooks/useCountries';

const CreateBlogPost = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { 
        createPost,
        loading: postLoading,
        error: postError 
    } = useBlogPosts();
    const { 
        searchCountries, 
        loading: countryLoading, 
        error: countryError 
    } = useCountries();

    const handleSubmit = async (formData) => {
        setError(null);
        try {
            // Validate country
            const countries = await searchCountries(formData.country_name);
            if (!countries || countries.length === 0) {
                setError('Invalid country name. Please enter a valid country.');
                return;
            }
            await createPost(formData);
            navigate('/posts');
        } catch (err) {
            console.error('Error creating blog post:', err);
            setError('Failed to create blog post. Please try again.');
        }
    };

    if (postLoading || countryLoading) {
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

            {(error || postError || countryError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || postError || countryError}
                </Alert>
            )}

            <BlogPostForm onSubmit={handleSubmit} />
        </Container>
    );
};

export default CreateBlogPost; 