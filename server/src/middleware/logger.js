const { logger } = require('../utils/logger');

// Request logging middleware
const logRequest = (req, res, next) => {
  const start = Date.now();
  
  // Log when the response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info({
      type: 'request',
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};

// Error logging middleware
const logError = (err, req, res, next) => {
  logger.error({
    type: 'error',
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    status: err.status || 500,
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });
  
  next(err);
};

module.exports = {
  logRequest,
  logError
}; 