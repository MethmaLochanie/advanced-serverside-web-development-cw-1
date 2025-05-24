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
        await initializeDatabase();

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
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    process.exit(0);
});

process.on('SIGINT', () => {
    process.exit(0);
}); 