import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3001", browserName: "chromium", trace: "retain-on-failure" },
  webServer: { command: "npm run dev", url: "http://127.0.0.1:3001", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
