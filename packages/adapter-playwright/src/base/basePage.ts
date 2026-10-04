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
   * Universal wrapper to perform safe text entries into input fields
   */
  async fillInputField(locator: Locator, text: string, fieldName: string): Promise<void> {
    TestLogger.info(`Interacting with UI Component: Entering text into [${fieldName}]`);
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Retrieves inner text content from an element safely
   */
  async getText(locator: Locator, elementName: string): Promise<string> {
    TestLogger.info(`Reading text from [${elementName}]`);
    await locator.waitFor({ state: 'visible' });
    const text = await locator.innerText();
    return text.trim();
  }

  /**
   * Checks if an element is visible within a given timeout
   */
  async isDisplayed(locator: Locator, elementName: string, timeoutMs: number = 3000): Promise<boolean> {
    TestLogger.info(`Checking visibility for [${elementName}]`);
    try {
      await locator.waitFor({ state: 'visible', timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Selects an option from a dropdown element
   */
  async selectOption(locator: Locator, valueOrLabel: string, elementName: string): Promise<void> {
    TestLogger.info(`Selecting option [${valueOrLabel}] in [${elementName}]`);
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption({ label: valueOrLabel });
  }

  /**
   * Waits for an element to reach a specific state
   */
  async waitForElement(
    locator: Locator,
    elementName: string,
    state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible',
    timeoutMs?: number
  ): Promise<void> {
    TestLogger.info(`Waiting for [${elementName}] to be [${state}]`);
    await locator.waitFor({ state, timeout: timeoutMs });
  }

  /**
   * Retrieves an HTML attribute value from an element
   */
  async getAttribute(locator: Locator, attributeName: string, elementName: string): Promise<string | null> {
    TestLogger.info(`Reading attribute [${attributeName}] from [${elementName}]`);
    await locator.waitFor({ state: 'attached' });
    return await locator.getAttribute(attributeName);
  }

  /**
   * Scrolls an element into view
   */
  async scrollIntoView(locator: Locator, elementName: string): Promise<void> {
    TestLogger.info(`Scrolling into view: [${elementName}]`);
    await locator.scrollIntoViewIfNeeded();
  }
}
