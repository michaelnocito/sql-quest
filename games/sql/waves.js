/* ────────────────────────────────────────────────────────────────────────
   SQL QUEST — WAVE CONFIG
   Each wave is fully data-driven so new waves (and whole expansion packs)
   can be added without touching engine code. The engine builds a fresh
   SQLite DB from `schema`, runs the player's query AND the `solution`,
   and compares the two result sets (order-insensitive). A match = the
   tower locks every enemy in the lane and clears the wave.

   The enemies shown in the battlefield lane ARE the solution's result set.
   So "write the query that returns exactly these targets" is the puzzle.
   ──────────────────────────────────────────────────────────────────────── */
window.WAVES = [
  {
    id: 1,
    concept: "SELECT",
    title: "First Contact",
    // Plain-language briefing — analyst vocab introduced gently.
    briefing: "A scout swarm broke through the perimeter. Your turret targets whatever your query returns. Pull <b>every row</b> out of the <code>enemies</code> table to lock onto the whole swarm.",
    objective: "Return all enemies so the turret targets every one.",
    realWorld: "SELECT is the first thing an analyst writes — it pulls raw rows out of a table so you can see what you're working with.",
    // Learning layer: copy/modify. Starter query is shown pre-filled.
    layer: "copy",                // copy → modify → scratch
    starter: "SELECT * FROM enemies;",
    solution: "SELECT * FROM enemies;",
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
    title: "Hold Your Fire",
    briefing: "Allied scouts are mixed into the lane — don't shred your own people. Only the <b>hostiles</b> (type <code>'Raider'</code>) should be targeted. Filter the swarm with a <code>WHERE</code> clause.",
    objective: "Return only the Raiders. Spare everyone else.",
    realWorld: "WHERE zooms a whole table down to just the rows a question is about — one date range, one region, one customer.",
    layer: "modify",
    starter: "SELECT * FROM enemies WHERE type = '____';",
    solution: "SELECT * FROM enemies WHERE type = 'Raider';",
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
    title: "Mark the Bounties",
    briefing: "Command only authorizes fire on enemies with an active <b>bounty</b>. The bounty list lives in a separate table. <code>JOIN</code> <code>enemies</code> to <code>bounties</code> so the turret only locks the wanted ones.",
    objective: "Return the enemies that have a matching bounty.",
    realWorld: "Real data lives across many tables. JOIN stitches them together — orders to customers, users to events — to answer almost any question.",
    layer: "scratch",
    starter: "SELECT e.id, e.name, e.type, e.health\nFROM enemies e\nJOIN bounties b ON ____ = ____;",
    solution: "SELECT e.id, e.name, e.type, e.health FROM enemies e JOIN bounties b ON e.id = b.enemy_id;",
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
