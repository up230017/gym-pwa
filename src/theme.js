import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#26336C',
    },
    secondary: {
      main: '#FFEB3B', // Color amarillo
    },
  },
  typography: {
    fontFamily: 'SourceCodeProLight, Arial',
    h1: {
      fontSize: '2rem',
    },
    body1: {
      fontSize: '18px',
    },
  },
});

export default theme;
