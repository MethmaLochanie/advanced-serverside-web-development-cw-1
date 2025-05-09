import React, { useState, useEffect } from 'react';
import { Container, Typography, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { blogPostService } from '../api/blogPosts';
import BlogPostForm from '../components/BlogPostForm';
import { fetchCountriesByName } from '../api/countries';
import { useAuth } from '../context/AuthContext';

const EditBlogPost = () => {
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const data = await blogPostService.getPost(id);
            setPost(data);
            setLoading(false);
        } catch (err) {
            setLoadError('Failed to fetch blog post');
            setLoading(false);
        }
    };

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
            await blogPostService.updatePost(id, formData);
            navigate('/posts');
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Invalid country name. Please enter a valid country.');
            } else {
                setError('Failed to update blog post. Please try again.');
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

    if (loadError) {
        return (
            <Container>
                <Alert severity="error">{loadError}</Alert>
            </Container>
        );
    }

    if (!post) {
        return (
            <Container>
                <Alert severity="error">Blog post not found</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Your Travel Story
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <BlogPostForm
                initialData={post}
                onSubmit={handleSubmit}
                isEditing={true}
            />
        </Container>
    );
};

export default EditBlogPost; 