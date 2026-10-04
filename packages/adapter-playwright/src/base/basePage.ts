import { Page, Locator } from '@playwright/test';
import { TestLogger } from '@script-crux/core-shared';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Universal wrapper to perform safe clicks with custom logging frameworks
   */
  async clickElement(locator: Locator, elementName: string): Promise<void> {
    TestLogger.info(`Interacting with UI Component: Clicking [${elementName}]`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * NEW: Universal wrapper to perform safe text entries into input fields
   */
  async fillInputField(locator: Locator, text: string, fieldName: string): Promise<void> {
    TestLogger.info(`Interacting with UI Component: Entering text into [${fieldName}]`);
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text);
  }
}
