import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Heading } from '@chakra-ui/react';

interface TrendData {
  month: string;
  total: number;
}

interface TrendsChartProps {
  data: TrendData[];
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ data }: TrendsChartProps) => {
  if (data.length === 0) {
    return (
      <Box p={8} textAlign="center" bg="gray.50" rounded="md">
        <Heading size="md" color="gray.500">No trend data yet</Heading>
      </Box>
    );
  }

  return (
    <Box bg="white" p={6} rounded="lg" shadow="md">
      <Heading size="md" mb={4}>Spending Trends</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" name="Monthly Spending" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
