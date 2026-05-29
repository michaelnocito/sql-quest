// PROJECT DIRECTIVES — the rules we set for THIS project, encoded as tests so
// they can't silently regress: keep the player oriented, keep the action
// visible, stamp every build, bake in spaced retrieval, stay private-network
// clean, and never leak private design notes into shipped files.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { openGame, startCampaign } = require('./helpers');

test.describe('Project directives', () => {
  test('player is oriented: wave counter, concept, and a step for every wave', async ({ page }) => {
    await openGame(page);
    await startCampaign(page);
    await expect(page.locator('#wave-num')).toHaveText('1');
    const total = Number(await page.locator('#wave-total').textContent());
    const wavesLen = await page.evaluate(() => window.WAVES.length);
    expect(total).toBe(wavesLen);
    const steps = await page.locator('#track .track-step').count();
    expect(steps).toBe(wavesLen);
    await expect(page.locator('#wave-concept')).not.toBeEmpty();
  });

  test('the primary action (editor + Execute) stays visible, even after a query', async ({ page }) => {
    await openGame(page);
    await startCampaign(page);
    await expect(page.locator('#sql')).toBeInViewport();
    await expect(page.getByRole('button', { name: /execute query/i })).toBeVisible();
    await page.fill('#sql', 'SELECT * FROM enemies');
    await page.getByRole('button', { name: /execute query/i }).click();
    await page.waitForTimeout(600);
    await expect(page.locator('#sql')).toBeInViewport(); // result table didn't bury it
  });

  test('build stamp is present and in the agreed ET format', async ({ page }) => {
    await openGame(page);
    const stamp = await page.locator('#build-ts').textContent();
    // e.g. "May 28, 2026 · 9:11 PM ET"
    expect(stamp.trim()).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4} · \d{1,2}:\d{2} (AM|PM) ET$/);
  });

  test('spaced-retrieval data is present (reinforces + later recall)', async ({ page }) => {
    await openGame(page);
    const r = await page.evaluate(() => {
      const w = window.WAVES;
      return {
        everyWaveHasReinforces: w.every((x) => Array.isArray(x.reinforces)),
        laterWavesRecallEarlier: w.slice(1).some((x) => x.reinforces.length > 0),
      };
    });
    expect(r.everyWaveHasReinforces).toBe(true);
    expect(r.laterWavesRecallEarlier).toBe(true);
  });

  test('only same-origin and known CDNs (sql.js + Google Fonts) are contacted', async ({ page }) => {
    // Allowed external hosts: the sql.js WebAssembly CDN and Google Fonts.
    // (If we ever self-host fonts for full privacy/offline, drop the font hosts.)
    const ALLOWED = ['localhost', '127.0.0.1', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];
    const offsite = new Set();
    page.on('request', (req) => {
      const u = new URL(req.url());
      if (!ALLOWED.includes(u.hostname)) offsite.add(u.hostname);
    });
    await openGame(page);
    await startCampaign(page);
    await page.waitForTimeout(600);
    expect([...offsite], [...offsite].join(', ')).toEqual([]);
  });

  test('private design notes never leak into shipped files', async () => {
    const fixturePath = path.resolve(__dirname, 'fixtures', 'private-terms.local.json');
    test.skip(!fs.existsSync(fixturePath), 'No local private-terms fixture present — leak guard skipped (see TESTING.md).');
    const terms = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const shipped = ['games/sql/index.html', 'games/sql/waves.js', 'index.html', 'README.md', 'ROADMAP.md', 'docs/SPEC.md'];
    const offendingFiles = new Set();
    for (const f of shipped) {
      const p = path.resolve(__dirname, '..', f);
      if (!fs.existsSync(p)) continue;
      const txt = fs.readFileSync(p, 'utf8').toLowerCase();
      for (const term of terms) {
        if (txt.includes(String(term).toLowerCase())) offendingFiles.add(f);
      }
    }
    // Report only the file (never echo the term itself).
    expect([...offendingFiles], `private design notes leaked into: ${[...offendingFiles].join(', ')}`).toEqual([]);
  });
});
