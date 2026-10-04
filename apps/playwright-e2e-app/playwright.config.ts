import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  // 1. Hook up your production-grade core listener package directly!
  // Give the overall test run a higher buffer limit (e.g., 45 seconds)
  timeout: 45000,
  reporter: [['list'], ['@script-crux/adapter-playwright/reporter']],

  use: {
    headless: true,
    // 🌟 CRUCIAL: Individual actions will fail after 10 seconds.
    // This allows the browser to stay alive long enough to attach the screenshot inside the step!
    actionTimeout: 10000,
    screenshot: 'only-on-failure',
    baseURL: 'https://www.saucedemo.com',
    // 🌟 ADD THIS: Record video files automatically only on a test failure
    video: 'retain-on-failure'
  }
});
