// src/components/ApiKeys.jsx
import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress, Grid, Tooltip, Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import {
  useApiKeys,
  useGenerateApiKey,
  useRevokeApiKey,
  useKeyUsage
} from '../hooks/useApiKeys';

const ApiKeys = () => {
  const { data: apiKeys, isLoading, isError, error } = useApiKeys();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [usageDialog, setUsageDialog] = useState({ open: false, usage: [], loading: false });
  const generate = useGenerateApiKey(msg => setSnackbar({ open: true, message: msg }));
  const revoke = useRevokeApiKey(msg => setSnackbar({ open: true, message: msg }));
  const usage = useKeyUsage();

  const handleGenerate = () => generate.mutate();
  const handleRevoke = (id) => revoke.mutate(id);
  const handleViewUsage = (keyId) => {
    setUsageDialog(d => ({ ...d, open: true, loading: true }));
    usage.mutate(
      { keyId },
      {
        onSuccess: data => setUsageDialog({ open: true, usage: data, loading: false }),
        onError: () => setUsageDialog(d => ({ ...d, loading: false }))
      }
    );
  };
  const copyKey = text => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'API key copied to clipboard' });
  };

  if (isLoading) return <CircularProgress />;
  if (isError)  return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">API Keys</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleGenerate}
          disabled={generate.isLoading}
        >
          Generate New Key
        </Button>
      </Box>

      <Grid container spacing={3}>
        {apiKeys.map(key => (
          <Grid item xs={12} key={key.id}>
            <Card>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {key.api_key}
                  </Typography>
                  <Typography variant="caption">
                    Created: {new Date(key.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="Copy">
                    <IconButton onClick={() => copyKey(key.api_key)}><CopyIcon/></IconButton>
                  </Tooltip>
                  <Tooltip title="Usage">
                    <IconButton onClick={() => handleViewUsage(key.id)}><ViewIcon/></IconButton>
                  </Tooltip>
                  <Tooltip title="Revoke">
                    <IconButton
                      color="error"
                      onClick={() => window.confirm('Revoke?') && handleRevoke(key.id)}
                      disabled={revoke.isLoading}
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={usageDialog.open}
        onClose={() => setUsageDialog(d => ({ ...d, open: false }))}
        fullWidth maxWidth="md"
      >
        <DialogTitle>Usage</DialogTitle>
        <DialogContent>
          {usageDialog.loading
            ? <CircularProgress />
            : usageDialog.usage.map((u,i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography>Endpoint: {u.endpoint}</Typography>
                  <Typography variant="caption">
                    Count: {u.count} • Last: {new Date(u.last_used).toLocaleString()}
                  </Typography>
                </Box>
              ))
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUsageDialog(d => ({ ...d, open: false }))}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ApiKeys;
