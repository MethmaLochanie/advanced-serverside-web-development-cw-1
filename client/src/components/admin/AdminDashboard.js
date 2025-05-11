// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Tabs,
//   Tab,
//   Typography,
//   Paper,
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   CircularProgress
// } from '@mui/material';
// import {
//   People as PeopleIcon,
//   VpnKey as KeyIcon,
//   Timeline as TimelineIcon,
//   History as HistoryIcon
// } from '@mui/icons-material';
// import UserManagement from './UserManagement';
// import { getSystemStats, getAdminLogs } from '../../api/admin';

// function TabPanel({ children, value, index, ...other }) {
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`admin-tabpanel-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// }

// const AdminDashboard = () => {
//   console.log('AdminDashboard component rendering');
  
//   const [value, setValue] = useState(0);
//   const [stats, setStats] = useState(null);
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     console.log('AdminDashboard useEffect running');
//     const fetchData = async () => {
//       try {
//         console.log('Fetching admin dashboard data...');
//         setLoading(true);
//         const [statsData, logsData] = await Promise.all([
//           getSystemStats(),
//           getAdminLogs(10)
//         ]);
//         console.log('Admin stats:', statsData);
//         console.log('Admin logs:', logsData);
//         setStats(statsData);
//         setLogs(logsData);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching admin data:', err);
//         setError(err.message || 'Failed to fetch dashboard data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const StatCard = ({ title, value, icon: Icon }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item>
//             <Icon color="primary" sx={{ fontSize: 40 }} />
//           </Grid>
//           <Grid item xs>
//             <Typography color="textSecondary" variant="h6" component="h2">
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div">
//               {value}
//             </Typography>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Admin Dashboard
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
//           {error}
//         </Paper>
//       ) : (
//         <>
//           <Grid container spacing={3} sx={{ mb: 4 }}>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Total Users"
//                 value={stats?.totalUsers || 0}
//                 icon={PeopleIcon}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Active Users"
//                 value={stats?.activeUsers || 0}
//                 icon={PeopleIcon}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Total API Keys"
//                 value={stats?.totalApiKeys || 0}
//                 icon={KeyIcon}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Active API Keys"
//                 value={stats?.activeApiKeys || 0}
//                 icon={KeyIcon}
//               />
//             </Grid>
//           </Grid>

//           <Paper sx={{ width: '100%' }}>
//             <Tabs
//               value={value}
//               onChange={handleChange}
//               indicatorColor="primary"
//               textColor="primary"
//               variant="fullWidth"
//             >
//               <Tab icon={<PeopleIcon />} label="Users" />
//               <Tab icon={<TimelineIcon />} label="API Usage" />
//               <Tab icon={<HistoryIcon />} label="Admin Logs" />
//             </Tabs>

//             <TabPanel value={value} index={0}>
//               <UserManagement />
//             </TabPanel>

//             <TabPanel value={value} index={1}>
//               <Typography variant="h6" gutterBottom>
//                 Top API Endpoints
//               </Typography>
//               {stats?.topEndpoints?.map((endpoint, index) => (
//                 <Box key={index} sx={{ mb: 2 }}>
//                   <Typography variant="subtitle1">
//                     {endpoint.endpoint}
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     {endpoint.count} requests
//                   </Typography>
//                 </Box>
//               ))}
//             </TabPanel>

//             <TabPanel value={value} index={2}>
//               <Typography variant="h6" gutterBottom>
//                 Recent Admin Actions
//               </Typography>
//               {logs.map((log, index) => (
//                 <Box key={index} sx={{ mb: 2 }}>
//                   <Typography variant="subtitle1">
//                     {log.action} by {log.admin_username}
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     {new Date(log.timestamp).toLocaleString()} - {log.details}
//                   </Typography>
//                 </Box>
//               ))}
//             </TabPanel>
//           </Paper>
//         </>
//       )}
//     </Container>
//   );
// };

// export default AdminDashboard; 