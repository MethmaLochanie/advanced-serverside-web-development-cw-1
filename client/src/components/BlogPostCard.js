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
        {countryInfo && (
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
            {countryInfo.flag?.png && (
              <img
                src={countryInfo.flag.png}
                alt={countryInfo.flag.alt || "Flag"}
                style={{
                  width: 40,
                  height: 28,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            )}
            <Box>
              <Typography variant="body2">
                <strong>Capital:</strong> {countryInfo.capital}
              </Typography>
              <Typography variant="body2">
                <strong>Currency:</strong>{" "}
                {countryInfo.currencies
                  .map((c) => `${c.name} (${c.symbol})`)
                  .join(", ")}
              </Typography>
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
