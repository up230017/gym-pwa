import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {getSubcategories, deleteCategorie} from '../../../services/categories';

const SubcategorieList = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getSubcategories();
      setUsers(result);
    } catch (error) {
      console.error('Error fetching Subcategories:', error); 
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubcategorie(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting Subcategorie:', error);
    }
  };

  const handleAdd = () => {
    router.push('/catalogs/Subcategories/add');
  };

  const handleEdit = (id) => {
    router.push(`/catalogs/Subcategories/edit/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Container> 
        <Typography>
            SubcategorieList
        </Typography>
    </Container>
  );
};

export default SubcategorieList;