import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#126d67',
      dark: '#0b4f4a',
    },
    secondary: {
      main: '#c78a2f',
    },
    background: {
      default: '#f7faf8',
      paper: '#ffffff',
    },
    text: {
      primary: '#17201d',
      secondary: '#65716c',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 900,
      letterSpacing: 0,
    },
    h2: {
      fontWeight: 900,
      letterSpacing: 0,
    },
    h3: {
      fontWeight: 900,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 800,
      textTransform: 'none',
    },
  },
});

export default theme;
