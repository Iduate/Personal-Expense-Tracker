export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Health' | 'Custom';

export interface Expense {
  _id?: string;
  userId: string;
  amount: number;
  description: string;
  category: Category | string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomCategory {
  _id?: string;
  userId: string;
  name: string;
  createdAt?: string;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
  };
}

export interface SpendingByCategory {
  category: string;
  total: number;
}

export interface MonthlySummary {
  month: string;
  total: number;
  byCategory: SpendingByCategory[];
}
