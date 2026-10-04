import { Locator, Page } from "@playwright/test";
import { BasePage, Step } from "@script-crux/adapter-playwright";

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    // 1. Call the parent BasePage constructor to initialize the page locator
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-buttons"]');
  }

  // 2. Decorate business workflows to print unified logs automatically!
  @Step("User fills out authentication forms and clicks submit")
  async loginWithUserCredentials(user: string, pass: string): Promise<void> {
    await this.fillInputField(this.usernameInput, user, "Username Input Box");
    await this.fillInputField(this.passwordInput, pass, "Password Input Box");
    await this.clickElement(this.loginButton, "Submit Login Action Button");
  }

  //  @Step('Login with demo credentials')
  // async login(username: string, password: string): Promise<void> {
  //   await this.page.getByLabel('Username').fill(username);
  //   await this.page.getByLabel('Password').fill(password);
  //   await this.page.getByRole('button', { name: /login/i }).click();
  // }
}
