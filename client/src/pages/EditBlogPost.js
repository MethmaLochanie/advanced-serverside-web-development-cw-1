import React, { useState, useEffect } from 'react';
import { Container, Typography, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { blogPostService } from '../api/blogPosts';
import BlogPostForm from '../components/BlogPostForm';

const EditBlogPost = () => {
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const data = await blogPostService.getPost(id);
            setPost(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch blog post');
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            await blogPostService.updatePost(id, formData);
            navigate('/posts');
        } catch (err) {
            setError('Failed to update blog post. Please try again.');
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
                <Alert severity="error">{error}</Alert>
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