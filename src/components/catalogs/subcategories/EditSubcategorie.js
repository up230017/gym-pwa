import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import {getCategorieById, putCategorie} from '../../../services/categories';
import Loading from '../../common/Loading';

const EditSubcategorie = () => {
  const router = useRouter();
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
      const data = await getCategorieById(id);
      setFormData(data);
    } catch (error) {
      setError('Error fetching subcategorie data: ' + error.message); 
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await putSubcategorie({ ...formData });
      if (response === 200) {
        setError('');
        router.push('/catalogs/subcategorie');
      } else {
        setError('Error updating user.');
      }
    } catch (error) {
      setError('Error updating subcategorie: ' + error.message);
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
                    Edit subcategorie
                </Typography>
            </Box>
        }
    </Container>
  );
};

export default EditSubcategorie;