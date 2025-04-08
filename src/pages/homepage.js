// pages/homepage.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Box
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Cookies from 'js-cookie';
import '../styles/diagonalLines.css';


// Importación de imágenes locales
const EdgarImage = "https://i.pinimg.com/originals/58/ff/e7/58ffe72b95350c2b3440659d5f9631ce.png";
const CesarImage = "https://png.pngtree.com/png-clipart/20230914/original/pngtree-chess-piece-with-king-on-the-mountain-background-vector-png-image_11090904.png";
const JessicaImage = "https://www.mondosonoro.com/wp-content/uploads/2021/04/Justin-Bieber-Peaches.jpg";
const IsaiasImage = "https://preview.redd.it/cuando-te-toca-tirar-paro-v0-7uz08onc52nc1.jpeg?width=720&format=pjpg&auto=webp&s=b4c536f69a462369d0c230be8a00b30be1dd1512";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const carouselItems = [
    {
      image: 'https://www.fitnesstech.es/cdn/shop/files/untitled2_1920x1080.png?v=1738055732',
      title: 'Pesas de Alta Calidad',
    },
    {
      image: 'https://images.unsplash.com/photo-1672344048213-76b6e77304bd?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Mancuernas Profesionales',
    },
    {
      image: 'https://img.freepik.com/fotos-premium/varias-piezas-equipos-gimnasia-estan-dispuestas-superficie-textura-oscura-incluidas-bandas-resistencia-pesas-pesas-que-sugieren-entorno-entrenamiento-activo_497837-53338.jpg',
      title: 'Bandas Elásticas Versátiles',
    },
    {
      image: 'https://media.istockphoto.com/id/1400781187/es/foto/una-mujer-est%C3%A1-haciendo-un-batido-de-prote%C3%ADnas-despu%C3%A9s-de-un-entrenamiento-en-el-gimnasio-ella.jpg?s=612x612&w=0&k=20&c=S32FLtNOo_xJY_WK67CC_i4-Gw-8R6nemGOImZ6WkUQ=',
      title: 'Suplementos Certficados',
    },
    {
      image: 'https://img.freepik.com/foto-gratis/equipo-gimnasio-3d_23-2151114152.jpg',
      title: 'Maquinas Adecuadas',
    },
  ];

  const creators = [
    {
      name: 'Edgar Márquez Montes',
      matricula: 'UP220275',
      image: EdgarImage,
    },
    {
      name: 'Cesar Sergio Consuelo Cervantes',
      matricula: 'UP230017',
      image: CesarImage,
    },
    {
      name: 'Jessica Anahi Posada Arce',
      matricula: 'UP210567',
      image: JessicaImage,
    },
    {
      name: 'Isaias Moreno Luna',
      matricula: 'UP210644',
      image: IsaiasImage,
    },
  ];

  // Función para mezclar productos aleatoriamente
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  // Obtención de productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get('token');
        if (!token)
          throw new Error('No se encontró un token de autenticación. Por favor, inicia sesión.');
        const response = await fetch('http://localhost:3005/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok)
          throw new Error(`Error al cargar los productos: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setProducts(shuffleArray(data));
      } catch (err) {
        console.error('Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Obtención de categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get('token');
        if (!token)
          throw new Error('No se encontró un token de autenticación. Por favor, inicia sesión.');
        const response = await fetch('http://localhost:3005/api/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok)
          throw new Error(`Error al cargar las categorías: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <div className="diagonal-lines-container">
      </div>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          width: '98vw',
          margin: 1,
          padding: 1,
        }}
      >

        {/* En lugar de un Box, usamos un div simple que no aplique padding */}
        <div style={{ marginTop: '4rem', padding: '20px' }}>
          <Typography
            variant="h2" // Se aumentó el tamaño
            sx={{
              color: '#D32F2F',
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: 4, // Mayor espaciado para un efecto más fuerte
              fontFamily: '"Cinzel", serif', // Fuente inspirada en estilo gladiador
            }}
          >
            Bienvenido a Gradiator
          </Typography>


          <Typography
            variant="h3" // Aumentado para mayor impacto
            component="h2"
            sx={{
              color: '#111', // Un tono más oscuro para mayor fuerza visual
              textAlign: 'left',
              paddingTop: '20px',
              marginBottom: '20px',
              fontWeight: 'bold',
              letterSpacing: 3, // Mayor separación para un efecto más imponente
              textTransform: 'uppercase', // Refuerza la presencia del mensaje
              fontFamily: '"Cinzel", serif', // Mantiene el estilo gladiador y clásico
              textAlign: 'center',
            }}
          >
            Descubre la Fuerza de Nuestros Productos
          </Typography>
          <Carousel animation="slide" interval={3000}>
            {carouselItems.map((item, index) => (
              <div key={index} style={{ margin: 0, padding: 0 }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={item.image}
                  alt={item.title}
                  sx={{ borderRadius: '12px', boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    marginTop: '16px',
                    color: '#333',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {item.title}
                </Typography>
              </div>
            ))}
          </Carousel>

          <Typography
            variant="h4" // Tamaño aumentado para mayor impacto
            sx={{
              color: '#111', // Tono más oscuro para mayor fuerza visual
              textAlign: 'center', // Centramos para dar equilibrio y presencia
              fontWeight: 'bold',
              marginBottom: 3,
              letterSpacing: 2, // Separación para mayor intensidad
              textTransform: 'uppercase',
              fontFamily: '"Cinzel", serif', // Mantiene el estilo imponente
            }}
          >
            ⚔️ Equipo de Batalla para Guerreros del Gimnasio ⚔️
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: '#222', // Refuerzo en el tono para impacto
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 3,
              fontFamily: '"Cinzel", serif',
            }}
          >
            Domina la arena con artículos de élite diseñados para forjar fuerza, resistencia y poder absoluto.
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: '#D32F2F',
              textAlign: 'center', // Centramos para mayor presencia
              fontWeight: 'bold',
              marginBottom: 3,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontFamily: '"Cinzel", serif',
            }}
          >
            🛡️ Domina la Arena: Forja Tu Cuerpo, Forja Tu Leyenda 🛡️
          </Typography>

          <Box
            sx={{
              backgroundColor: '#f7f7f7',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0px 5px 10px rgba(0,0,0,0.3)',
              border: '2px solid #D32F2F', // Refuerzo visual para mayor impacto
            }}
          >
            <ul style={{ listStyleType: 'none', padding: 0, fontSize: '18px', fontWeight: 'bold', fontFamily: '"Cinzel", serif' }}>
              <li>🔥 La hidratación es tu escudo. Mantente firme en la batalla.</li>
              <li>🏋️‍♂️ Entrena con el equipo correcto. Un guerrero nunca pelea sin su armadura.</li>
              <li>🍖 Alimenta tu fuerza. Un gladiador forja su poder desde adentro.</li>
              <li>💪 Respeta el descanso. Solo los insensatos ignoran la recuperación.</li>
              <li>🧠 Perfecciona la técnica. En la arena, la precisión decide la victoria.</li>
              <li>⏳ Nunca olvides calentar y enfriar. La resistencia es el arma del invicto.</li>
            </ul>
          </Box>
          <Typography
            variant="h3" // Aumentado para mayor impacto
            sx={{
              marginTop: '2rem',
              color: '#111', // Oscurecido para mayor presencia visual
              fontWeight: 'bold',
              letterSpacing: 3, // Expande la presencia del mensaje
              textTransform: 'uppercase',
              fontFamily: '"Cinzel", serif', // Mantiene el estilo gladiador
            }}
          >
            Explora Nuestras Categorías
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category._id}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#DC143CF1',
                    color: '#fff',
                    fontSize: '1.1rem',
                    padding: '12px 22px',
                    fontWeight: 'bold',
                    width: '100%', // Hace que todas sean del mismo tamaño
                    '&:hover': { backgroundColor: '#B22222' },
                  }}
                  onClick={() => router.push(`/categoria?id=${category._id}`)}
                >
                  {category.name}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="h3"
            sx={{
              marginTop: '2rem',
              color: '#D32F2F', // Rojo intenso para resaltar el mensaje
              fontWeight: 'bold',
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontFamily: '"Cinzel", serif',
            }}
          >
            Nuestros Productos Destacados
          </Typography>

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


          <Typography
            variant="h3" // Tamaño aumentado para mayor impacto
            sx={{
              marginTop: '2rem',
              color: '#000000FF', // Rojo intenso para mayor presencia
              textAlign: 'center',
              fontWeight: 'bold',
              letterSpacing: 3, // Espaciado para mayor contundencia
              textTransform: 'uppercase',
              fontFamily: '"Cinzel", serif', // Estilo inspirado en la antigüedad y la fuerza
            }}
          >
            ⚔️ Forjadores de esta Arena ⚔️
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {creators.map((creator, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{
                  textAlign: 'center',
                  padding: 2,
                  borderRadius: '8px',
                  boxShadow: '0px 5px 10px rgba(0,0,0,0.3)',
                  border: '2px solid #D32F2F', // Bordes rojos para mayor impacto visual
                }}>
                  <CardMedia component="img" height="140" image={creator.image} alt={creator.name} />
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: '"Oswald", sans-serif' }}>
                      {creator.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', fontFamily: '"Roboto", sans-serif' }}>
                      Matrícula: {creator.matricula}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Container>
    </>
  );
};
export default HomePage;