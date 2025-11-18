import { useQuery } from '@tanstack/react-query';
import { SiteDiary } from '@/app/api/graphql+api';
import { GET_SITE_DIARY } from '@/lib/graphql/queries';
import { graphqlRequest } from '@/lib/graphql/client';
import { siteDiaryKeys } from '@/lib/react-query/queryKeys';

type SiteDiaryResponse = {
  siteDiary: SiteDiary | null;
};

async function fetchSiteDiary(id: string): Promise<SiteDiary | null> {
  const data = await graphqlRequest<SiteDiaryResponse>(GET_SITE_DIARY, { id });
  return data.siteDiary;
}

export function useSiteDiary(id: string | undefined) {
  const query = useQuery({
    queryKey: siteDiaryKeys.detail(id || ''),
    queryFn: () => fetchSiteDiary(id!),
    enabled: !!id,
  });

  return {
    siteDiary: query.data || null,
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
