// INPUT MODES — Build / Blanks / Type (ported from SQL Trail).
// Three roads into the same editor + grader: tap-token Build, starter-skeleton
// Blanks, and full-manual Type (ace pay: lighter miss sting).
const { test, expect } = require('@playwright/test');
const { openGame, goToTask } = require('./helpers');

// Click a mode tab by its label fragment.
async function pickMode(page, re) {
  await page.locator('.modetabs button', { hasText: re }).click();
}

test.describe('Input modes', () => {
  test('Build is the default: pad visible, tabs present, editor empty', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    await expect(page.locator('.modetabs button')).toHaveCount(3);
    await expect(page.locator('.modetabs button', { hasText: /build/i })).toHaveClass(/on/);
    await expect(page.locator('.buildpad')).toBeVisible();
    expect(await page.inputValue('#editor')).toBe('');
  });

  test('Build pad assembles a runnable query on wave 1 and clears it', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    // Wave 1 solution: SELECT * FROM contacts;
    for (const tok of ['SELECT', '*', 'FROM', 'contacts']) {
      await page.locator('.buildpad button.tok').filter({ hasText: new RegExp(`^${tok === '*' ? '\\*' : tok}$`) }).first().click();
    }
    expect(await page.inputValue('#editor')).toBe('SELECT * FROM contacts');
    // Undo/Clear behave like Trail's.
    await page.locator('.buildpad button.tok', { hasText: /undo/i }).click();
    expect(await page.inputValue('#editor')).toBe('SELECT * FROM');
    await page.locator('.buildpad button.tok').filter({ hasText: /^contacts$/ }).first().click();
    await page.getByRole('button', { name: /execute/i }).click();
    await expect(page.locator('.winbanner')).toBeVisible({ timeout: 10_000 });
  });

  test('Type mode starts empty, shows ace-pay note, and persists across reload', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    await pickMode(page, /full manual/i);
    await expect(page.locator('.modetabs button', { hasText: /full manual/i })).toHaveClass(/on/);
    expect(await page.inputValue('#editor')).toBe('');
    await expect(page.locator('.buildpad')).toHaveCount(0);
    await expect(page.locator('.ruleline')).toContainText(/ace pay/i);
    // Lighter miss sting is stated on the rule line (−8 / −14).
    await expect(page.locator('.ruleline')).toContainText('−8');
    await expect(page.locator('.ruleline')).toContainText('−14');
    // Selection is remembered (Trail's inputMode pattern).
    expect(await page.evaluate(() => localStorage.getItem('sqlquest-input-v1'))).toBe('type');
    await page.reload();
    await page.waitForFunction(() => typeof SQLjs !== 'undefined' && SQLjs !== null, null, { timeout: 20_000 });
    await goToTask(page);
    await expect(page.locator('.modetabs button', { hasText: /full manual/i })).toHaveClass(/on/);
  });

  test('Blanks mode pre-fills the wave starter skeleton (not the solution)', async ({ page }) => {
    await openGame(page);
    // Wave 2's starter has real blanks: SELECT ____, ____ FROM contacts;
    await page.evaluate(() => { state.wave = 1; state.begun = true; save(); });
    await page.reload();
    await page.waitForFunction(() => typeof SQLjs !== 'undefined' && SQLjs !== null, null, { timeout: 20_000 });
    await goToTask(page);
    await pickMode(page, /blanks/i);
    const { starter, solution } = await page.evaluate(() => ({
      starter: window.WAVES[1].starter, solution: window.WAVES[1].solution,
    }));
    const val = await page.inputValue('#editor');
    expect(val).toBe(starter);
    expect(val.replace(/\s+/g, ' ').trim()).not.toBe(solution.replace(/\s+/g, ' ').trim());
    expect(val).toContain('____');
  });

  test('solution stays hidden pre-miss-2 in Build and Type modes', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const solution = await page.evaluate(() => window.WAVES[0].solution);
    const norm = (t) => t.replace(/\s+/g, ' ').replace(/;$/, '').trim().toLowerCase();
    for (const re of [/full manual/i, /tap the tokens/i]) {
      await pickMode(page, re);
      const body = await page.locator('#app').innerText();
      // The objective/story/pad must not spell out the full answer.
      expect(norm(body)).not.toContain(norm(solution));
      expect(await page.inputValue('#editor')).toBe('');
    }
  });
});
