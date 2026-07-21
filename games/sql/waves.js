/* ────────────────────────────────────────────────────────────────────────
   SQL SPACE QUEST — WAVE CONFIG
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
    story: "The quartermaster meets you at the sensor deck with a clipboard and a haunted look. “Chief, something just lit up every board I own. Before anyone fires anything, I need the whole picture — every contact, every reading, nothing held back. Pull the full manifest and let me see what we’re actually dealing with.”",
    captain: {
      intro: "Chief, we're reading a massive cluster on our sensors. I need a full diagnostic — all contacts, every data point. Run a complete scan and show me what we're facing.",
      win: "Well done. You pulled the complete picture on your first try. That's command-level thinking."
    },
    briefing: "The network is flooded with incoming contacts. Your console fires a volley on whatever your query returns. To lock the entire swarm, return the complete <code>contacts</code> table — all columns, all rows.",
    objective: "Return every row and every column from the <code>contacts</code> table. Hint: Your opening query is loaded for you. Read it left to right, then execute. Nothing is filtered, so every contact lights up.",
    reinforces: [],
    starter: "SELECT * FROM contacts;",
    solution: "SELECT * FROM contacts;",
    solutions: [
      {briefing:"A network anomaly is spreading through our database. I need a full diagnostic — every piece of data about these corrupted contacts so we can understand the extent.",objective:"Pull the complete dataset from the <code>contacts</code> table. Hint: The asterisk means all columns. Fire it.",explain:{simple:"SELECT * pulls every row and every column out of a table. The * is a wildcard meaning give me everything.",analogy:"Like a doctor asking run every test on a patient — you get back all measurements, all vital signs, a complete picture."},onTheJob:{uses:"First step in any analysis: you don't know what you have yet. SELECT * answers that question fast.",example:"I just got access to the sales table — what does it even contain? — you'd SELECT * to see all rows and columns."}},
      {briefing:"Our sensors are detecting incoming signatures. Before the captain can decide on a response, she needs a complete threat assessment. Feed her the raw data.",objective:"Return the entire <code>contacts</code> table unfiltered. Every column, every row — the captain needs the complete picture.",explain:{simple:"SELECT * means pull back all the data; nothing is hidden or removed. You're retrieving the full dataset.",analogy:"Like a security camera showing the entire room, not just one corner — you capture everything that's there."},onTheJob:{uses:"Before you can filter or analyze, you need to see what exists. Unfiltered data dumps are your baseline.",example:"Give me the raw customer data so I can understand what fields we have — SELECT * FROM customers."}},
      {briefing:"The database is locked in read-only mode while we investigate the breach. Your first job: catalog everything. What contacts exist? Retrieve the complete manifest.",objective:"Return all data from the <code>contacts</code> table with no filtering. That's your starting point for diagnosis.",explain:{simple:"SELECT * is SQL's way of saying no filtering, no edits — just hand me the data as-is.",analogy:"Like opening a filing cabinet and looking at every folder without removing any — you inventory what's there."},onTheJob:{uses:"After a data incident, the first forensic step is always: what do we actually have? SELECT * shows the raw facts.",example:"Something went wrong in the pipeline. I need to see every row and column in the source table. — SELECT *."}},
      {briefing:"Our deep-space sensors picked up something familiar — an old Federation database still broadcasting. Before we can make sense of it, we need the full telemetry. Show me everything.",objective:"Retrieve the complete <code>contacts</code> table. No cuts, no filters — full transparency.",explain:{simple:"SELECT * retrieves the whole dataset without modification. It's the most basic query: show me what you've got.",analogy:"Like an explorer opening a sealed archive for the first time — you see everything inside, completely unchanged."},onTheJob:{uses:"The building block of every analysis: start with the complete data, then filter and transform it step by step.",example:"Load the full dataset into memory so I can work with it — SELECT *."}}
    ],
    explain:{simple:"SELECT pulls rows back out of a table. The * means every column, so SELECT * FROM contacts hands you the whole table, nothing left out.",analogy:"Like asking a librarian to wheel out an entire shelf — every book comes back, none held aside."},
    onTheJob:{uses:"Reading rows back out of a table is the very first move in almost any analysis — an ad-hoc data pull, a sanity check before a report, or just seeing what columns a table even has.",example:"A teammate says can you pull the contacts table so we can take a look? — you'd reach for SELECT to read those rows back."},
    schema: `
      CREATE TABLE contacts (id INTEGER, name TEXT, type TEXT, threat_level INTEGER);
      INSERT INTO contacts VALUES
        (1,'Recon Drone','Scout',30),
        (2,'Skitter','Scout',25),
        (3,'Buzzer','Scout',20),
        (4,'Glider','Scout',35);
    `,
    terms: ["SELECT", "table", "row", "result set", "wildcard *"]
  },

  {
    id: 2,
    concept: "SELECT columns",
    enemyArch: "scout",
    title: "Just the Essentials",
    story: "The comms officer is rationing bandwidth like it’s the last coffee on the ship. “I can’t push the full sensor dump to the bridge, Chief — the channel would melt. Command only needs two things per contact: what it’s called and what class it is. Send exactly that. Nothing else rides the wire today.”",
    captain: {
      intro: "You don't need a full readout to assess a target. Name only what matters — the contact's signature and type — and leave the noise behind.",
      win: "Precise. You took exactly what the situation demanded. That efficiency could save the ship."
    },
    briefing: "Signal isolation is critical. You need each contact's <b>name</b> and <b>type</b>, not the full sensor array. Name those two columns instead of using <code>*</code>.",
    objective: "Return only the <code>name</code> and <code>type</code> columns from <code>contacts</code>. Hint: instead of grabbing everything, name the two columns you actually want.",
    reinforces: ["SELECT"],
    starter: "SELECT ____, ____ FROM contacts;",
    solution: "SELECT name, type FROM contacts;",
    solutions: [
      {briefing:"Signal isolation is critical right now. We're drowning in telemetry. Give me just the contact name and class so we can assess threat vectors.",objective:"Pull only <code>name</code> and <code>type</code> from the <code>contacts</code> table. Hint: list them after SELECT, separated by a comma.",explain:{simple:"Instead of * you list the exact columns you want, separated by commas. SELECT name, type returns just those two columns for every row.",analogy:"Like ordering two specific dishes off a menu instead of asking for one of everything in the kitchen — you get exactly what you asked for, nothing extra."},onTheJob:{uses:"Real tables can have dozens of columns; pulling only the ones you need keeps the output readable, the query fast, and your intent clear to whoever reads it later.",example:"Someone asks just give me each customer's name and email — you'd name those two columns instead of selecting the whole table."}},
      {briefing:"We're implementing cascade damping — a containment protocol. To tune it right, I need to understand the distribution of threat levels across contact types. Give me just the type and the threat reading.",objective:"Return only <code>type</code> and <code>threat_level</code> from <code>contacts</code>. This time, pick the columns that help you see patterns.",explain:{simple:"You can SELECT any columns you need. Just list them by name after SELECT, in any order.",analogy:"Like a researcher choosing which measurements to record — you pick what's relevant, ignore the rest."},onTheJob:{uses:"Every analyst query starts with knowing which columns to pull. Too many columns = noise. Too few = missing the picture.",example:"I need to see which products are in each category — SELECT category, product_name FROM inventory."}},
      {briefing:"Speed matters. We're at red alert. I don't have time for full telemetry dumps. Just send me name and type — that's all the captain needs to make a call.",objective:"Retrieve <code>name</code> and <code>type</code> only. The fewer columns, the faster the response — and right now, fast wins.",explain:{simple:"SELECT name, type FROM contacts will return just those two columns for all rows in the contacts table.",analogy:"Like giving your commander a briefing slide instead of a 50-page report — concise, actionable, now."},onTheJob:{uses:"High-volume queries benefit from pulling only what you need. Database performance scales with column count.",example:"For a report on active users, SELECT user_id, status FROM users — not every field in the profile."}},
      {briefing:"Captain's briefing: what are we facing? Send me the roster — contact names and their classification. That's the intel I need to decide our next move.",objective:"Pull name and type from contacts. These two columns tell the story we need.",explain:{simple:"Named columns in SELECT let you pick exactly which data comes back. It's more efficient and clearer than SELECT *.",analogy:"Like a historian choosing which documents to study — you focus on the relevant ones, not every archive box."},onTheJob:{uses:"Column selection is how you communicate intent. Seeing SELECT name, type tells the next person exactly what question you were answering.",example:"To find high-value customers, SELECT customer_id, revenue FROM customers WHERE revenue > 50000."}}
    ],
    explain:{simple:"Instead of * you can list the exact columns you want, separated by commas. SELECT name, type returns just those two columns for every row.",analogy:"Like ordering two specific dishes off a menu instead of asking for one of everything in the kitchen — you get exactly what you asked for, nothing extra."},
    onTheJob:{uses:"Real tables can have dozens of columns; pulling only the ones you need keeps the output readable, the query fast, and your intent clear to whoever reads it later.",example:"Someone asks just give me each customer's name and email — you'd name those two columns instead of selecting the whole table."},
    schema: `
      CREATE TABLE contacts (id INTEGER, name TEXT, type TEXT, threat_level INTEGER);
      INSERT INTO contacts VALUES
        (1,'Recon Drone','Scout',30),
        (2,'Skitter','Scout',25),
        (3,'Pip','Scout',28),
        (4,'Glider','Scout',35);
    `,
    terms: ["column list", "projection", "comma-separated columns"]
  },

  {
    id: 3,
    concept: "SELECT DISTINCT",
    enemyArch: "raider",
    title: "Sensor Noise",
    story: "The log clerk has been awake for two shifts and it shows. “The cascade duplicated every entry as it spread — I’m logging the same drone four times and my counts are garbage. Collapse the echoes for me, Chief. One clean line per real contact, and I can finally close the ledger.”",
    captain: {
      intro: "The logs are flooded with duplicates from a cascading loop. We need a clean picture: one entry per unique contact. Filter out the echoes and show me the real targets.",
      win: "Clean signal. One entry per target — you cut through the noise and showed me what's actually there."
    },
    briefing: "The log processor duplicated every contact entry as the cascade spread through the system. Collapse the duplicate rows into one clean entry per contact.",
    objective: "Return each contact once — no duplicate rows. Hint: the de-dupe keyword is already in the starter — just fill in the two columns that identify each unique contact.",
    reinforces: ["SELECT"],
    starter: "SELECT DISTINCT ____, ____ FROM contacts;",
    solution: "SELECT DISTINCT name, type FROM contacts;",
    solutions: [
      {briefing:"Log echo cleanup protocol: we need to see how many unique contact types we're actually dealing with. Every duplicate record is bloating the signal. De-dupe and show me the roster.",objective:"Return each unique combination of <code>name</code> and <code>type</code> once. Hint: DISTINCT goes right after SELECT.",explain:{simple:"DISTINCT filters the result set down to unique rows only — any row that's an exact copy of another is dropped. It sits right after SELECT, before the column list.",analogy:"Like calling roll in a class where some students appear twice on the sheet — you mark each name once and skip the repeat."},onTheJob:{uses:"Duplicates sneak in through logging, joins, and pipelines. SELECT DISTINCT is the quick sanity-check: how many unique values actually exist in this column?",example:"How many distinct product categories do we sell? — SELECT DISTINCT category FROM products."}},
      {briefing:"Cascade filtering in progress. I need to understand threat distribution across unique contact types — but first, no duplicates in the result set. Give me the distinct contact signatures.",objective:"Remove all duplicate rows from <code>contacts</code>. Show <code>name</code> and <code>type</code>, one per unique contact.",explain:{simple:"SELECT DISTINCT eliminates duplicate rows. If two rows are identical, only one survives in the result.",analogy:"Like a librarian removing duplicate catalog cards — the library now has a clean, accurate list."},onTheJob:{uses:"Before analyzing data, you often need to know: how many unique values are there really? DISTINCT answers that fast.",example:"How many distinct customers actually placed orders this month? — SELECT DISTINCT customer_id FROM orders."}},
      {briefing:"Threat assessment requires accuracy. The database is reporting duplicates for every incoming signal. Use DISTINCT to collapse them back to ground truth: one entry per actual threat.",objective:"Filter <code>contacts</code> to show each unique threat once. Return <code>name</code> and <code>type</code> with no repeats.",explain:{simple:"DISTINCT is SQL's way of saying keep only the unique rows. It compares entire rows, not individual columns.",analogy:"Like a bouncer checking IDs — if you've already been checked in, you don't get checked again."},onTheJob:{uses:"Event logs often create duplicates when systems process the same event twice. DISTINCT is your first deduplication tool.",example:"Our user login table has duplicates. SELECT DISTINCT user_id, login_time FROM logins to see unique sessions."}},
      {briefing:"Unique count verification: I need an accurate manifest of who — and what — we're facing. The sensor logs duplicated every entry. De-dupe the contacts and send me a clean count.",objective:"Use DISTINCT to return each unique contact in the table. Show <code>name</code> and <code>type</code>, no duplicates.",explain:{simple:"SELECT DISTINCT queries return each unique row exactly once, no matter how many times it appears in the original table.",analogy:"Like sorting through a stack of business cards and removing duplicates — you end up with one card per person."},onTheJob:{uses:"Database duplicates are common. DISTINCT is often the first step in cleaning data: see what unique values actually exist.",example:"Our ETL pipeline might have created duplicate customer records. SELECT DISTINCT email FROM customers to audit."}}
    ],
    explain:{simple:"DISTINCT filters the result set down to unique rows only — any row that's an exact copy of another is dropped. It sits right after SELECT, before the column list.",analogy:"Like calling roll in a class where some students appear twice on the sheet — you mark each name once and skip the repeat."},
    onTheJob:{uses:"Duplicates sneak in through logging, joins, and pipelines. SELECT DISTINCT is the quick sanity-check: how many unique values actually exist in this column?",example:"How many distinct product categories do we sell? — SELECT DISTINCT category FROM products."},
    schema: `
      CREATE TABLE contacts (id INTEGER, name TEXT, type TEXT, threat_level INTEGER);
      INSERT INTO contacts VALUES
        (1,'Vex','Raider',60),
        (1,'Vex','Raider',60),
        (2,'Pip','Scout',25),
        (2,'Pip','Scout',25),
        (3,'Maul','Raider',70),
        (4,'Glider','Scout',30),
        (4,'Glider','Scout',30);
    `,
    terms: ["SELECT DISTINCT", "deduplication", "unique values"]
  },

  {
    id: 4,
    concept: "WHERE",
    enemyArch: "raider",
    title: "Hold Your Fire",
    story: "A very nervous ensign flags you down at the firing console. “Chief — our own scouts are mixed into that lane. Medic Owl is out there. If your query is one word too loose, we hit our own people. Lock the Raiders and only the Raiders. Please. I already wrote the apology letter once this month.”",
    briefing: "Allied scouts are mixed into the lane — don't hit your own. Target only the hostiles (type <code>'Raider'</code>).",
    objective: "Return only the Raiders. Hint: the filter is set up for you — supply the class it should match, spelled exactly as it appears in the data.",
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
    terms: ["WHERE", "filter", "condition", "string literal"]
  },

  {
    id: 5,
    concept: "WHERE (numbers)",
    enemyArch: "raider",
    title: "Heavy Armor",
    story: "The gunnery sergeant taps the ammo readout meaningfully. “Every shot costs us, Chief, and light raiders pop on their own if you glare at them. Spend the volley on the heavies — anything holding more than fifty armor. The rest aren’t worth the capacitor charge.”",
    briefing: "Light raiders aren't worth a shot. Lock only the heavy ones — more than <code>50</code> health.",
    objective: "Return enemies with more than 50 health. Hint: fill in the sign for &ldquo;greater than.&rdquo; A number stands on its own — no quotes.",
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
    terms: ["comparison operator", "> < >= <=", "numeric filter"]
  },

  {
    id: 6,
    concept: "AND",
    enemyArch: "raider",
    title: "Confirmed Hostiles",
    story: "The bounty clerk slides a form across the desk with two checkboxes on it. “Command pays out when a target ticks both boxes: hostile class AND heavy armor. One box is a warning shot; two boxes is a payday. Bring me the contacts that clear both, and only those.”",
    briefing: "Tighten the firing solution: lock a contact only if it's a <code>'Raider'</code> <b>and</b> above <code>50</code> health.",
    objective: "Return Raiders that also have more than 50 health. Hint: both conditions are written — connect them so a row must pass <b>both</b> to count.",
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
    terms: ["AND", "compound condition", "logical operator"]
  },

  {
    id: 7,
    concept: "OR",
    enemyArch: "raider",
    title: "Multiple Targets",
    story: "The escort commander crackles onto your channel mid-maneuver. “Two hostile classes inbound, Chief — Raiders and Wardens, mixed in with our allies. I don’t care which flavor of trouble a contact is, if it’s either one, I want it on the firing list. Allies stay off it. Simple as that.”",
    briefing: "Two hostile classes inbound. Target every <code>'Raider'</code> and <code>'Warden'</code>; leave the allies be.",
    objective: "Return every Raider and every Warden. Hint: last wave a row had to pass <b>both</b> tests — here it counts if it passes <b>either</b> one. Which connector is the looser of the two?",
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
    terms: ["OR", "IN", "either/or condition"]
  },

  {
    id: 8,
    concept: "ORDER BY",
    enemyArch: "warden",
    title: "Threat Priority",
    story: "The fire-control lieutenant is a person of strong opinions about paperwork. “A pile of targets is not a plan, Chief. Rank the lane for me — deadliest first, down to the small fry. When the shooting starts I read top to bottom, and I’d rather not discover the big one at the bottom of the page.”",
    briefing: "Fire control wants the lane ranked, deadliest first. Sort every enemy by health, high to low.",
    objective: "Return all enemies, highest health first. Hint: the sort is already set to highest-first — just point it at the column the ranking is based on.",
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
    terms: ["ORDER BY", "ASC / DESC", "sort"]
  },

  {
    id: 9,
    concept: "LIMIT",
    enemyArch: "warden",
    title: "Top Threats Only",
    story: "The munitions officer holds up three fingers. “That’s the whole torpedo inventory, Chief. Three. So no, we are not ‘clearing the lane’ today. Rank them by armor and hand me the top three — the rest can file a complaint with the vacuum.”",
    briefing: "No time to clear the lane — hit only the three biggest threats. Sort by health, then keep the top rows.",
    objective: "Return only the 3 highest-health enemies. Hint: they're already sorted biggest-first — now keep just the top few and stop. What caps how many rows come back?",
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
    terms: ["LIMIT", "top N", "sample"]
  },

  {
    id: 10,
    concept: "JOIN",
    enemyArch: "warden",
    title: "Mark the Bounties",
    story: "The bounty clerk again, this time with two ledgers under one arm. “Legal says we only get paid for contacts with an active bounty — and of course the bounty list lives in its own table, because nothing on this ship is ever in one place. Match them up for me, Chief. No bounty, no shot, no invoice.”",
    briefing: "Command only authorizes fire on contacts with an active bounty. That list lives in a separate <code>bounties</code> table — join to it.",
    objective: "Return only enemies that have a bounty. Hint: the two tables connect through a value they share — line up the id in <code>enemies</code> with the matching column in <code>bounties</code>.",
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
    terms: ["JOIN", "key", "ON", "table alias"]
  },

  {
    id: 11,
    concept: "LEFT JOIN",
    enemyArch: "warden",
    title: "Off the Books",
    story: "The auditor from Fleet arrives with the special smile auditors have. “Your last report only listed contacts with bounties. Charming. I need everyone on the scope — bounty or not. The ones with nothing on file are exactly the ones I’m curious about. Keep every contact on the readout, even where the reward column comes up empty.”",
    briefing: "Two contacts are off the books with no bounty. A plain <code>JOIN</code> would drop them — keep every enemy on the readout.",
    objective: "Return all enemies, bounty or not. Hint: a plain join would drop the contacts with no reward — which kind of join keeps <b>every</b> left-side row, match or not?",
    reinforces: ["JOIN"],
    starter: "SELECT e.id, e.name, e.type, e.health\nFROM enemies e\n____ JOIN rewards r ON e.id = r.enemy_id;",
    solution: "SELECT e.id, e.name, e.type, e.health FROM enemies e LEFT JOIN rewards r ON e.id = r.enemy_id;",
    explain: {
      simple: "LEFT JOIN keeps every row from the left table. When the right table has no match, the right-side columns come back as NULL — but the left-side row is never dropped. INNER JOIN would have cut those rows silently.",
      analogy: "Like a class photo where some students forgot their permission slip — you still include them in the picture, their slip column just says blank."
    },
    onTheJob: {
      uses: "LEFT JOIN is how you find 'orphans' — customers with no orders, users with no activity, products with no sales. You can't see what's missing with an INNER JOIN.",
      example: "\"Which customers have never placed an order?\" — LEFT JOIN customers to orders; any customer with no matching order shows up with NULLs on the orders side."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60),
        (2,'Pip','Scout',25),
        (3,'Maul','Raider',70),
        (4,'Glider','Scout',30);
      CREATE TABLE rewards (enemy_id INTEGER, bounty INTEGER);
      INSERT INTO rewards VALUES (1,500),(3,750);
    `,
    terms: ["LEFT JOIN", "outer join", "NULL for no match", "unmatched rows"]
  },

  {
    id: 12,
    concept: "IS NULL",
    enemyArch: "scout",
    title: "Dark Contacts",
    story: "The intelligence officer spreads out the dossiers, and two of them are just… blank. “See that, Chief? No weakness on file. Not zero, not ‘none’ — missing. Those are the contacts that scare me. Surface everything we have no book on, and I’ll get analysts on them tonight.”",
    briefing: "Two contacts have no weakness on file. <code>NULL</code> means the data is missing — not zero, not blank. Surface those unknowns.",
    objective: "Return only enemies with no weakness on record. Hint: missing data won't answer to an equals sign — there's a special test for &ldquo;this field has nothing in it.&rdquo; What fills the blank?",
    reinforces: ["WHERE"],
    starter: "SELECT * FROM enemies WHERE weakness ____ NULL;",
    solution: "SELECT * FROM enemies WHERE weakness IS NULL;",
    explain: {
      simple: "NULL is not a value — it's the absence of one. You can't test it with = because NULL = NULL is undefined in SQL. IS NULL is the correct operator: 'this field has no data'.",
      analogy: "Like asking 'who handed in a blank form?' — you can't search for a blank by typing an answer; you have to ask specifically for forms with nothing written."
    },
    onTheJob: {
      uses: "Missing data is everywhere — optional fields, failed lookups, late entries. IS NULL finds the gaps; IS NOT NULL filters to only rows with data.",
      example: "\"Which customers haven't provided a phone number?\" — WHERE phone IS NULL."
    },
    schema: `
      CREATE TABLE enemies (id INTEGER, name TEXT, type TEXT, health INTEGER, weakness TEXT);
      INSERT INTO enemies VALUES
        (1,'Vex','Raider',60,'plasma'),
        (2,'Pip','Scout',25,NULL),
        (3,'Maul','Raider',70,NULL),
        (4,'Glider','Scout',30,'cryo');
    `,
    terms: ["NULL", "IS NULL", "IS NOT NULL", "missing data"]
  },

  /* ── TIER 2 — refine filters & first aggregates ─────────────────────────── */

  {
    id: 13,
    concept: "IN",
    enemyArch: "raider",
    title: "The Wanted Set",
    story: "The watch officer hands you the wanted list, which is getting longer. “Last time you chained ORs together like train cars and I aged a year reading it. There’s a cleaner way to say ‘any of these’ — use it. Raiders and Wardens, one tidy filter, and my eyesight thanks you.”",
    briefing: "Two hostile classes again — but stacking <code>OR</code>s gets messy. Match the whole set in one clean filter.",
    objective: "Return every Raider and Warden. Hint: you stacked <code>OR</code>s for this before — here's the tidy way to test one value against a whole list at once.",
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
    terms: ["IN", "set membership", "list of values"]
  },

  {
    id: 14,
    concept: "BETWEEN",
    enemyArch: "warden",
    title: "Threat Window",
    story: "The tactical analyst draws two lines on the threat chart. “This run is about the middle of the pack, Chief — armor from fifty to a hundred, ends included. Below that they’re chaff; above it we’re calling in the big guns. Give me the band, clean, in one clause.”",
    briefing: "Mid-tier threats only this run — armor from <code>50</code> to <code>100</code>. Filter the range cleanly.",
    objective: "Return enemies with health from 50 to 100. Hint: one keyword captures a whole range with both ends included — no need for two separate comparisons.",
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
    terms: ["BETWEEN", "range filter", "inclusive bounds"]
  },

  {
    id: 15,
    concept: "LIKE",
    enemyArch: "warden",
    title: "Pattern Match",
    story: "The signals officer slides you an intercepted fragment. “All we got off the intercept is that the cell’s callsigns start with V. That’s it. One letter. So no exact matches today, Chief — you’re hunting a pattern. Everything that opens with a V goes on the board.”",
    briefing: "Intel ties the next strike to any callsign starting with <code>V</code>. Match by pattern, not exact name.",
    objective: "Return every enemy whose name starts with V. Hint: an exact match can't do &ldquo;starts with&rdquo; — the pattern <code>'V%'</code> is ready, so which operator matches text against a pattern?",
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
    terms: ["LIKE", "% wildcard", "pattern matching"]
  },

  {
    id: 16,
    concept: "COUNT",
    enemyArch: "warden",
    title: "Body Count",
    story: "Field command doesn’t want the list. Field command wants a number. “Chief, I’m standing in front of the admiral in four minutes and she’s going to ask ‘how many Raiders,’ and if I hand her a table she will hand it back. One number. Count them.”",
    briefing: "Field command wants a number, not a list: how many Raiders are out there?",
    objective: "Return how many Raiders there are — a single number. Hint: you don't want the rows themselves, just <b>how many</b> — which function tallies matching rows into one number?",
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
    terms: ["COUNT", "aggregate function", "scalar result"]
  },

  {
    id: 17,
    concept: "SUM / AVG",
    enemyArch: "warden",
    title: "Total Threat",
    story: "The chief engineer squints at the power budget. “To tune the shield harmonics I need the total armor in this sector — every contact’s health, added into one figure. Don’t send me the rows, Chief, I’ve got a reactor to babysit. Send me the sum.”",
    briefing: "Sum the armor in the sector — the total health across every contact on the board.",
    objective: "Return the total health of all enemies — a single number. Hint: like last wave's tally, but instead of <b>how many</b> rows you want the column <b>added up</b>. Which function sums it?",
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
    terms: ["SUM", "AVG", "numeric aggregate"]
  },

  {
    id: 18,
    concept: "MIN / MAX",
    enemyArch: "warden",
    title: "Worst-Case Read",
    story: "The briefing officer preps the worst-case slide. “Command briefings run on extremes, Chief — nobody remembers the average. What’s the single toughest contact out there? Highest armor value on the board, one number, and it goes at the top of the slide in a very large font.”",
    briefing: "Brief the team on the single deadliest contact — the highest health on the board.",
    objective: "Return the single highest health value. Hint: same family as the totals — but you want the single <b>biggest</b> value in the column, not the sum. Which one reaches for the largest?",
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
    terms: ["MIN", "MAX", "extremes"]
  },

  /* ── TIER 3 — grouping ──────────────────────────────────────────────────── */

  {
    id: 19,
    concept: "GROUP BY",
    enemyArch: "warden",
    title: "Per-Class Census",
    story: "The census clerk from Fleet logistics arrives with forms in triplicate. “One grand total tells me nothing, Chief. I need the head count per class — so many Raiders, so many Wardens, so many Scouts. Bucket them first, then count each bucket. That’s how the paperwork wants it, and the paperwork always wins.”",
    briefing: "One total for the whole board isn't enough — command wants the head count for each class.",
    objective: "Return one count per class. Hint: one grand total isn't enough — you need the tally <b>bucketed</b> by class. What two words group the rows before counting?",
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
    terms: ["GROUP BY", "bucketing", "one row per group"]
  },

  {
    id: 20,
    concept: "HAVING",
    enemyArch: "warden",
    title: "Squads Only",
    story: "The strike coordinator won’t scramble fighters for stragglers. “A strike package costs the same whether it hits one ship or five, Chief. So we only call it on real squads — classes fielding three or more. Filter the groups themselves, after the counting. Lone wolves get ignored; that’s policy.”",
    briefing: "Only call a strike on classes with a real squad — three or more units. Filter the groups, not the rows.",
    objective: "Return only classes with 3 or more units. Hint: you're filtering the <b>groups</b> now, not the rows — and <code>WHERE</code> can't see a count. Which keyword filters after grouping?",
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
    terms: ["HAVING", "filter groups", "post-aggregate filter"]
  },

  {
    id: 21,
    concept: "AS / alias + ORDER BY aggregate",
    enemyArch: "warden",
    title: "Top Class",
    story: "The admiral’s aide needs the slide by the top of the hour. “She wants the classes ranked by size, biggest first, and she wants the count column to have an actual name — ‘COUNT(*)’ on a flag briefing looks like a typo. Label it something short, sort on that label, done.”",
    briefing: "Rank the classes by size, biggest first. Name the count, then sort on it.",
    objective: "Return each class and its unit count, biggest first. Hint: give the count a short name, then sort on that name — which keyword labels a column?",
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
    terms: ["AS", "alias", "ORDER BY aggregate"]
  },

  /* ── PHASE ENCOUNTERS — boss-style 2-phase waves ────────────────────────── */

  {
    id: 22,
    concept: "WHERE → AND",
    enemyArch: "warden",
    title: "Warden Protocol",
    story: "The shield specialist watches the Warden formation with professional respect. “Two-step job, Chief. Their shields shrug off a broad lock, so first map every Warden on the grid. Once the shields fracture, we finish only the heavies — the ones still holding real armor. Same table, tighter and tighter aim.”",
    briefing: "Warden-class contacts detected — their shields deflect targeting locks. Two queries to bring them down. Phase 1 maps the grid.",
    objective: "Return all Warden contacts. Hint: isolate one class first, then tighten the lock further.",
    reinforces: ["WHERE", "AND"],
    starter: "SELECT * FROM enemies WHERE type = '____';",
    solution: "SELECT * FROM enemies WHERE type = 'Warden' AND health > 60;",
    phases: [
      {
        briefing: "Warden contacts detected — their shields deflect locks. Map the grid first: lock every Warden.",
        objective: "Return all Warden contacts. Hint: isolate one class to start — fill in the name the filter should match, spelled exactly."  ,
        solution: "SELECT * FROM enemies WHERE type = 'Warden';"
      },
      {
        briefing: "Shields fractured. Only the strongest Wardens (<code>health &gt; 60</code>) still stand — finish them.",
        objective: "Return Wardens with more than 60 health. Hint: keep your Warden filter, then chain a second condition so <b>both</b> must hold.",
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
    terms: ["WHERE", "AND", "two-phase query", "compound condition"]
  },

  {
    id: 23,
    concept: "WHERE → OR",
    enemyArch: "scout",
    title: "Broken Escort",
    story: "The escort commander is back, and jammed. “Scout drones are scrambling every lock I have on the heavies. Phase one: sweep the Scouts. The moment the jamming drops, phase two: everything hostile — Raiders and Wardens both, one filter, no survivors. Allies sit this one out, as always.”",
    briefing: "Scout drones are jamming your locks on a Raider-Warden strike force. Clear the escort before the heavies. Phase 1 takes the Scouts.",
    objective: "Return all Scouts to clear the escort. Hint: clear one class first, then sweep up the rest.",
    reinforces: ["WHERE", "OR"],
    starter: "SELECT * FROM enemies WHERE type = '____';",
    solution: "SELECT * FROM enemies WHERE type = 'Raider' OR type = 'Warden';",
    phases: [
      {
        briefing: "Scout drones are jamming your locks on the heavies. Clear the Scout escort first.",
        objective: "Return all Scouts to clear the escort. Hint: deal with the jammers first — keep only the one class that's jamming you.",
        solution: "SELECT * FROM enemies WHERE type = 'Scout';"
      },
      {
        briefing: "Escort down, jamming cleared. Raiders and Wardens are exposed — take them all at once.",
        objective: "Return all Raiders and Wardens. Hint: two classes are hostile now — a row counts if it's <b>either</b> one. Which connector lets either through?",
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
    terms: ["WHERE", "OR", "two-phase query", "either/or condition"]
  }
];
