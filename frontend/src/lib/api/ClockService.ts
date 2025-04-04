import { ApiClient } from './ApiClient';
import { ClockResponse } from './types';

/**
 * Service for interacting with the Clock API endpoints
 */
export class ClockService {
  private client: ApiClient;

  constructor(apiClient?: ApiClient) {
    this.client = apiClient || new ApiClient();
  }

  /**
   * Get the current server time
   * @returns Promise with the current time data
   */
  async getTime(): Promise<ClockResponse> {
    return this.client.get<ClockResponse>('clock');
  }
}
