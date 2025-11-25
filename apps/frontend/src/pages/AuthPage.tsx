import React, { useState } from 'react';
import { Box, Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { AuthForm } from '../components';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }: AuthPageProps) => {
  const [tabIndex, setTabIndex] = React.useState(0);
  return (
    <Container maxW="500px" centerContent minH="100vh" display="flex" flexDirection="column" justifyContent="center">
      <Heading mb={8}>Expense Tracker</Heading>
      <Tabs isFitted variant="enclosed" width="full" index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab>Login</Tab>
          <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AuthForm isLogin onSuccess={onAuthSuccess} onToggleMode={() => setTabIndex(1)} />
          </TabPanel>
          <TabPanel>
            <AuthForm onSuccess={onAuthSuccess} onToggleMode={() => setTabIndex(0)} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};
