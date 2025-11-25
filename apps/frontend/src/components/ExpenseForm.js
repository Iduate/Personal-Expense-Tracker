import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast, Select, } from '@chakra-ui/react';
import { PREDEFINED_CATEGORIES } from '@shared/constants';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';
export const ExpenseForm = ({ onSuccess, customCategories = [], expense, onCancel, }) => {
    const [formData, setFormData] = React.useState({
        amount: expense?.amount?.toString() || '',
        description: expense?.description || '',
        category: expense?.category || '',
        date: expense?.date || new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = React.useState(false);
    const toast = useToast();
    const token = useAuthStore((state) => state.token);
    const allCategories = [...PREDEFINED_CATEGORIES, ...customCategories];
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.description || !formData.category || !formData.date) {
            toast({ title: 'Please fill all fields', status: 'error' });
            return;
        }
        setLoading(true);
        try {
            if (expense) {
                await apiClient.expenses.update(token, expense._id, {
                    amount: parseFloat(formData.amount),
                    description: formData.description,
                    category: formData.category,
                    date: formData.date,
                });
            }
            else {
                await apiClient.expenses.create(token, {
                    amount: parseFloat(formData.amount),
                    description: formData.description,
                    category: formData.category,
                    date: formData.date,
                });
            }
            toast({ title: expense ? 'Expense updated' : 'Expense created', status: 'success' });
            onSuccess();
        }
        catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error' });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Box, { p: 6, bg: "white", rounded: "lg", shadow: "md", children: _jsx("form", { onSubmit: handleSubmit, children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Amount" }), _jsx(Input, { type: "number", step: "0.01", min: "0", value: formData.amount, onChange: (e) => setFormData({ ...formData, amount: e.target.value }), placeholder: "0.00" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Description" }), _jsx(Input, { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "What did you spend on?" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Category" }), _jsxs(Select, { value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), children: [_jsx("option", { value: "", children: "Select a category" }), allCategories.map((cat) => (_jsx("option", { value: cat, children: cat }, cat)))] })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Date" }), _jsx(Input, { type: "date", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }) })] }), _jsxs(Box, { display: "flex", gap: 2, width: "full", children: [_jsxs(Button, { type: "submit", colorScheme: "green", flex: 1, isLoading: loading, children: [expense ? 'Update' : 'Add', " Expense"] }), onCancel && (_jsx(Button, { variant: "outline", flex: 1, onClick: onCancel, children: "Cancel" }))] })] }) }) }));
};
