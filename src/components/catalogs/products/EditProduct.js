import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { getProductById, putProduct } from '../../../services/products'; 
import Loading from '../../common/Loading';

const EditProduct = () => { 
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
      const data = await getProductById(id);
      setFormData(data);
    } catch (error) {
      setError('Error fetching product data: ' + error.message);
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

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await putProduct({ ...formData }); 
      if (response === 200) {
        setError('');
        router.push('/catalogs/products');
      } else {
        setError('Error updating product.'); 
      }
    } catch (error) {
      setError('Error updating product: ' + error.message);
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
            Edit Product
          </Typography>
        </Box>
      }
    </Container>
  );
};

export default EditProduct;