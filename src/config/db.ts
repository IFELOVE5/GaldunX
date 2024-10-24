import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

// Async function to connect to the MongoDB database
const dbConnect = async (): Promise<void> => {
  try {
    const MONGO_URL = process.env.MONGO_URL as string; // Get MongoDB URL from environment variables

    const connectOptions: ConnectOptions = {
      autoIndex: true, // Automatically build indexes
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
    };

    await mongoose.connect(MONGO_URL, connectOptions); // Establish connection
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on connection failure
  }
};

export default dbConnect;
