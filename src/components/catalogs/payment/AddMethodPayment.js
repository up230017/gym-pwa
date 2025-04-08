import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { postMethodPayment } from '../../../services/MethodPayments';
import Loading from '../../common/Loading';

const AddMethodPayment = () => { 
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
      const isValid = formData.userId !== null 
      && formData.number_account !== null
      && formData.type_payment !== undefined
      && formData.supplier !== null
      && formData.expiration_date !== null
      && formData.registration_date !== null
      setIsFormValid(isValid);
    }, [formData]);
  
    const validateForm = () => {
      if (!formData.userId === null
          || !formData.number_account === null 
          || !formData.type_payment === undefined 
          || !formData.supplier === null 
          || !formData.expiration_date === null 
          || !formData.registration_date === null) { 
        setError('All fields are required.');
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
      const response = await postMethodPayment({ ...formData });
      if (response !== '' || response !== null) {
        setError('');
        router.push('/catalogs/MethodPayment');
      } else {
        setError('Error adding MethodPayment.');
      }
    } catch (error) {
      setError('Error adding MethodPayment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container maxWidth="sm">
        {loading ? <Loading/> :
            <Box sx={{mt: 8}}>
                <Typography>
                    add MethodPayments
                </Typography>
            </Box>
        }
    </Container>
  );
};

export default AddMethodPayment;