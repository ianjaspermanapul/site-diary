import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CREATE_SITE_DIARY } from '@/lib/graphql/queries';
import { graphqlRequest, NetworkError } from '@/lib/graphql/client';
import { siteDiaryKeys } from '@/lib/react-query/queryKeys';
import { SiteDiary } from '@/app/api/graphql+api';

type CreateSiteDiaryInput = {
  id: string;
  date: string;
  title: string;
  createdBy: string;
  content?: string;
  weather?: {
    temperature: number;
    description: string;
  };
  attendees?: string[];
  attachments?: string[];
};

type CreateSiteDiaryResponse = {
  createSiteDiary: SiteDiary;
};

async function createSiteDiary(input: CreateSiteDiaryInput): Promise<SiteDiary> {
  const data = await graphqlRequest<CreateSiteDiaryResponse>(CREATE_SITE_DIARY, {
    input,
  });
  return data.createSiteDiary;
}

export function useCreateSiteDiary() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSiteDiary,
    onSuccess: () => {
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: siteDiaryKeys.all });
    },
    retry: (failureCount, error) => {
      // Don't retry network errors
      if (error instanceof NetworkError && error.isOffline) return false;
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    createSiteDiary: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error as Error | null,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}
