/**
 * Base API client for making HTTP requests to the backend
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(
    baseUrl: string = 'http://localhost:3001',
    headers: HeadersInit = {}
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  /**
   * Builds a complete URL from the endpoint path
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    method: string,
    body?: any,
    headers?: HeadersInit
  ): Promise<T> {
    const url = this.buildUrl(endpoint);

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    const response = await fetch(url, requestOptions);

    // Handle errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    // Check if the response is empty
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return (await response.json()) as T;
    }

    return {} as T;
  }

  /**
   * HTTP GET request
   */
  public async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, headers);
  }

  /**
   * HTTP POST request
   */
  public async post<T>(
    endpoint: string,
    data?: any,
    headers?: HeadersInit
  ): Promise<T> {
    return this.request<T>(endpoint, 'POST', data, headers);
  }

  /**
   * HTTP PUT request
   */
  public async put<T>(
    endpoint: string,
    data?: any,
    headers?: HeadersInit
  ): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data, headers);
  }

  /**
   * HTTP PATCH request
   */
  public async patch<T>(
    endpoint: string,
    data?: any,
    headers?: HeadersInit
  ): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', data, headers);
  }

  /**
   * HTTP DELETE request
   */
  public async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', undefined, headers);
  }
}
