# SQL Quest

A roguelike **tower-defense game where real SQL queries control your turret**. Built for aspiring data analysts: survive each wave by writing the query that locks onto the enemies in the lane. Every query runs against a real SQLite database — in your browser, with nothing to install.

**▶ Play:** open `index.html`, or visit the GitHub Pages site.

## Why this exists

It's a free learning tool for people breaking into data analytics. **23 waves** introduce one new SQL concept at a time, in the order you'd meet them on the job, then layer earlier ideas back in so you keep recalling them (spaced retrieval):

| Tier | Waves | Concepts |
|------|-------|----------|
| **Reading rows** | 1–3 | `SELECT *` · `SELECT` columns · `SELECT DISTINCT` |
| **Filtering** | 4–9 | `WHERE` (text) · `WHERE` (numbers) · `AND` · `OR` · `ORDER BY` · `LIMIT` |
| **Combining tables** | 10–12 | `JOIN` · `LEFT JOIN` · `IS NULL` |
| **Matching sets** | 13–15 | `IN` · `BETWEEN` · `LIKE` |
| **Aggregating** | 16–21 | `COUNT` · `SUM`/`AVG` · `MIN`/`MAX` · `GROUP BY` · `HAVING` · `AS` alias + `ORDER BY` an aggregate |
| **Boss waves** | 22–23 | Multi-phase fights that recombine filtering logic (`WHERE` → `AND` / `OR`) under pressure |

Each wave's `solution` deliberately reuses verbs from earlier waves, and a "🔁 Recall drill" chip in the briefing names which earlier concepts it makes you reuse.

## How a wave works

1. The lane shows the enemies you must clear. **Those enemies _are_ the result set of the correct query.**
2. Write SQL in the editor and hit **Execute** (`Ctrl/Cmd + Enter`).
3. The game runs your query and the solution against a fresh SQLite DB and compares result sets (order-insensitive).
4. **Match** → the turret fires a volley and clears the lane. **Mismatch** → the swarm advances and chips your base HP. **Syntax error** → you get a hint, no damage.

### Dev / practice mode (⚡, on by default)
The correct query appears as a faint ghost in the editor. Press **`Tab`** to drop it in, then **`Ctrl+Enter`** to fire. Turn it off (⚡ button) for from-scratch practice.

### Focus audio (🔇/🔊)
An optional Endel-style focus drone plus chimes on a hit. A break nudge appears after ~25 minutes of play (ultradian-rhythm pacing) to keep your focus fresh.

## Tech

- **100% client-side.** Real SQLite via [sql.js](https://github.com/sql-js/sql.js) (WebAssembly) loaded from CDN. No backend, no build step, free to host on GitHub Pages, works on a phone.
- Single self-contained game file (`games/sql/index.html`) + a data-driven wave config (`games/sql/waves.js`).
- Same design system as the [Analyst Prep Kit](https://michaelnocito.github.io/analyst-prep-kit/).

## Adding a wave / building an expansion pack

Waves are pure data — see `games/sql/waves.js`. Each entry defines its `schema`, `solution`, `briefing`, and progressive `hints`. The engine builds the lane from the solution's result set, so you never hand-author "expected output." Drop in a new object and it just works.

Future packs (Python, Excel, BI) live under `games/<name>/` and reuse the same battle/engine pattern.

## Roadmap

- [x] Waves 1–21 (reading, filtering, joins, set matching, aggregation)
- [x] Waves 22–23 — multi-phase boss fights
- [x] Spaced-retrieval recall chips (earlier verbs resurface on a gap)
- [ ] Next content: subqueries, CTEs (`WITH`), window functions (`RANK`, `ROW_NUMBER`)
- [ ] Per-concept "codex" cards for the analyst vocabulary each wave introduces
- [ ] Adaptive audio tied to wave difficulty + time of day (circadian toggle)
- [ ] Training Ground (replay any cleared wave)
- [ ] Python / Excel / Viz expansion packs

## License

MIT — see [LICENSE](LICENSE). Free for anyone to learn from, fork, and remix.
