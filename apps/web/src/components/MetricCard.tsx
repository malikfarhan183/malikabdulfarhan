import React from 'react';
import {Paper, Stack, Typography} from '@mui/material';

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
}

const MetricCard: React.FC<MetricCardProps> = ({label, value, helper}) => {
  return (
    <Paper elevation={0} sx={{p: 3, border: '1px solid #dfe7e2', height: '100%'}}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary" fontWeight={900}>
          {label}
        </Typography>
        <Typography variant="h3">{value}</Typography>
        <Typography color="text.secondary">{helper}</Typography>
      </Stack>
    </Paper>
  );
};

export default MetricCard;
