import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if (!DB_URI) {
    throw new Error('Please define the DB_URI environment variable inside .env<development/production>.local');
}

const connectDB = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        retryReads: true
    };

    let retries = 5;
    while (retries) {
        try {
            const conn = await mongoose.connect(DB_URI, options);
            
            // Connection events
            mongoose.connection.on('connected', () => {
                console.log(`MongoDB connected: ${NODE_ENV}`);
            });

            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });

            // Handle process termination
            process.on('SIGINT', async () => {
                try {
                    await mongoose.connection.close();
                    console.log('MongoDB connection closed through app termination');
                    process.exit(0);
                } catch (err) {
                    console.error('Error during MongoDB disconnection:', err);
                    process.exit(1);
                }
            });

            return conn;
        } catch (error) {
            retries--;
            console.error(`MongoDB connection failed. Retries left: ${retries}`, error);
            
            if (retries === 0) {
                console.error('Max retries reached. Could not connect to MongoDB');
                process.exit(1);
            }
            
            // Wait for 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

export default connectDB;

    

