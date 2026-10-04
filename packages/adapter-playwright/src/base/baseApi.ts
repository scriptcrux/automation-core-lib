import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestLogger } from '@script-crux/core-shared';

type HeadersMap = Record<string, string>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export abstract class BaseApi {
  protected constructor(protected readonly request: APIRequestContext) {}

  protected async get(url: string, headers?: HeadersMap): Promise<APIResponse> {
    return this.send('GET', url, { headers });
  }

  protected async post<TPayload>(url: string, payload?: TPayload, headers?: HeadersMap): Promise<APIResponse> {
    return this.send('POST', url, { data: payload, headers });
  }

  protected async put<TPayload>(url: string, payload?: TPayload, headers?: HeadersMap): Promise<APIResponse> {
    return this.send('PUT', url, { data: payload, headers });
  }

  protected async delete(url: string, headers?: HeadersMap): Promise<APIResponse> {
    return this.send('DELETE', url, { headers });
  }

  private async send(
    method: HttpMethod,
    url: string,
    options: { data?: unknown; headers?: HeadersMap } = {}
  ): Promise<APIResponse> {
    TestLogger.info(`[HTTP ${method}] ${url}`);

    const response = await this.request.fetch(url, {
      method,
      headers: options.headers,
      data: options.data
    });

    this.logResponse(method, url, response);
    return response;
  }

  private logResponse(method: HttpMethod, url: string, response: APIResponse): void {
    const statusMessage = `[HTTP ${method}] ${url} -> ${response.status()} ${response.statusText()}`;

    if (response.ok()) {
      TestLogger.info(statusMessage);
      return;
    }

    TestLogger.error(statusMessage);
  }
}
