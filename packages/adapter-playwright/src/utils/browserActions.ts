import { BrowserContext, Page } from '@playwright/test';
import { TestLogger } from '@script-crux/core-shared';

export class BrowserActions {
    /**
     * Safely switches focus to a newly opened browser tab/window and verifies its URL pattern
     */
    static async waitForNewTab(
        context: BrowserContext,
        expectedUrlPattern?: RegExp
    ): Promise<Page> {
        TestLogger.info('Waiting for a new browser tab...');

        // Wait for the new page promise to resolve natively
        const newPage = await context.waitForEvent('page');
        await newPage.waitForLoadState('domcontentloaded');

        const actualUrl = newPage.url();

        if (expectedUrlPattern && !expectedUrlPattern.test(actualUrl)) {
            TestLogger.warn(`New tab URL [${actualUrl}] did not match [${expectedUrlPattern}]`);
        } else {
            TestLogger.info(`Switched to new tab: ${actualUrl}`);
        }

        return newPage;
    }
}
