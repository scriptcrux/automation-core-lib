import { Page, Route } from '@playwright/test';
import { TestLogger } from '@script-crux/core-shared';

export interface MockResponseOptions {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
  delayMs?: number;
  contentType?: string;
}

export class NetworkMocking {
  /**
   * Mocks a specific URL endpoint with custom status, body, or artificial network delay.
   */
  public static async mockEndpoint(
    page: Page,
    urlPattern: string | RegExp,
    options: MockResponseOptions
  ): Promise<void> {
    const status = options.status ?? 200;
    TestLogger.info(`[MOCK NETWORK] Registering route mock for pattern [${urlPattern.toString()}] -> Status ${status}`);

    await page.route(urlPattern, async (route: Route) => {
      if (options.delayMs && options.delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, options.delayMs));
      }

      const bodyContent =
        typeof options.body === 'string'
          ? options.body
          : options.body !== undefined
            ? JSON.stringify(options.body)
            : undefined;

      try {
        await route.fulfill({
          status,
          contentType: options.contentType || (typeof options.body === 'object' ? 'application/json' : 'text/plain'),
          headers: options.headers,
          body: bodyContent
        });
      } catch {
        // Safe ignore if page unrouted or navigated away during delay
      }
    });
  }

  /**
   * Simulates microservice outage or HTTP error (e.g. 500, 503, 504) to test UI resilience.
   */
  public static async mockServiceFailure(
    page: Page,
    urlPattern: string | RegExp,
    status: number = 500,
    errorMessage: string = 'Simulated Microservice Outage'
  ): Promise<void> {
    TestLogger.warn(`[MOCK NETWORK] Simulating service failure on [${urlPattern.toString()}] with HTTP ${status}`);
    await this.mockEndpoint(page, urlPattern, {
      status,
      body: { error: errorMessage, code: 'SERVICE_UNAVAILABLE', simulated: true }
    });
  }

  /**
   * Clears route mocks for a given pattern or all active routes.
   */
  public static async clearMocks(page: Page, urlPattern?: string | RegExp): Promise<void> {
    TestLogger.info(`[MOCK NETWORK] Clearing route handler for [${urlPattern ? urlPattern.toString() : 'ALL'}]`);
    if (urlPattern) {
      await page.unroute(urlPattern);
    } else {
      await page.unrouteAll();
    }
  }
}
