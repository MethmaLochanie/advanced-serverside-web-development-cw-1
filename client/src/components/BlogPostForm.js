import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const BlogPostForm = ({ initialData, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    country_name: "",
    date_of_visit: new Date(),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date_of_visit: new Date(initialData.date_of_visit),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date_of_visit: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: "auto", p: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
      </Typography>

      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        margin="normal"
      />

      <TextField
        fullWidth
        label="Country Name"
        name="country_name"
        value={formData.country_name}
        onChange={handleChange}
        required
        margin="normal"
      />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date of Visit"
          value={formData.date_of_visit}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              margin: "normal",
            },
          }}
        />
      </LocalizationProvider>

      <TextField
        fullWidth
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        required
        multiline
        rows={6}
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {isEditing ? "Update Post" : "Create Post"}
      </Button>
    </Box>
  );
};

export default BlogPostForm;
