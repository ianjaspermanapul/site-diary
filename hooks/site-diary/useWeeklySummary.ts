import { useQuery } from '@tanstack/react-query';
import { GET_WEEKLY_SUMMARY } from '@/lib/graphql/queries';
import { graphqlRequest } from '@/lib/graphql/client';
import { siteDiaryKeys } from '@/lib/react-query/queryKeys';

type WeeklySummaryResponse = {
  weeklySummary: string;
};

async function fetchWeeklySummary(): Promise<string> {
  const data = await graphqlRequest<WeeklySummaryResponse>(GET_WEEKLY_SUMMARY);
  return data.weeklySummary;
}

export function useWeeklySummary() {
  const API_KEY = process.env.OPENAI_API_KEY;
  const query = useQuery({
    queryKey: [...siteDiaryKeys.all, 'weeklySummary'],
    queryFn: fetchWeeklySummary,
    staleTime: 1000 * 60 * 10, // 10 minutes - summaries don't change often
    enabled: !!API_KEY,
    retry: false,
  });

  const isApiKeyMissing = !API_KEY;

  return {
    summary: query.data || null,
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
    isApiKeyMissing: !!isApiKeyMissing,
  };
}
