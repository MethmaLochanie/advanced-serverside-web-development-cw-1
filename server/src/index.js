const config = require('./config/config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const countryRoutes = require('./routes/countries');
const apiKeyRoutes = require('./routes/apiKeys');
const adminRoutes = require('./routes/admin');
const { initializeDatabase } = require('./database/init');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = config.port;

// Security middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());

const limiter = rateLimit(config.rateLimit);
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/admin', adminRoutes);

// Initialize database
initializeDatabase();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
