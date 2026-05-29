/* ────────────────────────────────────────────────────────────────────────
   SQL QUEST — WAVE CONFIG
   Each wave is fully data-driven so new waves (and whole expansion packs)
   can be added without touching engine code. The engine builds a fresh
   SQLite DB from `schema`, runs the player's query AND the `solution`,
   and compares the two result sets (order-insensitive). A match = the
   tower locks every enemy in the lane and clears the wave.

   The enemies shown in the battlefield lane ARE the solution's result set.
   So "write the query that returns exactly these targets" is the puzzle.

   SPACED RETRIEVAL (learning science): concepts must come back AFTER A GAP,
   interleaved with newer material, so the player has to *recall* them, not just
   repeat them in a block. Two levers, both pure data here:
     1. Layering — author each wave's `solution` so it necessarily reuses earlier
        verbs (every query is still a SELECT; later ones fold in WHERE/JOIN/…).
     2. `reinforces: [...]` — names the earlier concepts a wave drills again, so
        the briefing shows a "Recall drill" chip and the schedule is explicit.
   Target schedule as waves are added (expanding gaps, Leitner-style): revisit a
   concept ~1, then ~3, then ~7 waves after it's introduced, in a fresh context.
   ──────────────────────────────────────────────────────────────────────── */
window.WAVES = [
  {
    id: 1,
    concept: "SELECT",
    enemyArch: "scout",           // nimble 3-point shards
    title: "First Contact",
    // Plain-language briefing — analyst vocab introduced gently.
    briefing: "A scout swarm broke through the perimeter. Your turret targets whatever your query returns. Pull <b>every row</b> out of the <code>enemies</code> table to lock onto the whole swarm.",
    objective: "Return all enemies so the turret targets every one.",
    realWorld: "SELECT is the first thing an analyst writes — it pulls raw rows out of a table so you can see what you're working with.",
    // Learning layer: copy/modify. Starter query is shown pre-filled.
    layer: "copy",                // copy → modify → scratch
    // Combat tuning: rounds = correct volleys needed to clear the lane
    // (drilling the new syntax a few times), creep = how far enemies edge
    // forward per turn (0..4 reaches the base). Early waves creep slowly.
    rounds: 3,
    creep: 0.10,
    reinforces: [],               // first concept — nothing to recall yet
    starter: "SELECT * FROM enemies;",
    solution: "SELECT * FROM enemies;",
    explain: {
      simple: "SELECT pulls rows back out of a table. The * means “every column”, so SELECT * FROM enemies hands you the whole table, nothing left out.",
      analogy: "Like asking a librarian to wheel out an entire shelf — every book comes back, none held aside."
    },
    readAloud: {
      sql: "SELECT * FROM enemies;",
      say: "Select everything from the enemies table — give me every column of every row.",
      lines: [
        ["SELECT", "tells the database you want to read data back"],
        ["*", "the wildcard — every column, no need to name them one by one"],
        ["FROM enemies", "which table to pull the rows from"]
      ]
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
    // Terms unlocked this wave (could power a future codex panel).
    terms: ["SELECT", "table", "row", "result set", "wildcard *"]
  },

  {
    id: 2,
    concept: "WHERE",
    enemyArch: "raider",          // 5-point red stars
    title: "Hold Your Fire",
    briefing: "Allied scouts are mixed into the lane — don't shred your own people. Only the <b>hostiles</b> (type <code>'Raider'</code>) should be targeted. Filter the swarm with a <code>WHERE</code> clause.",
    objective: "Return only the Raiders. Spare everyone else.",
    realWorld: "WHERE zooms a whole table down to just the rows a question is about — one date range, one region, one customer.",
    layer: "modify",
    rounds: 3,
    creep: 0.14,
    reinforces: ["SELECT"],       // still pulling rows with SELECT before you filter
    starter: "SELECT * FROM enemies WHERE type = '____';",
    solution: "SELECT * FROM enemies WHERE type = 'Raider';",
    explain: {
      simple: "WHERE keeps only the rows that meet a condition and drops the rest, so the query acts on just the slice you care about — here, the rows whose type is 'Raider'.",
      analogy: "Like telling that librarian “only the mystery novels, please” — you get back just the books that match, not the whole shelf."
    },
    readAloud: {
      sql: "SELECT * FROM enemies WHERE type = 'Raider';",
      say: "Select everything from enemies, but only the rows where the type equals 'Raider'.",
      lines: [
        ["SELECT *", "read back every column…"],
        ["FROM enemies", "…of the enemies table"],
        ["WHERE type = 'Raider'", "keep only rows whose type is exactly 'Raider' (text must match in quotes)"]
      ]
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
    id: 3,
    concept: "JOIN",
    enemyArch: "warden",          // heavy 6-point violet crystals
    title: "Mark the Bounties",
    briefing: "Command only authorizes fire on enemies with an active <b>bounty</b>. The bounty list lives in a separate table. <code>JOIN</code> <code>enemies</code> to <code>bounties</code> so the turret only locks the wanted ones.",
    objective: "Return the enemies that have a matching bounty.",
    realWorld: "Real data lives across many tables. JOIN stitches them together — orders to customers, users to events — to answer almost any question.",
    layer: "scratch",
    rounds: 4,
    creep: 0.18,
    reinforces: ["SELECT", "WHERE"], // re-type SELECT + columns; the ON match is WHERE's "match on a condition" muscle
    starter: "SELECT e.id, e.name, e.type, e.health\nFROM enemies e\nJOIN bounties b ON ____ = ____;",
    solution: "SELECT e.id, e.name, e.type, e.health FROM enemies e JOIN bounties b ON e.id = b.enemy_id;",
    explain: {
      simple: "JOIN links two tables on a value they share, so one query can use facts from both at once — here, only enemies whose id appears in the bounties table come back.",
      analogy: "Like matching coat-check tickets to coats: each ticket number lines up with exactly one coat, so you only pull the coats that have a ticket."
    },
    readAloud: {
      sql: "SELECT e.id, e.name, e.type, e.health\nFROM enemies e\nJOIN bounties b ON e.id = b.enemy_id;",
      say: "Read four columns from enemies, and stitch in the bounties table where each enemy's id matches a bounty's enemy_id — so only enemies on the bounty list come back.",
      lines: [
        ["SELECT e.id, e.name, …", "the columns to return, each tagged with the enemies alias e"],
        ["FROM enemies e", "the main table, nicknamed e"],
        ["JOIN bounties b", "bring in the bounties table, nicknamed b"],
        ["ON e.id = b.enemy_id", "match rows where the ids line up — the link between the two tables"]
      ]
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Drifter','Raider',45),
        (3,'Grist','Raider',55),
        (4,'Husk','Raider',50);
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
