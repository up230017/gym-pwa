import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { getTicketById, putTicket } from '../../../services/tickets';
import Loading from '../../common/Loading';

const EditTicket = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] =useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTicketById(id);
      setFormData(data);
    } catch (error) {
      setError('Error fetching ticket data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await putTicket({ ...formData });
      if (response === 200) {
        setError('');
        router.push('/catalogs/tickets');
      } else {
        setError('Error updating ticket.');
      }
    } catch (error) {
      setError('Error updating ticket: ' + error.message);
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
          <Typography>Edit Ticket</Typography>
        </Box>
      }
    </Container>
  );
};

export default EditTicket;