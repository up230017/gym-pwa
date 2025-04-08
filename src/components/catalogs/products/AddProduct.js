import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { postProduct } from '../../../services/products';
import Loading from '../../common/Loading';

const AddProduct = () => { 
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
      formData.name &&
      formData.amount && 
      formData.status && 
      formData.category; 
    setIsFormValid(isValid);
  }, [formData]);

const validateForm = () => {
    if (!formData.name || 
        !formData.amount || 
        !formData.status || 
        !formData.category) { 
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
      const response = await postProduct({ ...formData });
      if (response !== '' || response !== null) {
        setError('');
        router.push('/catalogs/product');
      } else {
        setError('Error adding product.'); 
      }
    } catch (error) {
      setError('Error adding product: ' + error.message); 
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
          <Typography>
            Add Product 
          </Typography>
        </Box>
      }
    </Container>
  );
};

export default AddProduct;