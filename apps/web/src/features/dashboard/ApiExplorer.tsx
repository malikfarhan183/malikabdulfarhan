import React from 'react';
import {Button, Paper, Stack, Typography} from '@mui/material';
import {apiRequest} from '../../api/httpClient';

const ApiExplorer: React.FC = () => {
  const [output, setOutput] = React.useState('Select an endpoint to inspect the JSON response.');

  const runRequest = React.useCallback(async (path: string) => {
    const startedAt = performance.now();
    const response = await apiRequest<unknown>(path);
    const duration = Math.round(performance.now() - startedAt);
    setOutput(JSON.stringify({path, duration: `${duration}ms`, response}, null, 2));
  }, []);

  return (
    <Paper elevation={0} sx={{p: 3, border: '1px solid #dfe7e2', height: '100%'}}>
      <Stack spacing={2}>
        <BoxTitle />
        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Button variant="outlined" onClick={() => runRequest('/api/dashboard/summary')}>
            Summary
          </Button>
          <Button variant="outlined" onClick={() => runRequest('/api/projects?size=2')}>
            Projects
          </Button>
          <Button variant="outlined" onClick={() => runRequest('/api/system/health')}>
            Health
          </Button>
        </Stack>
        <Paper
          component="pre"
          sx={{
            m: 0,
            p: 2,
            minHeight: 260,
            overflow: 'auto',
            bgcolor: '#101615',
            color: '#d9fff4',
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {output}
        </Paper>
      </Stack>
    </Paper>
  );
};

const BoxTitle: React.FC = () => (
  <Stack spacing={0.5}>
    <Typography variant="h6" fontWeight={900}>
      API Explorer
    </Typography>
    <Typography color="text.secondary">
      Protected REST endpoints with bearer token authentication.
    </Typography>
  </Stack>
);

export default ApiExplorer;
