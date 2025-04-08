import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material'; // Íconos para editar y eliminar
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const ProductPanel = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Obtener los productos y categorías desde el backend
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No se encontró un token de autenticación. Por favor inicia sesión.');
        }

        // Obtener productos
        const productResponse = await fetch('http://localhost:3005/api/products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!productResponse.ok) {
          throw new Error(`Error al cargar los productos: ${productResponse.statusText}`);
        }

        const productData = await productResponse.json();

        // Obtener categorías
        const categoryResponse = await fetch('http://localhost:3005/api/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!categoryResponse.ok) {
          throw new Error(`Error al cargar las categorías: ${categoryResponse.statusText}`);
        }

        const categoryData = await categoryResponse.json();

        setProducts(productData);
        setCategories(categoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  // Obtener el nombre de la categoría correspondiente al ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : 'Sin categoría';
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este producto? 💪');
    if (!confirmDelete) return;

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No se encontró un token de autenticación. Por favor inicia sesión.');
      }

      const response = await fetch(`http://localhost:3005/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el producto: ${response.statusText}`);
      }

      setProducts((prev) => prev.filter((product) => product._id !== id));
      alert('Producto eliminado exitosamente.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (id) => {
    localStorage.setItem('productId', id); // Guardar el ID en localStorage
    router.push('/productos/editar'); // Redirigir al formulario de edición
  };

  const handleAddProduct = () => {
    router.push('/productos/subir'); // Redirigir al formulario de creación
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 4,
        backgroundColor: '#f0f4f8',
        borderRadius: '16px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
        position: 'relative',
      }}
    >
      <Button
        variant="contained"
        color="success"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontWeight: 'bold',
          textTransform: 'none',
        }}
        onClick={handleAddProduct}
      >
        + Agregar Producto
      </Button>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 'bold',
          color: '#4CAF50',
          textTransform: 'uppercase',
          marginBottom: 3,
        }}
      >
        🛒 Panel de Productos
      </Typography>
      {loading ? (
        <Typography align="center">Cargando productos...</Typography>
      ) : error ? (
        <Typography align="center" color="error">
          {error}
        </Typography>
      ) : products.length === 0 ? (
        <Typography align="center" color="textSecondary">
          No existen productos disponibles.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#4CAF50' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Marca</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fabricante</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Imagen</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Forma</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Cantidad</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Precio</TableCell> {/* Columna de precio */}
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Detalles</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Categoría</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.brand || 'Generica'}</TableCell>
                  <TableCell>{product.manufacture || 'Anonimos'}</TableCell>
                  <TableCell>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                    ) : (
                      'Sin imagen'
                    )}
                  </TableCell>
                  <TableCell>{product.shape || 'Sin forma'}</TableCell>
                  <TableCell>{product.amount}</TableCell>
                  <TableCell>
                    {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : 'Sin precio'} {/* Manejo seguro */}
                  </TableCell>
                  <TableCell>{new Date(product.date).toLocaleDateString()}</TableCell>
                  <TableCell>{product.details || 'Sin detalles'}</TableCell>
                  <TableCell>{getCategoryName(product.category)}</TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        color="warning"
                        onClick={() => handleEdit(product._id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ProductPanel;