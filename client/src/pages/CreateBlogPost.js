import React, { useState } from 'react';
import { Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { blogPostService } from '../api/blogPosts';
import BlogPostForm from '../components/BlogPostForm';
import { fetchCountriesByName } from '../api/countries';
import { useAuth } from '../context/AuthContext';

const CreateBlogPost = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const handleSubmit = async (formData) => {
        setError(null);
        try {
            // Validate country
            const apiKey = user?.apiKeys && user.apiKeys[0];
            if (!apiKey) {
                setError('No API key found for country validation.');
                return;
            }
            const countries = await fetchCountriesByName(apiKey, formData.country_name);
            if (!countries || countries.length === 0) {
                setError('Invalid country name. Please enter a valid country.');
                return;
            }
            // Optionally, you can enhance formData with country info here
            await blogPostService.createPost(formData);
            navigate('/posts');
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Invalid country name. Please enter a valid country.');
            } else {
                setError('Failed to create blog post. Please try again.');
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Share Your Travel Story
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <BlogPostForm onSubmit={handleSubmit} />
        </Container>
    );
};

export default CreateBlogPost; 