export const PREDEFINED_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health'];

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && !isNaN(amount);
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const getMonthKey = (date: string): string => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
