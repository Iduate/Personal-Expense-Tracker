import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Button, HStack } from '@chakra-ui/react';
import { ExpenseForm, ExpenseItem, SpendingChart, TrendsChart, BudgetManager } from '../components';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../lib/api';
export const Dashboard = ({ onLogout }) => {
    const [expenses, setExpenses] = React.useState([]);
    const [customCategories, setCustomCategories] = React.useState([]);
    const [spending, setSpending] = React.useState([]);
    const [trends, setTrends] = React.useState([]);
    const [editingExpense, setEditingExpense] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState(0);
    const token = useAuthStore((state) => state.token);
    const email = useAuthStore((state) => state.email);
    const loadData = React.useCallback(async () => {
        try {
            const [expensesData, categoriesData, spendingData, trendsData] = await Promise.all([
                apiClient.expenses.list(token),
                apiClient.categories.list(token),
                apiClient.expenses.getSpendingByCategory(token),
                apiClient.trends.getMonthlyTrends(token),
            ]);
            setExpenses(expensesData);
            setCustomCategories(categoriesData.custom.map((c) => c.name));
            setSpending(spendingData);
            setTrends(trendsData);
        }
        catch (error) {
            console.error('Failed to load data:', error);
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    React.useEffect(() => {
        loadData();
    }, [loadData]);
    const handleExpenseCreated = () => {
        loadData();
        setEditingExpense(null);
    };
    const handleCSVExport = async () => {
        try {
            const csvBlob = await apiClient.trends.exportCSV(token);
            const url = window.URL.createObjectURL(csvBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `expenses-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        }
        catch (error) {
            console.error('Failed to export CSV:', error);
        }
    };
    return (_jsxs(Container, { maxW: "1200px", py: 8, children: [_jsxs(HStack, { justify: "space-between", mb: 8, children: [_jsxs(Box, { children: [_jsx("h1", { children: "Expense Tracker" }), _jsxs("p", { children: ["Welcome, ", email] })] }), _jsx(Button, { colorScheme: "red", onClick: onLogout, children: "Logout" })] }), _jsxs(Tabs, { index: activeTab, onChange: setActiveTab, children: [_jsxs(TabList, { children: [_jsx(Tab, { children: "Add Expense" }), _jsx(Tab, { children: "Expenses" }), _jsx(Tab, { children: "Analytics" }), _jsx(Tab, { children: "Budgets" }), _jsx(Tab, { children: "Trends" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { children: editingExpense ? (_jsxs(Box, { children: [_jsx("h3", { children: "Edit Expense" }), _jsx(ExpenseForm, { onSuccess: handleExpenseCreated, customCategories: customCategories, expense: editingExpense, onCancel: () => setEditingExpense(null) })] })) : (_jsx(ExpenseForm, { onSuccess: handleExpenseCreated, customCategories: customCategories })) }), _jsx(TabPanel, { children: !loading && (_jsxs(Box, { children: [_jsx(HStack, { mb: 4, children: _jsx(Button, { colorScheme: "green", onClick: handleCSVExport, children: "Export to CSV" }) }), expenses.length === 0 ? (_jsx("p", { children: "No expenses yet" })) : (expenses.map((expense) => (_jsx(ExpenseItem, { expense: expense, onDelete: () => loadData(), onEdit: (expense) => {
                                                setActiveTab(0);
                                                setEditingExpense(expense);
                                            } }, expense._id))))] })) }), _jsx(TabPanel, { children: !loading && _jsx(SpendingChart, { data: spending }) }), _jsx(TabPanel, { children: !loading && _jsx(BudgetManager, { customCategories: customCategories }) }), _jsx(TabPanel, { children: !loading && trends.length > 0 ? (_jsx(TrendsChart, { data: trends })) : (_jsx("p", { children: "No trend data available. Add expenses to see trends." })) })] })] })] }));
};
