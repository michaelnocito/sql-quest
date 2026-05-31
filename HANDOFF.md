# SQL Quest — Session Handoff (5.31.26)

**Current state:** Task #72 shipped, committed, and pushed. 34/34 tests green.
Build stamp: `May 31, 2026 · 1:05 AM ET`. Tree clean except local `.claude/`
(preview config, intentionally untracked).

**Latest commits:**
- `cd4efaa` — Build: May 31, 2026 · 1:05 AM ET
- `61172ca` — Task #72 — Intel Sheet clarity: crisp Objective + rewritten wave prose

---

## What Task #72 did (just finished)

The wave briefings were flowery and buried the actual task. Fixed it:

1. **Rewrote all 23 waves' prose** in `games/sql/waves.js`:
   - `objective` → leads with a plain GOAL, syntax tip moved to a `Hint:` suffix.
     e.g. "Return only the Raiders. Hint: filter with `WHERE type = 'Raider'`…"
   - `briefing` (the ⓘ lore) → cut to 1–2 crisp themed lines.
   - Phased waves 22 & 23 got the same per-phase treatment.

2. **Made the Objective unmissable** in `games/sql/index.html`:
   - New `setObjective()` splits each objective on `"Hint:"` → renders GOAL
     big/bold/yellow (19px desktop / 17px mobile) + hint as a small 💡 line
     beneath (`.obj-hint`, auto-hides when empty).
   - Enlarged Objective card: thicker yellow rail, soft glow, inline `<code>`.

**Authoring convention going forward:** write `objective` as
`"Goal sentence. Hint: nudge."` — the renderer handles the visual split.
Both `objective` and `briefing` render via innerHTML, so use inline `<code>`
chips and `&gt;`/`&lt;` for literal comparison operators.

---

## Open / candidate next tasks (pick with Mike)

1. **[Decision for Mike] Hint specificity.** Hints currently name the exact
   syntax (e.g. `WHERE health > 50`). Option: make hints a thinking-nudge and
   reserve full syntax for the existing 3-miss reveal. Mike to decide direction
   before implementing. (See [[feedback-learning-science-design]] — he likes
   retrieval, not spoon-feeding.)

2. **Playtest pass on the rewritten prose (W1–W23).** Walk each wave in a real
   browser, confirm the Objective reads crystal-clear and the ⓘ lore isn't
   confusing. This was the original intent — verify the clarity goal landed.

3. **Roadmap content** (from `ROADMAP.md`, source of truth): subqueries, CTEs,
   window functions — keep one-new-idea-per-wave pacing.

---

## How to resume fast

- **Local:** `C:\Users\Mike\Projects\sql-quest` — game is `games/sql/index.html`
  (~2500 lines), waves are `games/sql/waves.js`.
- **Run tests:** `npm test` (Playwright; 34 checks = 17 × desktop+mobile).
- **Preview:** `.claude/launch.json` defines a `sql-quest` server on port 4173
  (node test/server.js). Load the game at `/games/sql/` (trailing slash matters —
  relative scripts 404 without it). Click "Start Campaign" past the splash.
- **Build stamp:** update `const BUILD_TS` in index.html every build; ET 12-hour
  format. Get it via: `TZ="America/New_York" date "+%B %-d, %Y · %-I:%M %p ET"`.
- **Commit convention:** `Task #NNN — …` for the change, then a separate
  `Build: <stamp>` commit. Last task number used = **#72** (next = #73).
  Commit + push without asking (Mike pulls from git).

---

## Guardrails (don't regress)

- All wave content is pure data in `waves.js` — no engine changes needed to
  add/edit waves.
- Keep 34/34 green. Parallel-run a11y flakes are resource contention; confirm
  with `npx playwright test accessibility.spec.js --workers=1`.
- Private design rationale (psychedelic-celestial notes) must never ship —
  the leak-guard test checks for it.
