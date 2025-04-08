import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import Cookies from 'js-cookie'; // Importar js-cookie para manejar cookies

const PutCategory = () => {
  const [id, setId] = useState('');
  const [newName, setNewName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Recupera el ID desde localStorage al cargar la página
    const categoryId = localStorage.getItem('categoryId');
    if (categoryId) {
      setId(categoryId);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Leer el token desde las cookies
      const token = Cookies.get('token'); // Obtener el token desde las cookies
      if (!token) {
        setMessage('No se encontró un token de autenticación. Por favor inicia sesión.');
        return;
      }

      // Realizar la solicitud PUT para actualizar la categoría
      const response = await fetch(`http://localhost:3005/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token en los headers
        },
        body: JSON.stringify({ name: newName, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la categoría');
      }

      const data = await response.json();
      setMessage(`Categoría actualizada exitosamente: ${data.name}`);
      setNewName(''); // Limpiar el campo de nuevo nombre
      setDescription(''); // Limpiar el campo de descripción
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
          color: '#FF9800',
          textTransform: 'uppercase',
          marginBottom: 3,
        }}
      >
        📋 Editar Categoría
      </Typography>
      <form onSubmit={handleUpdate}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginBottom: 3,
          }}
        >
          <TextField
            label="ID de la Categoría"
            value={id}
            fullWidth
            disabled // Deshabilitado ya que el ID se obtiene automáticamente
          />
          <TextField
            label="Nuevo Nombre"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Nueva Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="warning"
          fullWidth
          sx={{ fontWeight: 'bold', fontSize: '1rem' }}
        >
          Actualizar
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

export default PutCategory;    