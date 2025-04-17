# Countries API Middleware Service

A secure API middleware service that interfaces with RestCountries.com, providing filtered country information with authentication and API key management.

## Project Structure

```
.
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/
|       ├── api/          #endpoints
│       ├── components/    # Reusable components
|           ├── admin/      #user management
│       ├── pages/        # Page components
│       ├── services/     # API services
│       ├── hooks/        # hooks ro call API end points
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

- User authentication system
- API key management
- Secure country data retrieval
- Rate limiting and usage tracking
- SQLite database storage

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

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/countries` - Get filtered country data
- `POST /api/keys/generate` - Generate new API key
- `GET /api/keys` - List user's API keys
- `DELETE /api/keys/:id` - Delete API key

## Security Features

- Password hashing with bcrypt
- JWT authentication
- API key validation
- Request rate limiting
- Input validation
- XSS protection with helmet 

## Containerized docker implementation