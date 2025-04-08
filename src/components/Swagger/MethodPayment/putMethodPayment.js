import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Select, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';

const PutMethodPayment = () => {
  const [id, setId] = useState('');
  const [numberAccount, setNumberAccount] = useState('');
  const [typePayment, setTypePayment] = useState('');
  const [supplier, setSupplier] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [message, setMessage] = useState('');

  // Recuperar el ID del método de pago desde localStorage
  useEffect(() => {
    const methodPaymentId = localStorage.getItem('methodPaymentId');
    if (methodPaymentId) {
      setId(methodPaymentId);
    }

    // Cargar datos del método de pago desde el backend
    const fetchMethodPayment = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('No se encontró un token de autenticación.');

        const response = await fetch(`http://localhost:3005/api/method_payment/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Error al cargar el método de pago.');

        const data = await response.json();
        setNumberAccount(data.number_account || '');
        setTypePayment(data.type_payment || '');
        setSupplier(data.supplier || '');
        setExpirationDate(data.expiration_date || '');
      } catch (error) {
        setMessage(`Error al cargar método de pago: ${error.message}`);
      }
    };

    if (id) fetchMethodPayment();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No se encontró un token de autenticación.');

      const response = await fetch(`http://localhost:3005/api/method_payment/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number_account: numberAccount,
          type_payment: typePayment,
          supplier,
          expiration_date: expirationDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el método de pago.');
      }

      const data = await response.json();
      setMessage(`Método de pago actualizado exitosamente: ${data.number_account}`);
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
        💳 Editar Método de Pago
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
          <TextField label="ID del Método de Pago" value={id} fullWidth disabled />
          <TextField label="Número de Cuenta" value={numberAccount} onChange={(e) => setNumberAccount(e.target.value)} fullWidth required />
          <Select value={typePayment} onChange={(e) => setTypePayment(e.target.value)} fullWidth displayEmpty required>
            <MenuItem value="" disabled>Selecciona un Tipo de Pago</MenuItem>
            <MenuItem value="tarjeta de credito">Tarjeta de Crédito</MenuItem>
            <MenuItem value="transferencia bancaria">Transferencia Bancaria</MenuItem>
            <MenuItem value="pago electronico">Pago Electrónico</MenuItem>
          </Select>
          <TextField label="Proveedor" value={supplier} onChange={(e) => setSupplier(e.target.value)} fullWidth required />
          <TextField label="Fecha de Expiración" type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} fullWidth required />
        </Box>
        <Button type="submit" variant="contained" color="warning" fullWidth sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
          Actualizar Método de Pago
        </Button>
      </form>
      {message && (
        <Typography align="center" sx={{ marginTop: 2 }} color={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default PutMethodPayment;