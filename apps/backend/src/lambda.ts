import app from './index';
import serverless from 'serverless-http';
import { connectDatabase } from './utils/database';
import dotenv from 'dotenv';

dotenv.config();

let mongooseConnection: boolean = false;

// Initialize database connection once
const initializeDatabase = async () => {
  if (!mongooseConnection) {
    try {
      console.log('🔄 Initializing database connection...');
      await connectDatabase();
      mongooseConnection = true;
      console.log('✓ Database connection initialized successfully');
    } catch (error) {
      console.error('✗ Database initialization failed:', error instanceof Error ? error.message : error);
      mongooseConnection = false;
      throw error;
    }
  }
};

// Configure serverless-http
const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  try {
    console.log('🚀 Lambda handler called');
    console.log('Path:', event.path, 'Method:', event.httpMethod);
    
    // Initialize database on first request
    if (!mongooseConnection) {
      console.log('🔄 First request, initializing database...');
      await initializeDatabase();
    }

    // Reuse database connection across Lambda invocations
    context.callbackWaitsForEmptyEventLoop = false;

    console.log('✅ Processing with serverless-http...');
    const response: any = await serverlessHandler(event, context);
    console.log('Response status:', response?.statusCode);
    return response;
  } catch (error) {
    console.error('💥 Lambda handler error:', error);
    console.error('Error type:', typeof error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'N/A');
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal server error',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
