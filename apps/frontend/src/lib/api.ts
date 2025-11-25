import type { AuthResponse, Expense, CustomCategory, MonthlySummary, SpendingByCategory } from '@shared/types';

const API_URL: string = 'http://localhost:3001/api';

const getHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const apiClient = {
  auth: {
    signup: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      return response.json();
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return response.json();
    },
  },

  expenses: {
    create: async (token: string, expense: Omit<Expense, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create expense');
      }

      return response.json();
    },

    list: async (token: string, filters?: { startDate?: string; endDate?: string; category?: string }): Promise<Expense[]> => {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.category) params.append('category', filters.category);

      const url = `${API_URL}/expenses${params.size ? '?' + params.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch expenses');
      }

      return response.json();
    },

    update: async (token: string, expenseId: string, updates: Partial<Expense>): Promise<Expense> => {
      const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update expense');
      }

      return response.json();
    },

    delete: async (token: string, expenseId: string): Promise<void> => {
      const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete expense');
      }
    },

    getMonthlySummary: async (token: string, month?: string): Promise<MonthlySummary> => {
      const params = new URLSearchParams();
      if (month) params.append('month', month);

      const url = `${API_URL}/expenses/monthly/summary${params.size ? '?' + params.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch summary');
      }

      return response.json();
    },

    getSpendingByCategory: async (token: string): Promise<SpendingByCategory[]> => {
      const response = await fetch(`${API_URL}/expenses/category/spending`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch spending');
      }

      return response.json();
    },
  },

  categories: {
    create: async (token: string, name: string): Promise<CustomCategory> => {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
      }

      return response.json();
    },

    list: async (token: string): Promise<{ predefined: string[]; custom: CustomCategory[]; all: string[] }> => {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch categories');
      }

      return response.json();
    },

    delete: async (token: string, categoryId: string): Promise<void> => {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }
    },
  },

  budgets: {
    create: async (token: string, budget: { category: string; limit: number; alert_threshold: number }): Promise<any> => {
      const response = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create budget');
      }

      return response.json();
    },

    list: async (token: string): Promise<any[]> => {
      const response = await fetch(`${API_URL}/budgets`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch budgets');
      }

      return response.json();
    },

    delete: async (token: string, category: string): Promise<void> => {
      const response = await fetch(`${API_URL}/budgets/${category}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete budget');
      }
    },
  },

  trends: {
    getMonthlyTrends: async (token: string): Promise<Array<{ month: string; total: number }>> => {
      const response = await fetch(`${API_URL}/expenses/trends/monthly`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch trends');
      }

      return response.json();
    },

    exportCSV: async (token: string): Promise<Blob> => {
      const response = await fetch(`${API_URL}/expenses/export/csv`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to export CSV');
      }

      return response.blob();
    },
  },
};
