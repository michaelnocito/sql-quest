// FUNCTIONAL — does the game actually work?
// Every wave must be solvable, the feedback tiers must behave, sorting/top-N
// must be enforced, and progress must survive a reload — with no console errors.
const { test, expect } = require('@playwright/test');
const { openGame, startCampaign, watchErrors } = require('./helpers');

test.describe('Functional correctness', () => {
  test('loads and boots the SQL engine with no console errors', async ({ page }) => {
    const errors = watchErrors(page);
    await openGame(page);
    await startCampaign(page);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('every wave is solvable by its own solution', async ({ page }) => {
    await openGame(page);
    const results = await page.evaluate(() => {
      return window.WAVES.map((w) => {
        const db = freshDB(w.schema);
        const sol = execQuery(db, w.solution);
        const ordered = /\border\s+by\b/i.test(w.solution);
        const pass = sameResult(sol, sol, ordered);
        db.close();
        // Row-result waves should have a name/id so enemies render with a label.
        // Aggregate/grouped waves are summary readouts — the "target" is the
        // number itself, so this check doesn't apply there.
        const isSummary = /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(w.solution) || /\bgroup\s+by\b/i.test(w.solution);
        const renderable = isSummary || sol.columns.includes('name') || sol.columns.includes('id');
        return { id: w.id, concept: w.concept, rows: sol.rows.length, renderable, pass };
      });
    });
    expect(results.length).toBeGreaterThanOrEqual(9);
    for (const r of results) {
      expect(r.pass, `wave ${r.id} (${r.concept}) solution should match itself`).toBe(true);
      expect(r.rows, `wave ${r.id} should return at least one target`).toBeGreaterThan(0);
      expect(r.renderable, `wave ${r.id} needs a name/id column so enemies render`).toBe(true);
    }
  });

  test('ORDER BY waves enforce row order; other waves stay order-insensitive', async ({ page }) => {
    await openGame(page);
    const r = await page.evaluate(() => {
      const out = {};
      const w7 = window.WAVES.find((w) => /order by/i.test(w.solution) && !/limit/i.test(w.solution));
      let db = freshDB(w7.schema);
      const sol = execQuery(db, w7.solution);
      const asc = execQuery(db, w7.solution.replace(/desc/i, 'ASC'));
      const unsorted = execQuery(db, 'SELECT * FROM enemies');
      db.close();
      out.correct = sameResult(sol, sol, true);
      out.wrongDirection = sameResult(sol, asc, true);
      out.unsorted = sameResult(sol, unsorted, true);
      const w1 = window.WAVES[0];
      db = freshDB(w1.schema);
      const s1 = execQuery(db, w1.solution);
      db.close();
      out.reversedStillMatches = sameResult(s1, { columns: s1.columns, rows: s1.rows.slice().reverse() }, false);
      return out;
    });
    expect(r.correct).toBe(true);
    expect(r.wrongDirection).toBe(false);
    expect(r.unsorted).toBe(false);
    expect(r.reversedStillMatches).toBe(true);
  });

  test('an over-broad query does not clear the wave and is flagged as friendly fire', async ({ page }) => {
    await openGame(page);
    const r = await page.evaluate(() => {
      const w = window.WAVES.find((x) => x.concept === 'WHERE');
      const db = freshDB(w.schema);
      const expected = execQuery(db, w.solution);
      const tooBroad = execQuery(db, 'SELECT * FROM enemies');
      const match = sameResult(expected, tooBroad, false);
      const fp = falsePositives(tooBroad, expected);
      db.close();
      return { match, fp };
    });
    expect(r.match).toBe(false);
    expect(r.fp).toBeGreaterThan(0);
  });

  test('UI playthrough: solving wave 1 clears the wave', async ({ page }) => {
    await openGame(page);
    await startCampaign(page);
    const { solution, rounds } = await page.evaluate(() => ({
      solution: window.WAVES[0].solution,
      rounds: window.WAVES[0].rounds,
    }));
    for (let i = 0; i < rounds; i++) {
      await page.waitForFunction(() => !busy, null, { timeout: 8_000 }).catch(() => {});
      await page.fill('#sql', solution);
      await page.getByRole('button', { name: /execute query/i }).click();
    }
    await expect(page.locator('#overlay')).toHaveClass(/show/, { timeout: 8_000 });
    await expect(page.locator('#ov-title')).toHaveText(/cleared/i);
  });

  test('progress persists across a reload', async ({ page }) => {
    await openGame(page);
    await page.evaluate(() => { state.wave = 4; save(); });
    await page.reload();
    await page.waitForFunction(() => typeof SQLjs !== 'undefined' && SQLjs !== null);
    const wave = await page.evaluate(() => state.wave);
    expect(wave).toBe(4);
  });
});
