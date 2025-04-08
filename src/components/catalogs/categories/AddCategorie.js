import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { postCategorie } from '../../../services/categories'; 
import Loading from '../../common/Loading';

const AddCategorie = () => {
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
    const isValid = formData.name && formData.parentId === null && formData.description;
    setIsFormValid(isValid);
  }, [formData]);

  const validateForm = () => {
    if (!formData.name || !formData.parentId !== null || !formData.description) { 
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
      const response = await postCategorie({ ...formData });
      if (response !== '' || response !== null) {
        setError('');
        router.push('/catalogs/categorie');
      } else {
        setError('Error adding categorie.');
      }
    } catch (error) {
      setError('Error adding categorie: ' + error.message);
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
                    add categories
                </Typography>
            </Box>
        }
    </Container>
  );
};

export default AddCategorie;