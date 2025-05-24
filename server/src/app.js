const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/error');
const { sanitizeRequest } = require('./middleware/sanitizer');

const authRoutes = require('./routes/auth');
const blogPostRoutes = require('./routes/blogPostRoutes');
const userRoutes = require('./routes/userRoutes');
const followRoutes = require('./routes/followRoutes');
const countryRoutes = require('./routes/countryRoutes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request sanitization
app.use(sanitizeRequest);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', blogPostRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/countries', countryRoutes);

// Error handling
// app.use(logError);
app.use(errorHandler);

module.exports = app; 