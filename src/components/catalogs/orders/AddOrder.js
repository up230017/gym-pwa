import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { postOrder } from '../../../services/orders';
import Loading from '../../common/Loading';

const AddOrder = () => {
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
      formData.total_amount && 
      formData.purchase_date;
    setIsFormValid(isValid);
  }, [formData]);

const validateForm = () => {
    if (!formData.total_amount) { 
      setError('El monto total es obligatorio.');
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
      const response = await postOrder({ ...formData });
      if (response !== '' || response !== null) {
        setError('');
        router.push('/catalogs/orders');
      } else {
        setError('Error adding order.');
      }
    } catch (error) {
      setError('Error adding order: ' + error.message);
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
          <Typography>Add Order</Typography>
        </Box>
      }
    </Container>
  );
};

export default AddOrder;