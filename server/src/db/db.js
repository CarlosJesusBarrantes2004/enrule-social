import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/config.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.log('Error connecting to MongoDB: ', error);
    process.exit(1);
  }
};
