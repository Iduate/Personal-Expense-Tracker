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
console.log('Connecting to:', MONGODB_URI.substring(0, 50) + '...');

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
