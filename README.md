# Travel Blog Platform

A full-stack web application for sharing travel experiences, featuring country information integration, user authentication, and social features.

## Architecture

```
.
├── client/                 # React frontend application
│   ├── public/            # Static assets and index.html
│   └── src/
│       ├── api/           # API client and endpoints
│       ├── components/    # Reusable React components
│       │   └── admin/     # Administrative interface components
│       ├── pages/         # Page-level components
│       ├── hooks/         # Custom React hooks
│       └── context/       # React context providers
├── server/                # Express.js backend server
│   └── src/
│       ├── controllers/   # Request handlers
│       ├── routes/        # API route definitions
│       ├── middleware/    # Custom middleware
│       ├── config/        # Configuration files
│       ├── utils/         # Utility functions
│       └── database/      # Database models and migrations
└── microservice/          # Country information service
    └── src/
        ├── controllers/   # Request handlers
        ├── routes/        # API route definitions
        ├── middleware/    # Custom middleware
        ├── config/        # Configuration files
        ├── utils/         # Utility functions
        └── database/      # Database models and migrations
```

## Core Features

- **User Authentication**
  - Secure registration and login
  - JWT-based session management
  - Role-based access control

- **Blog Management**
  - Create, read, update, and delete blog posts
  - Rich text content support
  - Image upload capabilities

- **Country Integration**
  - Real-time country data retrieval
  - Country-specific blog filtering
  - Geographic information display

- **Social Features**
  - User following system
  - Post reactions (likes/dislikes)
  - Comment system
  - User profiles

- **Administrative Tools**
  - User management interface
  - Content moderation
  - System statistics

## Technical Stack

- **Frontend**
  - React.js
  - Material-UI
  - React Router
  - Axios

- **Backend**
  - Node.js
  - Express.js
  - SQLite
  - JWT Authentication

- **Microservice**
  - Node.js
  - Express.js
  - Country API Integration
  - Redis (for caching)

## Development Setup

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm (v6 or higher)
   - Docker (optional)
   - Redis (optional, for microservice caching)

2. **Environment Configuration**
   ```bash
   # Server
   PORT=5000
   JWT_SECRET=${JWT_SECRET}
   JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   DB_PATH=./src/database/database.sqlite

   # Client
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_MICROSERVICE_URL=http://localhost:4000/api

   # Microservice
   PORT=4000
   JWT_SECRET=${JWT_SECRET}
   COUNTRY_API_URL=https://restcountries.com/v3.1
   API_RATE_LIMIT=100
   API_RATE_WINDOW=900000
   ```

3. **Installation**
   ```bash
   # Install dependencies for all services
   cd server && npm install
   cd ../client && npm install
   cd ../microservice && npm install

   # Start development servers
   docker-compose up --build
   ```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Blog Endpoints
- `GET /api/posts` - List blog posts
- `POST /api/posts` - Create blog post
- `GET /api/posts/:id` - Get post details
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comment` - Add comment

### Social Endpoints
- `POST /api/follow/:userId` - Follow user
- `DELETE /api/follow/:userId` - Unfollow user
- `GET /api/followers` - Get followers
- `GET /api/following` - Get following

### Country Endpoints
- `GET /api/countries` - List all countries
- `GET /api/countries/:code` - Get country by code
- `GET /api/countries/name/:name` - Search country by name
- `GET /api/countries/region/:region` - Get countries by region

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Request rate limiting
- Input validation and sanitization
- XSS protection with helmet
- CORS configuration
- SQL injection prevention
- API key management (microservice)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 