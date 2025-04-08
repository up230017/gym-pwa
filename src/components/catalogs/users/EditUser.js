import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import { getUserById, updateUser } from '../../../services/users';
import Loading from '../../common/Loading';


const EditUser = () => {
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
      const data = await getUserById(id);
      setFormData(data);
    } catch (error) {
      setError('Error fetching user data: ' + error.message);
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
      formData.name && // validar nombre
      formData.email && // validar correo electrónico
      formData.password; // validar contraseña
    setIsFormValid(isValid);
  }, [formData]);

const validateForm = () => {
    if (!formData.name || 
        !formData.email || 
        !formData.password) { // validar los campos requeridos
      setError('Nombre, correo electrónico y contraseña son obligatorios.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format.');
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
      const updated = new Date().toISOString();
      const updatedBy = user ? user.idUser : 'unknown';
      const response = await updateUser({ ...formData });
      if (response === 200) {
        setError('');
        router.push('/catalogs/users');
      } else {
        setError('Error updating user.');
      }
    } catch (error) {
      setError('Error updating user: ' + error.message);
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
          <Typography variant="h4" component="h1" gutterBottom>
            Edit User
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Username"
            name="userName"
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ maxLength: 100 }}
            value={formData.userName || ''}
            onChange={handleChange}
            required
          />
          <TextField
            label="Display Name"
            name="userDisplayName"
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ maxLength: 100 }}
            value={formData.userDisplayName || ''}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ maxLength: 100 }}
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
          <Button variant="contained" color="primary" onClick={handleUpdate} disabled={!isFormValid || loading} sx={{ mt: 2 }}>
            Update
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleBack} sx={{ mt: 2, ml: 2 }}>
            Back
          </Button>
        </Box>
      }
    </Container>
  );
};

export default EditUser;