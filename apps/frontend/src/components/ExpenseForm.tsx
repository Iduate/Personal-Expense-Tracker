import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Select,
} from '@chakra-ui/react';
import type { Expense } from '@shared/types';
import { PREDEFINED_CATEGORIES } from '@shared/constants';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface ExpenseFormProps {
  onSuccess: () => void;
  customCategories?: string[];
  expense?: Expense;
  onCancel?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSuccess,
  customCategories = [],
  expense,
  onCancel,
}: ExpenseFormProps) => {
  const [formData, setFormData] = React.useState({
    amount: expense?.amount?.toString() || '',
    description: expense?.description || '',
    category: expense?.category || '',
    date: expense?.date || new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const token = useAuthStore((state: any) => state.token)!;

  const allCategories = [...PREDEFINED_CATEGORIES, ...customCategories];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.amount || !formData.description || !formData.category || !formData.date) {
      toast({ title: 'Please fill all fields', status: 'error' });
      return;
    }

    setLoading(true);

    try {
      if (expense) {
        await apiClient.expenses.update(token, expense._id!, {
          amount: parseFloat(formData.amount),
          description: formData.description,
          category: formData.category,
          date: formData.date,
        });
      } else {
        await apiClient.expenses.create(token, {
          amount: parseFloat(formData.amount),
          description: formData.description,
          category: formData.category,
          date: formData.date,
        });
      }
      toast({ title: expense ? 'Expense updated' : 'Expense created', status: 'success' });
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6} bg="white" rounded="lg" shadow="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e: any) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              value={formData.description}
              onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What did you spend on?"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              value={formData.category}
              onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select a category</option>
              {allCategories.map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={formData.date}
              onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
            />
          </FormControl>

          <Box display="flex" gap={2} width="full">
            <Button
              type="submit"
              colorScheme="green"
              flex={1}
              isLoading={loading}
            >
              {expense ? 'Update' : 'Add'} Expense
            </Button>
            {onCancel && (
              <Button variant="outline" flex={1} onClick={onCancel}>
                Cancel
              </Button>
            )}
          </Box>
        </VStack>
      </form>
    </Box>
  );
};
