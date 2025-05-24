import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBlogPosts } from "../hooks/useBlogPosts";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import api from '../api/api';

// Comment Item Component
const CommentItem = ({ comment, onDelete, isOwner, currentUserId }) => {
  return (
    <div>
      <ListItem>
        <ListItemText
          primary={comment.content}
          secondary={
            <>
              <Typography component="span" variant="body2" color="text.primary">
                {comment.username}
              </Typography>
              {" • "}
              {format(new Date(comment.created_at || Date.now()), "MMM d, yyyy")}
            </>
          }
        />
        {(isOwner || currentUserId === comment.user_id) && (
          <Box sx={{ ml: 'auto' }}>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDelete(comment.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </ListItem>
      <Divider />
    </div>
  );
};

const BlogPostCard = ({ post, onDelete, isOwner, countryInfo }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addComment, getComments, deleteComment, toggleDislike, getDislikeStatus, getDislikeCount, toggleLike, getLikeStatus, getLikeCount } = useBlogPosts();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isDisliked, setIsDisliked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_CHAR_LIMIT = 200;
  const [countryMeta, setCountryMeta] = useState(null);
  const [countryMetaLoading, setCountryMetaLoading] = useState(false);
  const [countryMetaError, setCountryMetaError] = useState(null);
  const countryMetaCache = React.useRef({});

  useEffect(() => {
    fetchCounts();
    if (user) {
      checkLikeStatus();
    }
    const fetchCountryMeta = async () => {
      if (!post.country_cca3) return;
      if (countryMetaCache.current[post.country_cca3]) {
        setCountryMeta(countryMetaCache.current[post.country_cca3]);
        return;
      }
      setCountryMetaLoading(true);
      setCountryMetaError(null);
      try {
        const res = await api.get(`/countries/cca3/${post.country_cca3}`);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setCountryMeta(data);
        countryMetaCache.current[post.country_cca3] = data;
      } catch (err) {
        setCountryMetaError('Country info not found');
      } finally {
        setCountryMetaLoading(false);
      }
    };
    fetchCountryMeta();
  }, [post.country_cca3]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchCounts = async () => {
    // Fetch comment count
    try {
      const response = await getComments(post.id);
      if (response.success) {
        setCommentCount(response.data.length);
      }
    } catch (error) {
      setCommentCount(0);
    }
    // Fetch dislike count
    try {
      const response = await getDislikeCount(post.id);
      if (response.success) {
        setDislikeCount(response.data.count);
      }
    } catch (error) {
      setDislikeCount(0);
    }
    // Fetch like count
    try {
      const response = await getLikeCount(post.id);
      if (response.success) {
        setLikeCount(response.data.count);
      }
    } catch (error) {
      setLikeCount(0);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(post.id);
      if (response.success) {
        setComments(response.data || []);
        setCommentCount(response.data.length);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const checkDislikeStatus = async () => {
    try {
      const response = await getDislikeStatus(post.id);
      if (response.success) {
        setIsDisliked(response.data.isDisliked);
      }
    } catch (error) {
      console.error("Error checking dislike status:", error);
    }
  };

  const checkLikeStatus = async () => {
    try {
      const response = await getLikeStatus(post.id);
      if (response.success) {
        setIsLiked(response.data.isLiked);
      }
    } catch (error) {
      setIsLiked(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await addComment(post.id, newComment);
      if (response.success) {
        await fetchComments(); 
        await fetchCounts(); 
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(post.id, commentId);
      if (response.success) {
        await fetchComments(); 
        await fetchCounts(); 
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDislike = async () => {
    if (!user) return;
    try {
      const response = await toggleDislike(post.id);
      if (response.success) {
        setIsDisliked(!isDisliked);
        await fetchCounts(); // Update dislike count
      }
    } catch (error) {
      console.error("Error toggling dislike:", error);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      const response = await toggleLike(post.id);
      if (response.success) {
        setIsLiked(!isLiked);
        await fetchCounts(); // Update like count
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/posts/edit/${post.id}`);
  };

  // Helper to get preview (first 200 characters)
  const getPreview = (text) => {
    if (text.length <= PREVIEW_CHAR_LIMIT) return text;
    return text.slice(0, PREVIEW_CHAR_LIMIT);
  };

  const isTruncated =
    post.content.length > PREVIEW_CHAR_LIMIT ||
    post.content.split('\n').length > 3;

  return (
    <Card sx={{ mb: 2, maxWidth: 800, mx: "auto" }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {post.title}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={post.country_name}
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            Visited on {format(new Date(post.date_of_visit || post.created_at), "MMMM d, yyyy")}
          </Typography>
        </Box>
        {/* Country info display */}
        {countryMetaLoading ? (
          <Typography variant="body2" color="text.secondary">Loading country info...</Typography>
        ) : countryMetaError ? (
          <Typography variant="body2" color="error">{countryMetaError}</Typography>
        ) : countryMeta ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {countryMeta.flag?.png && (
              <img src={countryMeta.flag.png} alt={countryMeta.flag.alt || countryMeta.name} style={{ width: 32, height: 20, marginRight: 8, objectFit: 'cover', borderRadius: 2 }} />
            )}
            <Typography variant="body2" sx={{ mr: 2 }}>
              <b>{countryMeta.name}</b>
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              <b>Capital:</b> {countryMeta.capital}
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              <b>Currency:</b> {countryMeta.currencies && countryMeta.currencies.length > 0 ? countryMeta.currencies[0].name : 'N/A'}
            </Typography>
          </Box>
        ) : null}

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            whiteSpace: 'pre-line',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'none' : 3,
            WebkitBoxOrient: 'vertical',
            ...(expanded ? {} : { maxHeight: '4.5em' })
          }}
        >
          {expanded
            ? (
                <>
                  {post.content}
                  {isTruncated && (
                    <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => setExpanded(false)}>
                      {' '}See less...
                    </span>
                  )}
                </>
              )
            : (
                <>
                  {getPreview(post.content)}
                  {isTruncated && (
                    <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => setExpanded(true)}>
                      {' '}See more...
                    </span>
                  )}
                </>
              )}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Posted by {post.username} on{" "}
          {format(new Date(post.created_at || Date.now()), "MMMM d, yyyy")}
        </Typography>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <IconButton
            color={isLiked ? "primary" : "default"}
            onClick={handleLike}
            disabled={!user}
          >
            <ThumbUpIcon />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {likeCount}
            </Typography>
          </IconButton>
          <IconButton
            color={isDisliked ? "error" : "default"}
            onClick={handleDislike}
            disabled={!user}
          >
            <ThumbDownIcon />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {dislikeCount}
            </Typography>
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => setShowComments(true)}
          >
            <CommentIcon />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {commentCount}
            </Typography>
          </IconButton>
        </Box>
      </CardContent>

      {isOwner && (
        <CardActions>
          <Button size="small" color="primary" onClick={handleEdit}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => onDelete(post.id)}>
            Delete
          </Button>
        </CardActions>
      )}

      <Dialog
        open={showComments}
        onClose={() => setShowComments(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          {user && (
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={loading}
                sx={{ mb: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!newComment.trim() || loading}
              >
                Post Comment
              </Button>
            </Box>
          )}

          <List component="div">
            {comments.map((comment, index) => (
              <div key={comment.id}>
                <ListItem>
                  <ListItemText
                    primary={comment.content}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {comment.username}
                        </Typography>
                        {" • "}
                        {format(new Date(comment.created_at || Date.now()), "MMM d, yyyy")}
                      </>
                    }
                  />
                  {(isOwner || user?.id === comment.user_id) && (
                    <Box sx={{ ml: 'auto' }}>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </ListItem>
                {index < comments.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowComments(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default BlogPostCard;
