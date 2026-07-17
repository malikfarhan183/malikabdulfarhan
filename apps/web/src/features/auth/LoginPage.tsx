import React from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useAuth} from './AuthProvider';

const LoginPage: React.FC = () => {
  const {login} = useAuth();
  const [email, setEmail] = React.useState('malik@example.com');
  const [password, setPassword] = React.useState('Portfolio@2026');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError('');
      setIsSubmitting(true);

      try {
        await login(email, password);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Login failed.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, login, password]
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background:
          'linear-gradient(110deg, rgba(18,109,103,0.92), rgba(23,32,29,0.78)), url(/assets/full-stack-workstation.png)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={12} sx={{p: {xs: 3, md: 4}, borderRadius: 2}}>
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <LockOutlinedIcon color="primary" />
                <Typography variant="overline" color="secondary.main" fontWeight={900}>
                  JWT Protected Demo
                </Typography>
              </Stack>
              <Typography variant="h3" sx={{mt: 1}}>
                ClientOps Studio
              </Typography>
              <Typography color="text.secondary" sx={{mt: 1.5}}>
                A focused full-stack demo for React, MUI, Express APIs, and SQL Server-ready architecture.
              </Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
              <TextField
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                fullWidth
              />
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
