import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { register } from '../../services/auth';

const RegisterForm = ({ handleError }) => {
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!name) validationErrors.name = 'User Name is required';
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Email is not valid';
    }
    if (!password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register(name, email, password);
      router.push('/auth/login');
    } catch (error) {
      handleError(error.message || 'Registration failed');
    }
  };


  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ¡Regístrate en GymPro! 🏋️‍♂️
        </Typography>
        <Typography variant="body1" gutterBottom>
          Únete a nuestra comunidad fitness y lleva tus entrenamientos al siguiente nivel.
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Nombre de Usuario"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setname(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ backgroundColor: '#F5F5F5', borderRadius: 1 }}
          />
          <TextField
            label="Correo Electrónico"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ backgroundColor: '#F5F5F5', borderRadius: 1 }}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ backgroundColor: '#F5F5F5', borderRadius: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#DC143CF1',
              color: '#FFF',
              '&:hover': { backgroundColor: '#DC143C' },
              mt: 2,
              py: 1.5,
            }}
          >
            Regístrate
          </Button>
        </form>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" style={{ color: '#DC143C', textDecoration: 'none' }}>
              Inicia sesión aquí
            </Link>.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterForm;