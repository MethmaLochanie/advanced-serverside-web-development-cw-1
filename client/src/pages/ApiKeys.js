// import React, { useState } from 'react';
// import {
//   Box, Button, Card, CardContent, Typography, IconButton,
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Alert, CircularProgress, Grid, Tooltip, Snackbar
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   ContentCopy as CopyIcon,
//   Visibility as ViewIcon
// } from '@mui/icons-material';
// import {
//   useApiKeys,
//   useGenerateApiKey,
//   useRevokeApiKey,
//   useKeyUsage
// } from '../hooks/useApiKeys';

// const ApiKeys = () => {
//   const { data: apiKeys, isLoading, isError, error } = useApiKeys();
//   const [snackbar, setSnackbar] = useState({ open: false, message: '' });
//   const [usageDialog, setUsageDialog] = useState({ open: false, usage: [], loading: false });
//   const generate = useGenerateApiKey(msg => setSnackbar({ open: true, message: msg }));
//   const revoke = useRevokeApiKey(msg => setSnackbar({ open: true, message: msg }));
//   const usage = useKeyUsage();

//   const handleGenerate = () => generate.mutate();
//   const handleRevoke = (id) => revoke.mutate(id);
//   const handleViewUsage = (keyId) => {
//     setUsageDialog(d => ({ ...d, open: true, loading: true }));
//     usage.mutate(
//       { keyId },
//       {
//         onSuccess: data => setUsageDialog({ open: true, usage: data, loading: false }),
//         onError: () => setUsageDialog(d => ({ ...d, loading: false }))
//       }
//     );
//   };
//   const copyKey = text => {
//     navigator.clipboard.writeText(text);
//     setSnackbar({ open: true, message: 'API key copied to clipboard' });
//   };

//   if (isLoading) return <CircularProgress />;
//   if (isError)  return <Alert severity="error">{error.message}</Alert>;

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
//         <Typography variant="h4">API Keys</Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleGenerate}
//           disabled={generate.isLoading}
//         >
//           Generate New Key
//         </Button>
//       </Box>

//       <Grid container spacing={3}>
//         {apiKeys.map(key => (
//           <Grid item xs={12} key={key.id}>
//             <Card>
//               <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Box>
//                   <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
//                     {key.api_key}
//                   </Typography>
//                   <Typography variant="caption">
//                     Created: {new Date(key.created_at).toLocaleString()}
//                   </Typography>
//                   {key.last_used && (
//                     <Typography variant="body2" color="text.secondary">
//                       Last used: {new Date(key.last_used).toLocaleString()}
//                     </Typography>
//                   )}
//                   {key.revoked_at && (
//                     <Typography variant="body2" color="error">
//                       Revoked: {new Date(key.revoked_at).toLocaleString()}
//                     </Typography>
//                   )}
//                 </Box>
//                 <Box>
//                   <Tooltip title="Copy API Key">
//                     <IconButton onClick={() => copyKey(key.api_key)}><CopyIcon/></IconButton>
//                   </Tooltip>
//                   <Tooltip title="View Usage">
//                     <IconButton onClick={() => handleViewUsage(key.id)}><ViewIcon/></IconButton>
//                   </Tooltip>
//                   <Tooltip title="Revoke Key">
//                     <IconButton
//                       color="error"
//                       onClick={() => window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.') && handleRevoke(key.id)}
//                       disabled={revoke.isLoading}
//                     >
//                       <DeleteIcon/>
//                     </IconButton>
//                   </Tooltip>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Dialog
//         open={usageDialog.open}
//         onClose={() => setUsageDialog(d => ({ ...d, open: false }))}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>API Key Usage</DialogTitle>
//         <DialogContent>
//           {usageDialog.loading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <Box sx={{ mt: 2 }}>
//               {usageDialog.usage.map((usage, index) => (
//                 <Box key={index} sx={{ mb: 2 }}>
//                   <Typography variant="subtitle1">
//                     Endpoint: {usage.endpoint}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Count: {usage.count}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Last used: {new Date(usage.last_used).toLocaleString()}
//                   </Typography>
//                 </Box>
//               ))}
//               {usage.data === 0 && (
//                 <Typography>No usage data available</Typography>
//               )}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setUsageDialog(d => ({ ...d, open: false }))}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar(s => ({ ...s, open: false }))}
//         message={snackbar.message}
//       />
//     </Box>
//   );
// };

// export default ApiKeys;
