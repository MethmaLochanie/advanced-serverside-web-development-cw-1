import React, { useState } from 'react';
import { Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { blogPostService } from '../api/blogPosts';
import BlogPostForm from '../components/BlogPostForm';

const CreateBlogPost = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await blogPostService.createPost(formData);
            navigate('/posts');
        } catch (err) {
            setError('Failed to create blog post. Please try again.');
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