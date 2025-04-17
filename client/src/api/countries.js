// src/api/countries.js
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export async function fetchCountriesByName(apiKey, name) {
  // optional guard so you get a JS error early if key is missing
  if (!apiKey) {
    throw new Error('Missing API key');
  }
  const { data } = await axios.get(
    `${API_URL}/countries/name/${encodeURIComponent(name)}`,
    { headers: { 'x-api-key': apiKey } }
  );
  return data;
}
