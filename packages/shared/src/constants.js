export const PREDEFINED_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health'];
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const validateAmount = (amount) => {
    return amount > 0 && !isNaN(amount);
};
export const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
};
export const getMonthKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
