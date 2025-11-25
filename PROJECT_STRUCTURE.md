# Project Structure - Personal Expense Tracker

## Monorepo Structure

```
CODYGO TASK/
├── pnpm-workspace.yaml                 # pnpm workspace configuration
├── package.json                        # Root package.json
├── tsconfig.base.json                  # Base TypeScript config
├── .eslintrc.json                      # ESLint configuration
├── .gitignore                          # Git ignore rules
├── README.md                           # Main documentation
│
├── apps/
│   ├── backend/                        # Express.js server
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── jest.config.js
│   │   ├── .env.example
│   │   ├── .env
│   │   └── src/
│   │       ├── index.ts               # Server entry point
│   │       ├── models/                # MongoDB schemas
│   │       │   ├── User.ts
│   │       │   ├── Expense.ts
│   │       │   ├── Category.ts
│   │       │   └── index.ts
│   │       ├── controllers/           # Request handlers
│   │       │   ├── authController.ts
│   │       │   ├── expenseController.ts
│   │       │   ├── categoryController.ts
│   │       │   └── index.ts
│   │       ├── services/              # Business logic
│   │       │   ├── authService.ts
│   │       │   ├── expenseService.ts
│   │       │   ├── categoryService.ts
│   │       │   └── index.ts
│   │       ├── routes/                # API routes
│   │       │   ├── authRoutes.ts
│   │       │   ├── expenseRoutes.ts
│   │       │   ├── categoryRoutes.ts
│   │       │   └── index.ts
│   │       ├── middleware/            # Express middleware
│   │       │   ├── auth.ts           # JWT authentication
│   │       │   ├── errorHandler.ts   # Global error handler
│   │       │   └── index.ts
│   │       ├── utils/                 # Utility functions
│   │       │   ├── jwt.ts            # Token generation/verification
│   │       │   ├── crypto.ts         # Password hashing
│   │       │   ├── database.ts       # MongoDB connection
│   │       │   └── index.ts
│   │       └── __tests__/            # Unit tests
│   │           └── jwt.test.ts
│   │
│   └── frontend/                       # React + Vite app
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vite.config.ts
│       ├── index.html
│       ├── .env.example
│       ├── .env
│       └── src/
│           ├── main.tsx              # Entry point
│           ├── App.tsx               # Root component
│           ├── lib/                  # Utilities
│           │   └── api.ts           # API client
│           ├── store/                # Zustand stores
│           │   └── authStore.ts
│           ├── components/           # React components
│           │   ├── AuthForm.tsx
│           │   ├── ExpenseForm.tsx
│           │   ├── ExpenseItem.tsx
│           │   ├── SpendingChart.tsx
│           │   └── index.ts
│           └── pages/                # Page components
│               ├── Dashboard.tsx
│               ├── AuthPage.tsx
│               └── index.ts
│
├── packages/
│   └── shared/                        # Shared types and utils
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── types.ts              # Type definitions
│           ├── constants.ts          # Shared constants
│           └── __tests__/
│               └── constants.test.ts
│
└── infrastructure/                    # AWS CDK configuration
    ├── package.json
    ├── tsconfig.json
    └── lib/
        └── stack.ts                  # CDK stack definition
```

## Key Features Implemented

### Backend (Node.js/Express)
✅ JWT-based Authentication (signup/login)
✅ Expense CRUD Operations
✅ Category Management (predefined + custom)
✅ Spending Reports (monthly summary, category breakdown)
✅ MongoDB Integration with Mongoose
✅ Password Hashing with bcryptjs
✅ Error Handling Middleware
✅ Environment Configuration

### Frontend (React/Vite)
✅ Login/Signup Forms
✅ Expense Management UI
✅ Add/Edit/Delete Expenses
✅ Filter by Date & Category
✅ Spending Pie Chart
✅ Dashboard with Tabs
✅ Persistent Authentication
✅ Form Validation
✅ Error Notifications (Toast)

### Shared Package
✅ TypeScript Type Definitions
✅ Validation Functions
✅ Constants
✅ Utility Functions

### Infrastructure
✅ AWS CDK Configuration
✅ Stack Definition Template

## Code Quality Standards

### Applied Principles
1. **Minimalistic & Elegant** - Simple solutions, no over-engineering
2. **Functional Approach** - Pure functions, immutability favored
3. **Immutability by Default** - Using `const`, creating new objects
4. **Single Responsibility** - One function = one purpose
5. **DRY** - Extracted reusable code
6. **Encapsulation & Layering** - Clear module boundaries

### Type Safety
- ✅ Full TypeScript implementation
- ✅ Strict mode enabled
- ✅ No implicit any types
- ✅ Type definitions for all functions

### Testing
- ✅ Unit tests for validation functions
- ✅ Test structure for critical services
- ✅ Jest configuration in backend
- ✅ Vitest configuration in frontend

### Linting
- ✅ ESLint configured
- ✅ TypeScript ESLint rules
- ✅ Consistent code style

## Environment Files

### Backend (.env required)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Scripts Overview

### Root Level
```
pnpm install          # Install all dependencies
pnpm run build        # Build all packages
pnpm run dev          # Run all dev servers
pnpm run lint         # Lint all packages
pnpm run type-check   # Type check
pnpm run test         # Run tests
```

### Backend
```
pnpm run dev          # Start with hot reload
pnpm run build        # Build
pnpm run start        # Run compiled
pnpm run type-check   # Type check
pnpm run lint         # Lint
pnpm run test         # Tests
```

### Frontend
```
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run preview      # Preview build
pnpm run type-check   # Type check
pnpm run lint         # Lint
pnpm run test         # Tests
```

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login

### Expenses
- POST /api/expenses
- GET /api/expenses
- PUT /api/expenses/:id
- DELETE /api/expenses/:id
- GET /api/expenses/monthly/summary
- GET /api/expenses/category/spending

### Categories
- POST /api/categories
- GET /api/categories
- DELETE /api/categories/:id

## Setup Steps

1. `pnpm install` - Install all dependencies
2. Configure `.env` files for backend and frontend
3. `pnpm run build --filter @expense-tracker/shared` - Build shared package
4. Backend: `pnpm run dev --filter @expense-tracker/backend`
5. Frontend: `pnpm run dev --filter @expense-tracker/frontend`
6. Access at `http://localhost:3000`

## Next Steps (Optional Enhancements)

- [ ] AWS Lambda deployment setup
- [ ] Budget per category feature
- [ ] CSV export functionality
- [ ] Spending trends (line charts)
- [ ] Recurring expenses
- [ ] Budget alerts
- [ ] Multi-currency support
- [ ] Email notifications
- [ ] Mobile app (React Native)

---

**Status**: ✅ Core application complete and ready for development/deployment
**Code Quality**: ✅ Follows all specified principles and standards
**Documentation**: ✅ Comprehensive README with troubleshooting
