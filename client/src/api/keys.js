// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// // all calls accept a bearer token
// const authHeader = token => ({ headers: { Authorization: `Bearer ${token}` } });

// export const getApiKeys = async (token) => {
//   const { data } = await axios.get(`${API_URL}/keys`, authHeader(token));
//   return data;
// };

// export const createApiKey = async (token) => {
//   const { data } = await axios.post(`${API_URL}/keys/generate`, {}, authHeader(token));
//   return data;
// };

// export const deleteApiKey = async ({ token, keyId }) => {
//   await axios.delete(`${API_URL}/keys/${keyId}`, authHeader(token));
// };

// export const getKeyUsage = async ({ token, keyId }) => {
//   const { data } = await axios.get(`${API_URL}/keys/${keyId}/usage`, authHeader(token));
//   return data;
// };
