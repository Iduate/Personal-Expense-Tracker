# Personal Expense Tracker

A full-stack expense tracking application built with React, Node.js, MongoDB, and AWS.

## Architecture Overview

```
expense-tracker-monorepo/
├── apps/
│   ├── backend/           # Express.js + TypeScript
│   ├── frontend/          # React 18 + Vite + TypeScript
├── packages/
│   ├── shared/           # Shared types and utilities
├── infrastructure/       # AWS CDK configuration
```

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Chakra UI** - Component library
- **Zustand** - State management
- **React Query** - Data fetching
- **Recharts** - Charts and visualization

### Backend
- **Node.js 20+** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB Atlas** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Infrastructure
- **AWS Lambda** - Serverless compute (future enhancement)
- **API Gateway** - REST API management
- **AWS CDK** - Infrastructure as code
- **S3 + CloudFront** - Static hosting

## Prerequisites

- **Node.js**: v20.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **MongoDB Atlas**: Account and cluster set up
- **AWS Account** (optional, for deployment): With CDK CLI configured

Install Node.js and pnpm if not already installed:
```bash
# Install pnpm globally (if not installed)
npm install -g pnpm@latest
```

## Quick Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd expense-tracker-monorepo
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables

#### Backend Configuration
Copy `.env.example` to `.env` in the backend directory:
```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:
```env
# MongoDB Configuration (required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker

# JWT Secret (change in production)
JWT_SECRET=your-secret-key-change-in-production

# Server Configuration
PORT=3001
NODE_ENV=development
```

**MongoDB Atlas Setup:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string from "Connect" button
4. Replace `username:password` with your credentials

#### Frontend Configuration
Copy `.env.example` to `.env` in the frontend directory:
```bash
cp apps/frontend/.env.example apps/frontend/.env
```

The default configuration should work for local development. For production:
```env
VITE_API_URL=https://api.yourdomain.com
```

### 4. Build Shared Package
```bash
pnpm run build --filter @expense-tracker/shared
```

### 5. Run Locally

**Terminal 1 - Backend:**
```bash
pnpm run dev --filter @expense-tracker/backend
# Server will run on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
pnpm run dev --filter @expense-tracker/frontend
# Application will open on http://localhost:3000
```

## Available Scripts

### Root Commands
```bash
pnpm install           # Install all dependencies
pnpm run build        # Build all packages
pnpm run dev          # Run all dev servers in parallel
pnpm run lint         # Lint all packages
pnpm run type-check   # Type check all packages
pnpm run test         # Run tests in all packages
```

### Backend Commands
```bash
cd apps/backend
pnpm run dev           # Start dev server with hot reload
pnpm run build         # Build TypeScript
pnpm run start         # Run compiled code
pnpm run type-check    # Check types
pnpm run lint          # Lint code
pnpm run test          # Run tests
```

### Frontend Commands
```bash
cd apps/frontend
pnpm run dev           # Start Vite dev server
pnpm run build         # Build for production
pnpm run preview       # Preview production build
pnpm run type-check    # Check types
pnpm run lint          # Lint code
pnpm run test          # Run tests
```

## API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Create new account
- **POST** `/api/auth/login` - Login with credentials

### Expenses
- **POST** `/api/expenses` - Create expense
- **GET** `/api/expenses` - List expenses (with filters)
- **PUT** `/api/expenses/:id` - Update expense
- **DELETE** `/api/expenses/:id` - Delete expense
- **GET** `/api/expenses/monthly/summary` - Get monthly spending
- **GET** `/api/expenses/category/spending` - Get spending by category

### Categories
- **POST** `/api/categories` - Create custom category
- **GET** `/api/categories` - List all categories
- **DELETE** `/api/categories/:id` - Delete custom category

## Features

### ✅ Implemented
- **User Authentication**: JWT-based signup/login
- **Expense Management**: Add, edit, delete, list expenses
- **Category Management**: Predefined categories + custom categories
- **Expense Filtering**: Filter by date range and category
- **Spending Reports**: Monthly totals and category breakdown
- **Data Visualization**: Pie chart of spending by category
- **Responsive UI**: Chakra UI components

### 🔄 Optional Enhancements (To Implement)
- Budget setting per category
- CSV export functionality
- Spending trends visualization (line charts)
- Recurring expenses
- Budget alerts
- Multi-currency support

## Code Quality & Style

### Principles Applied
1. **Minimalistic & Elegant** - Simple, straightforward solutions
2. **Functional Approach** - Pure functions, immutability
3. **Single Responsibility** - One function = one purpose
4. **DRY (Don't Repeat Yourself)** - Reusable code
5. **Encapsulation & Layering** - Clear module boundaries

### Code Validation
Run before committing:
```bash
pnpm run type-check    # Fix type errors: tsc --noEmit
pnpm run lint          # Fix lint errors: eslint --fix src
pnpm run test          # Run and fix tests
```

## Deployment

### AWS Deployment (CDK)

1. **Configure AWS Credentials:**
```bash
aws configure
# Enter: Access Key, Secret Key, Region (e.g., us-east-1)
```

2. **Set Environment Variables:**
```bash
export MONGODB_URI="your-mongodb-uri"
export JWT_SECRET="your-jwt-secret"
```

3. **Deploy Infrastructure:**
```bash
cd infrastructure
pnpm install
pnpm run cdk:deploy
```

### Manual Deployment

**Backend (Lambda + API Gateway):**
- Build: `cd apps/backend && pnpm run build`
- Deploy to Lambda with environment variables
- Set up API Gateway with /api endpoints

**Frontend (S3 + CloudFront):**
- Build: `cd apps/frontend && pnpm run build`
- Upload `dist/` to S3 bucket
- Configure CloudFront distribution

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Expenses Collection
```javascript
{
  _id: ObjectId,
  userId: String (indexed),
  amount: Number,
  description: String,
  category: String,
  date: String (ISO format),
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  userId: String (indexed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### "Cannot find module '@expense-tracker/shared'"
**Solution:** Build shared package first:
```bash
pnpm run build --filter @expense-tracker/shared
```

### "MongoDB connection refused"
**Solution:** 
- Verify MongoDB URI in `.env`
- Check MongoDB Atlas IP whitelist includes your IP
- Verify cluster is running

### "Port 3001 already in use"
**Solution:** 
```bash
# Change port in apps/backend/.env
PORT=3002
```

### "CORS errors"
**Solution:** 
- Backend enables CORS for localhost by default
- For production, update CORS configuration in `apps/backend/src/index.ts`

### Frontend can't reach backend
**Solution:**
- Verify backend is running on `http://localhost:3001`
- Check `VITE_API_URL` in `apps/frontend/.env`
- Ensure no proxy conflicts

### Build fails with TypeScript errors
**Solution:**
```bash
# Ensure types are available
pnpm install

# Rebuild with type checking
pnpm run type-check
pnpm run build
```

## Testing

### Run All Tests
```bash
pnpm run test
```

### Backend Tests
```bash
cd apps/backend
pnpm run test
```

### Frontend Tests
```bash
cd apps/frontend
pnpm run test
```

## Project Structure

```
expense-tracker-monorepo/
│
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── services/       # Business logic
│   │   │   ├── models/         # Database schemas
│   │   │   ├── routes/         # API routes
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── utils/          # Utility functions
│   │   │   └── index.ts        # Server entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   └── .env
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── pages/          # Page components
│       │   ├── store/          # Zustand stores
│       │   ├── lib/            # API client
│       │   ├── App.tsx         # Root component
│       │   └── main.tsx        # Entry point
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       ├── .env.example
│       └── .env
│
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── types.ts        # Shared types
│       │   ├── constants.ts    # Shared constants
│       │   └── index.ts        # Exports
│       ├── package.json
│       └── tsconfig.json
│
├── infrastructure/
│   ├── lib/
│   │   └── stack.ts           # CDK stack definition
│   ├── package.json
│   └── tsconfig.json
│
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── .eslintrc.json
└── README.md (this file)
```

## License

MIT

## Support

For issues and questions:
1. Check the Troubleshooting section
2. Review code comments
3. Check TypeScript types in `packages/shared/src/types.ts`
