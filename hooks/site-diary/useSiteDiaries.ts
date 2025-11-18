import { useState, useEffect } from 'react';
import { SiteDiary } from '@/app/api/graphql+api';
import { GET_SITE_DIARIES } from '@/lib/graphql/queries';
import { graphqlRequest } from '@/lib/graphql/client';

type SiteDiariesResponse = {
  siteDiaries: SiteDiary[];
};

export function useSiteDiaries() {
  const [siteDiaries, setSiteDiaries] = useState<SiteDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSiteDiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await graphqlRequest<SiteDiariesResponse>(GET_SITE_DIARIES);
      setSiteDiaries(data.siteDiaries);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch site diaries');
      setError(error);
      console.error('Error fetching site diaries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteDiaries();
  }, []);

  return {
    siteDiaries,
    loading,
    error,
    refetch: fetchSiteDiaries,
  };
}
