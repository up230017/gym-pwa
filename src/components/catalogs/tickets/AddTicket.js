import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { postTicket } from '../../../services/tickets';
import Loading from '../../common/Loading';

const AddTicket = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const isValid =
      formData.montoDeDinero && 
      formData.fechaDeEmision && 
      formData.detalles; 
    setIsFormValid(isValid);
  }, [formData]);

const validateForm = () => {
    if (!formData.montoDeDinero || 
        !formData.fechaDeEmision || 
        !formData.detalles) { 
      setError('Todos los campos requeridos deben estar completos.');
      return false;
    }
    setError('');
    return true;
};

  const handleAdd = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await postTicket({ ...formData });
      if (response !== '' || response !== null) {
        setError('');
        router.push('/catalogs/tickets');
      } else {
        setError('Error adding ticket.');
      }
    } catch (error) {
      setError('Error adding ticket: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container maxWidth="sm">
      {loading ? <Loading /> :
        <Box sx={{ mt: 8 }}>
          <Typography>Add Ticket</Typography>
        </Box>
      }
    </Container>
  );
};

export default AddTicket;