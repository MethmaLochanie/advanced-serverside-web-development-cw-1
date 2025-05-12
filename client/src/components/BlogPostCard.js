import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const BlogPostCard = ({ post, onDelete, isOwner, countryInfo }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/posts/edit/${post.id}`);
  };

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
            Visited on {format(new Date(post.date_of_visit), "MMMM d, yyyy")}
          </Typography>
        </Box>
        {/* Country info display */}
        {(post.country_flag || post.country_capital || post.country_currency) && (
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
            {post.country_flag && (
              <img
                src={post.country_flag}
                alt={post.country_name + " flag"}
                style={{ width: 40, height: 28, objectFit: "cover", borderRadius: 4 }}
              />
            )}
            <Box>
              {post.country_capital && (
                <Typography variant="body2">
                  <strong>Capital:</strong> {post.country_capital}
                </Typography>
              )}
              {post.country_currency && (
                <Typography variant="body2">
                  <strong>Currency:</strong> {post.country_currency}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Typography variant="body1" color="text.secondary" paragraph>
          {post.content}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Posted by {post.username} on{" "}
          {format(new Date(post.created_at), "MMMM d, yyyy")}
        </Typography>
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
    </Card>
  );
};

export default BlogPostCard;
