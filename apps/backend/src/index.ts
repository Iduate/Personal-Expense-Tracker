import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes';
import expensesRoutes from './routes/expenseRoutes';
import categoriesRoutes from './routes/categoryRoutes';
import budgetsRoutes from './routes/budgetRoutes';

app.use('/auth', authRoutes);
app.use('/expenses', expensesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/budgets', budgetsRoutes);

app.get('/utils-test', async (req, res) => {
  try {
    console.log('Testing utils...');
    
    console.log('Testing bcryptjs...');
    const bcryptjs = await import('bcryptjs');
    const hashed = await bcryptjs.default.hash('test123', 10);
    console.log('Bcryptjs works:', hashed.substring(0, 10));
    
    console.log('Testing jwt...');
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign({ userId: '123' }, 'secret', { expiresIn: '7d' });
    console.log('JWT works:', token.substring(0, 10));
    
    res.json({ message: 'Utils work fine', bcryptjs_ok: true, jwt_ok: true });
  } catch (error: any) {
    console.error('Utils test error:', error);
    console.error('Error stack:', error?.stack);
    res.status(500).json({ 
      error: error?.message || String(error),
      stack: error?.stack
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/env-check', (req, res) => {
  res.json({
    MONGODB_URI: process.env.MONGODB_URI ? '✓ Set' : '✗ Not set',
    JWT_SECRET: process.env.JWT_SECRET ? '✓ Set' : '✗ Not set',
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_VALUE: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'MISSING',
  });
});

app.get('/db-test', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const connected = mongoose.connection.readyState === 1;
    
    // Try to query the User model
    const { UserModel } = await import('./models');
    const userCount = await UserModel.countDocuments();
    
    res.json({
      message: "DB test endpoint",
      mongodb_connected: connected,
      connection_state: mongoose.connection.readyState,
      models: Object.keys(mongoose.modelNames()),
      user_count: userCount,
    });
  } catch (error: any) {
    console.error('DB test error:', error);
    res.status(500).json({ error: error?.message || String(error) });
  }
});

app.post('/auth/test-signup', async (req, res) => {
  try {
    console.log('Testing signup flow...');
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    console.log('Loading user model...');
    const { UserModel } = await import('./models');
    
    console.log('Checking if user exists...');
    const existingUser = await UserModel.findOne({ email });
    
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    console.log('Hashing password...');
    const { hashPassword } = await import('./utils');
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed');
    
    console.log('Creating user...');
    const user = await UserModel.create({ email, password: hashedPassword });
    
    console.log('Generating token...');
    const { generateToken } = await import('./utils');
    const token = generateToken(user._id.toString());
    console.log('Token generated');
    
    console.log('User created successfully');
    res.status(201).json({ 
      message: 'User created',
      user: { email: user.email, _id: user._id },
      token: token
    });
  } catch (error: any) {
    console.error('Test signup error:', error);
    res.status(500).json({ 
      error: 'Test signup failed',
      message: error?.message || String(error)
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error caught by handler:', err);
  console.error('Error type:', typeof err);
  console.error('Error message:', err?.message);
  console.error('Error stack:', err?.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Required so lambda.ts can consume app
export default app;
