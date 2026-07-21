// Practice mode: the lesson without the game. The contract that matters is
// isolation — a practice run must be unable to touch base integrity, campaign
// stats, cleared sectors, or where the campaign is parked.
const { test, expect } = require('@playwright/test');
const { openGame } = require('./helpers');

async function enterPractice(page) {
  await openGame(page);
  await page.getByRole('button', { name: /practice/i }).click();
  await expect(page.locator('.prac-row').first()).toBeVisible();
}

test.describe('Practice mode', () => {
  test('every wave is open from the practice range', async ({ page }) => {
    await enterPractice(page);
    const rows = await page.locator('.prac-row').count();
    const waves = await page.evaluate(() => WAVES.length);
    expect(rows).toBe(waves);
  });

  test('misses cost nothing and never touch campaign stats', async ({ page }) => {
    await enterPractice(page);
    const before = await page.evaluate(() => ({
      hp: state.baseHP, attempts: state.attempts, correct: state.correct,
      vision: (state.visionWaves || []).length, cleared: state.cleared.length,
    }));
    // Open a drill and miss it three times — the full help escalation.
    await page.locator('.prac-row').nth(3).click();
    await expect(page.locator('#editor')).toBeVisible();
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => { document.getElementById('editor').value = 'SELECT 1 AS nope;'; });
      await page.getByRole('button', { name: /execute/i }).click();
      await expect(page.locator('.helpline')).toBeVisible();
    }
    const after = await page.evaluate(() => ({
      hp: state.baseHP, attempts: state.attempts, correct: state.correct,
      vision: (state.visionWaves || []).length, cleared: state.cleared.length,
    }));
    expect(after).toEqual(before);
  });

  test('the third miss still hands over the solution — help works, it just is not charged for', async ({ page }) => {
    await enterPractice(page);
    await page.locator('.prac-row').nth(3).click();
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => { document.getElementById('editor').value = 'SELECT 1 AS nope;'; });
      await page.getByRole('button', { name: /execute/i }).click();
      await expect(page.locator('.helpline')).toBeVisible();
    }
    const handed = await page.evaluate(() => ({
      editor: document.getElementById('editor').value.trim(),
      answer: WAVES[state.wave].solution.trim(),
      hp: state.baseHP,
    }));
    expect(handed.editor).toBe(handed.answer);
    expect(handed.hp).toBe(100);
  });

  test('clearing a drill does not mark the sector cleared or advance the campaign', async ({ page }) => {
    await enterPractice(page);
    await page.locator('.prac-row').nth(2).click();
    await page.evaluate(() => { document.getElementById('editor').value = WAVES[state.wave].solution; });
    await page.getByRole('button', { name: /execute/i }).click();
    await expect(page.getByRole('button', { name: /pick another drill/i })).toBeVisible({ timeout: 15_000 });
    const s = await page.evaluate(() => ({
      cleared: state.cleared.length, fatalities: state.fatalities || 0, streak: state.streak || 0,
    }));
    expect(s).toEqual({ cleared: 0, fatalities: 0, streak: 0 });
  });

  test('leaving practice puts the campaign back exactly where it was', async ({ page }) => {
    await openGame(page);
    await page.evaluate(() => { state.wave = 5; state.begun = true; save(); });
    await page.reload();
    await page.waitForFunction(() => typeof SQLjs !== 'undefined' && SQLjs !== null);
    await page.getByRole('button', { name: /practice/i }).click();
    await page.locator('.prac-row').nth(0).click();
    await expect(page.locator('#editor')).toBeVisible();
    await page.getByRole('button', { name: /back to drills/i }).click();
    await page.getByRole('button', { name: /back to the title/i }).click();
    const wave = await page.evaluate(() => state.wave);
    expect(wave).toBe(5);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('sqlquest')).wave);
    expect(saved).toBe(5);
  });
});
