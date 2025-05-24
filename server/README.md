# Blog Platform Server

A robust Node.js/Express server that powers the blog platform, handling user authentication, blog post management, and social interactions.

## Overview

This server provides a RESTful API for the blog platform, managing:
- User authentication and authorization
- Blog post CRUD operations
- Social features (following, likes, comments)
- Country information integration
- File uploads and media management

## Architecture

```
src/
├── config/        # Configuration files
├── controllers/   # Request handlers
├── database/      # Database models and migrations
├── middleware/    # Custom middleware
├── routes/        # API route definitions
├── services/      # Business logic
├── utils/         # Utility functions
├── app.js         # Express application setup
└── index.js       # Server entry point
```

## Features

- **User Management**
  - Registration and authentication
  - Profile management
  - Role-based access control

- **Blog Post Management**
  - Create, read, update, delete posts
  - Rich text support
  - Image uploads
  - Draft saving
  - Post scheduling

- **Social Features**
  - User following system
  - Post likes and comments
  - Activity feed
  - Notifications

- **Country Integration**
  - Country data retrieval
  - Geographic information
  - Location-based features

## Technical Stack

- **Runtime**
  - Node.js
  - Express.js

- **Database**
  - SQLite
  - Sequelize ORM

- **Security**
  - JWT Authentication
  - Password Hashing (bcrypt)
  - Input Validation
  - CORS Protection

- **File Storage**
  - Local file system
  - Image processing

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/posts` - Get user's posts

### Blog Posts
- `GET /api/posts` - List posts
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comment` - Comment on post

### Social
- `POST /api/follow/:id` - Follow user
- `DELETE /api/follow/:id` - Unfollow user
- `GET /api/followers` - Get followers
- `GET /api/following` - Get following

## Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Database
DB_PATH=./src/database/database.sqlite

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB

# Microservice
COUNTRY_SERVICE_URL=http://localhost:4000
```

## Development Setup

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm (v6 or higher)

2. **Installation**
   ```bash
   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env

   # Initialize database
   npm run db:init

   # Start development server
   npm run dev
   ```

3. **Docker Deployment**
   ```bash
   # Build and run with Docker
   docker build -t blog-server .
   docker run -p 4000:5001 blog-server
   ```

## API Usage

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

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

The server uses standard HTTP status codes and provides detailed error messages:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Monitoring

- Request logging
- Error tracking
- Performance metrics
- Database query logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 