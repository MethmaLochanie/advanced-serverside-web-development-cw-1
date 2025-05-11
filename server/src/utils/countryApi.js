const axios = require('axios');
const COUNTRY_API_BASE_URL = 'https://restcountries.com/v3.1';

const validateAndGetCountryDetails = async (countryName) => {
  try {
    const response = await axios.get(`${COUNTRY_API_BASE_URL}/name/${encodeURIComponent(countryName)}`);
    
    if (!response.data || response.data.length === 0) {
      throw new Error('Country not found');
    }

    const country = response.data[0];
    
    return {
      name: country.name.common,
      flag: country.flags.svg,
      currency: Object.keys(country.currencies || {})[0],
      capital: country.capital?.[0] || null
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Country not found');
    }
    throw new Error('Failed to validate country');
  }
};

module.exports = {
  validateAndGetCountryDetails
}; 