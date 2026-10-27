import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: process.env.NEXT_PUBLIC_WEBSITE_DATA_SOURCE === 'api' ? '**/api-mode.spec.ts' : '**/*.spec.ts',
  testIgnore: process.env.NEXT_PUBLIC_WEBSITE_DATA_SOURCE === 'api' ? [] : ['**/api-mode.spec.ts'],
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3001", browserName: "chromium", trace: "retain-on-failure" },
  webServer: { command: "npm run dev", url: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3001", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
