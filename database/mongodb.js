import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';


if(!DB_URI){
    throw new Error('Please define the mongodb_uri environment variable inside .env<development/production>.local');
}

const connectDB = async () => { 
    try{
        await mongoose.connect(DB_URI);
        console.log(`MongoDB connected: ${NODE_ENV}`);
    }
    catch(error){
        console.error('MongoDB connection failed',error);

        process.exit(1);
    }
};

export default connectDB;

    

