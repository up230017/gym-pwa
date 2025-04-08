import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTickets, deleteTicket } from '../../../services/tickets';

const TicketList = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getTickets();
      setTickets(result);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const handleAdd = () => {
    router.push('/catalogs/tickets/add');
  };

  const handleEdit = (id) => {
    router.push(`/catalogs/tickets/edit/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container>
      <Typography>TicketList</Typography>
    </Container>
  );
};

export default TicketList;