# SQL Quest

A roguelike **tower-defense game where real SQL queries control your turret**. Built for aspiring data analysts: survive each wave by writing the query that locks onto the enemies in the lane. Every query runs against a real SQLite database — in your browser, with nothing to install.

**▶ Play:** open `index.html`, or visit the GitHub Pages site.

## Why this exists

It's a free learning tool for people breaking into data analytics. Each wave teaches one core SQL concept in the order you'd meet it on the job:

| Wave | Concept | What you practice |
|------|---------|-------------------|
| 1 | `SELECT` | Pulling rows from a table |
| 2 | `WHERE` | Filtering to the rows that matter |
| 3 | `JOIN` | Combining two tables on a key |
| 4 | `GROUP BY` + `HAVING` | Aggregating *(planned)* |
| 5 | Subqueries | Nesting queries *(planned)* |
| 6 | CTEs (`WITH`) | Readable multi-step queries *(planned)* |
| 7 | Window functions | `RANK`, `ROW_NUMBER` *(planned)* |

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

- [x] Wave 1–3 (SELECT, WHERE, JOIN)
- [ ] Waves 4–7 (GROUP BY, subqueries, CTEs, window functions)
- [ ] Per-concept "codex" cards for the analyst vocabulary each wave introduces
- [ ] Adaptive audio tied to wave difficulty + time of day (circadian toggle)
- [ ] Training Ground (replay any cleared wave)
- [ ] Python / Excel / Viz expansion packs

## License

MIT — see [LICENSE](LICENSE). Free for anyone to learn from, fork, and remix.
