import { GRAPHQL_ENDPOINT } from './queries';

export class NetworkError extends Error {
  constructor(message: string, public isOffline: boolean = false) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class GraphQLError extends Error {
  constructor(message: string, public errors?: any[]) {
    super(message);
    this.name = 'GraphQLError';
  }
}

export async function graphqlRequest<T = any>(
  query: string,
  variables?: Record<string, any>,
  options?: { timeout?: number }
): Promise<T> {
  const timeout = options?.timeout || 30000; // 30 seconds default timeout

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let response: Response;
    try {
      response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle abort (timeout)
      if (fetchError.name === 'AbortError') {
        throw new NetworkError('Request timed out. Please check your internet connection and try again.');
      }
      
      // Handle network errors
      if (
        fetchError.message?.includes('Network') ||
        fetchError.message?.includes('network') ||
        fetchError.message?.includes('Failed to fetch') ||
        fetchError.message?.includes('fetch')
      ) {
        throw new NetworkError(
          'Unable to connect to the server. Please check your internet connection.',
          true
        );
      }
      
      // Re-throw unknown errors
      throw new NetworkError(
        `Network request failed: ${fetchError.message || 'Unknown error'}`,
        true
      );
    }

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 0 || response.status >= 500) {
        throw new NetworkError(
          'Server error. Please try again later.',
          true
        );
      }
      if (response.status === 404) {
        throw new NetworkError('Service not found. Please check your configuration.');
      }
      throw new NetworkError(`Request failed with status ${response.status}`);
    }

    let result: any;
    try {
      result = await response.json();
    } catch (jsonError) {
      throw new NetworkError('Invalid response from server. Please try again.');
    }

    // Handle GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors[0]?.message || 'GraphQL request failed';
      throw new GraphQLError(errorMessage, result.errors);
    }

    return result.data;
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof NetworkError || error instanceof GraphQLError) {
      throw error;
    }
    
    // Wrap unknown errors
    if (error instanceof Error) {
      // Check if it's a network-related error
      if (
        error.message.includes('Network') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('fetch')
      ) {
        throw new NetworkError(
          'Unable to connect to the server. Please check your internet connection.',
          true
        );
      }
      throw new NetworkError(error.message, true);
    }
    
    throw new NetworkError('An unexpected error occurred. Please try again.');
  }
}

