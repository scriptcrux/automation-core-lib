import { Page } from '@playwright/test';
import { TestLogger } from '@script-crux/core-shared';

export interface EventStreamWaitOptions {
  eventType?: string;
  predicate?: (data: any) => boolean;
  timeoutMs?: number;
}

export class EventStreamHelper {
  /**
   * Evaluates and waits for a specific EventSource message on the client window.
   */
  public static async waitForClientEvent<T = any>(page: Page, options: EventStreamWaitOptions = {}): Promise<T> {
    const { eventType, timeoutMs = 8000 } = options;
    TestLogger.info(
      `[EVENT STREAM] Waiting for browser EventSource message ${eventType ? `(type: ${eventType})` : ''}...`
    );

    // Ensure global event collector is attached in browser context
    await page.evaluate(() => {
      if (!(window as any).__billPulseEvents) {
        (window as any).__billPulseEvents = [];
      }
    });

    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      const match = await page.evaluate((type) => {
        const events = (window as any).__billPulseEvents || [];
        if (!type) {
          return events[events.length - 1] || null;
        }
        for (let i = events.length - 1; i >= 0; i--) {
          if (events[i]?.type === type || events[i]?.eventType === type) {
            return events[i];
          }
        }
        return null;
      }, eventType);

      if (match) {
        if (!options.predicate || options.predicate(match)) {
          TestLogger.info(`[EVENT STREAM] Captured matching browser event: ${JSON.stringify(match).slice(0, 100)}`);
          return match as T;
        }
      }

      await page.waitForTimeout(200);
    }

    throw new Error(
      `Timeout of ${timeoutMs}ms exceeded while waiting for event stream message ${eventType ? `of type '${eventType}'` : ''}`
    );
  }
}
