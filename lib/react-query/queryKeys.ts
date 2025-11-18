export const siteDiaryKeys = {
  all: ['siteDiaries'] as const,
  lists: () => [...siteDiaryKeys.all, 'list'] as const,
  list: (filters: string) => [...siteDiaryKeys.lists(), { filters }] as const,
  details: () => [...siteDiaryKeys.all, 'detail'] as const,
  detail: (id: string) => [...siteDiaryKeys.details(), id] as const,
};
