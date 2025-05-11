import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BlogPostForm from "../components/BlogPostForm";
import { useBlogPosts } from "../hooks/useBlogPosts";

const EditBlogPost = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getPost, 
    updatePost, 
    loading: postLoading, 
    error: postError 
  } = useBlogPosts();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await getPost(id);
      if (response.success) {
        setPost(response.data);
      } else {
        setError(response.error || 'Failed to fetch post');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    }
  };

  const handleSubmit = async (formData) => {
    setError(null);
    try {
      const response = await updatePost(id, formData);
      if (response.success) {
        navigate('/posts');
      } else {
        setError(response.error || 'Failed to update blog post');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog post. Please try again.');
    }
  };

  if (postLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container>
        <Alert severity="error">
          Post not found or you don't have permission to edit it.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Your Travel Story
      </Typography>

      {(error || postError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || postError}
        </Alert>
      )}

      <BlogPostForm
        onSubmit={handleSubmit}
        initialData={post}
        isEditing={true}
      />
    </Container>
  );
};

export default EditBlogPost;
