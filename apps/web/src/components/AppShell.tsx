import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {useAuth} from '../features/auth/AuthProvider';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({children}) => {
  const {logout, user} = useAuth();

  return (
    <Box sx={{minHeight: '100vh', bgcolor: 'background.default'}}>
      <AppBar position="sticky" elevation={0} sx={{bgcolor: '#101615'}}>
        <Toolbar sx={{gap: 2}}>
          <Box sx={{flexGrow: 1}}>
            <Typography variant="h6" fontWeight={900}>
              ClientOps Studio
            </Typography>
            <Typography variant="caption" sx={{color: 'rgba(255,255,255,0.66)'}}>
              Malik Farhan full-stack showcase
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{width: 34, height: 34, bgcolor: 'primary.main'}}>
              {user?.name.slice(0, 1)}
            </Avatar>
            <Box sx={{display: {xs: 'none', sm: 'block'}}}>
              <Typography variant="body2" fontWeight={800}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{color: 'rgba(255,255,255,0.66)'}}>
                {user?.role}
              </Typography>
            </Box>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{border: '1px solid rgba(255,255,255,0.18)'}}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{py: {xs: 3, md: 5}}}>
        {children}
      </Container>
    </Box>
  );
};

export default AppShell;
