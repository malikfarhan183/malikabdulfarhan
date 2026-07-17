import React from 'react';
import {CircularProgress, Box} from '@mui/material';
import AppShell from './components/AppShell';
import {useAuth} from './features/auth/AuthProvider';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';

const App: React.FC = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return (
      <Box sx={{display: 'grid', minHeight: '100vh', placeItems: 'center'}}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
};

export default App;
