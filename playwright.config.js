// Playwright config — how the headless tests run.
// We test in headless Chromium at two sizes: a desktop window and an
// iPhone-12-sized window (the game is mobile-first, so both matter).
const { defineConfig } = require('@playwright/test');

const PORT = Number(process.env.TEST_PORT || 4173);

module.exports = defineConfig({
  testDir: './tests',
  // Fail fast-ish but give the SQL engine (loads over the network) room to boot.
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  // Plain text results in the terminal + a nice clickable HTML report.
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    headless: true,
    // Capture a trace/screenshot when something fails, so it's easy to see why.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  // Start a tiny local web server before the tests, stop it after.
  webServer: {
    command: 'node test/server.js',
    port: PORT,
    reuseExistingServer: true,
    timeout: 20_000,
  },
  projects: [
    {
      name: 'desktop',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } },
    },
    {
      // iPhone-12-ish, still Chromium so we only download one browser.
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
