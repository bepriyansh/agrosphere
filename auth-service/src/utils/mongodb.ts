import mongoose from 'mongoose';
import { config } from './config';

let isConnected = false;

export const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    await mongoose.connect(config.Database!)
        .then(() => {
            isConnected = true;
            console.log('Connected to MongoDB');
        })
        .catch(err => {
            isConnected = false;
            console.error('MongoDB connection error:', err);
        });
};

// Middleware-safe check before each request
export const checkDBConnection = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.log('MongoDB not connected. Attempting to reconnect...');
        await connectDB();
    }
};

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open');
});

mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('Mongoose default connection disconnected');
});

mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error('Mongoose default connection error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
});
