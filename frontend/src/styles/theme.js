import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#81bae0', 
    },
    secondary: {
      main: '#30638E', // Lapis Lazuli
    },
    background: {
      default: '#F7F7FF', // Ghost White
    },
    text: {
      primary: '#141414', // Night
    },
    success: {
      main: '#63A088', // Zomp
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
