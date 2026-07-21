// Ship presence + attack motion. Screenshots of this game are unreliable (the
// layered background stalls the renderer, and a hidden preview freezes the CSS
// timeline at 0), so everything here is measured off the DOM and the Web
// Animations API instead of looked at.
const { test, expect } = require('@playwright/test');
const { openGame, goToTask } = require('./helpers');

test.describe('Ships and attacks', () => {
  test('hulls render large on screen, not as specks', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const sizes = await page.evaluate(() =>
      [...document.querySelectorAll('#field .enemy image')].map(el => Math.round(el.getBoundingClientRect().width))
    );
    expect(sizes.length).toBeGreaterThan(0);
    // Pre-#84 a sprite drew at ~50 CSS px on desktop. The floor here is
    // deliberately well above that so a future layout change can't quietly
    // shrink the fleet back down.
    const floor = page.viewportSize().width > 600 ? 78 : 40;
    sizes.forEach(w => expect(w).toBeGreaterThanOrEqual(floor));
  });

  test('no wave packs the formation tight enough for hulls to collide', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const clashes = await page.evaluate(() => {
      const out = [];
      WAVES.forEach((w, wi) => {
        state.wave = wi; state.phase = 0; prepareWave();
        const pts = enemiesLive.map((en, i) => ({
          p: enemyPos(i), r: SHIP_SIZE * jitterOf(en, i).scale / 2, name: en.name
        }));
        for (let a = 0; a < pts.length; a++) {
          for (let b = a + 1; b < pts.length; b++) {
            const d = Math.hypot(pts[a].p.x - pts[b].p.x, pts[a].p.y - pts[b].p.y);
            // Sprites are mostly transparent margin, so allow real overlap of
            // the bounding boxes — but not hulls sitting on top of each other.
            if (d < (pts[a].r + pts[b].r) * 0.62) out.push({ wave: w.id, a: pts[a].name, b: pts[b].name, d: Math.round(d) });
          }
        }
      });
      return out;
    });
    expect(clashes, `overlapping hulls: ${JSON.stringify(clashes)}`).toEqual([]);
  });

  test('every hull stays inside the scope window', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const escapees = await page.evaluate(() => {
      const out = [];
      WAVES.forEach((w, wi) => {
        state.wave = wi; state.phase = 0; prepareWave();
        enemiesLive.forEach((en, i) => {
          const p = enemyPos(i), r = SHIP_SIZE * jitterOf(en, i).scale / 2;
          if (p.x - r * 0.6 < 0 || p.x + r * 0.6 > FIELD_W || p.y - r * 0.6 < 0 || p.y + r * 0.6 > FIELD_H)
            out.push({ wave: w.id, name: en.name });
        });
      });
      return out;
    });
    expect(escapees).toEqual([]);
  });

  test('hulls idle: drift and roll run, and they run out of phase with each other', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const idle = await page.evaluate(() => {
      const ships = [...document.querySelectorAll('#field .ship')];
      return ships.map(s => {
        const anims = s.getAnimations();
        return {
          names: anims.map(a => a.animationName).sort(),
          // Negative delays from the jitter hash: each hull starts mid-cycle.
          delays: anims.map(a => a.effect.getComputedTiming().delay),
        };
      });
    });
    expect(idle.length).toBeGreaterThan(1);
    idle.forEach(s => expect(s.names).toEqual(['ship-drift', 'ship-roll']));
    const signatures = new Set(idle.map(s => JSON.stringify(s.delays)));
    expect(signatures.size).toBe(idle.length);
  });

  test('firing draws travelling bolts and kicks the helm', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const fired = await page.evaluate(async () => {
      document.getElementById('editor').value = WAVES[state.wave].solution;
      submitAnswer();
      await new Promise(r => setTimeout(r, 90));
      const beams = [...document.querySelectorAll('#field .beam')];
      return {
        beams: beams.length,
        // A bolt must have real travel time, not appear whole.
        durations: beams.map(b => b.getAnimations()[0].effect.getComputedTiming().duration),
        muzzle: document.querySelectorAll('#field .muzzle').length,
        recoil: document.querySelector('.field-pane').classList.contains('recoil'),
      };
    });
    expect(fired.beams).toBeGreaterThan(0);
    fired.durations.forEach(d => expect(d).toBeGreaterThan(100));
    expect(fired.muzzle).toBeGreaterThan(0);
    expect(fired.recoil).toBe(true);
  });

  test('a struck hull flashes on its sprite, so the death fade still plays on the group', async ({ page }) => {
    await openGame(page);
    await goToTask(page);
    const anims = await page.evaluate(async () => {
      document.getElementById('editor').value = WAVES[state.wave].solution;
      submitAnswer();
      await new Promise(r => setTimeout(r, 340));
      const g = document.querySelector('#field .enemy.struck');
      if (!g) return null;
      return {
        onSprite: g.querySelector('image').getAnimations().map(a => a.animationName),
        onGroup: g.getAnimations().map(a => a.animationName),
      };
    });
    expect(anims).not.toBeNull();
    expect(anims.onSprite).toContain('struck');
    // The group must be free to own enemy-die — two `animation` rules on one
    // element means only the later one ever runs.
    expect(anims.onGroup).not.toContain('struck');
  });
});
