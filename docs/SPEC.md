# SQL Quest — Design Spec

> Locked during a discovery session (2026-05-28). This file is the source of truth for intent.

## Concept
Roguelike tower defense where SQL queries control the turret. Players survive waves by writing correct SQL. Audience: aspiring data analysts prepping for their first month on the job. Free, open-source. Foundation for expansion packs (Python, Excel, BI).

## Architecture decision (changed from original handoff)
The original handoff proposed **FastAPI + React + server SQLite**. We switched to **100% client-side sql.js** because:
- It hosts free on GitHub Pages and runs on an iPhone with **zero backend / zero hosting cost**.
- It matches every repo Mike already ships (the Analyst Prep Kit SQL kit uses the same sql.js engine).
- It still uses **real SQLite / real SQL** — no simulated parser.

Everything else from the locked spec is preserved.

## Locked decisions
- **Validation:** result-set comparison (order-insensitive), not syntax parsing. Engine runs the player query *and* the solution against a fresh DB and diffs them.
- **Win model:** the enemies in the lane **are** the solution's result set. Correct query → turret volley clears the lane.
- **Feedback tiers:** banned verb → blocked; syntax error → "check spelling" + no damage; valid-but-wrong → swarm advances, base takes damage; correct → clear.
- **Onboarding (layered learning):** Wave 1 copy, Wave 2 modify, Wave 3+ from scratch. Real analyst vocab from wave 1.
- **Dev mode:** default ON. Solution shows as a ghost; `Tab` inserts it; `Ctrl/Cmd+Enter` executes. Toggle off for production/practice.
- **Hints:** progressive 3-tier (nudge → keyword → full answer).
- **UI:** editor on top, SVG battlefield on bottom. iPhone-12-first.
- **Persistence:** localStorage (wave, base HP, settings, cleared waves, accuracy).
- **Audio:** optional Endel-style focus drone that brightens with wave difficulty; chimes on hit/clear.
- **Breaks:** ultradian/Pomodoro nudge after ~25 min of play.
- **Security:** allowlist — block DROP/DELETE/UPDATE/INSERT/ALTER/CREATE/etc.
- **Replayability:** same schema, campaign wraps; Training Ground planned.

## Wave progression
SELECT → WHERE → JOIN → GROUP BY+HAVING → subqueries → CTEs → window functions. (1–3 built; 4–7 planned.)

## Expansion architecture
Single repo. Each game under `games/<name>/`, self-contained, sharing the battle/engine pattern. Waves are pure data (`waves.js`) so content is swappable without engine changes.

## Reminder (carried from discovery)
After this MVP, build a separate **analytics self-care kit** that plugs into Mike's existing GitHub skill-base repos.
