// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import * as api from '../api/keys';
// import { useAuth } from '../context/AuthContext';

// export function useApiKeys() {
//   const { token } = useAuth();
//   return useQuery({
//     queryKey: ['apiKeys'],
//     queryFn: () => api.getApiKeys(token),
//   });
// }

// export function useGenerateApiKey(onSuccessSnackbar) {
//   const { token, validateToken } = useAuth();
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: () => api.createApiKey(token),
//     onSuccess: (newKey) => {
//       qc.invalidateQueries({ queryKey: ['apiKeys'] });
//       validateToken();
//       onSuccessSnackbar('New API key generated successfully');
//     },
//   });
// }


// export function useRevokeApiKey(onSuccessSnackbar) {
//   const { token, validateToken } = useAuth();
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (keyId) => api.deleteApiKey({ token, keyId }),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['apiKeys'] });
//       validateToken();
//       onSuccessSnackbar('API key revoked successfully');
//     },
//   });
// }

// export function useKeyUsage() {
//   const { token } = useAuth();
//   return useMutation({
//     mutationFn: ({ keyId }) => api.getKeyUsage({ token, keyId }),
//   });
// }
