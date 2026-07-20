// FUNCTIONAL — does the game actually work?
// Every wave must be solvable, the escalating help must behave, sorting/top-N
// must be enforced, and progress must survive a reload — with no console errors.
const { test, expect } = require('@playwright/test');
const { openGame, goToTask, watchErrors } = require('./helpers');

test.describe('Functional correctness', () => {
  test('loads and boots the SQL engine with no console errors', async ({ page }) => {
    const errors = watchErrors(page);
    await openGame(page);
    await goToTask(page);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('every wave is solvable by its own solution', async ({ page }) => {
    await openGame(page);
    const results = await page.evaluate(() => {
      return window.WAVES.map((w) => {
        const db = freshDB(w.schema);
        const sol = execQuery(db, w.solution);
        const ordered = solutionIsOrdered(w.solution);
        const pass = sameResult(sol, sol, ordered);
        db.close();
        // Row-result waves should have a name/id so enemies render with a label.
        const isSummary = /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(w.solution) || /\bgroup\s+by\b/i.test(w.solution);
        const renderable = isSummary || sol.columns.includes('name') || sol.columns.includes('id');
        return { id: w.id, concept: w.concept, rows: sol.rows.length, renderable, pass, hasStory: typeof w.story === 'string' && w.story.length > 40 };
      });
    });
    expect(results.length).toBeGreaterThanOrEqual(9);
    for (const r of results) {
      expect(r.pass, `wave ${r.id} (${r.concept}) solution should match itself`).toBe(true);
      expect(r.rows, `wave ${r.id} should return at least one target`).toBeGreaterThan(0);
      expect(r.renderable, `wave ${r.id} needs a name/id column so enemies render`).toBe(true);
      expect(r.hasStory, `wave ${r.id} needs a Captain's story for the briefing screen`).toBe(true);
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

  test('UI playthrough: solving wave 1 leads to the debrief card', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const solution = await page.evaluate(() => window.WAVES[0].solution);
    await page.fill('#editor', solution);
    await page.getByRole('button', { name: /execute/i }).click();
    // Clean first-try → FATALITY banner on the debrief; a Next sector CTA follows.
    await expect(page.locator('.winbanner')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: /next sector/i })).toBeVisible();
  });

  test('escalating help: free miss, then half the code, then the full solution', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const solution = await page.evaluate(() => window.WAVES[0].solution);
    const hpBefore = await page.evaluate(() => state.baseHP);

    // Miss 1 — free: a wry line + diagnostic, no HP cost, editor untouched.
    await page.fill('#editor', 'SELECT name FROM contacts');
    await page.getByRole('button', { name: /execute/i }).click();
    await expect(page.locator('.helpline')).toBeVisible();
    expect(await page.evaluate(() => state.baseHP)).toBe(hpBefore);
    expect(await page.locator('#trypips i.used').count()).toBe(1);

    // Miss 2 — costs the base and pre-fills ~half the solution.
    await page.fill('#editor', 'SELECT name FROM contacts');
    await page.getByRole('button', { name: /execute/i }).click();
    await expect(page.locator('#trypips i.used')).toHaveCount(2);
    expect(await page.evaluate(() => state.baseHP)).toBeLessThan(hpBefore);
    const half = await page.inputValue('#editor');
    expect(half.trim().length).toBeGreaterThan(0);
    expect(solution.replace(/\s+/g, ' ')).toContain(half.trim().replace(/\s+/g, ' '));

    // Miss 3 — hands over the full solution; the player still presses Execute.
    await page.fill('#editor', 'SELECT name FROM contacts');
    await page.getByRole('button', { name: /execute/i }).click();
    await expect(page.locator('#trypips i.used')).toHaveCount(3);
    expect((await page.inputValue('#editor')).replace(/\s+/g, ' ').trim())
      .toBe(solution.replace(/\s+/g, ' ').trim());
    await page.getByRole('button', { name: /execute/i }).click();
    await expect(page.locator('.winbanner')).toBeVisible({ timeout: 10_000 });
  });

  test('no part of the solution is visible before the 2nd miss', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const solution = await page.evaluate(() => window.WAVES[0].solution);
    const norm = (s) => s.replace(/\s+/g, ' ').replace(/;$/, '').trim().toLowerCase();
    // Pre-solve: empty editor (Trail starts blank — no starter pre-fill, no ghost),
    // and the solution string appears nowhere in the rendered screen.
    expect(await page.inputValue('#editor')).toBe('');
    let body = await page.locator('#app').innerText();
    expect(norm(body)).not.toContain(norm(solution));
    // Tab must not insert anything (dev mode is gone).
    await page.focus('#editor');
    await page.keyboard.press('Tab');
    expect(await page.inputValue('#editor')).toBe('');
    // After miss 1 (free): still no solution anywhere, editor untouched.
    await page.fill('#editor', 'SELECT name FROM contacts');
    await page.getByRole('button', { name: /execute/i }).click();
    await expect(page.locator('#trypips i.used')).toHaveCount(1);
    expect(norm(await page.inputValue('#editor'))).not.toBe(norm(solution));
    body = await page.locator('#app').innerText();
    expect(norm(body)).not.toContain(norm(solution));
  });

  test('an empty Execute does not count as a try', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    await page.getByRole('button', { name: /execute/i }).click();
    expect(await page.locator('#trypips i.used').count()).toBe(0);
    await expect(page.locator('#feedback')).toContainText(/write a query first/i);
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
