import { useQuery } from '@tanstack/react-query';
import { SiteDiary } from '@/app/api/graphql+api';
import { GET_SITE_DIARY } from '@/lib/graphql/queries';
import { graphqlRequest, NetworkError } from '@/lib/graphql/client';
import { siteDiaryKeys } from '@/lib/react-query/queryKeys';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

type SiteDiaryResponse = {
  siteDiary: SiteDiary | null;
};

async function fetchSiteDiary(id: string): Promise<SiteDiary | null> {
  const data = await graphqlRequest<SiteDiaryResponse>(GET_SITE_DIARY, { id });
  return data.siteDiary;
}

export function useSiteDiary(id: string | undefined) {
  const { isOffline } = useNetworkStatus();

  const query = useQuery({
    queryKey: siteDiaryKeys.detail(id || ''),
    queryFn: () => fetchSiteDiary(id!),
    enabled: !!id,
    // When offline, still allow query to run to get cached data
    staleTime: isOffline ? Infinity : 1000 * 60 * 5, // 5 minutes
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
    siteDiary: query.data || null,
    loading: query.isLoading && !isOffline, // Don't show loading when offline (using cache)
    error: query.error as Error | null,
    refetch: query.refetch,
    isRefetching: query.isRefetching && !isOffline,
    isOffline,
  };
}
