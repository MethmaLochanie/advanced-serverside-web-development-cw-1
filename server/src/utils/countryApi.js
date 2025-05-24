const axios = require('axios');

const COUNTRY_API_URL = process.env.COUNTRY_API_URL || 'http://localhost:4000/api';
const COUNTRY_API_KEY = process.env.COUNTRY_API_KEY;

async function fetchCountryByName(name) {
  const response = await axios.get(`${COUNTRY_API_URL}/countries/name/${encodeURIComponent(name)}`, {
    headers: { 'x-api-key': COUNTRY_API_KEY }
  });
  return response.data;
}

async function fetchCountryByRegion(region) {
  const response = await axios.get(`${COUNTRY_API_URL}/countries/region/${encodeURIComponent(region)}`, {
    headers: { 'x-api-key': COUNTRY_API_KEY }
  });
  return response.data;
}

async function fetchAllCountries() {
  const response = await axios.get(`${COUNTRY_API_URL}/countries`, {
    headers: { 'x-api-key': COUNTRY_API_KEY }
  });
  return response.data;
}

async function validateAndGetCountryDetails(countryName) {
  if (!countryName) {
    throw new Error('Country name is required');
  }

  try {
    const countries = await fetchCountryByName(countryName);
    const country = Array.isArray(countries) && countries.length > 0 ? countries[0] : null;
    if (!country) {
      throw new Error('Country not found');
    }

    return {
      flag: country.flag?.png || country.flag?.svg,
      currency: country.currencies ? Object.values(country.currencies)[0]?.name : null,
      capital: country.capital?.[0] || null,
      cca3: country.cca3 || null
    };
  } catch (error) {
    console.error('Error validating country:', error);
    throw new Error('Invalid Country');
  }
}

async function fetchCountryByCca3(cca3) {
  const response = await axios.get(`${COUNTRY_API_URL}/countries/cca3/${encodeURIComponent(cca3)}`, {
    headers: { 'x-api-key': COUNTRY_API_KEY }
  });
  return response.data;
}

module.exports = {
  fetchCountryByName,
  fetchCountryByRegion,
  fetchAllCountries,
  validateAndGetCountryDetails,
  fetchCountryByCca3
}; 