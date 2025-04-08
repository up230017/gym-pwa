import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Divider, IconButton, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Ícono de eliminar
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'; // Ícono relacionado con el gimnasio
import Cookies from 'js-cookie';

const MisCompras = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('No se encontró un token de autenticación.');

        const response = await fetch('http://localhost:3005/api/ticket', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los tickets.');
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleDelete = async (ticketId) => {
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No se encontró un token de autenticación.');

      const response = await fetch(`http://localhost:3005/api/ticket/${ticketId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el ticket.');
      }

      // Actualizar la lista de tickets después de eliminar
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== ticketId));
      alert('Compra eliminada exitosamente.');
    } catch (err) {
      alert(`Error al eliminar la compra: ${err.message}`);
    }
  };

  return (
    <Container
      sx={{
        padding: 4,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        marginTop: 4,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ color: '#D32F2F' }}>
        <FitnessCenterIcon sx={{ fontSize: 40, verticalAlign: 'middle', marginRight: 1, color: '#D32F2F' }} />
        Mis Compras
      </Typography>
      {loading ? (
        <Typography align="center" variant="h6">
          Cargando tus compras...
        </Typography>
      ) : error ? (
        <Typography align="center" color="error" variant="h6">
          {error}
        </Typography>
      ) : tickets.length === 0 ? (
        <Typography align="center" variant="h6">
          No tienes compras registradas.
        </Typography>
      ) : (
        <Box sx={{ marginTop: 2 }}>
          {tickets.map((ticket) => (
            <Card key={ticket._id} sx={{ marginBottom: 2, padding: 2, backgroundColor: '#FFEBEE', border: '1px solid #D32F2F' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#D32F2F' }}>
                      Compra ID: {ticket.idCompra || 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#C62828' }}>
                      Monto: ${ticket.montoDeDinero.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#C62828' }}>
                      Fecha de emisión: {new Date(ticket.fechaDeEmision).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ marginTop: 1, color: '#B71C1C' }}>
                      Detalles:
                    </Typography>
                    <List dense>
                      {ticket.detalles.split('\n').map((detalle, index) => (
                        <ListItem key={index} sx={{ padding: 0 }}>
                          <ListItemText primary={`• ${detalle}`} sx={{ color: '#B71C1C' }} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  {/* Botón para eliminar */}
                  <IconButton
                    onClick={() => handleDelete(ticket._id)}
                    sx={{ color: '#D32F2F' }}
                    aria-label="Eliminar compra"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
              <Divider sx={{ backgroundColor: '#D32F2F' }} />
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MisCompras;