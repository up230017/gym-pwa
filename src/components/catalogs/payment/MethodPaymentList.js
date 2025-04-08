import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {getMethodPayments, deleteMethodPayment} from '../../../services/MethodPayments';

const MethodPaymentList = () => { 
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getMethodPayments();
      setUsers(result);
    } catch (error) {
      console.error('Error fetching MethodPayments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMethodPayment(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting MethodPayment:', error);
    }
  };

  const handleAdd = () => {
    router.push('/catalogs/MethodPayments/add');
  };

  const handleEdit = (id) => {
    router.push(`/catalogs/MethodPayments/edit/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container> 
        <Typography>
            MethodPaymentList 
        </Typography>
    </Container>
  );
};

export default MethodPaymentList; 