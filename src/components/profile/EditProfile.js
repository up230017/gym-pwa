import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Alert, Card, Box, Select, MenuItem } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

// Ruta corregida para evitar errores de importación
import { getUserById } from '../../services/users';

const gymImages = [
  "https://as2.ftcdn.net/jpg/02/09/36/25/1000_F_209362507_6ui13Mths70VHAOcZLcWBzM0JV3Grvvn.jpg",
  "https://i.pinimg.com/1200x/1e/cd/d5/1ecdd5186159231776c13df05c795f2e.jpg",
  "https://img.freepik.com/premium-photo/man-with-barbell-that-says-man-back_1270569-3505.jpg",
  "https://img.freepik.com/foto-gratis/equipo-gimnasio-3d_23-2151114123.jpg",
  "https://i.pinimg.com/1200x/ca/90/ca/ca90caac1875a4927fe890e20ef2f8ae.jpg"
];

const sliderSettings = {
  vertical: true,
  verticalSwiping: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 2000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const EditProfile = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    direction: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) {
      setError('User ID is missing.');
      return;
    }

    setLoading(true);
    try {
      const data = await getUserById(user.id);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        direction: data.direction || '',
        role: data.role || 'user',
      });
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

  const validateForm = () => {
    if (!formData.name || !formData.email) {
      setError('Name and email are required.');
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format.');
      return false;
    }

    if (formData.password && formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    setError('');
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      const token = Cookies.get('token');
      const userId = Cookies.get('userId');
      if (!token || !userId) throw new Error('No authentication token found.');
  
      const response = await fetch(`http://localhost:3005/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email, // Se agregó el email
          password: formData.password, // Se agregó la contraseña
          direction: formData.direction,
          role: formData.role,
        }),
      });
  
      if (!response.ok) throw new Error('Error updating user.');
  
      alert('User updated successfully.');
  
      // Eliminar el token y redirigir al login después de la actualización
      Cookies.remove('token');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error updating user:', error.message);
      setError(error.message);
    }
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>

      {/* Carrusel Izquierdo */}
      <Box sx={{ width: '25%', height: '500px' }}>
        <Slider {...sliderSettings}>
          {gymImages.map((image, index) => (
            <Box key={index}>
              <img src={image} alt={`Gym ${index + 1}`} style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '8px' }} />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Formulario en el centro */}
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: 5, width: '50%', textAlign: 'center', backgroundColor: '#fff', color: '#000' }}>
        <FitnessCenterIcon sx={{ fontSize: 50, color: '#DC143CF1' }} />
        <Typography variant="h4" component="h1" gutterBottom color="#DC143CF1">
          Edit Profile
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Name" name="name" variant="outlined" fullWidth margin="normal" value={formData.name} onChange={handleChange} required />
        <TextField label="Email" name="email" variant="outlined" fullWidth margin="normal" value={formData.email} onChange={handleChange} required />
        <TextField label="Address" name="direction" variant="outlined" fullWidth margin="normal" value={formData.direction} onChange={handleChange} />
        <TextField label="New Password" name="password" type="password" variant="outlined" fullWidth margin="normal" value={formData.password} onChange={handleChange} />
        <TextField label="Confirm Password" type="password" variant="outlined" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <Select label="Role" name="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} fullWidth sx={{ mt: 2 }}>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>

        <Button variant="contained" color="warning" onClick={handleUpdate} disabled={loading} sx={{ mt: 2, width: '100%', fontWeight: 'bold' }}>
          Update & Logout
        </Button>
        <Button variant="contained" color="error" onClick={handleBack} sx={{ mt: 2, width: '100%', fontWeight: 'bold' }}>
          Back
        </Button>
      </Card>

      {/* Carrusel Derecho */}
      <Box sx={{ width: '25%', height: '500px' }}>
        <Slider {...sliderSettings}>
          {gymImages.map((image, index) => (
            <Box key={index}>
              <img src={image} alt={`Gym ${index + 1}`} style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '8px' }} />
            </Box>
          ))}
        </Slider>
      </Box>
      
    </Container>
  );
};

export default EditProfile;