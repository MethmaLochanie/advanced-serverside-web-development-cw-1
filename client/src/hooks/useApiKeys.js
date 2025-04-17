// src/hooks/useApiKeys.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/keys';
import { useAuth } from '../context/AuthContext';

export function useApiKeys() {
  const { token } = useAuth();
  return useQuery(['apiKeys'], () => api.getApiKeys(token));
}

export function useGenerateApiKey(onSuccessSnackbar) {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation(() => api.createApiKey(token), {
    onSuccess: () => {
      qc.invalidateQueries(['apiKeys']);
      onSuccessSnackbar('New API key generated successfully');
    }
  });
}

export function useRevokeApiKey(onSuccessSnackbar) {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation(
    (keyId) => api.deleteApiKey({ token, keyId }),
    {
      onSuccess: () => {
        qc.invalidateQueries(['apiKeys']);
        onSuccessSnackbar('API key revoked successfully');
      }
    }
  );
}

export function useKeyUsage() {
  const { token } = useAuth();
  return useMutation(
    ({ keyId }) => api.getKeyUsage({ token, keyId })
  );
}
