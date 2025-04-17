// src/hooks/useDashboardStats.js
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to fetch dashboard stats.
 * Returns: { data, isLoading, isError, error }
 */
export function useDashboardStats() {
  const { token } = useAuth();
  return useQuery(
    ['dashboardStats'],                 // query key
    () => getDashboardStats(token),     // fetcher fn
    { staleTime: 5 * 60 * 1000 }       // cache for 5m
  );
}
