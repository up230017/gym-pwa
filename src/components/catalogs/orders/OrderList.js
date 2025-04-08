import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getOrders, deleteOrder } from '../../../services/order';

const OrderList = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getOrders();
      setOrders(result);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleAdd = () => {
    router.push('/catalogs/orders/add');
  };

  const handleEdit = (id) => {
    router.push(`/catalogs/orders/edit/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container>
      <Typography>OrderList</Typography>
    </Container>
  );
};

export default OrderList;