import React from 'react';
import ReactDOM from 'react-dom';
import {CssBaseline} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import {QueryClient, QueryClientProvider} from 'react-query';
import App from './App';
import {AuthProvider} from './features/auth/AuthProvider';
import theme from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
