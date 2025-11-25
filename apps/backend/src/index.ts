import express from 'express';
import cors from 'cors';
import { connectDatabase } from './utils';
import { authMiddleware, errorHandler } from './middleware';
import { authRoutes, expenseRoutes, categoryRoutes, budgetRoutes } from './routes';
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/budgets', authMiddleware, budgetRoutes);

// Error handling
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
