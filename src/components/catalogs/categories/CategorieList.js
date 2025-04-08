import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {getCategories, deleteCategorie} from '../../../services/categories';

const CategorieList = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getCategories();
      setUsers(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategorie(id);//cambiar
      fetchData();
    } catch (error) {
      console.error('Error deleting categorie:', error);
    }
  };

  const handleAdd = () => {
    router.push('/catalogs/categories/add');
  };

  const handleEdit = (id) => {
    router.push(`/catalogs/categories/edit/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (//cambiar
    <Container> 
        <Typography>
            CategorieList
        </Typography>
    </Container>
  );
};

export default CategorieList;