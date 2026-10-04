import { test as baseTest, APIRequestContext } from '@playwright/test'; // ◀️ Added APIRequestContext to imports
import { ConfigManager, TestLogger } from '@script-crux/core-shared';

// Extend the fixture typing contract to expose the API request capability
export const baseUiTest = baseTest.extend<{
  apiContext: APIRequestContext; // ◀️ Properly type the context parameter interface contract
}>({
  // 1. Auto-configure the Playwright API context layer
  apiContext: async ({ playwright }, use) => { // ◀️ Types are now inferred cleanly via the extended generic contract
    const appConfig = ConfigManager.getConfig();
    
    // Boot up an isolated network context targeting the active environment URL
    const context = await playwright.request.newContext({
      baseURL: appConfig.baseUrl,
    });
    
    await use(context);
    await context.dispose(); // Clean up network sockets automatically
  },

  // 2. Update your page navigation fixture block to log uniformly
  page: async ({ page }, use) => {
    const appConfig = ConfigManager.getConfig();
    TestLogger.info(`Bootstrapping browser engine workflow for environment profile: [${appConfig.envName}]`);
    
    await page.goto(appConfig.baseUrl);
    await use(page);
  },
});

export { expect } from '@playwright/test';
