import React from 'react';
import { Box, Button, Flex, HStack, Text, useToast } from '@chakra-ui/react';
import type { Expense } from '@shared/types';
import { formatCurrency } from '@shared/constants';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: () => void;
  onEdit: (expense: Expense) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete, onEdit }: ExpenseItemProps) => {
  const [deleting, setDeleting] = React.useState(false);
  const toast = useToast();
  const token = useAuthStore((state: any) => state.token)!;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiClient.expenses.delete(token, expense._id!);
      toast({ title: 'Expense deleted', status: 'success' });
      onDelete();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box p={4} bg="gray.50" rounded="md" borderLeft="4px" borderColor="blue.500">
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">{expense.description}</Text>
        <Text fontSize="lg" fontWeight="bold" color="green.600">
          {formatCurrency(expense.amount)}
        </Text>
      </Flex>
      <HStack spacing={4}>
        <Text fontSize="sm" color="gray.600">
          Category: <strong>{expense.category}</strong>
        </Text>
        <Text fontSize="sm" color="gray.600">
          Date: <strong>{new Date(expense.date).toLocaleDateString()}</strong>
        </Text>
      </HStack>
      <HStack spacing={2} mt={3}>
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          onClick={() => onEdit(expense)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          variant="outline"
          isLoading={deleting}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </HStack>
    </Box>
  );
};
