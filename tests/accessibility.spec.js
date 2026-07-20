// ACCESSIBILITY — can everyone use it? (WCAG 2.1 AA)
// We run axe-core (the industry-standard automated a11y scanner), check that
// every control has a name a screen reader can announce, and confirm the game
// calms its motion when the OS asks for reduced motion.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { openGame, startCampaign, goToTask } = require('./helpers');

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  test('no serious or critical axe violations on the game screen', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    const summary = serious.map((v) => `${v.id} (${v.impact}) — ${v.help}: ${v.nodes.length} node(s)`).join('\n');
    expect(serious, summary || 'clean').toEqual([]);
  });

  test('every control has an accessible name', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const unnamed = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('button, a, input, textarea, select').forEach((el) => {
        if (el.offsetParent === null) return; // skip hidden controls
        const name = (
          el.getAttribute('aria-label') ||
          el.textContent ||
          el.getAttribute('title') ||
          el.getAttribute('placeholder') ||
          ''
        ).trim();
        if (!name) bad.push(el.tagName + ' ' + el.outerHTML.slice(0, 70));
      });
      return bad;
    });
    expect(unnamed, unnamed.join('\n')).toEqual([]);
  });

  test('honors prefers-reduced-motion (ambient background animation off)', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await openGame(page);
    await goToTask(page);
    const animName = await page.evaluate(() => {
      const el = document.getElementById('field-bg');
      return el ? getComputedStyle(el).animationName : 'none';
    });
    expect(animName).toBe('none');
    await ctx.close();
  });
});
