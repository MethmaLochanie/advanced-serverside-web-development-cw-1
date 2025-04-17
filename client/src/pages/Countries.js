import React, { useState } from 'react';
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
import { useSearchCountries } from '../hooks/useCountries';

const regions = ['all', 'africa', 'americas', 'asia', 'europe', 'oceania'];

const Countries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);

  const {
    mutate: search,
    data: countries = [],
    isError,
    error
  } = useSearchCountries();

  // local loading state
  const [localLoading, setLocalLoading] = useState(false);

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (!term) {
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setLocalLoading(true);

    // call the mutation, and clear localLoading when done
    search(term, {
      onSettled: () => setLocalLoading(false)
    });
  };

  // apply region filter
  const displayed =
    region === 'all'
      ? countries
      : countries.filter((c) => c.region?.toLowerCase() === region);

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
              label="Search Country name"
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
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
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
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.response?.status === 404
            ? 'Wrong country name'
            : 'Error fetching countries'}
        </Alert>
      )}
      {localLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {displayed.length > 0 ? (
            <Grid container spacing={3}>
              {displayed.map((country) => (
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
          ) : (
            hasSearched && !isError && (
              <Typography
                variant="body1"
                sx={{ textAlign: 'center', mt: 4 }}
              >
                No countries found
              </Typography>
            )
          )}
        </>
      )}
    </Box>
  );
};

export default Countries;
