
import React from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';

const CatalogCard = ({ catalog, onClick }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h6" component="h2">
        {catalog.name}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => onClick(catalog.path)}
      >
        View {catalog.name}
      </Button>
    </Paper>
  </Grid>
);

export default CatalogCard;