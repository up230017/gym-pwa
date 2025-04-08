// components/layout/Layout.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from './NavBar';
import Footer from './Footer';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  const [error, setError] = useState(null);
  const router = useRouter();

  // Ocultar NavBar en las páginas de autenticación
  const isAuthPage =
    router.pathname === '/auth/login' || router.pathname === '/auth/register';

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        width: '100vw', // Se asegura que ocupe todo el ancho del viewport
      }}
    >
      {!isAuthPage && <NavBar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          m: 0,
          p: 0,
          mt: '8px', // Reducir espacio entre NavBar y contenido
          width: '100%',
        }}
      >
        {error && (
          <Box sx={{ mb: 2 }}>
            <p style={{ color: 'red' }}>{error}</p>
          </Box>
        )}
        {React.cloneElement(children, { handleError })}
      </Box>
      <Footer />
    </div>
  );
};

export default Layout;