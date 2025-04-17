const express = require('express');
const { verifyApiKey } = require('../middleware/auth');
const {
  getAllCountries,
  getCountryByName,
  getCountriesByRegion
} = require('../controllers/countriesController');

const router = express.Router();

// All routes require API key authentication
router.use(verifyApiKey);

router.get('/', getAllCountries);
router.get('/name/:name', getCountryByName);
router.get('/region/:region', getCountriesByRegion);

module.exports = router; 