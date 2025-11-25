# Personal Expense Tracker

A full-stack expense tracking application built with React, Node.js, MongoDB, and AWS.

## 1. Setup Instructions

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **MongoDB Atlas**: Account and cluster set up
- **AWS Account**: With CDK CLI configured

### Quick Start

1. **Clone the Repository**
```bash
git clone https://github.com/Iduate/Personal-Expense-Tracker.git
cd Personal-Expense-Tracker
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Configure Environment Variables**

Create `.env.local` in the root directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
```

4. **Deploy to AWS**
```bash
cd infrastructure
pnpm install
pnpm run cdk:deploy
```

## 2. Architecture Overview

### Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│                   React 18 + Vite App                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
         ┌───────────────────────────────┐
         │    CloudFront (CDN)           │
         │  d1a3j9vnt3lui7.cloudfront.net│
         └────────────┬────────────────┬─┘
                      │ Static Files   │
         ┌────────────▼──┐         ┌───▼────────────┐
         │  S3 Bucket    │         │  API Requests  │
         │  (Frontend)   │         └────┬───────────┘
         └───────────────┘              │
                                        ▼
                        ┌──────────────────────────────┐
                        │    API Gateway               │
                        │ fpmdy194nh.execute-api...    │
                        │ /prod/{proxy+}               │
                        └────────────┬─────────────────┘
                                     │
                                     ▼
                        ┌──────────────────────────────┐
                        │   AWS Lambda                 │
                        │   Node.js 20.x               │
                        │   Express.js App             │
                        │   serverless-http            │
                        └────────────┬─────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
         ┌──────────────────────┐         ┌──────────────────────┐
         │  MongoDB Atlas       │         │  JWT Auth            │
         │  Database            │         │  (bcryptjs)          │
         │  (Expenses, Users,   │         │                      │
         │   Categories)        │         │                      │
         └──────────────────────┘         └──────────────────────┘
```

### Project Structure

```
Personal-Expense-Tracker/
├── apps/
│   ├── backend/                    # Express.js + TypeScript
│   │   ├── src/
│   │   │   ├── controllers/        # Request handlers
│   │   │   ├── services/           # Business logic
│   │   │   ├── models/             # Mongoose schemas
│   │   │   ├── routes/             # API routes
│   │   │   ├── middleware/         # Auth & error handling
│   │   │   ├── utils/              # JWT, crypto, database
│   │   │   ├── lambda.ts           # AWS Lambda handler
│   │   │   └── index.ts            # Express app
│   │   └── package.json
│   │
│   └── frontend/                   # React 18 + Vite
│       ├── src/
│       │   ├── components/         # React components
│       │   ├── pages/              # Page components
│       │   ├── store/              # Zustand auth store
│       │   ├── lib/                # API client
│       │   ├── App.tsx             # Root component
│       │   └── main.tsx            # Entry point
│       └── package.json
│
├── packages/
│   └── shared/                     # Shared types & constants
│       └── src/
│           ├── types.ts            # TypeScript interfaces
│           └── constants.ts        # Shared constants
│
├── infrastructure/                 # AWS CDK
│   └── lib/
│       └── stack.ts                # Lambda, API Gateway, S3, CloudFront
│
└── README.md
```

### Technology Stack

**Frontend:**
- React 18, Vite, TypeScript, Chakra UI, Zustand, React Query, Recharts

**Backend:**
- Node.js 20, Express.js, TypeScript, MongoDB, JWT, bcryptjs

**Infrastructure:**
- AWS Lambda, API Gateway, S3, CloudFront, AWS CDK

## 3. Key Design Decisions

1. **Serverless Architecture**
   - Express app runs on AWS Lambda with API Gateway routing
   - Eliminates server management overhead
   - Auto-scaling and pay-per-use model

2. **Lazy-loaded Models**
   - Mongoose models imported dynamically in services
   - Prevents initialization before database connection
   - Ensures database connection established before model registration

3. **Environment Variables at Synthesis**
   - CDK loads `.env.local` at synthesis time
   - Populates Lambda environment variables (MONGODB_URI, JWT_SECRET)
   - Secure credential management

4. **Monorepo Structure**
   - Shared types and utilities in separate package
   - Code reuse across frontend and backend
   - Centralized dependency management with pnpm workspaces

5. **Stateless Lambda**
   - Database connection reused across invocations
   - Module-level variable maintains connection state
   - Reduces cold start latency for subsequent requests

6. **JWT Authentication**
   - Stateless auth with tokens in Authorization header
   - Middleware verifies and extracts userId from token
   - No session storage required

7. **Tab-based UI**
   - Dashboard uses Chakra UI Tabs
   - State management for feature switching
   - Smooth navigation between expenses, analytics, budgets

## 4. GitHub Repository Link

```
https://github.com/Iduate/Personal-Expense-Tracker.git
```

## 5. Deployed Application URLs

### Frontend
```
https://d1a3j9vnt3lui7.cloudfront.net
```

### API Base URL
```
https://fpmdy194nh.execute-api.us-east-1.amazonaws.com/prod/
```

### API Endpoints

**Authentication**
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login

**Expenses**
- `POST /expenses` - Create expense
- `GET /expenses` - List expenses
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /expenses/category/spending` - Spending by category
- `GET /expenses/trends/monthly` - Monthly trends
- `POST /expenses/export` - Export to CSV

**Categories**
- `POST /categories` - Create custom category
- `GET /categories` - List categories
- `DELETE /categories/:id` - Delete category

**Budgets**
- `POST /budgets` - Create budget
- `GET /budgets` - List budgets
- `DELETE /budgets/:id` - Delete budget

**Utilities**
- `GET /health` - Health check

## Features Implemented

✅ User authentication with JWT  
✅ Expense CRUD operations  
✅ Category management (predefined + custom)  
✅ Spending reports by category  
✅ Monthly trends visualization  
✅ Budget management per category  
✅ CSV export functionality  
✅ Responsive UI with Chakra UI  
✅ Full AWS deployment (Lambda, API Gateway, S3, CloudFront)  
✅ MongoDB Atlas database  
✅ Password hashing with bcryptjs  

## Local Development

**Terminal 1 - Backend:**
```bash
cd apps/backend
pnpm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm run dev
# Application opens on http://localhost:3000
```

## Testing the Application

1. Visit https://d1a3j9vnt3lui7.cloudfront.net
2. Sign up with email and password
3. Create expenses
4. View spending analytics
5. Manage budgets and categories

## License

MIT
