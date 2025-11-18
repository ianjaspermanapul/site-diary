import { prisma } from './client';

// Helper function to transform Prisma data to GraphQL format
function transformSiteDiary(diary: any) {
  return {
    id: diary.id,
    date: diary.date,
    title: diary.title,
    content: diary.content || null,
    createdBy: diary.createdBy,
    weather: diary.weather
      ? {
          temperature: diary.weather.temperature,
          description: diary.weather.description,
        }
      : null,
    attendees: diary.attendees?.map((a: any) => a.name) || [],
    attachments: diary.attachments?.map((a: any) => a.uri) || [],
  };
}

export const resolvers = {
  Query: {
    siteDiaries: async () => {
      const diaries = await prisma.siteDiary.findMany({
        include: {
          weather: true,
          attendees: true,
          attachments: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
      return diaries.map(transformSiteDiary);
    },
    siteDiary: async (_parent: any, args: { id: string }) => {
      const diary = await prisma.siteDiary.findUnique({
        where: { id: args.id },
        include: {
          weather: true,
          attendees: true,
          attachments: true,
        },
      });
      return diary ? transformSiteDiary(diary) : null;
    },
  },
  Mutation: {
    createSiteDiary: async (
      _parent: any,
      args: {
        input: {
          id: string;
          date: string;
          createdBy: string;
          title: string;
          content?: string;
          weather?: { temperature: number; description: string };
          attendees?: string[];
          attachments?: string[];
        };
      }
    ) => {
      const { id, date, createdBy, title, content, weather, attendees, attachments } = args.input;

      const diary = await prisma.siteDiary.create({
        data: {
          id,
          date,
          createdBy,
          title,
          content,
          weather: weather
            ? {
                create: {
                  temperature: weather.temperature,
                  description: weather.description,
                },
              }
            : undefined,
          attendees: attendees
            ? {
                create: attendees.map((name) => ({ name })),
              }
            : undefined,
          attachments: attachments
            ? {
                create: attachments.map((uri) => ({ uri })),
              }
            : undefined,
        },
        include: {
          weather: true,
          attendees: true,
          attachments: true,
        },
      });

      return transformSiteDiary(diary);
    },
  },
};
