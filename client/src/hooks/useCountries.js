import { useMutation } from '@tanstack/react-query';
import { fetchCountriesByName } from '../api/countries';
import { useAuth } from '../context/AuthContext';

export function useSearchCountries() {
  const { user } = useAuth();
  const apiKey = user.apiKeys[0]

  return useMutation({
    mutationFn: (searchTerm) => {
      if (!apiKey) {
        throw new Error('Missing API key');
      }
      return fetchCountriesByName(apiKey, searchTerm);
    },
    retry: false
  });
}
