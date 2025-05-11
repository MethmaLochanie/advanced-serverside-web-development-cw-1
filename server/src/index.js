require('dotenv').config();
const app = require('./app');
const config = require('./config/config');
const { initializeDatabase } = require('./database/init');

// Global error handler
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Initialize database and start server
const startServer = async () => {
    try {
        console.log('Starting server initialization...');
        await initializeDatabase();
        console.log('Database initialized successfully');

        const server = app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
console.log('Starting server...');
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
}); 