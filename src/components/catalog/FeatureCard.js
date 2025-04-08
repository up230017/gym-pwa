import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: '#f0f0f0',
}));

function FeatureCard({ title, description }) {
  return (
    <StyledPaper elevation={1}>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      <Typography variant="body2">
        {description}
      </Typography>
    </StyledPaper>
  );
}

export default FeatureCard;