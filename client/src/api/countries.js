// src/api/countries.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchCountriesByName(apiKey, name) {
  const { data } = await axios.get(
    `${API_URL}/countries/name/${encodeURIComponent(name)}`,
    { headers: { 'x-api-key': apiKey } }
  );
  return data;
}
