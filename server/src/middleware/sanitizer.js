const sanitizeHtml = require('sanitize-html');

// Sanitization options
const sanitizeOptions = {
  allowedTags: [], // No HTML tags allowed
  allowedAttributes: {}, // No attributes allowed
  allowedIframeHostnames: [], // No iframes allowed
  disallowedTagsMode: 'recursiveEscape'
};

// Sanitize a single value
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return sanitizeHtml(value, sanitizeOptions);
  }
  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item));
  }
  if (typeof value === 'object' && value !== null) {
    return sanitizeObject(value);
  }
  return value;
};

// Sanitize an object recursively
const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(value);
  }
  return sanitized;
};

// Middleware to sanitize request body, query, and params
const sanitizeRequest = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

module.exports = {
  sanitizeRequest,
  sanitizeValue,
  sanitizeObject
}; 