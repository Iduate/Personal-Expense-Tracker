import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Heading } from '@chakra-ui/react';
import type { SpendingByCategory } from '@shared/types';

interface SpendingChartProps {
  data: SpendingByCategory[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }: SpendingChartProps) => {
  if (data.length === 0) {
    return (
      <Box p={8} textAlign="center" bg="gray.50" rounded="md">
        <Heading size="md" color="gray.500">No spending data yet</Heading>
      </Box>
    );
  }

  return (
    <Box bg="white" p={6} rounded="lg" shadow="md">
      <Heading size="md" mb={4}>Spending by Category</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, total }: any) => `${category}: $${total.toFixed(2)}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="total"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};
