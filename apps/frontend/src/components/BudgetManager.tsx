import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Badge,
} from '@chakra-ui/react';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface Budget {
  category: string;
  limit: number;
  alert_threshold: number;
}

interface BudgetManagerProps {
  customCategories: string[];
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({ customCategories }: BudgetManagerProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [threshold, setThreshold] = useState('80');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const token = useAuthStore((state: any) => state.token)!;

  const allCategories = [...['Food', 'Transport', 'Entertainment', 'Utilities', 'Health'], ...customCategories];

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await apiClient.budgets.list(token);
      setBudgets(data);
    } catch (error: any) {
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
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (cat: string) => {
    try {
      await apiClient.budgets.delete(token, cat);
      toast({ title: 'Budget deleted', status: 'success' });
      await loadBudgets();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box bg="white" p={6} rounded="lg" shadow="md">
        <FormLabel fontWeight="bold" mb={4}>Set Budget Limit</FormLabel>
        <VStack spacing={3}>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #cbd5e0',
              }}
            >
              <option value="">Select category</option>
              {allCategories.map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </FormControl>

          <FormControl>
            <FormLabel>Budget Limit ($)</FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={limit}
              onChange={(e: any) => setLimit(e.target.value)}
              placeholder="100.00"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Alert Threshold (%)</FormLabel>
            <Input
              type="number"
              min="0"
              max="100"
              value={threshold}
              onChange={(e: any) => setThreshold(e.target.value)}
              placeholder="80"
            />
          </FormControl>

          <Button colorScheme="blue" width="full" onClick={handleAddBudget} isLoading={loading}>
            Set Budget
          </Button>
        </VStack>
      </Box>

      {budgets.length > 0 && (
        <Box bg="white" p={6} rounded="lg" shadow="md" overflowX="auto">
          <FormLabel fontWeight="bold" mb={4}>Active Budgets</FormLabel>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Limit</Th>
                <Th>Threshold</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {budgets.map((budget: Budget) => (
                <Tr key={budget.category}>
                  <Td>{budget.category}</Td>
                  <Td>${budget.limit.toFixed(2)}</Td>
                  <Td>{budget.alert_threshold}%</Td>
                  <Td>
                    <Button size="sm" colorScheme="red" onClick={() => handleDeleteBudget(budget.category)}>
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </VStack>
  );
};
