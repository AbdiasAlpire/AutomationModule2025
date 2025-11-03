import { defineConfig, devices } from '@playwright/test';
<<<<<<< HEAD
import dotenv from 'dotenv';
import path from 'path';
=======
>>>>>>> parent of 1688d32 (Merge pull request #1 from carolyLazo/final-project)

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') }); // 🔹 DESCOMENTADO para leer .env

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
<<<<<<< HEAD
  testDir: './src/tests',
  testMatch: '**/*.spec.ts',
=======
  testDir: './tests',
>>>>>>> parent of 1688d32 (Merge pull request #1 from carolyLazo/final-project)
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
<<<<<<< HEAD
    baseURL: process.env.API_BASE, // 🔹 ahora baseURL usa valor de .env
=======
    // baseURL: 'http://localhost:3000',
>>>>>>> parent of 1688d32 (Merge pull request #1 from carolyLazo/final-project)

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
