import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('all');
  const { user } = useAuth();

  const regions = ['all', 'africa', 'americas', 'asia', 'europe', 'oceania'];

  useEffect(() => {
    fetchCountries();
  }, [region]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError('');
      const endpoint = region === 'all' ? '' : `/region/${region}`;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/countries${endpoint}`,
        {
          headers: {
            'x-api-key': user.apiKeys[0]
          }
        }
      );
      setCountries(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching countries');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCountries();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/countries/name/${searchTerm}`,
        {
          headers: {
            'x-api-key': user.apiKeys[0]
          }
        }
      );
      setCountries(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setCountries([]);
      } else {
        setError(err.response?.data?.message || 'Error searching countries');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Countries
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search countries"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {regions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCountries.map((country) => (
            <Grid item xs={12} sm={6} md={4} key={country.name}>
              <Card>
                <CardMedia
                  component="img"
                  height="160"
                  image={country.flag.png}
                  alt={country.flag.alt || `Flag of ${country.name}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {country.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capital: {country.capital}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Languages: {country.languages.join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Currencies:{' '}
                    {country.currencies
                      .map((c) => `${c.name} (${c.symbol})`)
                      .join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredCountries.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          No countries found
        </Typography>
      )}
    </Box>
  );
};

export default Countries; 