import { Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const GenericPageLoading = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton height={100} />
      <Skeleton height={100} />
      <Skeleton height={100} />
    </Box>
  );
};

export default GenericPageLoading;
