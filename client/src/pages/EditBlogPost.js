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
import { useAuth } from "../context/AuthContext";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { useCountries } from "../hooks/useCountries";

const EditBlogPost = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { 
    getPost, 
    updatePost, 
    loading: postLoading, 
    error: postError 
  } = useBlogPosts();
  const { 
    searchCountries, 
    loading: countryLoading, 
    error: countryError 
  } = useCountries();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await getPost(id);
      setPost(data);
    } catch (err) {
      console.error('Error fetching post:', err);
    }
  };

  const handleSubmit = async (formData) => {
    setError(null);
    try {
      // Validate country
      const countries = await searchCountries(formData.country_name);
      if (!countries || countries.length === 0) {
        setError("Invalid country name. Please enter a valid country.");
        return;
      }
      await updatePost(id, formData);
      navigate("/posts");
    } catch (err) {
      console.error('Error updating post:', err);
      setError("Failed to update blog post. Please try again.");
    }
  };

  if (postLoading || countryLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (postError) {
    return (
      <Container>
        <Alert severity="error">{postError}</Alert>
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

      {(error || countryError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || countryError}
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
