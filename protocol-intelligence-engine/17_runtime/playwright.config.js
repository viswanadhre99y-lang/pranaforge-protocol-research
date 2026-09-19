// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 2,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: '../18_qa/playwright-results.json' }]],
  use: {
    baseURL: process.env.PIE_BASE_URL || 'http://127.0.0.1:8790',
    screenshot: 'only-on-failure',
    trace: 'off',
    viewport: { width: 1280, height: 900 },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
