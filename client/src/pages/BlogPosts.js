import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  TextField,
  Pagination,
  Grid,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import BlogPostCard from "../components/BlogPostCard";
import { useAuth } from "../context/AuthContext";
import { useBlogPosts } from "../hooks/useBlogPosts";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchType, setSearchType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user } = useAuth();
  const {
    getAllPosts,
    searchByCountry,
    searchByUsername,
    deletePost,
    loading: postsLoading,
    error: postsError,
  } = useBlogPosts();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllPosts();

      if (response.success) {
        setPosts(response.data.posts || []);
        setPagination(
          response.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          }
        );
        if (!response.data.posts || response.data.posts.length === 0) {
          setSuccessMessage("No blog posts found");
        }
      } else {
        setError(response.error || "Failed to fetch posts");
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while fetching posts"
      );
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        searchType === "country"
          ? await searchByCountry(searchQuery, pagination.currentPage)
          : await searchByUsername(searchQuery, pagination.currentPage);

      if (response.success) {
        setPosts(response.data?.posts || []);
        setPagination(
          response.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          }
        );
        if (!response.data?.posts || response.data.posts.length === 0) {
          setSuccessMessage(
            `No posts found for ${
              searchType === "country" ? "country" : "username"
            }: ${searchQuery}`
          );
        }
      } else {
        setError(response.error || "Failed to search posts");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while searching posts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, currentPage: value });
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchQuery("");
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    });
  };

  const handleAllPosts = () => {
    setSearchType("all");
    setSearchQuery("");
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    });
    fetchPosts();
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        setPosts(posts.filter((post) => post.id !== postId));
        setSuccessMessage("Post deleted successfully");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete post");
      }
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    fetchPosts();
  }, [pagination.currentPage]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Travel Stories
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={4} md={4}>
            <Button
              variant={searchType === "all" ? "contained" : "outlined"}
              onClick={handleAllPosts}
              fullWidth
            >
              All Posts
            </Button>
          </Grid>
          <Grid xs={12} sm={4} md={4}>
            <Button
              variant={searchType === "country" ? "contained" : "outlined"}
              onClick={() => handleSearchTypeChange("country")}
              fullWidth
            >
              Search by Country
            </Button>
          </Grid>
          <Grid xs={12} sm={4} md={4}>
            <Button
              variant={searchType === "username" ? "contained" : "outlined"}
              onClick={() => handleSearchTypeChange("username")}
              fullWidth
            >
              Search by Username
            </Button>
          </Grid>
        </Grid>

        {(searchType === "country" || searchType === "username") && (
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label={`Search by ${searchType}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {posts.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No blog posts found.
          </Alert>
        ) : (
          <>
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                isOwner={user && user.id === post.user_id}
              />
            ))}

            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default BlogPosts;
