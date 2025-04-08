import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Select, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';

const PostMethodPayment = () => {
  const [numberAccount, setNumberAccount] = useState('');
  const [typePayment, setTypePayment] = useState('');
  const [supplier, setSupplier] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No se encontró un token de autenticación.');

      const response = await fetch('https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/method_payment', {
        method: 'POST',
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
        throw new Error(errorData.message || 'Error al crear el método de pago.');
      }

      setMessage('Método de pago creado exitosamente.');
      setNumberAccount('');
      setTypePayment('');
      setSupplier('');
      setExpirationDate('');
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
        💳 Crear Nuevo Método de Pago
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}>
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
        <Button type="submit" variant="contained" color="success" fullWidth sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
          Crear Método de Pago
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

export default PostMethodPayment;