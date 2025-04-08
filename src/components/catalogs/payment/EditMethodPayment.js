import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import {getMethodPaymentById, putMethodPayment} from '../../../services/payment';
import Loading from '../../common/Loading';

const EditMetodPayment = () => {
  const { id } = router.query;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect (()=>{
    if(id){
        fetchData();
    }
  },[id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getMetodPaymentById(id);// cambiar
      setFormData(data);
    } catch (error) {
      setError('Error fetching MetodPayment data: ' + error.message); //cambiar
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await putMetodPayment({ ...formData });
      if (response === 200) {
        setError('');
        router.push('/catalogs/payments');
      } else {
        setError('Error updating MetodPayment.');
      }
    } catch (error) {
      setError('Error updating MetodPayment: ' + error.message);
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
                    Edit MetodPayments
                </Typography>
            </Box>
        }
    </Container>
  );
};

export default EditMetodPayment;