// src/hooks/useCountries.js
import { useQuery } from '@tanstack/react-query';
import { fetchCountriesByName } from '../api/countries';
import { useAuth } from '../context/AuthContext';

export function useSearchCountries(searchTerm) {
  const { user } = useAuth();
  const apiKey = user.apiKeys[0];

  return useQuery(
    ['countries', searchTerm],
    () => fetchCountriesByName(apiKey, searchTerm),
    {
      enabled: !!searchTerm,      // only fetch when there's a non-empty search term
      retry: false,               // don’t retry 404’s
    }
  );
}
