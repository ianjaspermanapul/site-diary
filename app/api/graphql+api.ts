import { createYoga, createSchema } from 'graphql-yoga';
import { resolvers } from './db/resolvers';

// Export types for use in other parts of the app
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
      content: String
      weather: WeatherInput
      attendees: [String!]
      attachments: [String!]
    }

    input WeatherInput {
      temperature: Int!
      description: String!
    }

    type Query {
      siteDiaries: [SiteDiary!]!
      siteDiary(id: String!): SiteDiary
      weeklySummary: String
    }

    type Mutation {
      createSiteDiary(input: SiteDiaryInput!): SiteDiary!
    }
  `,
  resolvers,
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
