import { useQuery } from '@tanstack/react-query';
import { SiteDiary } from '@/app/api/graphql+api';
import { GET_SITE_DIARIES } from '@/lib/graphql/queries';
import { graphqlRequest } from '@/lib/graphql/client';
import { siteDiaryKeys } from '@/lib/react-query/queryKeys';

type SiteDiariesResponse = {
  siteDiaries: SiteDiary[];
};

async function fetchSiteDiaries(): Promise<SiteDiary[]> {
  const data = await graphqlRequest<SiteDiariesResponse>(GET_SITE_DIARIES);
  return data.siteDiaries;
}

export function useSiteDiaries() {
  const query = useQuery({
    queryKey: siteDiaryKeys.lists(),
    queryFn: fetchSiteDiaries,
  });

  return {
    siteDiaries: query.data || [],
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
