import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const [selectedKey, setSelectedKey] = useState(null);
  const [showUsageDialog, setShowUsageDialog] = useState(false);
  const [usageData, setUsageData] = useState([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { token } = useAuth();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/keys`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApiKeys(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching API keys');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    try {
      // generate on server
      await axios.post(
        `${process.env.REACT_APP_API_URL}/keys/generate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // refresh list
      await fetchApiKeys();
      setSnackbar({ open: true, message: 'New API key generated successfully' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating API key');
    }
  };

  const revokeApiKey = async (keyId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/keys/${keyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchApiKeys();
      setSnackbar({ open: true, message: 'API key revoked successfully' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error revoking API key');
    }
  };

  const fetchKeyUsage = async (keyId) => {
    try {
      setUsageLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/keys/${keyId}/usage`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsageData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching API key usage');
    } finally {
      setUsageLoading(false);
    }
  };

  const handleViewUsage = (key) => {
    // setSelectedKey(key);
    setShowUsageDialog(true);
    fetchKeyUsage(key.id);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'API key copied to clipboard' });
  };

  return (
    <Box>
      {/* Header + Generate button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">API Keys</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={generateApiKey}
        >
          Generate New Key
        </Button>
      </Box>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading spinner */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {apiKeys.map((key) => (
            <Grid item xs={12} key={key.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        API Key
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {key.api_key}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(key.created_at).toLocaleString()}
                      </Typography>
                      {key.last_used && (
                        <Typography variant="body2" color="text.secondary">
                          Last used: {new Date(key.last_used).toLocaleString()}
                        </Typography>
                      )}
                      {key.revoked_at && (
                        <Typography variant="body2" color="error">
                          Revoked: {new Date(key.revoked_at).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Tooltip title="Copy API Key">
                        <IconButton onClick={() => copyToClipboard(key.api_key)}>
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Usage">
                        <IconButton onClick={() => handleViewUsage(key)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Revoke Key">
                        <IconButton
                          color="error"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to revoke this API key? This action cannot be undone.'
                              )
                            ) {
                              revokeApiKey(key.id);
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Usage dialog */}
      <Dialog
        open={showUsageDialog}
        onClose={() => setShowUsageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>API Key Usage</DialogTitle>
        <DialogContent>
          {usageLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              {usageData.length > 0 ? (
                usageData.map((usage, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      Endpoint: {usage.endpoint}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Count: {usage.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last used: {new Date(usage.last_used).toLocaleString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>No usage data available</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUsageDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for copy/generate/revoke */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ApiKeys;
