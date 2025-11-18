import { prisma } from './client';
import dayjs from 'dayjs';
import { generateWeeklySummary } from '../../../lib/ai/summarize';

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
    weeklySummary: async () => {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not configured. Please add it to your .env file.');
      }
      // Get date range for past 7 days
      const today = dayjs();
      const sevenDaysAgo = today.subtract(7, 'days');
      const startDate = sevenDaysAgo.format('YYYY-MM-DD');
      const endDate = today.format('YYYY-MM-DD');

      // Fetch diaries from the past week
      const diaries = await prisma.siteDiary.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          weather: true,
          attendees: true,
        },
        orderBy: {
          date: 'asc',
        },
      });

      if (diaries.length === 0) {
        return 'No site diary entries found for the past week.';
      }

      // Transform diaries for AI
      const formattedDiaries = diaries.map((diary: any) => ({
        date: diary.date,
        title: diary.title,
        content: diary.content,
        createdBy: diary.createdBy,
        weather: diary.weather
          ? {
              temperature: diary.weather.temperature,
              description: diary.weather.description,
            }
          : null,
        attendees: diary.attendees?.map((a: any) => a.name) || [],
      }));

      // Generate AI summary
      try {
        const summary = await generateWeeklySummary(formattedDiaries);
        return summary;
      } catch (error) {
        console.error('Error generating weekly summary:', error);
        // Fallback to a simple summary if AI fails
        return `Weekly Summary: ${diaries.length} site diary entries recorded from ${startDate} to ${endDate}. Key activities include: ${diaries.map((d: any) => d.title).join(', ')}.`;
      }
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
