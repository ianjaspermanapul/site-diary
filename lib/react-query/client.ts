import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry if offline or network error
        if (
          error?.message?.includes('Network request failed') ||
          error?.message?.includes('Failed to fetch')
        ) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      // Use cached data when offline
      networkMode: 'offlineFirst',
    },
  },
});
