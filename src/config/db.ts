import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv'


const dbConnect = async (): Promise<void> => {
  try {
    const MONGO_URL = process.env.MONGO_URL as string; 


    const connectOptions: ConnectOptions = {
      autoIndex: true, 
      serverSelectionTimeoutMS: 5000, 
    };

    await mongoose.connect(MONGO_URL, connectOptions);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};

export default dbConnect;
