import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeKeys: 0,
    popularEndpoints: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Fetch API keys
      const keysResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/keys`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Calculate statistics
      const activeKeys = keysResponse.data.filter(key => key.is_active).length;
      const totalRequests = keysResponse.data.reduce(
        (sum, key) => sum + (key.usage_count || 0),
        0
      );

      // Get usage data for all keys
      const usagePromises = keysResponse.data.map(key =>
        axios.get(
          `${process.env.REACT_APP_API_URL}/keys/${key.id}/usage`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      );

      const usageResponses = await Promise.all(usagePromises);
      const allUsage = usageResponses.flatMap(response => response.data);

      // Calculate popular endpoints
      const endpointCounts = allUsage.reduce((acc, usage) => {
        acc[usage.endpoint] = (acc[usage.endpoint] || 0) + usage.count;
        return acc;
      }, {});

      const popularEndpoints = Object.entries(endpointCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([endpoint, count]) => ({ endpoint, count }));

      setStats({
        totalRequests,
        activeKeys,
        popularEndpoints
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
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
        {stats.popularEndpoints.map((endpoint, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1,
              borderBottom: index < stats.popularEndpoints.length - 1 ? 1 : 0,
              borderColor: 'divider'
            }}
          >
            <Typography variant="body1">
              {endpoint.endpoint}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {endpoint.count} requests
            </Typography>
          </Box>
        ))}
        {stats.popularEndpoints.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No endpoint usage data available
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard; 