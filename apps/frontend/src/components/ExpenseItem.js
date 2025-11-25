import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Button, Flex, HStack, Text, useToast } from '@chakra-ui/react';
import { formatCurrency } from '@shared/constants';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';
export const ExpenseItem = ({ expense, onDelete, onEdit }) => {
    const [deleting, setDeleting] = React.useState(false);
    const toast = useToast();
    const token = useAuthStore((state) => state.token);
    const handleDelete = async () => {
        setDeleting(true);
        try {
            await apiClient.expenses.delete(token, expense._id);
            toast({ title: 'Expense deleted', status: 'success' });
            onDelete();
        }
        catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error' });
        }
        finally {
            setDeleting(false);
        }
    };
    return (_jsxs(Box, { p: 4, bg: "gray.50", rounded: "md", borderLeft: "4px", borderColor: "blue.500", children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 2, children: [_jsx(Text, { fontWeight: "bold", children: expense.description }), _jsx(Text, { fontSize: "lg", fontWeight: "bold", color: "green.600", children: formatCurrency(expense.amount) })] }), _jsxs(HStack, { spacing: 4, children: [_jsxs(Text, { fontSize: "sm", color: "gray.600", children: ["Category: ", _jsx("strong", { children: expense.category })] }), _jsxs(Text, { fontSize: "sm", color: "gray.600", children: ["Date: ", _jsx("strong", { children: new Date(expense.date).toLocaleDateString() })] })] }), _jsxs(HStack, { spacing: 2, mt: 3, children: [_jsx(Button, { size: "sm", colorScheme: "blue", variant: "outline", onClick: () => onEdit(expense), children: "Edit" }), _jsx(Button, { size: "sm", colorScheme: "red", variant: "outline", isLoading: deleting, onClick: handleDelete, children: "Delete" })] })] }));
};
