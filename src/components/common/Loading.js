import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loading = () => {
  const [message, setMessage] = useState('Cargando...');

  useEffect(() => {
    const messages = [
      'Preparando pesas para tu entrenamiento...',
      'Conectando con la zona fitness...',
      'Ajustando las mancuernas...',
      '¡Tu tienda está casi lista!',
    ];

    let index = 0;
    const interval = setInterval(() => {
      setMessage(messages[index]);
      index = (index + 1) % messages.length; // Cicla los mensajes
    }, 2000);

    return () => clearInterval(interval); // Limpia el intervalo
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#F5F5F5', // Fondo gris claro
      }}
    >
      <CircularProgress sx={{ color: '#DC143C' }} /> {/* Color rojo carmesí */}
      <Typography variant="h6" sx={{ mt: 2, color: '#333' }}>
        {message} {/* Muestra el mensaje dinámico */}
      </Typography>
    </Box>
  );
};

export default Loading;