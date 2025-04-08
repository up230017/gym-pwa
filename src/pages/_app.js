// pages/_app.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from '../theme';
import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import { GlobalProvider } from '../context/GlobalContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext'; // Importamos el CartProvider

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <GlobalProvider>
          <CartProvider> {/* Envolvemos aquí para que todas las partes de la app tengan acceso al carrito */}
            <Box
              sx={{
                minHeight: '100vh',    // Altura mínima igual a la altura del viewport
                width: '100vw',        // Ancho total del viewport
                backgroundColor:'transparent', // Fondo blanco
                m: 0,                  // Sin margen
                p: 0,                  // Sin padding
                overflowX: 'hidden',   // Oculta scroll horizontal
              }}
            >
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Box>
          </CartProvider>
        </GlobalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default MyApp;
