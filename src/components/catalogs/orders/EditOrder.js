import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { getOrderById, putOrder } from '../../../services/orders';
import Loading from '../../common/Loading';

const EditOrder = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(id);
      setFormData(data);
    } catch (error) {
      setError('Error fetching order data: ' + error.message);
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

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await putOrder({ ...formData });
      if (response === 200) {
        setError('');
        router.push('/catalogs/orders');
      } else {
        setError('Error updating order.');
      }
    } catch (error) {
      setError('Error updating order: ' + error.message);
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
          <Typography>Edit Order</Typography>
        </Box>
      }
    </Container>
  );
};

export default EditOrder;