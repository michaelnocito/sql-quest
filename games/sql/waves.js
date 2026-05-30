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
    objective: "Target the full swarm — SELECT * FROM enemies returns every row.",
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
    objective: "Pull just name and type. Hint: list both column names after SELECT, separated by a comma.",
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
    objective: "Target Raiders only. Hint: add WHERE type = '...' after FROM to filter rows by a text value.",
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
    objective: "Target enemies with more than 50 health. Hint: WHERE health > 50 — numbers never need quotes.",
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
    objective: "Raiders with 50+ health only. Hint: stack two WHERE conditions with AND — a row must pass both.",
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
    objective: "Raider or Warden — both are hostile. Hint: WHERE type = '...' OR type = '...' lets either through.",
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
    objective: "Return all enemies, deadliest first. Hint: add ORDER BY health DESC after your FROM clause.",
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
    objective: "Top 3 threats only. Hint: ORDER BY health DESC first, then add LIMIT 3 at the end.",
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
    objective: "Only enemies that have a bounty. Hint: JOIN enemies to bounties ON the column they share (e.id = b.enemy_id).",
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
  },

  /* ── TIER 2 — refine filters & first aggregates ─────────────────────────── */

  {
    id: 10,
    concept: "IN",
    enemyArch: "raider",
    title: "The Wanted Set",
    briefing: "Two hostile classes again, but chaining <code>OR</code>s gets ugly fast. <code>IN</code> checks membership against a whole <b>set</b> at once. Match anything whose type is in (<code>'Raider'</code>, <code>'Warden'</code>).",
    objective: "Raider or Warden in one clean filter. Hint: WHERE type IN ('Raider', 'Warden') checks a list at once.",
    realWorld: "When a question has a list of acceptable values, IN keeps the WHERE tidy — no matter if the list is 2 things or 20.",
    layer: "modify",
    rounds: 3,
    creep: 0.15,
    reinforces: ["WHERE", "OR"],
    starter: "SELECT * FROM enemies WHERE type ____ ('Raider', 'Warden');",
    solution: "SELECT * FROM enemies WHERE type IN ('Raider', 'Warden');",
    explain: {
      simple: "IN tests if a value matches any item in a parenthesized list. `x IN (a, b, c)` is shorthand for `x = a OR x = b OR x = c`. Same result, way cleaner once the list grows.",
      analogy: "Like a bouncer with a guest list — your name's either on it or it isn't; he doesn't recite the whole list out loud."
    },
    onTheJob: {
      uses: "Matching against a known list — a handful of customer IDs, a set of allowed statuses, the regions you care about. IN keeps the filter readable as that list grows.",
      example: "\"Pull orders for these five customer IDs\" — you'd use WHERE customer_id IN (the five ids) instead of five OR clauses."
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
      "You want a set of acceptable types, both should count.",
      "IN takes a parenthesized list: WHERE type IN ('Raider', 'Warden')",
      "SELECT * FROM enemies WHERE type IN ('Raider', 'Warden');"
    ],
    terms: ["IN", "set membership", "list of values"]
  },

  {
    id: 11,
    concept: "BETWEEN",
    enemyArch: "warden",
    title: "Threat Window",
    briefing: "Only mid-tier threats this run — armor between <code>50</code> and <code>100</code>. You could write <code>health &gt;= 50 AND health &lt;= 100</code>… or use <code>BETWEEN</code>, the clean way to filter a <b>range</b>.",
    objective: "Enemies in the 50–100 health window. Hint: WHERE health BETWEEN 50 AND 100 — both ends are included.",
    realWorld: "Range filters are everywhere — dates between two days, amounts within a band, ages in a bracket. BETWEEN is the readable shorthand.",
    layer: "modify",
    rounds: 3,
    creep: 0.16,
    reinforces: ["WHERE", "AND"],
    starter: "SELECT * FROM enemies WHERE health ____ 50 AND 100;",
    solution: "SELECT * FROM enemies WHERE health BETWEEN 50 AND 100;",
    explain: {
      simple: "BETWEEN x AND y matches values from x to y, including the endpoints. It's exactly the same as `>= x AND <= y`, just shorter and easier to read.",
      analogy: "Like saying \"anything between 9 and 5\" instead of \"anything that's nine or later AND five or earlier\" — same window, half the words."
    },
    onTheJob: {
      uses: "Date ranges are the classic case — \"orders between Jan 1 and Mar 31.\" Same shape for amounts, ages, scores, or any numeric band you need.",
      example: "\"Show me transactions from last quarter\" — you'd use WHERE order_date BETWEEN '2026-01-01' AND '2026-03-31'."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Pip','Scout',25),
        (2,'Vex','Raider',60),
        (3,'Grist','Raider',95),
        (4,'Aegis','Warden',140),
        (5,'Husk','Raider',50),
        (6,'Bulwark','Warden',100);
    `,
    hints: [
      "You want a range of health values, including the edges.",
      "BETWEEN 50 AND 100 covers both endpoints.",
      "SELECT * FROM enemies WHERE health BETWEEN 50 AND 100;"
    ],
    terms: ["BETWEEN", "range filter", "inclusive bounds"]
  },

  {
    id: 12,
    concept: "LIKE",
    enemyArch: "warden",
    title: "Pattern Match",
    briefing: "Intel pegs the next strike to anything starting with <code>V</code>. Use <code>LIKE</code> with the <code>%</code> wildcard to match by <b>pattern</b>: <code>name LIKE 'V%'</code>.",
    objective: "Every name starting with V. Hint: WHERE name LIKE 'V%' — the % matches any characters that follow.",
    realWorld: "Exact matching breaks the moment you need \"starts with,\" \"contains,\" or \"ends in\" — LIKE is how analysts search messy text.",
    layer: "modify",
    rounds: 3,
    creep: 0.17,
    reinforces: ["WHERE"],
    starter: "SELECT * FROM enemies WHERE name ____ 'V%';",
    solution: "SELECT * FROM enemies WHERE name LIKE 'V%';",
    explain: {
      simple: "LIKE compares text against a pattern. The `%` wildcard means \"anything, any length.\" So `'V%'` matches anything that starts with V; `'%son'` matches anything ending in son; `'%data%'` matches anything containing data.",
      analogy: "Like asking the librarian for \"any book whose title starts with V\" — they don't need the rest, they grab whatever fits the front of the pattern."
    },
    onTheJob: {
      uses: "Searching messy text is constant in analysis — names with inconsistent capitalization, emails from a domain, product codes with a prefix, free-form notes containing a keyword.",
      example: "\"All customers with a gmail address\" — you'd use WHERE email LIKE '%@gmail.com'."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Grist','Raider',55),
        (3,'Vanguard','Warden',130),
        (4,'Husk','Raider',45),
        (5,'Vortex','Warden',110),
        (6,'Bulwark','Warden',140);
    `,
    hints: [
      "You want every name beginning with V — that's a pattern, not an exact match.",
      "LIKE with % matches any tail: WHERE name LIKE 'V%'",
      "SELECT * FROM enemies WHERE name LIKE 'V%';"
    ],
    terms: ["LIKE", "% wildcard", "pattern matching"]
  },

  {
    id: 13,
    concept: "COUNT",
    enemyArch: "warden",
    title: "Body Count",
    briefing: "Field command wants a number, not a list — <b>how many Raiders</b> are out there? <code>COUNT(*)</code> tallies the rows that match.",
    objective: "How many Raiders are there? Hint: SELECT COUNT(*) collapses rows into a single number — keep your WHERE.",
    realWorld: "\"How many?\" is the single most common analyst question. COUNT is the first aggregate you'll reach for, every day.",
    layer: "scratch",
    rounds: 3,
    creep: 0.16,
    reinforces: ["WHERE"],
    starter: "SELECT ____ FROM enemies WHERE type = 'Raider';",
    solution: "SELECT COUNT(*) FROM enemies WHERE type = 'Raider';",
    explain: {
      simple: "An aggregate function collapses many rows into a single number. COUNT(*) counts how many rows match — combine it with WHERE to ask \"how many of THESE?\"",
      analogy: "Like dumping a jar of marbles on the table and just answering \"thirty-seven\" instead of handing the marbles over one by one."
    },
    onTheJob: {
      uses: "Volume questions are everywhere — \"how many sign-ups this week,\" \"how many failed payments,\" \"how many active accounts in the region.\" COUNT answers all of them.",
      example: "\"How many orders did we ship yesterday?\" — you'd use SELECT COUNT(*) FROM orders WHERE shipped_date = yesterday."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Medic Owl','Ally',40),
        (3,'Grist','Raider',55),
        (4,'Scout Fenn','Ally',30),
        (5,'Maul','Raider',70),
        (6,'Aegis','Warden',120);
    `,
    hints: [
      "You don't want the rows themselves — just how many there are.",
      "COUNT(*) tallies matching rows. Keep your WHERE.",
      "SELECT COUNT(*) FROM enemies WHERE type = 'Raider';"
    ],
    terms: ["COUNT", "aggregate function", "scalar result"]
  },

  {
    id: 14,
    concept: "SUM / AVG",
    enemyArch: "warden",
    title: "Total Threat",
    briefing: "Sum up the armor in the sector — what's the <b>total health</b> across every enemy on the board? Add them all with <code>SUM(health)</code>.",
    objective: "Total health across the entire board. Hint: SELECT SUM(health) adds up that column for every row.",
    realWorld: "After \"how many?\" comes \"how much?\" — SUM totals a column; AVG gives you its average. Both are everyday-analyst staples.",
    layer: "modify",
    rounds: 3,
    creep: 0.16,
    reinforces: ["COUNT"],
    starter: "SELECT ____(health) FROM enemies;",
    solution: "SELECT SUM(health) FROM enemies;",
    explain: {
      simple: "SUM adds up a numeric column across every row. AVG gives you the average instead. Both work just like COUNT — they collapse rows into a single number.",
      analogy: "SUM is the cash-register total; AVG is the average ticket. Same receipts, different question."
    },
    onTheJob: {
      uses: "Totals and averages are how a pile of rows becomes a headline number — total revenue, average order value, total time on site, average session length. Constant work.",
      example: "\"What was our total revenue this month?\" — SUM(amount). \"What's our average order value?\" — AVG(amount)."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Aegis','Warden',120),
        (3,'Grist','Raider',55),
        (4,'Bulwark','Warden',140),
        (5,'Pip','Scout',25);
    `,
    hints: [
      "You don't want a count — you want the total of a numeric column.",
      "SUM(column_name) adds the values. AVG(column_name) averages them.",
      "SELECT SUM(health) FROM enemies;"
    ],
    terms: ["SUM", "AVG", "numeric aggregate"]
  },

  {
    id: 15,
    concept: "MIN / MAX",
    enemyArch: "warden",
    title: "Worst-Case Read",
    briefing: "Brief the team on the <b>single deadliest</b> contact in range — the maximum health on the board. <code>MAX(column)</code> grabs the largest value.",
    objective: "Find the single highest health value. Hint: SELECT MAX(health) returns just the largest number in that column.",
    realWorld: "MIN and MAX find the extremes — biggest order, smallest payment, earliest date, latest event. Constant in summary reporting.",
    layer: "modify",
    rounds: 3,
    creep: 0.17,
    reinforces: ["SUM / AVG"],
    starter: "SELECT ____(health) FROM enemies;",
    solution: "SELECT MAX(health) FROM enemies;",
    explain: {
      simple: "MAX returns the largest value in a column; MIN the smallest. Same family as SUM/AVG/COUNT — each one collapses many rows into a single answer.",
      analogy: "Like skimming a stack of receipts for just the biggest one — MAX finds it. MIN does the same thing for the tiniest."
    },
    onTheJob: {
      uses: "Extremes summarize a dataset fast — biggest customer by spend, slowest page by load time, latest activity timestamp, smallest non-zero balance.",
      example: "\"When did this account last log in?\" — MAX(login_time). \"Smallest order we've ever shipped?\" — MIN(amount)."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Pip','Scout',25),
        (2,'Vex','Raider',60),
        (3,'Grist','Raider',95),
        (4,'Aegis','Warden',140),
        (5,'Husk','Raider',50);
    `,
    hints: [
      "You want a single value — the biggest one in the column.",
      "MAX(column) returns the largest. MIN does the smallest.",
      "SELECT MAX(health) FROM enemies;"
    ],
    terms: ["MIN", "MAX", "extremes"]
  },

  /* ── TIER 3 — grouping ──────────────────────────────────────────────────── */

  {
    id: 16,
    concept: "GROUP BY",
    enemyArch: "warden",
    title: "Per-Class Census",
    briefing: "One number for the whole board isn't enough — command wants the count <b>per class</b>. <code>GROUP BY</code> turns one aggregate into one-per-category.",
    objective: "One count per class. Hint: SELECT type, COUNT(*) then GROUP BY type — one row per distinct type.",
    realWorld: "GROUP BY is the unlock for almost every analyst dashboard — sales by region, signups per day, errors per service. One row per group.",
    layer: "scratch",
    rounds: 3,
    creep: 0.18,
    reinforces: ["COUNT"],
    starter: "SELECT type, COUNT(*) FROM enemies ____ ____ type;",
    solution: "SELECT type, COUNT(*) FROM enemies GROUP BY type;",
    explain: {
      simple: "GROUP BY buckets the rows by a column's value, then runs the aggregate ONCE per bucket. You get one row per distinct value — exactly what \"X per category\" needs.",
      analogy: "Like sorting laundry by color first, then counting each pile — instead of one total, you get a count for each color."
    },
    onTheJob: {
      uses: "Almost every breakdown report — \"per region,\" \"per day,\" \"per product\" — is a GROUP BY with an aggregate. It's the bread-and-butter of analyst SQL.",
      example: "\"How many orders per state?\" — SELECT state, COUNT(*) FROM orders GROUP BY state. One row per state, with its order count."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Aegis','Warden',120),
        (3,'Grist','Raider',55),
        (4,'Maul','Raider',70),
        (5,'Bulwark','Warden',140),
        (6,'Pip','Scout',25),
        (7,'Skitter','Scout',30);
    `,
    hints: [
      "You want one row per type, not one row total. Bucket by the type column first.",
      "Combine SELECT type, COUNT(*) with GROUP BY type.",
      "SELECT type, COUNT(*) FROM enemies GROUP BY type;"
    ],
    terms: ["GROUP BY", "bucketing", "one row per group"]
  },

  {
    id: 17,
    concept: "HAVING",
    enemyArch: "warden",
    title: "Squads Only",
    briefing: "Only call in a strike on classes with a real <b>squad</b> — three or more units. Group by type, then filter the <i>groups</i> with <code>HAVING</code>.",
    objective: "Classes with 3+ units only. Hint: GROUP BY type, then HAVING COUNT(*) >= 3 filters the small groups out.",
    realWorld: "WHERE filters rows BEFORE aggregating; HAVING filters groups AFTER. \"Customers who placed more than 5 orders\" needs HAVING.",
    layer: "modify",
    rounds: 4,
    creep: 0.18,
    reinforces: ["GROUP BY", "WHERE"],
    starter: "SELECT type, COUNT(*) FROM enemies GROUP BY type ____ COUNT(*) >= 3;",
    solution: "SELECT type, COUNT(*) FROM enemies GROUP BY type HAVING COUNT(*) >= 3;",
    explain: {
      simple: "HAVING is WHERE for groups. WHERE picks which rows go INTO the buckets; HAVING picks which BUCKETS come out. You can put aggregate conditions like COUNT(*) >= 3 in HAVING — you can't in WHERE.",
      analogy: "Like sorting laundry into color piles, then keeping only the piles big enough to be worth folding — the filter happens AFTER the sort."
    },
    onTheJob: {
      uses: "Anytime the question is \"which groups …\" — customers with more than N orders, days with revenue above a threshold, products that sold more than M times. WHERE can't do that; HAVING can.",
      example: "\"Which customers placed more than five orders?\" — GROUP BY customer_id HAVING COUNT(*) > 5."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Grist','Raider',55),
        (3,'Maul','Raider',70),
        (4,'Husk','Raider',50),
        (5,'Aegis','Warden',120),
        (6,'Bulwark','Warden',140),
        (7,'Pip','Scout',25);
    `,
    hints: [
      "You can't put COUNT(*) inside WHERE — try HAVING instead.",
      "GROUP BY first, then HAVING filters the groups.",
      "SELECT type, COUNT(*) FROM enemies GROUP BY type HAVING COUNT(*) >= 3;"
    ],
    terms: ["HAVING", "filter groups", "post-aggregate filter"]
  },

  {
    id: 18,
    concept: "AS / alias + ORDER BY aggregate",
    enemyArch: "warden",
    title: "Top Class",
    briefing: "Rank the classes — which one has the <b>most</b> units? Count per type, give the count a clean name with <code>AS</code>, then sort by it: most first.",
    objective: "Rank classes by size, largest first. Hint: name COUNT(*) with AS, then ORDER BY that name DESC.",
    realWorld: "Aliases let you give a computed column a readable name; sorting on that alias is how you turn a breakdown into a ranked report.",
    layer: "scratch",
    rounds: 4,
    creep: 0.20,
    reinforces: ["GROUP BY", "ORDER BY"],
    starter: "SELECT type, COUNT(*) ____ n FROM enemies GROUP BY type ORDER BY ____ DESC;",
    solution: "SELECT type, COUNT(*) AS n FROM enemies GROUP BY type ORDER BY n DESC;",
    explain: {
      simple: "AS renames a column in the output — `COUNT(*) AS n` shows up as a column called n, which you can also ORDER BY. ORDER BY on the aggregate is how a breakdown becomes a ranking.",
      analogy: "Like labelling each laundry pile (\"reds: 6, whites: 4, darks: 9\") and then lining the piles up biggest to smallest — same count, but now it's a ranking."
    },
    onTheJob: {
      uses: "Almost every leaderboard or top-N report is GROUP BY + aggregate + AS + ORDER BY — top regions by revenue, busiest hours by traffic, slowest pages by load time.",
      example: "\"Rank our regions by total sales, biggest first\" — SELECT region, SUM(amount) AS total FROM orders GROUP BY region ORDER BY total DESC."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Grist','Raider',55),
        (3,'Maul','Raider',70),
        (4,'Husk','Raider',50),
        (5,'Aegis','Warden',120),
        (6,'Bulwark','Warden',140),
        (7,'Pip','Scout',25),
        (8,'Skitter','Scout',30);
    `,
    hints: [
      "Give COUNT(*) a name with AS, then sort by that name.",
      "ORDER BY can sort by the alias you defined: ORDER BY n DESC.",
      "SELECT type, COUNT(*) AS n FROM enemies GROUP BY type ORDER BY n DESC;"
    ],
    terms: ["AS", "alias", "ORDER BY aggregate"]
  },

  /* ── PHASE ENCOUNTERS — boss-style 2-phase waves ────────────────────────── */

  {
    id: 19,
    concept: "WHERE → AND",
    enemyArch: "warden",
    title: "Warden Protocol",
    briefing: "Warden-class contacts detected. Their energy shields deflect targeting locks — two queries to bring them down. Phase 1: lock onto all Wardens to map the shield grid.",
    objective: "Lock onto all Wardens. Hint: WHERE type = '...' filters rows by a text value.",
    realWorld: "Multi-step targeting mirrors real analysis — find the right slice first, then narrow further with AND to act on the exact subset.",
    layer: "modify",
    rounds: 3,
    creep: 0,
    reinforces: ["WHERE", "AND"],
    starter: "SELECT * FROM enemies WHERE type = '____';",
    solution: "SELECT * FROM enemies WHERE type = 'Warden' AND health > 60;",
    phases: [
      {
        briefing: "Warden-class contacts detected. Their energy shields deflect targeting locks — calibrate first. Lock onto <b>all Warden contacts</b> to map the shield grid.",
        objective: "Lock onto all Wardens. Hint: WHERE type = '...' filters rows by a text value."  ,
        solution: "SELECT * FROM enemies WHERE type = 'Warden';"
      },
      {
        briefing: "Shields fractured. Heavy armor still standing — only the strongest Wardens (<code>health > 60</code>) remain a real threat. Finish them.",
        objective: "Finish Wardens with more than 60 health. Hint: add AND health > 60 after your type filter.",
        solution: "SELECT * FROM enemies WHERE type = 'Warden' AND health > 60;"
      }
    ],
    explain: {
      simple: "AND chains two WHERE conditions — a row must pass BOTH. Here, type = 'Warden' isolates the class; AND health > 60 sharpens the lock to only the dangerous ones.",
      analogy: "Like a keycard that needs both a code AND a fingerprint — only rows that clear both gates make the final list."
    },
    onTheJob: {
      uses: "Layering conditions with AND is how analysts zero in on an exact segment — one filter for category, another for threshold, a third for time range.",
      example: "\"High-value pending orders from this quarter\" — that's WHERE status = 'pending' AND amount > 1000 AND order_date >= '2026-01-01'."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Aegis','Warden',120),
        (2,'Medic Owl','Ally',40),
        (3,'Bulwark','Warden',50),
        (4,'Scout Fenn','Ally',30),
        (5,'Rampart','Warden',90),
        (6,'Shard','Warden',45);
    `,
    hints: [
      "Phase 1: pull all Wardens first to break the shields. Phase 2: tighten with AND.",
      "Phase 1: WHERE type = 'Warden'. Phase 2: add AND health > 60",
      "Phase 2: SELECT * FROM enemies WHERE type = 'Warden' AND health > 60;"
    ],
    terms: ["WHERE", "AND", "two-phase query", "compound condition"]
  },

  {
    id: 20,
    concept: "WHERE → OR",
    enemyArch: "scout",
    title: "Broken Escort",
    briefing: "Scout drones are shielding a Raider-Warden strike force. You can't lock the heavies until the escort is cleared. Phase 1: clear the Scouts.",
    objective: "Clear the Scout escort. Hint: WHERE type = '...' isolates a single class.",
    realWorld: "Sometimes a query needs to run in stages — identify one subset first, then pivot to a broader filter to finish the job.",
    layer: "modify",
    rounds: 3,
    creep: 0,
    reinforces: ["WHERE", "OR"],
    starter: "SELECT * FROM enemies WHERE type = '____';",
    solution: "SELECT * FROM enemies WHERE type = 'Raider' OR type = 'Warden';",
    phases: [
      {
        briefing: "Scout drones are shielding the Raiders and Wardens. Their jamming blocks targeting locks on the heavies. <b>Clear the Scout escort first.</b>",
        objective: "Clear the Scout escort. Hint: WHERE type = '...' isolates one class.",
        solution: "SELECT * FROM enemies WHERE type = 'Scout';"
      },
      {
        briefing: "Escort down — jamming cleared. <b>Raiders and Wardens are fully exposed.</b> Both are hostile; take them all in one query.",
        objective: "Take down Raiders or Wardens. Hint: WHERE type = '...' OR type = '...' lets either class through.",
        solution: "SELECT * FROM enemies WHERE type = 'Raider' OR type = 'Warden';"
      }
    ],
    explain: {
      simple: "OR widens a WHERE — a row passes when EITHER condition is true. type = 'Raider' OR type = 'Warden' catches both hostile classes in one filter.",
      analogy: "Like a checkpoint that lets through anyone on List A OR List B — you don't need to be on both; either one is enough."
    },
    onTheJob: {
      uses: "OR pulls multiple acceptable values at once — a handful of regions, a set of statuses, two product lines — without running a separate query for each.",
      example: "\"Orders from either the East or West region\" — WHERE region = 'East' OR region = 'West'."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Pip','Scout',25),
        (2,'Vex','Raider',60),
        (3,'Buzzer','Scout',20),
        (4,'Aegis','Warden',120),
        (5,'Glider','Scout',30),
        (6,'Medic Owl','Ally',40);
    `,
    hints: [
      "Phase 1: target only the Scouts. Phase 2: both Raiders and Wardens are hostile.",
      "Phase 1: WHERE type = 'Scout'. Phase 2: WHERE type = 'Raider' OR type = 'Warden'",
      "Phase 2: SELECT * FROM enemies WHERE type = 'Raider' OR type = 'Warden';"
    ],
    terms: ["WHERE", "OR", "two-phase query", "either/or condition"]
  }
];
