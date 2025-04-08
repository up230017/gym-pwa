import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        borderTop: '2px solid black', // Línea negra en la parte superior
        backgroundColor: '#000', // Fondo negro para mayor contraste
      }}
    >
      <Typography
        variant="body2"
        align="center"
        sx={{ color: '#FFF' }} // Letras blancas
      >
        &copy; {new Date().getFullYear()} GradiatorGym E-commerce
      </Typography>
    </Box>
  );
};

export default Footer;
