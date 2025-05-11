const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.msg
      }))
    });
  }

  // Handle authentication errors
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication Error',
      message: 'Invalid or missing authentication token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication Error',
      message: 'Your session has expired. Please login again'
    });
  }

  // Handle database errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    let errorMessage = 'Database Error';
    let details = '';

    switch (err.code) {
      case 'SQLITE_CONSTRAINT':
        if (err.message.includes('UNIQUE constraint failed')) {
          errorMessage = 'Duplicate Entry';
          details = 'This record already exists';
        } else {
          errorMessage = 'Data Integrity Error';
          details = 'The operation violates database constraints';
        }
        break;
      case 'SQLITE_BUSY':
        errorMessage = 'Database Busy';
        details = 'The database is currently busy. Please try again';
        break;
      case 'SQLITE_LOCKED':
        errorMessage = 'Database Locked';
        details = 'The database is locked. Please try again';
        break;
      default:
        details = 'An unexpected database error occurred';
    }
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
      details
    });
  }

  // Handle not found errors
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: err.message || 'The requested resource was not found'
    });
  }

  // Handle rate limiting errors
  if (err.type === 'RateLimitExceeded') {
    return res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: err.message || 'You have exceeded the rate limit. Please try again later'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler; 