import React, { useState, useEffect } from 'react';
import {
    Box,
    Autocomplete,
    TextField,
    Typography,
    CircularProgress,
    Paper,
    Grid
} from '@mui/material';
import api from '../api/api';

const CountrySelector = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/countries');
                if (response.data) {
                    setCountries(response.data);
                }
            } catch (err) {
                setError('Failed to fetch countries');
                console.error('Error fetching countries:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Autocomplete
                options={countries}
                getOptionLabel={(option) => option.name || ''}
                value={selectedCountry}
                onChange={(event, newValue) => {
                    setSelectedCountry(newValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select a Country"
                        variant="outlined"
                        fullWidth
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {option.flag?.png && (
                                <img
                                    src={option.flag.png}
                                    alt={option.flag.alt || option.name}
                                    style={{ width: 30, height: 20, objectFit: 'cover' }}
                                />
                            )}
                            <Typography>{option.name}</Typography>
                        </Box>
                    </li>
                )}
            />

            {selectedCountry && (
                <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            {selectedCountry.flag?.png && (
                                <Box sx={{ textAlign: 'center' }}>
                                    <img
                                        src={selectedCountry.flag.png}
                                        alt={selectedCountry.flag.alt || selectedCountry.name}
                                        style={{ width: 200, height: 140, objectFit: 'cover' }}
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h5" gutterBottom>
                                {selectedCountry.name}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <strong>Capital:</strong> {selectedCountry.capital || 'N/A'}
                            </Typography>
                            {selectedCountry.currencies && selectedCountry.currencies.length > 0 && (
                                <Typography variant="body1" paragraph>
                                    <strong>Currency:</strong> {selectedCountry.currencies[0].name} ({selectedCountry.currencies[0].symbol})
                                </Typography>
                            )}
                            <Typography variant="body1" paragraph>
                                <strong>Region:</strong> {selectedCountry.region || 'N/A'}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <strong>Population:</strong> {selectedCountry.population?.toLocaleString() || 'N/A'}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Box>
    );
};

export default CountrySelector; 