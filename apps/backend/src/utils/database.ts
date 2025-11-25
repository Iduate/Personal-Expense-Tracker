import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Try to load .env from multiple locations
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✓ Loaded .env from:', envPath);
} else {
  console.log('✗ .env not found at:', envPath);
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

console.log('MONGODB_URI from env:', process.env.MONGODB_URI ? '✓ Set' : '✗ Not set, using default');

// Validate MongoDB URI before attempting connection
if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/expense-tracker') {
  console.warn('⚠️  Warning: MONGODB_URI is not properly configured. Using default localhost URI.');
}

export const connectDatabase = async (): Promise<void> => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✓ MongoDB already connected');
      return;
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
    });
    console.log('✓ Connected to MongoDB successfully');
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error);
    throw new Error(
      `MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('✗ Failed to disconnect from MongoDB:', error);
  }
};
