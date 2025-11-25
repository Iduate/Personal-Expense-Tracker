# Quick Start Guide

## Prerequisites ✅

Before starting, ensure you have:
- **Node.js 20+** installed
- **pnpm 8+** installed (`npm install -g pnpm`)
- **MongoDB Atlas account** with a cluster created
- **Git** for version control

## One-Command Setup

After cloning the repository, run:

```bash
# Install all dependencies
pnpm install

# Setup shared package
pnpm run build --filter @expense-tracker/shared
```

## Configuration Files Setup

### 1. Configure Backend

Copy the example env file:
```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/expense-tracker
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
NODE_ENV=development
```

**Where to get MongoDB URI:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Click "Connect" on your cluster
4. Choose "Drivers" → "Node.js"
5. Copy the connection string and update credentials

### 2. Configure Frontend

Copy the example env file:
```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Edit `apps/frontend/.env` (default works for local development):
```env
VITE_API_URL=http://localhost:3001/api
```

## Running Locally

**Terminal 1 - Start Backend:**
```bash
cd apps/backend
pnpm run dev
```
✅ Backend runs on `http://localhost:3001`

**Terminal 2 - Start Frontend:**
```bash
cd apps/frontend
pnpm run dev
```
✅ Frontend opens at `http://localhost:3000`

## Testing the Application

1. **Sign Up**: Create a new account
2. **Add Expense**: Click "Add Expense" tab, fill the form
3. **View Expenses**: Go to "Expenses" tab
4. **View Analytics**: Go to "Analytics" tab to see spending chart

## Common Issues & Solutions

### ❌ "Cannot find module" errors
```bash
# Solution: Rebuild shared package
pnpm run build --filter @expense-tracker/shared
```

### ❌ MongoDB connection fails
- Check `MONGODB_URI` in `apps/backend/.env`
- Verify IP address is whitelisted in MongoDB Atlas
- Ensure cluster is running
- Try recreating the connection string

### ❌ Port 3001 already in use
```bash
# Solution: Change port in apps/backend/.env
PORT=3002
```

### ❌ Frontend can't reach backend
- Verify backend is running on `http://localhost:3001`
- Check `VITE_API_URL` in `apps/frontend/.env`
- Clear browser cache

### ❌ CORS errors in console
- Backend has CORS enabled for localhost by default
- For production, update CORS in `apps/backend/src/index.ts`

## Project Commands

### Build Everything
```bash
pnpm run build
```

### Run All Servers
```bash
pnpm run dev
```

### Type Check
```bash
pnpm run type-check
```

### Lint & Fix
```bash
pnpm run lint
```

### Run Tests
```bash
pnpm run test
```

## Architecture Overview

```
Frontend (React)          Backend (Express)         Database (MongoDB)
   Port 3000                Port 3001                 Atlas Cloud
   ✓ Signup/Login ------→ /api/auth/signup
   ✓ Add Expense -------→ /api/expenses
   ✓ View Reports ------→ /api/expenses/category/spending
```

## API Overview

### Authentication
- **POST** `/api/auth/signup` - Create account
- **POST** `/api/auth/login` - Login

### Expenses (Require Token)
- **GET** `/api/expenses` - List all
- **POST** `/api/expenses` - Create new
- **PUT** `/api/expenses/:id` - Update
- **DELETE** `/api/expenses/:id` - Delete

### Reports (Require Token)
- **GET** `/api/expenses/monthly/summary` - Monthly totals
- **GET** `/api/expenses/category/spending` - Spending breakdown

### Categories (Require Token)
- **GET** `/api/categories` - List all
- **POST** `/api/categories` - Create custom
- **DELETE** `/api/categories/:id` - Delete custom

## File Structure Quick Reference

```
apps/backend/
  ├── src/
  │   ├── models/          (MongoDB schemas)
  │   ├── controllers/     (Request handlers)
  │   ├── services/        (Business logic)
  │   ├── routes/          (API routes)
  │   ├── middleware/      (Auth, errors)
  │   ├── utils/           (JWT, crypto, DB)
  │   └── index.ts         (Server entry)

apps/frontend/
  ├── src/
  │   ├── components/      (React components)
  │   ├── pages/           (Page layouts)
  │   ├── store/           (State management)
  │   ├── lib/             (API client)
  │   └── main.tsx         (Entry point)

packages/shared/
  ├── src/
  │   ├── types.ts         (Shared types)
  │   ├── constants.ts     (Shared constants)
  │   └── __tests__/       (Tests)
```

## Next Steps

1. ✅ Setup complete
2. 📝 Customize branding/colors in `apps/frontend/src/App.tsx`
3. 🔐 Change JWT_SECRET to a strong value in production
4. 📊 Add more features (budgets, CSV export, etc.)
5. 🚀 Deploy to AWS

## Getting Help

- Check the main `README.md` for detailed documentation
- Review `PROJECT_STRUCTURE.md` for complete file layout
- Check backend code comments for implementation details
- Review `packages/shared/src/types.ts` for data structures

## Environment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB URI copied to `apps/backend/.env`
- [ ] JWT_SECRET configured in `apps/backend/.env`
- [ ] Node.js 20+ installed
- [ ] pnpm 8+ installed
- [ ] Dependencies installed with `pnpm install`
- [ ] Shared package built
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Can sign up and add expenses

---

**Ready to build! 🚀**

For deployment to AWS, see the Deployment section in `README.md`.
