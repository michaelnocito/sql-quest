/* ────────────────────────────────────────────────────────────────────────
   SQL QUEST — WAVE CONFIG
   Each wave is fully data-driven so new waves (and whole expansion packs)
   can be added without touching engine code. The engine builds a fresh
   SQLite DB from `schema`, runs the player's query AND the `solution`,
   and compares the two result sets. A match = the tower locks every enemy in
   the lane and clears the wave.

   Comparison is order-INSENSITIVE by default; if a wave's `solution` uses
   ORDER BY, row order must match too (so sorting waves are testable).

   The enemies shown in the battlefield lane ARE the solution's result set.
   So "write the query that returns exactly these targets" is the puzzle.

   BEGINNER RAMP (2026-05-28): this is a track for someone who has never touched
   SQL, learning it as entry-level data-analyst skills. So the curve is gentle —
   ONE genuinely new idea per wave, building single-table fluency (choose columns
   → filter → compare → combine → sort → top-N) BEFORE the big JOIN step.

   SPACED RETRIEVAL (learning science): concepts must come back AFTER A GAP,
   interleaved with newer material, so the player has to *recall* them, not just
   repeat them in a block. Two levers, both pure data here:
     1. Layering — author each wave's `solution` so it necessarily reuses earlier
        verbs (every query is still a SELECT; later ones fold in WHERE/AND/…).
     2. `reinforces: [...]` — names the earlier concepts a wave drills again, so
        the briefing shows a "Recall drill" chip and the schedule is explicit.
   The ramp revisits each verb in a fresh context a wave or two after it lands,
   on expanding gaps (Leitner-style).
   ──────────────────────────────────────────────────────────────────────── */
window.WAVES = [
  {
    id: 1,
    concept: "SELECT",
    enemyArch: "scout",
    title: "First Contact",
    briefing: "A scout swarm broke through the perimeter. Your turret targets whatever your query returns. Pull <b>every row</b> out of the <code>enemies</code> table to lock onto the whole swarm.",
    objective: "Return all enemies so the turret targets every one.",
    realWorld: "SELECT is the first thing an analyst writes — it pulls raw rows out of a table so you can see what you're working with.",
    layer: "copy",
    rounds: 3,
    creep: 0.10,
    reinforces: [],
    starter: "SELECT * FROM enemies;",
    solution: "SELECT * FROM enemies;",
    explain: {
      simple: "SELECT pulls rows back out of a table. The * means “every column”, so SELECT * FROM enemies hands you the whole table, nothing left out.",
      analogy: "Like asking a librarian to wheel out an entire shelf — every book comes back, none held aside."
    },
    onTheJob: {
      uses: "Reading rows back out of a table is the very first move in almost any analysis — an ad-hoc data pull, a sanity check before a report, or just seeing what columns a table even has.",
      example: "A teammate says \"can you pull the customers table so we can take a look?\" — you'd reach for SELECT to read those rows back."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Recon Drone','Scout',30),
        (2,'Skitter','Scout',25),
        (3,'Buzzer','Scout',20),
        (4,'Glider','Scout',35);
    `,
    hints: [
      "The turret fires on whatever rows come back. You want ALL of them.",
      "Use the * wildcard to grab every column: SELECT * FROM ...",
      "SELECT * FROM enemies;"
    ],
    terms: ["SELECT", "table", "row", "result set", "wildcard *"]
  },

  {
    id: 2,
    concept: "SELECT columns",
    enemyArch: "scout",
    title: "Just the Essentials",
    briefing: "You don't need the full readout on every contact — just the <b>designation</b> and <b>class</b>. Instead of <code>*</code>, name the columns you want: pull only <code>name</code> and <code>type</code>.",
    objective: "Return only the name and type columns for every enemy.",
    realWorld: "Analysts almost never want every column — you pick the handful that answer the question, which keeps results readable and queries fast.",
    layer: "modify",
    rounds: 3,
    creep: 0.11,
    reinforces: ["SELECT"],
    starter: "SELECT ____, ____ FROM enemies;",
    solution: "SELECT name, type FROM enemies;",
    explain: {
      simple: "Instead of the * wildcard, you can list the exact columns you want, separated by commas. SELECT name, type returns just those two columns for every row.",
      analogy: "Like ordering two specific dishes off a menu instead of asking for one of everything in the kitchen — you get exactly what you asked for, nothing extra."
    },
    onTheJob: {
      uses: "Real tables can have dozens of columns; pulling only the ones you need keeps the output readable, the query fast, and your intent clear to whoever reads it later.",
      example: "Someone asks \"just give me each customer's name and email\" — you'd name those two columns instead of selecting the whole table."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Recon Drone','Scout',30),
        (2,'Skitter','Scout',25),
        (3,'Pip','Scout',28),
        (4,'Glider','Scout',35);
    `,
    hints: [
      "Don't use *. List the columns you want instead.",
      "Separate column names with a comma: SELECT colA, colB FROM ...",
      "SELECT name, type FROM enemies;"
    ],
    terms: ["column list", "projection", "comma-separated columns"]
  },

  {
    id: 3,
    concept: "WHERE",
    enemyArch: "raider",
    title: "Hold Your Fire",
    briefing: "Allied scouts are mixed into the lane — don't shred your own people. Only the <b>hostiles</b> (type <code>'Raider'</code>) should be targeted. Filter the swarm with a <code>WHERE</code> clause.",
    objective: "Return only the Raiders. Spare everyone else.",
    realWorld: "WHERE zooms a whole table down to just the rows a question is about — one date range, one region, one customer.",
    layer: "modify",
    rounds: 3,
    creep: 0.13,
    reinforces: ["SELECT"],
    starter: "SELECT * FROM enemies WHERE type = '____';",
    solution: "SELECT * FROM enemies WHERE type = 'Raider';",
    explain: {
      simple: "WHERE keeps only the rows that meet a condition and drops the rest, so the query acts on just the slice you care about — here, the rows whose type is 'Raider'.",
      analogy: "Like telling that librarian “only the mystery novels, please” — you get back just the books that match, not the whole shelf."
    },
    onTheJob: {
      uses: "Almost no real question wants the whole table — you want one slice of it: one region, one date range, one status, one customer segment. WHERE is how you narrow down to just the rows the question is about.",
      example: "Your manager asks \"which orders are still marked pending?\" — you'd use WHERE to keep only the rows whose status is 'pending'."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Medic Owl','Ally',40),
        (3,'Grist','Raider',55),
        (4,'Scout Fenn','Ally',30),
        (5,'Maul','Raider',70);
    `,
    hints: [
      "You only want the Raiders. WHERE lets you keep rows that match a condition.",
      "Match the text exactly, in quotes: WHERE type = 'Raider'",
      "SELECT * FROM enemies WHERE type = 'Raider';"
    ],
    terms: ["WHERE", "filter", "condition", "string literal"]
  },

  {
    id: 4,
    concept: "WHERE (numbers)",
    enemyArch: "raider",
    title: "Heavy Armor",
    briefing: "The light raiders aren't worth a shot — only the <b>heavily-armored</b> ones (more than <code>50</code> health) are a real threat. Filter on a number with the <code>&gt;</code> operator.",
    objective: "Return only enemies with health greater than 50.",
    realWorld: "Numeric thresholds are everywhere in analysis — orders over $100, sessions longer than 5 minutes, accounts older than a year.",
    layer: "modify",
    rounds: 3,
    creep: 0.14,
    reinforces: ["SELECT", "WHERE"],
    starter: "SELECT * FROM enemies WHERE health ____ 50;",
    solution: "SELECT * FROM enemies WHERE health > 50;",
    explain: {
      simple: "WHERE works on numbers too, using comparison operators: > (greater than), < (less than), >= and <=. Numbers don't need quotes — quotes are only for text.",
      analogy: "Like sorting a stack of receipts into “over fifty dollars” and “under” — you only keep the pile above the line you drew."
    },
    onTheJob: {
      uses: "Comparing against a number is one of the most common filters there is — finding the big orders, the slow pages, the high-value accounts, anything above or below a threshold.",
      example: "\"Show me every transaction over $1,000\" — you'd use WHERE amount > 1000 (no quotes, because it's a number)."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Drifter','Raider',45),
        (3,'Grist','Raider',80),
        (4,'Husk','Raider',35),
        (5,'Maul','Raider',70);
    `,
    hints: [
      "You want the high-health ones. Compare the health column to a number.",
      "Use > for “greater than”, and don't put quotes around a number: WHERE health > 50",
      "SELECT * FROM enemies WHERE health > 50;"
    ],
    terms: ["comparison operator", "> < >= <=", "numeric filter"]
  },

  {
    id: 5,
    concept: "AND",
    enemyArch: "raider",
    title: "Confirmed Hostiles",
    briefing: "Tighten the firing solution: only lock on contacts that are <b>both</b> a <code>'Raider'</code> <b>and</b> above <code>50</code> health. Chain the two conditions together with <code>AND</code>.",
    objective: "Return enemies that are Raiders AND have health over 50.",
    realWorld: "Real questions usually stack conditions — analysts combine filters constantly to zero in on an exact segment.",
    layer: "modify",
    rounds: 4,
    creep: 0.15,
    reinforces: ["WHERE"],
    starter: "SELECT * FROM enemies WHERE type = 'Raider' ____ health > 50;",
    solution: "SELECT * FROM enemies WHERE type = 'Raider' AND health > 50;",
    explain: {
      simple: "AND joins two conditions so a row is kept only when BOTH are true. It narrows your results — each extra AND can only shrink the set, never grow it.",
      analogy: "Like a bouncer with two rules: on the list AND over 21. Miss either one and you don't get in."
    },
    onTheJob: {
      uses: "You'll stack conditions to pin down an exact group — combining a category, a date range, and a status in a single filter is everyday work.",
      example: "\"California orders over $100 that shipped this week\" — that's three conditions joined with AND."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Medic Owl','Ally',90),
        (3,'Grist','Raider',40),
        (4,'Husk','Raider',75),
        (5,'Scout Fenn','Ally',30);
    `,
    hints: [
      "Two conditions must both hold: the right type, and enough health.",
      "Join them with AND: WHERE type = 'Raider' AND health > 50",
      "SELECT * FROM enemies WHERE type = 'Raider' AND health > 50;"
    ],
    terms: ["AND", "compound condition", "logical operator"]
  },

  {
    id: 6,
    concept: "OR",
    enemyArch: "raider",
    title: "Multiple Targets",
    briefing: "Two hostile classes are inbound. Target anything that's a <code>'Raider'</code> <b>or</b> a <code>'Warden'</code> — leave the allies be. Widen the net with <code>OR</code>.",
    objective: "Return enemies whose type is Raider OR Warden.",
    realWorld: "Where AND narrows, OR widens — analysts use it to pull several categories or values in one pass.",
    layer: "modify",
    rounds: 4,
    creep: 0.16,
    reinforces: ["WHERE", "AND"],
    starter: "SELECT * FROM enemies WHERE type = 'Raider' ____ type = 'Warden';",
    solution: "SELECT * FROM enemies WHERE type = 'Raider' OR type = 'Warden';",
    explain: {
      simple: "OR keeps a row when EITHER condition is true. It's the opposite of AND — where AND shrinks the set, OR grows it, gathering rows that match any of the options.",
      analogy: "Like a guest list that says “bring a partner OR a friend” — either one gets you a plus-one; you don't need both."
    },
    onTheJob: {
      uses: "OR pulls several acceptable values at once — a few regions, a set of statuses, a handful of product lines — without running a separate query for each.",
      example: "\"Orders from California or New York\" — you'd join the two with OR (or use the IN shorthand: state IN ('CA','NY'))."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Aegis','Warden',120),
        (3,'Medic Owl','Ally',40),
        (4,'Grist','Raider',55),
        (5,'Bulwark','Warden',140),
        (6,'Scout Fenn','Ally',30);
    `,
    hints: [
      "You want two different types to both count. Either one should match.",
      "Use OR between the two conditions: WHERE type = 'Raider' OR type = 'Warden'",
      "SELECT * FROM enemies WHERE type = 'Raider' OR type = 'Warden';"
    ],
    terms: ["OR", "IN", "either/or condition"]
  },

  {
    id: 7,
    concept: "ORDER BY",
    enemyArch: "warden",
    title: "Threat Priority",
    briefing: "Fire control wants the lane <b>ranked</b> — most dangerous first. Return every enemy <b>sorted by health, highest to lowest</b>, using <code>ORDER BY ... DESC</code>.",
    objective: "Return all enemies sorted by health, highest first.",
    realWorld: "Sorting turns a pile of rows into a ranking — top sellers, slowest queries, newest signups. It's how you make data tell a story.",
    layer: "modify",
    rounds: 4,
    creep: 0.17,
    reinforces: ["SELECT"],
    starter: "SELECT * FROM enemies ORDER BY ____ DESC;",
    solution: "SELECT * FROM enemies ORDER BY health DESC;",
    explain: {
      simple: "ORDER BY sorts the rows that come back. Add DESC for highest-to-lowest (descending); leave it off, or write ASC, for lowest-to-highest. The rows are the same — just arranged.",
      analogy: "Like fanning out a hand of cards and lining them up high to low — same cards, now you can see the ranking at a glance."
    },
    onTheJob: {
      uses: "Ranking is how a result set becomes an answer — \"who's biggest / slowest / most recent\" all come down to sorting on the right column.",
      example: "\"Rank our customers by total spend, biggest first\" — you'd ORDER BY that total DESC."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Skitter','Raider',45),
        (2,'Vex','Raider',80),
        (3,'Grist','Raider',60),
        (4,'Husk','Raider',30),
        (5,'Maul','Raider',95);
    `,
    hints: [
      "Same rows, but the order matters now — sort them by health.",
      "ORDER BY sorts; add DESC for highest first: ORDER BY health DESC",
      "SELECT * FROM enemies ORDER BY health DESC;"
    ],
    terms: ["ORDER BY", "ASC / DESC", "sort"]
  },

  {
    id: 8,
    concept: "LIMIT",
    enemyArch: "warden",
    title: "Top Threats Only",
    briefing: "No time to clear the whole lane — lock onto only the <b>three biggest threats</b>. Sort by health (highest first), then keep just the top rows with <code>LIMIT</code>.",
    objective: "Return only the top 3 enemies by health, highest first.",
    realWorld: "“Top N” is one of the most-asked questions in any analyst role — top 5 customers, top 10 pages, biggest 3 deals.",
    layer: "modify",
    rounds: 4,
    creep: 0.18,
    reinforces: ["ORDER BY"],
    starter: "SELECT * FROM enemies ORDER BY health DESC ____ 3;",
    solution: "SELECT * FROM enemies ORDER BY health DESC LIMIT 3;",
    explain: {
      simple: "LIMIT caps how many rows come back. Pair it with ORDER BY and you get a “top N”: sort first so the rows you want are on top, then LIMIT keeps just that many.",
      analogy: "Like reading only the top three names on a leaderboard — you sort everyone by score, then your eyes stop after three."
    },
    onTheJob: {
      uses: "“Show me the top N” is a constant request, and LIMIT is also how you peek at a sample of a huge table without pulling millions of rows.",
      example: "\"What are our five best-selling products?\" — you'd ORDER BY sales DESC and LIMIT 5."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Skitter','Warden',45),
        (2,'Vex','Warden',80),
        (3,'Grist','Warden',60),
        (4,'Husk','Warden',30),
        (5,'Maul','Warden',95),
        (6,'Aegis','Warden',70);
    `,
    hints: [
      "Sort by health first so the biggest are on top — then keep only the first three.",
      "Add LIMIT after the sort: ORDER BY health DESC LIMIT 3",
      "SELECT * FROM enemies ORDER BY health DESC LIMIT 3;"
    ],
    terms: ["LIMIT", "top N", "sample"]
  },

  {
    id: 9,
    concept: "JOIN",
    enemyArch: "warden",
    title: "Mark the Bounties",
    briefing: "Command only authorizes fire on enemies with an active <b>bounty</b>. The bounty list lives in a separate table. <code>JOIN</code> <code>enemies</code> to <code>bounties</code> so the turret only locks the wanted ones.",
    objective: "Return the enemies that have a matching bounty.",
    realWorld: "Real data lives across many tables. JOIN stitches them together — orders to customers, users to events — to answer almost any question.",
    layer: "scratch",
    rounds: 4,
    creep: 0.20,
    reinforces: ["SELECT", "WHERE"],
    starter: "SELECT e.id, e.name, e.type, e.health\nFROM enemies e\nJOIN bounties b ON ____ = ____;",
    solution: "SELECT e.id, e.name, e.type, e.health FROM enemies e JOIN bounties b ON e.id = b.enemy_id;",
    explain: {
      simple: "JOIN links two tables on a value they share, so one query can use facts from both at once — here, only enemies whose id appears in the bounties table come back.",
      analogy: "Like matching coat-check tickets to coats: each ticket number lines up with exactly one coat, so you only pull the coats that have a ticket."
    },
    onTheJob: {
      uses: "Real data is spread across many tables — orders in one, customers in another, products in a third. JOIN stitches them together on a shared id so a single query can answer questions that span them.",
      example: "Someone asks \"which customers actually placed an order?\" — you'd JOIN the customers table to the orders table on their shared customer id, so only customers with a matching order come back."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Warden',60),
        (2,'Drifter','Warden',45),
        (3,'Grist','Warden',55),
        (4,'Husk','Warden',50);
      CREATE TABLE bounties (enemy_id INTEGER, reward INTEGER);
      INSERT INTO bounties VALUES (1,500),(3,750);
    `,
    hints: [
      "A JOIN stitches two tables together on a shared key.",
      "enemies.id lines up with bounties.enemy_id — join ON that match.",
      "SELECT e.id, e.name, e.type, e.health FROM enemies e JOIN bounties b ON e.id = b.enemy_id;"
    ],
    terms: ["JOIN", "key", "ON", "table alias"]
  }
];
