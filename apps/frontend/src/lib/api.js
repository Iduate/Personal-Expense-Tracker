const API_URL = process.env.VITE_API_URL || 'https://fpmdy194nh.execute-api.us-east-1.amazonaws.com/prod';
const getHeaders = (token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token)
        headers.Authorization = `Bearer ${token}`;
    return headers;
};
export const apiClient = {
    auth: {
        signup: async (email, password) => {
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
        login: async (email, password) => {
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
        create: async (token, expense) => {
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
        list: async (token, filters) => {
            const params = new URLSearchParams();
            if (filters?.startDate)
                params.append('startDate', filters.startDate);
            if (filters?.endDate)
                params.append('endDate', filters.endDate);
            if (filters?.category)
                params.append('category', filters.category);
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
        update: async (token, expenseId, updates) => {
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
        delete: async (token, expenseId) => {
            const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
                method: 'DELETE',
                headers: getHeaders(token),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete expense');
            }
        },
        getMonthlySummary: async (token, month) => {
            const params = new URLSearchParams();
            if (month)
                params.append('month', month);
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
        getSpendingByCategory: async (token) => {
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
        create: async (token, name) => {
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
        list: async (token) => {
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
        delete: async (token, categoryId) => {
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
        create: async (token, budget) => {
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
        list: async (token) => {
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
        delete: async (token, category) => {
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
        getMonthlyTrends: async (token) => {
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
        exportCSV: async (token) => {
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
