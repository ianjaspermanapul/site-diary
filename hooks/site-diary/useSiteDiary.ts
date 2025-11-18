import { useState, useEffect } from 'react';
import { SiteDiary } from '@/app/api/graphql+api';
import { GET_SITE_DIARY } from '@/lib/graphql/queries';
import { graphqlRequest } from '@/lib/graphql/client';

type SiteDiaryResponse = {
  siteDiary: SiteDiary | null;
};

export function useSiteDiary(id: string | undefined) {
  const [siteDiary, setSiteDiary] = useState<SiteDiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchSiteDiary = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await graphqlRequest<SiteDiaryResponse>(GET_SITE_DIARY, { id });
        setSiteDiary(data.siteDiary);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch site diary');
        setError(error);
        console.error('Error fetching site diary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteDiary();
  }, [id]);

  return {
    siteDiary,
    loading,
    error,
  };
}
