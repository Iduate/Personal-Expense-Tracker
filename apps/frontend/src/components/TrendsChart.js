import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Heading } from '@chakra-ui/react';
export const TrendsChart = ({ data }) => {
    if (data.length === 0) {
        return (_jsx(Box, { p: 8, textAlign: "center", bg: "gray.50", rounded: "md", children: _jsx(Heading, { size: "md", color: "gray.500", children: "No trend data yet" }) }));
    }
    return (_jsxs(Box, { bg: "white", p: 6, rounded: "lg", shadow: "md", children: [_jsx(Heading, { size: "md", mb: 4, children: "Spending Trends" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, { formatter: (value) => `$${value.toFixed(2)}` }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "total", stroke: "#8884d8", name: "Monthly Spending" })] }) })] }));
};
