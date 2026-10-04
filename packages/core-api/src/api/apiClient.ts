import { ConfigManager, TestLogger } from '@script-crux/core-shared';
import { HTTP_HEADERS } from '../constants/httpHeaders.js';
import { MIME_TYPES } from '../constants/mimeTypes.js';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = ConfigManager.getConfig().baseUrl;
  }

  /**
   * Universal GET Request Helper
   */
  async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    TestLogger.info(`[API REQUEST] Sending GET to: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        [HTTP_HEADERS.ACCEPT]: MIME_TYPES.APPLICATION_JSON,
        ...headers
      }
    });

    if (!response.ok) {
      throw new Error(`[API EXCEPTION] Request failed with status code: ${response.status}`);
    }

    return (await response.json()) as T;
  }
}
