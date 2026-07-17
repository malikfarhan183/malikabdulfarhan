import React from 'react';
import {
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type {Project} from '../../types';

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
}

const statusColor = {
  active: 'success',
  planning: 'info',
  review: 'warning',
  completed: 'default',
} as const;

const ProjectsTable: React.FC<ProjectsTableProps> = ({projects, isLoading}) => {
  return (
    <Paper elevation={0} sx={{border: '1px solid #dfe7e2', overflow: 'hidden'}}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{p: 3}}>
        <BoxTitle />
        <Chip label="Optimized list API" color="primary" variant="outlined" />
      </Stack>
      {isLoading && <LinearProgress />}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Stack</TableCell>
              <TableCell align="right">Budget</TableCell>
              <TableCell align="right">Health</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow hover key={project.id}>
                <TableCell>{project.clientName}</TableCell>
                <TableCell>
                  <Typography fontWeight={800}>{project.projectName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due {project.dueDate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={project.status}
                    color={statusColor[project.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    {project.stack.map((item) => (
                      <Chip key={item} label={item} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">${project.budget.toLocaleString()}</TableCell>
                <TableCell align="right">{project.healthScore}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const BoxTitle: React.FC = () => (
  <Box>
    <Typography variant="h6" fontWeight={900}>
      Project Pipeline
    </Typography>
    <Typography color="text.secondary">Filtering, pagination, and indexed SQL-ready data.</Typography>
  </Box>
);

const Box = Stack;

export default ProjectsTable;
