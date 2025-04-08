import React from 'react';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const Dashboard = () => {
  const router = useRouter();

  const sections = [
    { name: 'Categoría', path: '/swagger/categorias' },
    { name: 'Producto', path: '/swagger/productos' },
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 4,
        backgroundColor: '#f7f9fc',
        borderRadius: '16px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 'bold',
          color: '#000',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        Panel de Administración - Gym Manager
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.name}>
            <Box
              sx={{
                border: '2px solid #FF5722',
                borderRadius: '12px',
                padding: 4,
                textAlign: 'center',
                backgroundColor: '#fff',
                transition: '0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: '#D32F2F',
                }}
              >
                {section.name}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#D32F2F',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  padding: '12px 24px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#B71C1C',
                  },
                }}
                onClick={() => handleNavigation(section.path)}
              >
                Gestionar {section.name}
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Icono grande y centrado del gimnasio */}
      <Box sx={{ textAlign: 'center', marginTop: 6 }}>
        <FitnessCenterIcon sx={{ fontSize: 100, color: '#D32F2F' }} />
      </Box>
    </Container>
  );
};

export default Dashboard;