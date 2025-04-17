const axios = require('axios');

const BASE_URL = 'https://restcountries.com/v3.1';

const filterCountryData = (country) => {
  return {
    name: country.name.common,
    currencies: Object.entries(country.currencies || {}).map(([code, currency]) => ({
      code,
      name: currency.name,
      symbol: currency.symbol
    })),
    capital: country.capital?.[0] || 'N/A',
    languages: Object.values(country.languages || {}),
    flag: {
      png: country.flags?.png,
      svg: country.flags?.svg,
      alt: country.flags?.alt
    }
  };
};

const getAllCountries = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    const filteredData = response.data.map(filterCountryData);
    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      message: 'Error fetching countries',
      error: error.response?.data || error.message
    });
  }
};

const getCountryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(`${BASE_URL}/name/${encodeURIComponent(name)}`);
    const filteredData = response.data.map(filterCountryData);
    res.json(filteredData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Country not found' });
    }
    console.error('Error fetching country:', error);
    res.status(500).json({
      message: 'Error fetching country',
      error: error.response?.data || error.message
    });
  }
};

const getCountriesByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const response = await axios.get(`${BASE_URL}/region/${encodeURIComponent(region)}`);
    const filteredData = response.data.map(filterCountryData);
    res.json(filteredData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Region not found' });
    }
    console.error('Error fetching countries by region:', error);
    res.status(500).json({
      message: 'Error fetching countries by region',
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  getAllCountries,
  getCountryByName,
  getCountriesByRegion
}; 