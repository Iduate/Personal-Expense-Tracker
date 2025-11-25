import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { AuthForm } from '../components';
export const AuthPage = ({ onAuthSuccess }) => {
    const [tabIndex, setTabIndex] = React.useState(0);
    return (_jsxs(Container, { maxW: "500px", centerContent: true, minH: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", children: [_jsx(Heading, { mb: 8, children: "Expense Tracker" }), _jsxs(Tabs, { isFitted: true, variant: "enclosed", width: "full", index: tabIndex, onChange: setTabIndex, children: [_jsxs(TabList, { children: [_jsx(Tab, { children: "Login" }), _jsx(Tab, { children: "Sign Up" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { children: _jsx(AuthForm, { isLogin: true, onSuccess: onAuthSuccess, onToggleMode: () => setTabIndex(1) }) }), _jsx(TabPanel, { children: _jsx(AuthForm, { onSuccess: onAuthSuccess, onToggleMode: () => setTabIndex(0) }) })] })] })] }));
};
