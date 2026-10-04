import { Locator, Page } from "@playwright/test";
import { BasePage, Step } from "@script-crux/adapter-playwright";

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  @Step("Enter username")
  async enterUsername(user: string): Promise<void> {
    await this.fillInputField(this.usernameInput, user, "Username Input Box");
  }

  @Step("Enter password")
  async enterPassword(pass: string): Promise<void> {
    await this.fillInputField(this.passwordInput, pass, "Password Input Box");
  }

  @Step("Click submit login button")
  async clickSubmit(): Promise<void> {
    await this.clickElement(this.loginButton, "Submit Login Action Button");
  }

  // @Step('Login with valid user credentials')
  async loginWithUserCredentials(user: string, pass: string): Promise<void> {
    await this.enterUsername(user);
    await this.enterPassword(pass);
    await this.clickSubmit();
  }
}
