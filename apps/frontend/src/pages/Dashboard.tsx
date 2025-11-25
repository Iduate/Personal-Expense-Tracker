import React, { useState } from 'react';
import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Button, HStack } from '@chakra-ui/react';
import { AuthForm, ExpenseForm, ExpenseItem, SpendingChart, TrendsChart, BudgetManager } from '../components';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../lib/api';
import type { Expense } from '@shared/types';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }: DashboardProps) => {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [customCategories, setCustomCategories] = React.useState<string[]>([]);
  const [spending, setSpending] = React.useState<Array<{ category: string; total: number }>>([]);
  const [trends, setTrends] = React.useState<Array<{ month: string; total: number }>>([]);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(0);
  const token = useAuthStore((state: any) => state.token)!;
  const email = useAuthStore((state: any) => state.email);

  const loadData = React.useCallback(async () => {
    try {
      const [expensesData, categoriesData, spendingData, trendsData] = await Promise.all([
        apiClient.expenses.list(token),
        apiClient.categories.list(token),
        apiClient.expenses.getSpendingByCategory(token),
        apiClient.trends.getMonthlyTrends(token),
      ]);
      setExpenses(expensesData);
      setCustomCategories(categoriesData.custom.map((c: any) => c.name));
      setSpending(spendingData);
      setTrends(trendsData);
    } catch (error: any) {
      console.error('Failed to load data:', error);
    } finally {
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
    } catch (error: any) {
      console.error('Failed to export CSV:', error);
    }
  };

  return (
    <Container maxW="1200px" py={8}>
      <HStack justify="space-between" mb={8}>
        <Box>
          <h1>Expense Tracker</h1>
          <p>Welcome, {email}</p>
        </Box>
        <Button colorScheme="red" onClick={onLogout}>
          Logout
        </Button>
      </HStack>

      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>Add Expense</Tab>
          <Tab>Expenses</Tab>
          <Tab>Analytics</Tab>
          <Tab>Budgets</Tab>
          <Tab>Trends</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {editingExpense ? (
              <Box>
                <h3>Edit Expense</h3>
                <ExpenseForm
                  onSuccess={handleExpenseCreated}
                  customCategories={customCategories}
                  expense={editingExpense}
                  onCancel={() => setEditingExpense(null)}
                />
              </Box>
            ) : (
              <ExpenseForm
                onSuccess={handleExpenseCreated}
                customCategories={customCategories}
              />
            )}
          </TabPanel>

          <TabPanel>
            {!loading && (
              <Box>
                <HStack mb={4}>
                  <Button colorScheme="green" onClick={handleCSVExport}>
                    Export to CSV
                  </Button>
                </HStack>
                {expenses.length === 0 ? (
                  <p>No expenses yet</p>
                ) : (
                  expenses.map((expense: Expense) => (
                    <ExpenseItem
                      key={expense._id}
                      expense={expense}
                      onDelete={() => loadData()}
                      onEdit={(expense) => {
                        setActiveTab(0);
                        setEditingExpense(expense);
                      }}
                    />
                  ))
                )}
              </Box>
            )}
          </TabPanel>

          <TabPanel>
            {!loading && <SpendingChart data={spending} />}
          </TabPanel>

          <TabPanel>
            {!loading && <BudgetManager customCategories={customCategories} />}
          </TabPanel>

          <TabPanel>
            {!loading && trends.length > 0 ? (
              <TrendsChart data={trends} />
            ) : (
              <p>No trend data available. Add expenses to see trends.</p>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};
