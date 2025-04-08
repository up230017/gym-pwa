import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const CategoryPanel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No se encontró un token de autenticación. Por favor inicia sesión.');
        }

        const response = await fetch('http://localhost:3005/api/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error al cargar las categorías: ${response.statusText}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar esta categoría? 💪');
    if (!confirmDelete) return;

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No se encontró un token de autenticación. Por favor inicia sesión.');
      }

      const response = await fetch(`http://localhost:3005/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar la categoría: ${response.statusText}`);
      }

      setCategories((prev) => prev.filter((category) => category._id !== id));
      alert('Categoría eliminada exitosamente.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (id) => {
    localStorage.setItem('categoryId', id); // Guardar el ID en localStorage
    router.push('/categorias/editar'); // Redirigir a editar.js
  };

  const handleAddCategory = () => {
    router.push('/categorias/subir');
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 4,
        backgroundColor: '#f0f4f8',
        borderRadius: '16px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
        position: 'relative',
      }}
    >
      <Button
        variant="contained"
        color="success"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontWeight: 'bold',
          textTransform: 'none',
        }}
        onClick={handleAddCategory}
      >
        + Agregar Categoría
      </Button>
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
        🏋️‍♀️ Panel de Categorías
      </Typography>
      {loading ? (
        <Typography align="center">Cargando categorías...</Typography>
      ) : error ? (
        <Typography align="center" color="error">
          {error}
        </Typography>
      ) : categories.length === 0 ? (
        <Typography align="center" color="textSecondary">
          No existen categorías disponibles.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#4CAF50' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || 'Sin descripción'}</TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        color="warning"
                        onClick={() => handleEdit(category._id)} // Llama a handleEdit
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(category._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default CategoryPanel;