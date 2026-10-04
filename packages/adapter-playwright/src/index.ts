// Core Architecture Blocks
export { BasePage } from './base/basePage.js';
export { baseUiTest, expect } from './fixtures/baseUiTest.js';
export { BaseApi } from './base/baseApi.js';

// Reporting Decorators
export { Step } from './decorator/step.js';

// Framework Event Listeners
export { default as CustomTestReporter } from './listener/testReporter.js';

// Low-Level Window/Browser Utilities
export { BrowserActions } from './utils/browserActions.js';
export { NetworkMocking } from './utils/networkMocking.js';
export type { MockResponseOptions } from './utils/networkMocking.js';
export { SoftAssert } from './utils/softAssert.js';
export type { SoftAssertionFailure } from './utils/softAssert.js';
export { EventStreamHelper } from './utils/eventStreamHelper.js';
export type { EventStreamWaitOptions } from './utils/eventStreamHelper.js';
