# Testing SQL Quest

This is a plain-language guide to the game's **automated headless tests** — what
they check, why, and how to run them. "Headless" just means the tests drive a
real web browser that runs invisibly in the background (no window pops up), so
the whole game can be checked in seconds without anyone clicking around by hand.

The tests use **[Playwright](https://playwright.dev/)**, the industry-standard
tool for this. You don't need to know how it works to use it — just the commands
below.

## One-time setup

You need [Node.js](https://nodejs.org/) installed (check with `node --version`).
Then, from the project folder:

```bash
npm install        # downloads the test tools (one time)
npm run setup      # downloads the headless browser (one time)
```

None of this is shipped to the live site — it's developer-only tooling and is
kept out of the repo by `.gitignore`.

## Running the tests

```bash
npm test           # runs everything, prints a pass/fail list
npm run test:report   # opens a detailed clickable report of the last run
```

Green = pass. Red = something to look at; the report shows exactly what and
where (with a screenshot of the moment it failed).

## What gets checked

The tests run at two screen sizes — a desktop window and an iPhone-12-sized
window — because the game is mobile-first.

### `functional.spec.js` — does it actually work?
- The page loads and the SQL engine boots **with zero console errors**.
- **All 9 waves are solvable** by their intended answer, and each returns at
  least one target.
- **Sorting is real:** ORDER BY waves require the right row order (a wrong
  direction or unsorted rows fail); non-sorting waves ignore order.
- An **over-broad query** (returning too many rows) does *not* clear the wave
  and is flagged as friendly fire.
- A full **UI playthrough** clears Wave 1 by typing and firing the answer.
- **Progress persists** across a page reload.

### `accessibility.spec.js` — can everyone use it? (WCAG 2.1 AA)
- An **axe-core** scan finds no serious or critical accessibility problems.
- **Every button/control has a name** a screen reader can announce.
- The game **calms its motion** when the device asks for reduced motion.

### `security.spec.js` — is it safe?
- The SQL allowlist **blocks every write/destructive verb** (DROP, DELETE,
  UPDATE, INSERT, ALTER, CREATE, REPLACE, ATTACH, DETACH, PRAGMA, VACUUM) — the
  game only ever runs read-only queries.
- **No secrets** (API keys, tokens, private keys) are committed in the source.

### `directives.spec.js` — does it follow OUR project rules?
- The player stays **oriented**: wave counter, current concept, and one progress
  step per wave.
- The **primary action stays visible** — the result table never buries the editor.
- Every build carries a **timestamp** in the agreed Eastern-time format.
- **Spaced retrieval** is baked in (each wave's "reinforces" recall data).
- The game only contacts **itself and the sql.js CDN** — no surprise network calls.
- **Private design notes never leak** into shipped files (see below).

## The private-notes leak guard

One directive test checks that internal design notes never end up in any file
that ships publicly. The list of phrases it scans for is intentionally **kept
out of this (public) repo** — it lives in a local-only file:

```
tests/fixtures/private-terms.local.json
```

That file is `.gitignore`d, so it never gets committed or pushed. If it isn't
present (e.g. on a fresh clone), that one test simply **skips** with a note
instead of failing. To enable the guard on a machine, create that file as a JSON
array of strings.

## Notes

- The tests need internet the first time they run, because the game loads its
  SQLite engine (sql.js) from a CDN.
- A tiny local web server (`test/server.js`, no extra dependencies) serves the
  files during a test run and shuts down afterward — Playwright handles this.
