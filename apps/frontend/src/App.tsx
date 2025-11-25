import React, { useEffect } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { useAuthStore } from './store/authStore';
import { Dashboard, AuthPage } from './pages';

export const App: React.FC = () => {
  const token = useAuthStore((state: any) => state.token);
  const clearAuth = useAuthStore((state: any) => state.clearAuth);
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

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        )}
      </Box>
    </ChakraProvider>
  );
};
