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

const MethodPaymentPanel = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No se encontró un token de autenticación. Por favor inicia sesión.');
        }

        const response = await fetch('http://localhost:3005/api/method_payment', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error al cargar los métodos de pago: ${response.statusText}`);
        }

        const data = await response.json();
        setMethods(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este método de pago? 💳');
    if (!confirmDelete) return;

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No se encontró un token de autenticación. Por favor inicia sesión.');
      }

      const response = await fetch(`http://localhost:3005/api/method_payment/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el método de pago: ${response.statusText}`);
      }

      setMethods((prev) => prev.filter((method) => method._id !== id));
      alert('Método de pago eliminado exitosamente.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (id) => {
    localStorage.setItem('methodPaymentId', id);
    router.push('/MetodoPago/editar'); // Modificación aquí ✅
  };

  const handleAddMethod = () => {
    router.push('/MetodoPago/subir'); // Modificación aquí ✅
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
        onClick={handleAddMethod}
      >
        + Agregar Método de Pago
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
        💳 Panel de Métodos de Pago
      </Typography>
      {loading ? (
        <Typography align="center">Cargando métodos de pago...</Typography>
      ) : error ? (
        <Typography align="center" color="error">
          {error}
        </Typography>
      ) : methods.length === 0 ? (
        <Typography align="center" color="textSecondary">
          No existen métodos de pago disponibles.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#4CAF50' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Número de cuenta</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tipo de pago</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Proveedor</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fecha de expiración</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {methods.map((method) => (
                <TableRow key={method._id}>
                  <TableCell>{method.number_account}</TableCell>
                  <TableCell>{method.type_payment}</TableCell>
                  <TableCell>{method.supplier}</TableCell>
                  <TableCell>{new Date(method.expiration_date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <IconButton color="warning" onClick={() => handleEdit(method._id)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(method._id)}>
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

export default MethodPaymentPanel;