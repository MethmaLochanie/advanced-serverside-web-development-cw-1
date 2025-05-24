const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  generateApiKey,
  listApiKeys,
  revokeApiKey,
  getApiKeyUsage
} = require('../controllers/apiKeyController');

const router = express.Router();

// All routes require JWT authentication
router.use(verifyToken);

router.post('/generate', generateApiKey);
router.get('/', listApiKeys);
router.delete('/:id', revokeApiKey);
router.get('/:id/usage', getApiKeyUsage);

module.exports = router; 