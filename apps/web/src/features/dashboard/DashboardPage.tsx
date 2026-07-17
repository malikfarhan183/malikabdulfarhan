import React from 'react';
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {useQuery} from 'react-query';
import {apiRequest} from '../../api/httpClient';
import MetricCard from '../../components/MetricCard';
import ProjectsTable from '../projects/ProjectsTable';
import ApiExplorer from './ApiExplorer';
import type {
  ApiResponse,
  AuditEvent,
  DashboardSummary,
  PaginatedApiResponse,
  Project,
} from '../../types';

const DashboardPage: React.FC = () => {
  const summaryQuery = useQuery(['dashboard', 'summary'], () =>
    apiRequest<ApiResponse<DashboardSummary>>('/api/dashboard/summary')
  );
  const projectsQuery = useQuery(['projects'], () =>
    apiRequest<PaginatedApiResponse<Project>>('/api/projects?size=10')
  );
  const auditQuery = useQuery(['audit-events'], () =>
    apiRequest<ApiResponse<AuditEvent[]>>('/api/audit-events')
  );
  const summary = summaryQuery.data?.data;
  const projects = projectsQuery.data?.data || [];
  const auditEvents = auditQuery.data?.data || [];

  return (
    <Stack spacing={4}>
      <Paper
        elevation={0}
        sx={{
          p: {xs: 3, md: 4},
          border: '1px solid #dfe7e2',
          background:
            'linear-gradient(120deg, rgba(18,109,103,0.96), rgba(23,32,29,0.92)), url(/assets/full-stack-workstation.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          color: '#fff',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Chip label="React + MUI + JWT + Express + MSSQL" sx={{color: '#fff', borderColor: 'rgba(255,255,255,0.4)'}} variant="outlined" />
            <Typography variant="h2" sx={{mt: 2, maxWidth: 840}}>
              A client-ready dashboard built to demonstrate senior full-stack delivery.
            </Typography>
            <Typography sx={{mt: 2, maxWidth: 760, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8}}>
              This demo shows polished frontend implementation, protected API design, optimized query patterns, and SQL Server-ready persistence in a readable codebase.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={3}>
          <MetricCard
            label="Active Projects"
            value={String(summary?.activeProjects ?? '--')}
            helper="Role-aware dashboard data"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            label="Pipeline Value"
            value={summary ? `$${summary.totalBudget.toLocaleString()}` : '--'}
            helper="Aggregated from API service"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            label="Health Score"
            value={summary ? `${summary.averageHealth}%` : '--'}
            helper="Computed service metric"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            label="API Latency"
            value={summary ? `${summary.apiLatency}ms` : '--'}
            helper="Performance-oriented endpoint"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <ProjectsTable projects={projects} isLoading={projectsQuery.isLoading} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ApiExplorer />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{p: 3, border: '1px solid #dfe7e2'}}>
        <Typography variant="h6" fontWeight={900}>
          Audit Timeline
        </Typography>
        <Stack spacing={2} sx={{mt: 2}}>
          {auditEvents.map((event) => (
            <Box key={event.id} sx={{borderLeft: '3px solid #c78a2f', pl: 2}}>
              <Typography fontWeight={900}>{event.action}</Typography>
              <Typography color="text.secondary">{event.message}</Typography>
              <Typography variant="caption" color="text.secondary">
                {event.actor} - {new Date(event.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default DashboardPage;
