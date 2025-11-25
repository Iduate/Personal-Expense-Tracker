import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { validateEmail } from '@shared/constants';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface AuthFormProps {
  onSuccess: () => void;
  isLogin?: boolean;
  onToggleMode?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, isLogin = false, onToggleMode }: AuthFormProps) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const setAuth = useAuthStore((state: any) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast({ title: 'Invalid email', status: 'error' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', status: 'error' });
      return;
    }

    setLoading(true);

    try {
      const authFn = isLogin ? apiClient.auth.login : apiClient.auth.signup;
      const result = await authFn(email, password);
      setAuth(result.token, result.user._id, result.user.email);
      toast({ title: isLogin ? 'Logged in successfully' : 'Account created', status: 'success' });
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" p={8} bg="white" rounded="lg" shadow="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>

          <Text fontSize="sm" textAlign="center">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <ChakraLink color="blue.500" onClick={onToggleMode} cursor="pointer">
              {isLogin ? 'Sign Up' : 'Login'}
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};
