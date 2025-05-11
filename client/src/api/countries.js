// import axios from 'axios';
// const API_URL = process.env.REACT_APP_API_URL;

import api from './api';

export const fetchCountriesByName = async (apiKey, name) => {
    const response = await api.get(`/countries/name/${encodeURIComponent(name)}`, {
        headers: {
            'X-API-Key': apiKey
        }
    });
    return response.data;
};

// export async function fetchCountriesByName(apiKey, name) {
//   // guard to get a JS error early if key is missing
//   if (!apiKey) {
//     throw new Error('Missing API key');
//   }
//   const { data } = await axios.get(
//     `${API_URL}/countries/name/${encodeURIComponent(name)}`,
//     { headers: { 'x-api-key': apiKey } }
//   );
//   return data;
// }
