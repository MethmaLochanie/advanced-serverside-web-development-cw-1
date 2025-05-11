// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // Create axios instance with auth header
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Add auth token to requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export const getUsers = async () => {
//   try {
//     const response = await api.get('/admin/users');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to fetch users' };
//   }
// };

// export const updateUserStatus = async (userId, isActive) => {
//   try {
//     const response = await api.patch(`/admin/users/${userId}/status`, { is_active: isActive });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to update user status' };
//   }
// };

// export const updateUserRole = async (userId, role) => {
//   try {
//     const response = await api.patch(`/admin/users/${userId}/role`, { role });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to update user role' };
//   }
// };

// export const getSystemStats = async () => {
//   try {
//     const response = await api.get('/admin/stats');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to fetch system stats' };
//   }
// };

// export const getAdminLogs = async (limit = 100, offset = 0) => {
//   try {
//     const response = await api.get(`/admin/logs?limit=${limit}&offset=${offset}`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to fetch admin logs' };
//   }
// }; 