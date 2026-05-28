# SQL Quest — Roadmap & Feedback Triage

A living board. New feedback lands in the **log** at the bottom, gets a priority,
then moves into **Now / Next / Later / Icebox**. Done items drop to **Shipped**.

**Priority key:** `P0` broken/blocking · `P1` high-impact · `P2` nice-to-have · `P3` someday
**Status key:** `todo` · `wip` · `done`

---

## Now (actively building)
_Nothing in flight._

## Next (queued, agreed)
- **[P2] Turret muzzle flash + recoil** — make the base feel like it fires, not just the enemies exploding.
- **[P2] Per-wave combat tuning pass** — once Mike plays it, dial `rounds`/`creep` per wave so each fight reinforces without going stale.

## Later (good ideas, not scheduled)
- **[P2] Waves 4–7** — GROUP BY + HAVING, subqueries, CTEs, window functions.
- **[P2] Per-concept codex cards** — revisit unlocked vocab.
- **[P3] Training Ground** — replay any cleared wave.
- **[P3] Adaptive audio** tied to difficulty + circadian toggle.

## Icebox (parked / maybe never)
- Multiplayer / leaderboards.
- Server-side anything (we are deliberately 100% client-side sql.js).

---

## Shipped
- **[P1] FF-style HP-whittle combat exchange** (2026-05-28) — enemies have HP bars; a correct query is a volley chipping `maxHp/rounds` per turn, so you re-fire the right query a few times to clear (drilling the syntax). All living enemies creep forward slowly (visible, near-harmless early). Wrong query = wasted turn + free creep; over-broad query = friendly-fire base damage. Floating damage numbers + non-lethal hit flash. Tuning is data-driven per wave (`rounds`, `creep` in waves.js).
- **[P1] Explosion/attack animation on correct query** (2026-05-28) — staggered beams from the base, per-enemy detonation (flash + expanding ring + 7 shards), enemy death fade. Real visual payoff before the Wave Cleared card.
- Wayfinding pass: Wave X/N counter, concept track, "Next up" preview, stuck-nudge.
- Waves 1–3 (SELECT / WHERE / JOIN), 4 feedback tiers, hints, persistence, audio, theme, mobile.

---

## Feedback log
Raw incoming notes from Mike. Newest first. Triaged into the lists above.

| Date | Feedback | Priority | Status | Where it went |
|------|----------|----------|--------|----------------|
| 2026-05-28 | "Back-and-forth with enemies — they creep closer, we attack with SQL, takes some HP off, exchange continues, Final Fantasy style." Chose HP-whittle: slow visible creep early, re-type the attack each round, tuned so a wave lasts long enough to learn but not get stale; friendly fire on over-broad queries. | P1 | done | Shipped |
| 2026-05-28 | "Need animation when the query executes — an attack/explosion of each enemy. Right now it congratulates you but there's no visual payoff." | P1 | done | Shipped |
