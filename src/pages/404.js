import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';

function Custom404() {
  const router = useRouter();

  const handleGoBack = () => {
    if (router.asPath !== '/') {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          404 - Página no encontrada 🏋️‍♂️
        </Typography>
        <Typography variant="body1" gutterBottom>
          Parece que esta ruta tomó el camino equivocado, ¡como un mal ejercicio! 💡 Regresa a la rutina correcta.
        </Typography>
        <Button variant="contained" color="success" onClick={handleGoBack} sx={{ mt: 2 }}>
          Regresar a la tienda virtual
        </Button>
      </Box>
    </Container>
  );
}

export default Custom404;