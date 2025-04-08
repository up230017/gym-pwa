import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Select, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';

const PutProduct = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [manufacture, setManufacture] = useState('');
  const [image, setImage] = useState('');
  const [shape, setShape] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState(''); // Nuevo estado para el precio
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  // Recuperar el ID del producto desde localStorage
  useEffect(() => {
    const productId = localStorage.getItem('productId');
    if (productId) {
      setId(productId);
    }

    // Cargar las categorías disponibles desde el backend
    const fetchCategories = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('No se encontró un token de autenticación.');

        const response = await fetch('http://localhost:3005/api/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Error al cargar las categorías.');

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setMessage(`Error al cargar categorías: ${error.message}`);
      }
    };

    fetchCategories();
  }, []);

  // Cargar datos del producto desde el backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('No se encontró un token de autenticación.');

        const response = await fetch(`http://localhost:3005/api/products/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Error al cargar el producto.');

        const data = await response.json();
        setName(data.name || '');
        setBrand(data.brand || '');
        setManufacture(data.manufacture || '');
        setImage(data.image || '');
        setShape(data.shape || '');
        setAmount(data.amount || '');
        setPrice(data.price || ''); // Cargar el precio
        setCategory(data.category || '');
        setDetails(data.details || '');
      } catch (error) {
        setMessage(`Error al cargar producto: ${error.message}`);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setMessage('La cantidad no puede ser negativa.');
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice < 1) {
      setMessage('El precio debe ser mayor o igual a 1.');
      return;
    }

    // Calcular el status automáticamente
    const status = parsedAmount === 0 ? 'Inactivo' : 'Activo';

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No se encontró un token de autenticación.');

      const response = await fetch(`http://localhost:3005/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          brand,
          manufacture,
          image,
          shape,
          amount: parsedAmount,
          price: parsedPrice, // Enviar el precio
          status, // Enviar el status calculado
          details,
          category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el producto.');
      }

      const data = await response.json();
      setMessage(`Producto actualizado exitosamente: ${data.name}`);

      // Volver a cargar datos del producto actualizado
      const updatedResponse = await fetch(`http://localhost:3005/api/products/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!updatedResponse.ok) throw new Error('Error al cargar el producto actualizado.');

      const updatedData = await updatedResponse.json();
      setPrice(updatedData.price); // Actualizar el precio en el estado
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Container
      sx={{
        padding: 4,
        backgroundColor: '#f7f9fc',
        borderRadius: '16px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 'bold',
          color: '#FF9800',
          textTransform: 'uppercase',
          marginBottom: 3,
        }}
      >
        📋 Editar Producto
      </Typography>
      <form onSubmit={handleUpdate}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginBottom: 3,
          }}
        >
          <TextField
            label="ID del Producto"
            value={id}
            fullWidth
            disabled
          />
          <TextField
            label="Nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Marca del producto"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            fullWidth
          />
          <TextField
            label="Fabricante"
            value={manufacture}
            onChange={(e) => setManufacture(e.target.value)}
            fullWidth
          />
          <TextField
            label="Imagen (URL)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            fullWidth
          />
          <TextField
            label="Forma del producto"
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            fullWidth
          />
          <TextField
            label="Cantidad"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Precio"
            type="number"
            value={price} // Campo de precio
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            required
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona una Categoría
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Detalles del producto"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            fullWidth
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="warning"
          fullWidth
          sx={{ fontWeight: 'bold', fontSize: '1rem' }}
        >
          Actualizar
        </Button>
      </form>
      {message && (
        <Typography
          align="center"
          sx={{ marginTop: 2 }}
          color={message.includes('Error') ? 'error' : 'success'}
        >
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default PutProduct;