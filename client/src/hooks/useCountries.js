import { useState } from 'react';
import { fetchCountriesByName } from '../api/countries';
import { useAuth } from '../context/AuthContext';

export const useCountries = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const validateApiKey = () => {
        const apiKey = user?.apiKeys && user.apiKeys[0];
        if (!apiKey) {
            throw new Error('No API key found for country validation');
        }
        return apiKey;
    };

    const searchCountries = async (name) => {
        if (!name?.trim()) {
            throw new Error('Country name is required');
        }

        const apiKey = validateApiKey();
        setLoading(true);
        setError(null);

        try {
            const data = await fetchCountriesByName(apiKey, name);
            if (!data || data.length === 0) {
                throw new Error('No countries found with that name');
            }
            return data;
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Country not found');
            } else {
                setError('Failed to fetch country data');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const validateCountry = async (countryName) => {
        try {
            const countries = await searchCountries(countryName);
            return countries.length > 0;
        } catch (err) {
            return false;
        }
    };

    return {
        loading,
        error,
        searchCountries,
        validateCountry
    };
};
