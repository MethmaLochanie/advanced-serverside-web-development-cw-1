// src/hooks/useDashboardStats.js
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';

export function useDashboardStats() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => getDashboardStats(token),
    staleTime: 5 * 60 * 1000,   // 5 minutes
  });
}
