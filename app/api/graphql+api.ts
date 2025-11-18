import { createYoga, createSchema } from 'graphql-yoga';

export type Weather = {
  temperature: number;
  description: string;
};

export type SiteDiary = {
  id: string;
  date: string;
  weather?: Weather;
  createdBy: string;
  title: string;
  content?: string;
  attendees?: string[];
  attachments?: string[];
};

export const siteDiaries: SiteDiary[] = [
  {
    id: 'cm4lvx1rf00006fujdr7w5u9h',
    date: '2024-12-13',
    weather: {
      temperature: 20,
      description: 'sunny',
    },
    createdBy: 'John Doe',
    title: 'Test',
    content: 'Site diary entry to discuss the activities of the day',
    attendees: ['Jane Smith', 'John Doe'],
    attachments: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    id: 'cm4lvx1rf00007fujdr7w5u9i',
    date: '2024-12-12',
    weather: {
      temperature: 18,
      description: 'cloudy',
    },
    createdBy: 'Jane Smith',
    title: 'Progress Meeting',
    content: 'Detailed discussion on project milestones',
    attendees: ['John Doe', 'Mary Johnson'],
    attachments: [
      'https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=1700&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    id: 'cm4lvx1rf00008fujdr7w5u9j',
    date: '2024-12-11',
    weather: {
      temperature: 22,
      description: 'partly cloudy',
    },
    createdBy: 'Mary Johnson',
    title: 'Inspection Report',
    content: 'Inspection of the northern site completed',
    attendees: ['Jane Smith', 'Robert Brown'],
    attachments: [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    id: 'cm4lvx1rf00009fujdr7w5u9k',
    date: '2024-12-10',
    weather: {
      temperature: 16,
      description: 'rainy',
    },
    createdBy: 'Robert Brown',
    title: 'Safety Check',
    content: 'Conducted safety checks on all equipment',
    attendees: ['John Doe', 'Mary Johnson'],
    attachments: [],
  },
  {
    id: 'cm4lvx1rf00010fujdr7w5u9l',
    date: '2024-12-09',
    weather: {
      temperature: 19,
      description: 'windy',
    },
    createdBy: 'Jane Smith',
    title: 'Weekly Summary',
    content: 'Summarised the weekly progress on the project',
    attendees: ['Jane Smith', 'Robert Brown', 'Mary Johnson'],
    attachments: [
      'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
];

const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Weather {
      description: String!
      temperature: Int!
    }

    type SiteDiary {
      attachments: [String!]
      attendees: [String!]
      content: String
      createdBy: String!
      date: String!
      id: String!
      title: String!
      weather: Weather
    }

    input SiteDiaryInput {
      createdBy: String!
      date: String!
      id: String!
      title: String!
    }

    type Query {
      siteDiaries: [SiteDiary!]!
      siteDiary(id: String!): SiteDiary
    }

    type Mutation {
      createSiteDiary(input: SiteDiaryInput!): SiteDiary!
    }
  `,
  resolvers: {
    Query: {
      siteDiaries: () => siteDiaries,
      siteDiary: (_parent, args: { id: string }) => {
        return siteDiaries.find((diary) => diary.id === args.id) || null;
      },
    },
    Mutation: {
      createSiteDiary: (
        _parent,
        args: { input: { id: string; date: string; createdBy: string; title: string } }
      ) => {
        const newSiteDiary: SiteDiary = {
          id: args.input.id,
          date: args.input.date,
          createdBy: args.input.createdBy,
          title: args.input.title,
          attendees: [],
          attachments: [],
        };
        siteDiaries.push(newSiteDiary);
        return newSiteDiary;
      },
    },
  },
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  // Enable GraphiQL interface for development
  graphiql: true,
  fetchAPI: {
    Response,
    Request,
  },
});

export async function GET(request: Request): Promise<Response> {
  const response = await yoga.fetch(request);
  return response;
}

export async function POST(request: Request): Promise<Response> {
  const response = await yoga.fetch(request);
  return response;
}

export async function OPTIONS(request: Request): Promise<Response> {
  const response = await yoga.fetch(request);
  return response;
}
