// Phone pass — the game is played on a 390px screen as often as a desktop one,
// so the things that break a phone playthrough get their own guard rails:
// tap-target size, no sideways scrolling, an editor iOS won't zoom into, and a
// build pad that can never shove Execute off the bottom of the screen.
const { test, expect } = require('@playwright/test');
const { openGame, goToTask } = require('./helpers');

// These only mean anything at phone width, so skip the desktop project.
test.describe('Phone layout', () => {
  test.skip(({ viewport }) => viewport.width > 600, 'phone-width checks only');

  test('every control on the firing console clears a 44px tap target', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const small = await page.evaluate(() => {
      const sel = '.btn, .btn-sm, .icon-btn, .tok, .modetabs button, .outtabs button';
      return [...document.querySelectorAll(sel)]
        .filter(el => el.offsetParent !== null)
        .map(el => ({ t: (el.textContent || el.id || '').trim().slice(0, 24), h: Math.round(el.getBoundingClientRect().height) }))
        .filter(x => x.h < 44);
    });
    expect(small, `controls under 44px: ${JSON.stringify(small)}`).toEqual([]);
  });

  test('no horizontal scrolling anywhere in the wave flow', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const overflow = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.body.clientWidth,
    }));
    expect(overflow.doc).toBeLessThanOrEqual(1);
    expect(overflow.body).toBeLessThanOrEqual(1);
  });

  test('editor is at least 16px so iOS never zooms on focus, and the ghost matches it', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const m = await page.evaluate(() => {
      const g = el => {
        const s = getComputedStyle(el);
        return { size: s.fontSize, line: s.lineHeight, family: s.fontFamily };
      };
      return { ed: g(document.getElementById('editor')), ghost: g(document.getElementById('ghost')) };
    });
    expect(parseFloat(m.ed.size)).toBeGreaterThanOrEqual(16);
    // The ghost is the syntax-highlighted underlay drawn behind the transparent
    // textarea text — if its metrics drift, the highlight slides off the caret.
    expect(m.ghost).toEqual(m.ed);
  });

  test('a long build pad scrolls inside itself instead of burying Execute', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const pad = await page.evaluate(() => {
      const el = document.querySelector('.buildpad');
      if (!el) return null;
      const s = getComputedStyle(el);
      return { overflowY: s.overflowY, capped: el.getBoundingClientRect().height <= window.innerHeight * 0.5 };
    });
    expect(pad).not.toBeNull();
    expect(pad.overflowY).toBe('auto');
    expect(pad.capped).toBe(true);
  });
});
