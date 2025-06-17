⚠ Notice

This project is proprietary. No use, reproduction, modification, or distribution of this software or its source code is allowed without explicit written permission from the author, Methma Lochanie Rathnayaka.

If you wish to reference this work or request usage permissions, please contact the author directly.

Unauthorized use will be considered a violation of copyright and may lead to legal action.


# Countries API Middleware Service

A secure API middleware service that interfaces with RestCountries.com, providing filtered country information with authentication and API key management.

## Project Structure

```
.
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/
|       ├── api/          # API endpoints
│       ├── components/    # Reusable components
|           ├── admin/     # User management
│       ├── pages/        # Page components
│       ├── services/     # API services
│       ├── hooks/        # Custom React hooks
│       └── context/      # React context
├── server/                # Node.js backend
│   └── src/
│       ├── controllers/  # Route controllers
│       ├── routes/       # API routes
│       ├── middleware/   # Custom middleware
│       ├── config/       # Configuration files
│       ├── utils/        # Utility functions
│       └── database/     # Database setup
```

## Features

- User authentication system with JWT
- API key management and tracking
- Secure country data retrieval from RestCountries.com
- Rate limiting and usage tracking
- SQLite database storage
- Modern React frontend with Material-UI
- Responsive design
- React Query for efficient data fetching
- Protected routes and role-based access control

## Tech Stack

### Frontend
- React 19
- Material-UI v7
- React Router v7
- React Query v5
- Axios for API calls
- Emotion for styled components

### Backend
- Node.js with Express
- SQLite3 database
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for input validation
- Helmet for security headers
- Express Rate Limit for API protection

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server (in a new terminal)
   cd client
   npm start
   ```

5. Access the application at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Countries
- `GET /api/countries` - Get filtered country data
- `GET /api/countries/:code` - Get specific country details

### API Keys
- `POST /api/keys/generate` - Generate new API key
- `GET /api/keys` - List user's API keys
- `DELETE /api/keys/:id` - Delete API key

## Security Features

- Password hashing with bcrypt
- JWT authentication
- API key validation and tracking
- Request rate limiting
- Input validation with express-validator
- XSS protection with helmet
- CORS configuration
- Secure HTTP headers

## Development

The project uses Docker for containerization. To run the application using Docker:

```bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
```

## Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```


## License
This project is licensed under the proprietary License.
