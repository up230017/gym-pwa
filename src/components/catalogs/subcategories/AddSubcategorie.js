import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { postCategorie } from '../../../services/categories';
import Loading from '../../common/Loading';

const AddCSubcategorie = () => {
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
    const isValid = formData.name && formData.parentId !== null && formData.description;
    setIsFormValid(isValid);
  }, [formData]);

  const validateForm = () => {
    if (!formData.name || !formData.parentId === null || !formData.description) {
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
        router.push('/catalogs/Subcategorie');
      } else {
        setError('Error adding Subcategorie.');
      }
    } catch (error) {
      setError('Error adding Subcategorie: ' + error.message);
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
                    add Subcategories
                </Typography>
            </Box>
        }
    </Container>
  );
};

export default AddSubcategorie;