# Country Information Microservice

A dedicated microservice for handling country-related data and operations, providing a secure and efficient interface to the RestCountries API.

## Overview

This microservice acts as a middleware between the main application and the RestCountries API, providing:
- Cached country data
- Rate limiting
- API key management
- Data transformation and filtering
- Error handling and logging

## Architecture

```
src/
├── controllers/   # Request handlers
├── routes/        # API route definitions
├── middleware/    # Custom middleware
├── config/        # Configuration files
├── utils/         # Utility functions
└── database/      # Database models and migrations
```

## Features

- **Country Data Management**
  - Real-time country data retrieval
  - Data caching for improved performance
  - Country search by name, code, and region
  - Geographic information processing

- **API Security**
  - API key authentication
  - Rate limiting per API key
  - Request validation
  - Error handling

- **Data Processing**
  - Response transformation
  - Data filtering
  - Error standardization
  - Response caching

## Technical Stack

- **Runtime**
  - Node.js
  - Express.js

- **Database**
  - SQLite
  - Redis (for caching)

- **Security**
  - JWT Authentication
  - API Key Management
  - Rate Limiting

## API Endpoints

### Country Endpoints
- `GET /api/countries` - List all countries
- `GET /api/countries/:code` - Get country by code
- `GET /api/countries/name/:name` - Search country by name
- `GET /api/countries/region/:region` - Get countries by region

### API Key Management
- `POST /api/keys/generate` - Generate new API key
- `GET /api/keys` - List user's API keys
- `DELETE /api/keys/:id` - Revoke API key
- `GET /api/keys/usage` - Get API key usage statistics

## Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=${JWT_SECRET}
API_RATE_LIMIT=100
API_RATE_WINDOW=900000  # 15 minutes in milliseconds

# External Services
COUNTRY_API_URL=https://restcountries.com/v3.1
REDIS_URL=redis://localhost:6379

# Database
DB_PATH=./src/database/database.sqlite
```

## Development Setup

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm (v6 or higher)
   - Redis (optional, for caching)

2. **Installation**
   ```bash
   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

3. **Docker Deployment**
   ```bash
   # Build and run with Docker
   docker build -t country-microservice .
   docker run -p 4000:5002 country-microservice
   ```

## API Usage

### Authentication
All requests must include an API key in the header:
```
X-API-Key: your_api_key_here
```

### Rate Limiting
- 100 requests per 15 minutes per API key
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "error": null
}
```

## Error Handling

The service uses standard HTTP status codes and provides detailed error messages:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Monitoring

- Request logging
- Error tracking
- API usage statistics
- Performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 