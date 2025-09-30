import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import LogStream from '../components/LogStream';
import AnalyticsChart from '../components/AnalyticsChart';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" className="mb-6 font-bold">
        Log Analytics Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <LogStream />
        </Grid>
        <Grid item xs={12} lg={4}>
          <AnalyticsChart />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
