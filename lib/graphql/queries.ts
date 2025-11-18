export const GRAPHQL_ENDPOINT = '/api/graphql';

export const GET_SITE_DIARIES = `
  query {
    siteDiaries {
      id
      date
      title
      createdBy
      content
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;

export const GET_SITE_DIARY = `
  query GetSiteDiary($id: String!) {
    siteDiary(id: $id) {
      id
      date
      title
      content
      createdBy
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;

export const CREATE_SITE_DIARY = `
  mutation CreateSiteDiary($input: SiteDiaryInput!) {
    createSiteDiary(input: $input) {
      id
      date
      title
      createdBy
    }
  }
`;

