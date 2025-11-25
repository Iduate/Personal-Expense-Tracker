import React, { useState } from 'react';
import { Box, Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { AuthForm } from '../components';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }: AuthPageProps) => {
  return (
    <Container maxW="500px" centerContent minH="100vh" display="flex" flexDirection="column" justifyContent="center">
      <Heading mb={8}>Expense Tracker</Heading>
      <Tabs isFitted variant="enclosed" width="full">
        <TabList>
          <Tab>Login</Tab>
          <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AuthForm isLogin onSuccess={onAuthSuccess} />
          </TabPanel>
          <TabPanel>
            <AuthForm onSuccess={onAuthSuccess} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};
