import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Box, Heading } from '@chakra-ui/react';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
export const SpendingChart = ({ data }) => {
    if (data.length === 0) {
        return (_jsx(Box, { p: 8, textAlign: "center", bg: "gray.50", rounded: "md", children: _jsx(Heading, { size: "md", color: "gray.500", children: "No spending data yet" }) }));
    }
    return (_jsxs(Box, { bg: "white", p: 6, rounded: "lg", shadow: "md", children: [_jsx(Heading, { size: "md", mb: 4, children: "Spending by Category" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, cx: "50%", cy: "50%", labelLine: false, label: ({ category, total }) => `${category}: $${total.toFixed(2)}`, outerRadius: 80, fill: "#8884d8", dataKey: "total", children: data.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(RechartsTooltip, { formatter: (value) => `$${value.toFixed(2)}` }), _jsx(Legend, {})] }) })] }));
};
