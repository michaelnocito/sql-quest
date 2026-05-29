// SECURITY — the game runs arbitrary SQL the player types, so the engine must
// only ever allow read-only queries, and we must not ship secrets.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { openGame } = require('./helpers');

const BANNED = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'REPLACE', 'ATTACH', 'DETACH', 'PRAGMA', 'VACUUM'];

test.describe('Security', () => {
  test('the SQL allowlist blocks every write/DDL verb', async ({ page }) => {
    await openGame(page);
    const r = await page.evaluate((banned) => {
      return {
        readOk: isSafe('SELECT * FROM enemies'),
        blocked: banned.filter((v) => isSafe(`${v} something`) === false),
      };
    }, BANNED);
    expect(r.readOk).toBe(true);
    expect(r.blocked.sort()).toEqual([...BANNED].sort());
  });

  test('no obvious secrets in shipped source', async () => {
    const files = ['games/sql/index.html', 'games/sql/waves.js', 'index.html', 'README.md', 'ROADMAP.md', 'docs/SPEC.md'];
    const patterns = [
      /sk-[A-Za-z0-9]{20,}/, // OpenAI-style key
      /AKIA[0-9A-Z]{16}/, // AWS access key id
      /ghp_[A-Za-z0-9]{30,}/, // GitHub token
      /-----BEGIN [A-Z ]*PRIVATE KEY-----/, // private key block
    ];
    const hits = [];
    for (const f of files) {
      const p = path.resolve(__dirname, '..', f);
      if (!fs.existsSync(p)) continue;
      const txt = fs.readFileSync(p, 'utf8');
      patterns.forEach((re) => { if (re.test(txt)) hits.push(`${f} matches ${re}`); });
    }
    expect(hits, hits.join('\n')).toEqual([]);
  });
});
