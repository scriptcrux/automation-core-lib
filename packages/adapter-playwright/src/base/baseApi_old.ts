import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestLogger } from '@script-crux/core-shared';

export abstract class BaseApi {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Technical Wrapper for HTTP GET requests with automated logging hooks
   */
  protected async sendGet(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    TestLogger.info(`[HTTP GET] Requesting resource path: ${url}`);
    const response = await this.request.get(url, { headers });
    this.validateResponseState('GET', url, response);
    return response;
  }

  /**
   * Technical Wrapper for HTTP POST requests with automated logging hooks
   */
  protected async sendPost(url: string, payload: object, headers?: Record<string, string>): Promise<APIResponse> {
    TestLogger.info(`[HTTP POST] Dispatching data payload to endpoint: ${url}`);
    const response = await this.request.post(url, { data: payload, headers });
    this.validateResponseState('POST', url, response);
    return response;
  }

  /**
   * Technical Wrapper for HTTP PUT requests with automated logging hooks
   */
  protected async sendPut(url: string, payload: object, headers?: Record<string, string>): Promise<APIResponse> {
    TestLogger.info(`[HTTP PUT] Updating target resource state at path: ${url}`);
    const response = await this.request.put(url, { data: payload, headers });
    this.validateResponseState('PUT', url, response);
    return response;
  }

  /**
   * Technical Wrapper for HTTP DELETE requests with automated logging hooks
   */
  protected async sendDelete(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    TestLogger.info(`[HTTP DELETE] Purging target resource path: ${url}`);
    const response = await this.request.delete(url, { headers });
    this.validateResponseState('DELETE', url, response);
    return response;
  }

  /**
   * Shared private utility to uniformly intercept and report network status errors
   */
  private validateResponseState(method: string, url: string, response: APIResponse): void {
    if (!response.ok()) {
      TestLogger.error(
        `[NETWORK ALERT] [${method}] failed on path [${url}] with HTTP Status Code: ${response.status()} (${response.statusText()})`
      );
    } else {
      TestLogger.info(`[NETWORK SUCCESS] [${method}] responded with HTTP Status Code: ${response.status()}`);
    }
  }
}
