import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  Key as KeyIcon,
  Public as PublicIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useDashboardStats } from '../hooks/useDashboardStats';

const StatCard = ({ icon, title, value, subtitle }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const {
    data: stats,
    isLoading,
    isError,
    error
  } = useDashboardStats();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error.message || 'Error fetching dashboard statistics'}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<KeyIcon color="primary" />}
            title="Active API Keys"
            value={stats.activeKeys}
            subtitle="Currently active API keys"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<PublicIcon color="primary" />}
            title="Total Requests"
            value={stats.totalRequests}
            subtitle="Total API requests made"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<TimelineIcon color="primary" />}
            title="Endpoints"
            value={stats.popularEndpoints.length}
            subtitle="Unique endpoints accessed"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Popular Endpoints
        </Typography>
        {stats.popularEndpoints.length > 0 ? (
          stats.popularEndpoints.map((ep, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                borderBottom:
                  idx < stats.popularEndpoints.length - 1 ? 1 : 0,
                borderColor: 'divider'
              }}
            >
              <Typography variant="body1">{ep.endpoint}</Typography>
              <Typography variant="body2" color="text.secondary">
                {ep.count} requests
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No endpoint usage data available
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
