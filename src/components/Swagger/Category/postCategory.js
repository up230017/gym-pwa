import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import Cookies from 'js-cookie'; // Importar js-cookie para manejar cookies

const PostCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Leer el token desde las cookies
      const token = Cookies.get('token'); // Nombre de la cookie es "token"

      if (!token) {
        setMessage('No se encontró un token de autenticación. Por favor inicia sesión.');
        return;
      }

      const response = await fetch('https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Usa el token leído de las cookies
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Si el backend devuelve un mensaje indicando duplicado, lo mostramos
        if (errorData.message === 'Ya existe una categoría con este nombre.') {
          setMessage('No se pudo crear la categoría porque ya existe una con este nombre.');
        } else {
          throw new Error(errorData.message || 'Error al crear la categoría');
        }
        return;
      }

      const data = await response.json();
      setMessage(`Categoría creada exitosamente: ${data.name}`);
      setName('');
      setDescription('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Container
      sx={{
        padding: 4,
        backgroundColor: '#f7f9fc',
        borderRadius: '16px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 'bold',
          color: '#4CAF50',
          textTransform: 'uppercase',
          marginBottom: 3,
        }}
      >
        💪 Crear Nueva Categoría
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginBottom: 2,
          }}
        >
          <TextField
            label="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          sx={{ fontWeight: 'bold', fontSize: '1rem' }}
        >
          Crear
        </Button>
      </form>
      {message && (
        <Typography align="center" sx={{ marginTop: 2 }} color="textSecondary">
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default PostCategory;