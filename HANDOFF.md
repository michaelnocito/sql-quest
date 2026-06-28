# SQL Quest -- Session Handoff (6.28.26)

**Current state:** Task #73 shipped, committed, and pushed. 26/26 tests green.
Build stamp: `June 28, 2026 · 9:01 PM ET`. Tree clean except local `.claude/`
(preview config, intentionally untracked).

**Latest commits:**
- `bab984f` -- Build: June 28, 2026 · 9:01 PM ET
- `7da9d38` -- Task #73 -- Phase 1: enemy ship sprites + screen shake/flash feedback

---

## What Task #73 did (just finished)

Mike's feedback: correct-answer animations are hard to see relative to the
terminal. Solution: make feedback impossible to miss via full-screen effects +
replace abstract SVG enemies with real ship sprites.

1. **Enemy ship sprites from CC0 asset pack** (Wisedawn 200+ Starships, Clean
   style): 5 ships (7, 23, 51, 84, 112) mapped to scout/raider/warden
   archetypes. Odd-indexed enemies use alternate sprites for visual variety.
   SVG `<image>` elements replace the polygon mote-core; halo, shield ring,
   charge telegraph, HP bars, and labels all preserved on top.
   Files: `games/sql/enemies/enemy_{7,23,51,84,112}.png`

2. **Screen shake + red damage flash** on wrong answer (`missTurn` +
   `syntaxHit`): full-viewport red overlay (0.35s fade) + CSS shake on
   `<main>` (0.25s). Fires on top of existing enemy lunge/bolt/HP drain.

3. **Green success flash** on correct answer (`volley` + `fatality`):
   full-viewport green overlay (0.4s fade). Fires on top of existing beam
   volley/boom particles/shockwaves.

---

## Active roadmap: Action-RPG progression system

Mike approved a multi-phase expansion (session 6.28.26). Phase 1 shipped;
Phases 2-5 are the next body of work. Full details in ROADMAP.md under
"Action-RPG Progression (Phases 1-5)."

**Phase 1 (DONE):** Ship sprites + screen shake/flash feedback.
**Phase 2:** Enemy variety per wave + item drops on enemy kill.
**Phase 3:** Loot inventory + equippable cosmetics (change ship appearance).
**Phase 4:** Crafting system (scrap pieces from enemies, click-to-craft recipes).
**Phase 5:** Meta progression (stat bonuses, unlockable cosmetics, difficulty tiers).

Key decisions already made:
- Enemy sprites: CC0 asset pack (Wisedawn), not hand-drawn
- Crafting: simple click-to-craft, no skill commands
- Equipment slots: silly but professional cosmetic options
- Ship variety: alternating sprites per enemy index

---

## Open / candidate next tasks (pick with Mike)

1. **Phase 2 build** -- item drops when enemies die, visual loot on the
   battlefield, inventory UI. Needs: drop table design (what items exist,
   rarity tiers), cosmetic sprite set for equippable items.

2. **[Decision for Mike] Hint specificity.** Hints currently name the exact
   syntax (e.g. `WHERE health > 50`). Option: make hints a thinking-nudge and
   reserve full syntax for the existing 3-miss reveal.

3. **Playtest pass on the rewritten prose (W1-W23).** Walk each wave, confirm
   Objective reads crystal-clear and the lore isn't confusing.

4. **Roadmap content** (from `ROADMAP.md`): subqueries, CTEs, window functions.

---

## How to resume fast

- **Local:** `C:\Users\Mike\Projects\sql-quest` -- game is `games/sql/index.html`
  (~2550 lines), waves are `games/sql/waves.js`.
- **Enemy sprites:** `games/sql/enemies/enemy_{7,23,51,84,112}.png` (CC0).
- **Run tests:** `npm test` (Playwright; 26 checks).
- **Preview:** `.claude/launch.json` defines a `sql-quest` server on port 4173
  (node test/server.js). Load the game at `/games/sql/` (trailing slash matters).
  Click "Start Campaign" past the splash.
- **Build stamp:** update `const BUILD_TS` in index.html every build; ET 12-hour
  format. Get it via: `TZ="America/New_York" date "+%B %-d, %Y · %-I:%M %p ET"`.
- **Commit convention:** `Task #NNN -- ...` for the change, then a separate
  `Build: <stamp>` commit. Last task number used = **#73** (next = #74).
  Commit + push without asking (Mike pulls from git).

---

## Guardrails (don't regress)

- All wave content is pure data in `waves.js` -- no engine changes needed to
  add/edit waves.
- Keep tests green. Parallel-run a11y flakes are resource contention; confirm
  with `npx playwright test accessibility.spec.js --workers=1`.
- Private design rationale (psychedelic-celestial notes) must never ship --
  the leak-guard test checks for it.
- Enemy sprites are CC0 licensed (Wisedawn 200+ Starships). No attribution
  required but asset pack source documented here for provenance.
