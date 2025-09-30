import React from 'react';
import { Container, Typography, Paper, Switch, FormControlLabel } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Container maxWidth="md" className="py-8">
      <Typography variant="h4" className="mb-6 font-bold">
        Settings
      </Typography>
      <Paper className="p-6">
        <Typography variant="h6" className="mb-4">
          Preferences
        </Typography>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Enable real-time log streaming"
          className="mb-2"
        />
        <FormControlLabel
          control={<Switch />}
          label="Show timestamps"
          className="mb-2"
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Auto-scroll to latest logs"
        />
      </Paper>
    </Container>
  );
};

export default Settings;
