// Shared helpers for the test specs.
const { expect } = require('@playwright/test');

const GAME_URL = '/games/sql/';

// Start collecting console errors + uncaught page errors.
// Call this BEFORE navigating so nothing is missed.
function watchErrors(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

// Load the game and wait until the SQLite engine has finished booting.
async function openGame(page) {
  await page.goto(GAME_URL);
  // SQLjs is set once the WebAssembly SQLite engine has loaded.
  await page.waitForFunction(() => typeof SQLjs !== 'undefined' && SQLjs !== null, null, { timeout: 20_000 });
  await page.waitForFunction(() => Array.isArray(window.WAVES) && window.WAVES.length > 0);
}

// Title screen → sector chart (Trail-style flow: Launch/Resume lands on the map).
async function startCampaign(page) {
  await page.getByRole('button', { name: /launch campaign|resume/i }).click();
  await expect(page.locator('#track')).toBeVisible();
}

// All the way to the firing console: map → briefing → task.
async function goToTask(page) {
  await startCampaign(page);
  await page.getByRole('button', { name: /advance to the swarm/i }).click();
  await page.getByRole('button', { name: /on to the firing console/i }).click();
  await expect(page.locator('#editor')).toBeVisible();
}

module.exports = { GAME_URL, watchErrors, openGame, startCampaign, goToTask };
