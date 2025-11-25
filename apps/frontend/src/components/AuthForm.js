import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast, Text, Link as ChakraLink, } from '@chakra-ui/react';
import { validateEmail } from '@shared/constants';
import { apiClient } from '../lib/api';
import { useAuthStore } from '../store/authStore';
export const AuthForm = ({ onSuccess, isLogin = false, onToggleMode }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const toast = useToast();
    const setAuth = useAuthStore((state) => state.setAuth);
    const handleSubmit = async (e) => {
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
        }
        catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error' });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Box, { maxW: "400px", mx: "auto", p: 8, bg: "white", rounded: "lg", shadow: "md", children: _jsx("form", { onSubmit: handleSubmit, children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Email" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Password" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter your password" })] }), _jsx(Button, { type: "submit", colorScheme: "blue", width: "full", isLoading: loading, children: isLogin ? 'Login' : 'Sign Up' }), _jsxs(Text, { fontSize: "sm", textAlign: "center", children: [isLogin ? "Don't have an account? " : 'Already have an account? ', _jsx(ChakraLink, { color: "blue.500", onClick: onToggleMode, cursor: "pointer", children: isLogin ? 'Sign Up' : 'Login' })] })] }) }) }));
};
