import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Autocomplete, InputAdornment, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import api from '../api/api';

const BlogPostForm = ({ initialData, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    country_name: "",
    country_cca3: "",
    date_of_visit: new Date(),
  });

  const [countryOptions, setCountryOptions] = useState([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [countryLoading, setCountryLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        country_name: initialData.country_name || "",
        country_cca3: initialData.country_cca3 || "",
        date_of_visit: initialData.date_of_visit ? new Date(initialData.date_of_visit) : new Date(),
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

  const handleCountrySearch = async () => {
    if (!countrySearch.trim()) return;
    setCountryLoading(true);
    try {
      const res = await api.get(`countries/name/${encodeURIComponent(countrySearch)}`);
      setCountryOptions(res.data);
    } catch (err) {
      setCountryOptions([]);
    } finally {
      setCountryLoading(false);
    }
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

      <Autocomplete
        freeSolo={false}
        options={countryOptions}
        getOptionLabel={option => option.name || ""}
        value={formData.country_cca3 ? countryOptions.find(c => c.cca3 === formData.country_cca3) || null : null}
        onChange={(event, value) => {
          setFormData(prev => ({
            ...prev,
            country_name: value ? value.name : "",
            country_cca3: value ? value.cca3 : ""
          }));
        }}
        inputValue={countrySearch}
        onInputChange={(event, newInputValue) => {
          setCountrySearch(newInputValue);
        }}
        loading={countryLoading}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            label="Country"
            required
            margin="normal"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCountrySearch} edge="end">
                    <SearchIcon />
                  </IconButton>
                  {params.InputProps.endAdornment}
                </InputAdornment>
              )
            }}
          />
        )}
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
