import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, CardMedia, Button, Container, Grid, CardActions } from '@mui/material';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const CategoriaPagina = () => {
  const router = useRouter();
  const { id } = router.query;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = '';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('No se encontró un token de autenticación.');

        const categoryResponse = await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/categories/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!categoryResponse.ok) throw new Error(`Error al cargar la categoría: ${categoryResponse.statusText}`);

        const categoryData = await categoryResponse.json();
        setCategory(categoryData);

        const productsResponse = await fetch(`https://gladiator-gym-api-5b2f674fd27d.herokuapp.com/api/products`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!productsResponse.ok) throw new Error(`Error al cargar los productos: ${productsResponse.statusText}`);

        const productsData = await productsResponse.json();
        setProducts(shuffleArray(productsData.filter(product => product.category === id)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryAndProducts();
    }
  }, [id]);

  const handleViewMore = (productId) => {
    router.push(`/producto?id=${productId}`);
  };

  return (
    <>
      {/* Contenedor de las olas */}
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
  
      {/* Contenido principal */}
      <Container
        maxWidth="md"
        style={{
          textAlign: 'center',
          marginTop: '20px',
          position: 'relative',
          zIndex: 1, // Asegúrate de que el contenido esté encima de las olas
        }}
      >
        {loading ? (
          <Typography variant="h5">Cargando categoría...</Typography>
        ) : error ? (
          <Typography variant="h5" color="error">{error}</Typography>
        ) : category ? (
          <>
            <Typography variant="h2" fontWeight="bold">{category.name}</Typography>
            <Typography variant="h5" color="black" marginBottom="20px">{category.description}</Typography>
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Card
                    sx={{
                      padding: 2,
                      textAlign: 'center',
                      borderRadius: '12px',
                      boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0px 8px 16px rgba(0,0,0,0.25)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.image || 'https://via.placeholder.com/180'}
                      alt={product.name}
                      sx={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        marginBottom: 2,
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#777',
                          fontStyle: 'italic',
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.details || 'Sin descripción disponible'}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#DC143CF1' }}>
                        Precio: ${product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#DC143CF1',
                          color: '#fff',
                          borderRadius: '20px',
                          paddingX: 3,
                          '&:hover': { backgroundColor: '#B22222' },
                        }}
                        onClick={() => router.push(`/producto?id=${product._id}`)}
                      >
                        Ver más
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Typography variant="h5">Categoría no encontrada</Typography>
        )}
      </Container>
    </>
  );
};

export default CategoriaPagina;