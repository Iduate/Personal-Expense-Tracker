import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast, Table, Thead, Tbody, Tr, Th, Td, } from '@chakra-ui/react';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';
export const BudgetManager = ({ customCategories }) => {
    const [budgets, setBudgets] = useState([]);
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');
    const [threshold, setThreshold] = useState('80');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const token = useAuthStore((state) => state.token);
    const allCategories = [...['Food', 'Transport', 'Entertainment', 'Utilities', 'Health'], ...customCategories];
    useEffect(() => {
        loadBudgets();
    }, []);
    const loadBudgets = async () => {
        try {
            const data = await apiClient.budgets.list(token);
            setBudgets(data);
        }
        catch (error) {
            console.error('Failed to load budgets:', error);
        }
    };
    const handleAddBudget = async () => {
        if (!category || !limit) {
            toast({ title: 'Please fill all fields', status: 'error' });
            return;
        }
        setLoading(true);
        try {
            await apiClient.budgets.create(token, {
                category,
                limit: parseFloat(limit),
                alert_threshold: parseFloat(threshold),
            });
            toast({ title: 'Budget created', status: 'success' });
            setCategory('');
            setLimit('');
            setThreshold('80');
            await loadBudgets();
        }
        catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error' });
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteBudget = async (cat) => {
        try {
            await apiClient.budgets.delete(token, cat);
            toast({ title: 'Budget deleted', status: 'success' });
            await loadBudgets();
        }
        catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error' });
        }
    };
    return (_jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsxs(Box, { bg: "white", p: 6, rounded: "lg", shadow: "md", children: [_jsx(FormLabel, { fontWeight: "bold", mb: 4, children: "Set Budget Limit" }), _jsxs(VStack, { spacing: 3, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Category" }), _jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), style: {
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            border: '1px solid #cbd5e0',
                                        }, children: [_jsx("option", { value: "", children: "Select category" }), allCategories.map((cat) => (_jsx("option", { value: cat, children: cat }, cat)))] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Budget Limit ($)" }), _jsx(Input, { type: "number", step: "0.01", min: "0", value: limit, onChange: (e) => setLimit(e.target.value), placeholder: "100.00" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Alert Threshold (%)" }), _jsx(Input, { type: "number", min: "0", max: "100", value: threshold, onChange: (e) => setThreshold(e.target.value), placeholder: "80" })] }), _jsx(Button, { colorScheme: "blue", width: "full", onClick: handleAddBudget, isLoading: loading, children: "Set Budget" })] })] }), budgets.length > 0 && (_jsxs(Box, { bg: "white", p: 6, rounded: "lg", shadow: "md", overflowX: "auto", children: [_jsx(FormLabel, { fontWeight: "bold", mb: 4, children: "Active Budgets" }), _jsxs(Table, { size: "sm", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Category" }), _jsx(Th, { children: "Limit" }), _jsx(Th, { children: "Threshold" }), _jsx(Th, { children: "Action" })] }) }), _jsx(Tbody, { children: budgets.map((budget) => (_jsxs(Tr, { children: [_jsx(Td, { children: budget.category }), _jsxs(Td, { children: ["$", budget.limit.toFixed(2)] }), _jsxs(Td, { children: [budget.alert_threshold, "%"] }), _jsx(Td, { children: _jsx(Button, { size: "sm", colorScheme: "red", onClick: () => handleDeleteBudget(budget.category), children: "Delete" }) })] }, budget.category))) })] })] }))] }));
};
