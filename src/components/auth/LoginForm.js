import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { login as loginUser } from '../../services/auth';
import { AuthContext } from '../../context/AuthContext';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);

      // Guardar el token en las cookies
      Cookies.set('token', data.token, { expires: 7, path: '/' });

      // Guardar el refresh token en las cookies
      Cookies.set('refreshToken', data.refreshToken, { expires: 7, path: '/' });

      // Guardar el _id del usuario en las cookies
      Cookies.set('userId', data.userId, { expires: 7, path: '/' });

      // Autenticar al usuario en el contexto
      login(data.token);

      // Redirigir al usuario después del inicio de sesión exitoso
      router.push('/homepage');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ¡Bienvenido a Gradiator GYM! 🏋️‍♂️
        </Typography>
        <Typography variant="body1" gutterBottom>
          Inicia sesión para acceder a tu rutina personalizada y gestionar tus productos de fitness.
        </Typography>
        {error && (
          <Typography variant="body1" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            label="Correo Electrónico"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: '#F5F5F5', borderRadius: 1 }}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Inicia sesión
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;