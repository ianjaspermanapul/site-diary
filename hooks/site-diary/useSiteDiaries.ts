import { useQuery } from '@tanstack/react-query';
import { SiteDiary } from '@/app/api/graphql+api';
import { GET_SITE_DIARIES } from '@/lib/graphql/queries';
import { graphqlRequest, NetworkError } from '@/lib/graphql/client';
import { siteDiaryKeys } from '@/lib/react-query/queryKeys';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

type SiteDiariesResponse = {
  siteDiaries: SiteDiary[];
};

async function fetchSiteDiaries(): Promise<SiteDiary[]> {
  const data = await graphqlRequest<SiteDiariesResponse>(GET_SITE_DIARIES);
  return data.siteDiaries;
}

export function useSiteDiaries() {
  const { isOffline } = useNetworkStatus();

  const query = useQuery({
    queryKey: siteDiaryKeys.lists(),
    queryFn: fetchSiteDiaries,
    // When offline, still allow query to run to get cached data
    // Keep cached data longer when offline
    staleTime: isOffline ? Infinity : 1000 * 60 * 5,
    // Don't refetch when offline
    refetchOnMount: !isOffline,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry if offline
      if (isOffline) return false;
      // Don't retry network errors (they'll be retried on reconnect)
      if (error instanceof NetworkError && error.isOffline) return false;
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    siteDiaries: query.data || [],
    loading: query.isLoading && !isOffline, // Don't show loading when offline (using cache)
    error: query.error as Error | null,
    refetch: query.refetch,
    isRefetching: query.isRefetching && !isOffline,
    isOffline,
  };
}
