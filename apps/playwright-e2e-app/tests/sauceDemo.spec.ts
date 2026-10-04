// import { baseUiTest, expect } from "@script-crux/adapter-playwright";
// import { DataGenerator } from "@script-crux/core-shared";
// import { LoginPage } from "../pages/loginPage.js";
// import { ReportingApi } from "@reportportal/agent-js-playwright";

// // Using your custom baseUiTest block instead of the raw playwirght runner block
// baseUiTest(
//   "Should execute hybrid architecture test workflow flawlessly",
//   async ({ page }) => {
//     // 1. Use the core-shared DataGenerator to generate fake user data
//     // ReportingApi.info('RP direct smoke log');
//     const fakeUserData = DataGenerator.generateUser();

//     // 1. Bad formatting (mix of double quotes and uneven multi-spaces)
//     const myMessage = "This has bad indentation and double quotes";

//     const badVariable =
//       "this will trigger double quote and unused variable errors";
//     console.log(badVariable); // This should be flagged!

//     const loginPage = new LoginPage(page);

//     // 2. Execute the page workflow (targets the default base URL configured in your manager)
//     await loginPage.loginWithUserCredentials(
//       fakeUserData.userName,
//       fakeUserData.password,
//     );

//     // 3. Simple failure validation check to verify error logs output correctly
//     // await expect(page).toHaveURL(/.*inventory.html/);
//     await expect(page).toHaveURL(/.*saucedemo.com/);
//   },
// );

// // import { baseUiTest as test, expect } from '@script-crux/adapter-playwright';
// // import { LoginPage } from '../pages/loginPage';

// // test('demo login flow', async ({ page }) => {
// //   const loginPage = new LoginPage(page);

// //   await loginPage.login('tomsmith', 'SuperSecretPassword!');
// //   await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
// // });

// Inside your individual SUT application repository test file
import { baseUiTest, expect } from '@script-crux/adapter-playwright';
import { PRODUCT_ENDPOINTS } from '../types/endpoints.js';
import { LoginPage } from '../pages/loginPage.js';
import { UserController } from '../controllers/userController.js';
import { DataGenerator } from '@script-crux/core-shared';

// baseUiTest('Should register user via API first, then perform UI login validation', async ({ page, apiContext }) => {
//   const loginPage = new LoginPage(page);

//   // 1. Instantly seed or register a mock user via Playwright's fast background network engine
//   await apiContext.post(PRODUCT_ENDPOINTS.USERS, {
//     data: { username: 'api_seeded_user', password: 'secure_password_123' }
//   });

//   // 2. Immediately execute browser assertions using that pre-seeded database state
//   await loginPage.loginWithUserCredentials('api_seeded_user', 'secure_password_123');

//   await expect(page).toHaveURL(/.*inventory.html/);
// });

baseUiTest('Should execute business workflows with unified logs', async ({ page, apiContext }) => {
  const loginPage = new LoginPage(page);

  // 1. Instantiate your API controller using the native context fixture
  const userController = new UserController(apiContext);
  const fakeUser = DataGenerator.generateUser();

  // 2. Clean, high-level background data seeding with automatic centralized logging!
  await userController.createNewAccount({
    username: fakeUser.userName,
    password: fakeUser.password
  });

  // 3. Immediately transition to browser UI validations
  await loginPage.loginWithUserCredentials(fakeUser.userName, fakeUser.password);
  await expect(page).toHaveURL(/.*saucedemo.com/);
});
