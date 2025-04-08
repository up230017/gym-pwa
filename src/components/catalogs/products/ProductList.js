import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProducts, deleteProduct } from '../../../services/products';

const ProductList = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getProducts(); 
      setUsers(result);
    } catch (error) {
      console.error('Error fetching products:', error); 
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAdd = () => {
    router.push('/catalogs/products/add'); 
  };

  const handleEdit = (id) => {
    router.push(`/catalogs/products/edit/${id}`); 
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container> 
        <Typography>
            ProductList 
        </Typography>
    </Container>
  );
};

export default ProductList;