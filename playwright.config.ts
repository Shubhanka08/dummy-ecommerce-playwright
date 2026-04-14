import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,

  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-web-security', '--no-sandbox'],
        },
      },
    },
  ],
});