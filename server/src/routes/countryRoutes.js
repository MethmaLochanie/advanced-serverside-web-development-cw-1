const express = require('express');
const router = express.Router();
const { fetchCountryByName, fetchAllCountries, fetchCountryByRegion, fetchCountryByCca3 } = require('../utils/countryApi');

// GET /api/countries/name/:name
router.get('/name/:name', async (req, res) => {
  try {
    const countries = await fetchCountryByName(req.params.name);
    if (!countries || countries.length === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching country', error: err.message });
  }
});

// GET /api/countries/cca3/:cca3
router.get('/cca3/:cca3', async (req, res) => {
  try {
    const countries = await fetchCountryByCca3(req.params.cca3);
    if (!countries || countries.length === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching country by cca3', error: err.message });
  }
});

// GET /api/countries
router.get('/', async (req, res) => {
  try {
    const countries = await fetchAllCountries();
    if (!countries || countries.length === 0) {
      return res.status(404).json({ message: 'No countries found' });
    }
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching countries', error: err.message });
  }
});

// GET /api/countries/region/:region
router.get('/region/:region', async (req, res) => {
  try {
    const countries = await fetchCountryByRegion(req.params.region);
    if (!countries || countries.length === 0) {
      return res.status(404).json({ message: 'No countries found for this region' });
    }
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching countries by region', error: err.message });
  }
});

module.exports = router; 