import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { useAuthStore } from './store/authStore';
import { Dashboard, AuthPage } from './pages';
export const App = () => {
    const token = useAuthStore((state) => state.token);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const [isAuthenticated, setIsAuthenticated] = React.useState(!!token);
    useEffect(() => {
        setIsAuthenticated(!!token);
    }, [token]);
    const handleLogout = () => {
        clearAuth();
        setIsAuthenticated(false);
    };
    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
    };
    return (_jsx(ChakraProvider, { children: _jsx(Box, { minH: "100vh", bg: "gray.50", children: isAuthenticated ? (_jsx(Dashboard, { onLogout: handleLogout })) : (_jsx(AuthPage, { onAuthSuccess: handleAuthSuccess })) }) }));
};
