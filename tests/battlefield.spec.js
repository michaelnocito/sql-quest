// Battlefield legibility: the scope should show the whole situation, not just
// the answer. Off-target contacts explain why an over-broad query costs you HP,
// and per-contact jitter stops a lane of five Raiders reading as one ship
// stamped five times. Both are cosmetic — grading must not move.
const { test, expect } = require('@playwright/test');
const { openGame, goToTask } = require('./helpers');

test.describe('Battlefield', () => {
  test('off-target contacts appear on filtered waves and are never counted as targets', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    // Jump to the first WHERE wave, where the solution deliberately excludes rows.
    const info = await page.evaluate(() => {
      const i = WAVES.findIndex(w => /\bWHERE\b/i.test(w.solution) && !/\bJOIN\b/i.test(w.solution));
      state.wave = i; state.phase = 0;
      screenTask();
      return {
        wave: WAVES[i].id,
        hostiles: enemiesLive.length,
        offTargets: offTargets.map(o => o.name),
        rings: document.querySelectorAll('#field .offtarget').length,
      };
    });
    expect(info.offTargets.length).toBeGreaterThan(0);
    expect(info.rings).toBe(info.offTargets.length);
    // An off-target must never also be a live hostile — that would make the
    // correct query look like it spared something it actually destroyed.
    const overlap = await page.evaluate(() => {
      const names = new Set(enemiesLive.map(e => String(e.name)));
      return offTargets.filter(o => names.has(String(o.name))).map(o => o.name);
    });
    expect(overlap).toEqual([]);
  });

  test('waves with nothing to leave out show no off-target ring', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    // Wave 1 is SELECT * — every row is a target, so there is nothing to spare.
    const n = await page.evaluate(() => {
      state.wave = 0; state.phase = 0; screenTask();
      return offTargets.length;
    });
    expect(n).toBe(0);
  });

  test('aggregate and JOIN waves opt out (no honest row identity to draw)', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const bad = await page.evaluate(() => {
      const out = [];
      WAVES.forEach((w, i) => {
        if (!/\b(COUNT|SUM|AVG|MIN|MAX)\s*\(|\bGROUP\s+BY\b|\bJOIN\b/i.test(w.solution)) return;
        state.wave = i; state.phase = 0; prepareWave();
        if (offTargets.length) out.push(w.id);
      });
      return out;
    });
    expect(bad).toEqual([]);
  });

  test('per-contact jitter is varied but stable across redraws', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const r = await page.evaluate(() => {
      const i = WAVES.findIndex(w => /\bWHERE\b/i.test(w.solution));
      state.wave = i; state.phase = 0; screenTask();
      const read = () => [...document.querySelectorAll('#field .enemy image')]
        .map(el => el.getAttribute('width') + '|' + el.getAttribute('transform'));
      const first = read();
      drawField();
      return { first, second: read(), contacts: enemiesLive.length };
    });
    expect(r.contacts).toBeGreaterThan(1);
    // Stable: a redraw mid-wave must not re-roll the fleet's appearance.
    expect(r.second).toEqual(r.first);
    // Varied: no two ships share the exact same size and attitude.
    expect(new Set(r.first).size).toBe(r.first.length);
  });

  test('the debrief teaches after the shot lands, and never before it', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    // Nothing on the firing console may leak the post-solve teaching.
    // innerText reflects CSS text-transform, so match case-insensitively.
    const preSolve = (await page.locator('#app').innerText()).toLowerCase();
    expect(preSolve).not.toContain('what you just did');
    expect(preSolve).not.toContain('on the job');

    await page.evaluate(() => { document.getElementById('editor').value = WAVES[state.wave].solution; });
    await page.getByRole('button', { name: /execute/i }).click();
    await expect(page.getByRole('button', { name: /next sector/i })).toBeVisible({ timeout: 15_000 });
    const debrief = (await page.locator('#app').innerText()).toLowerCase();
    expect(debrief).toContain('what you just did');
    expect(debrief).toContain('on the job');
  });
});
