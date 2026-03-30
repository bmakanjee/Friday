import { Database } from "bun:sqlite";
import { config } from "../../config";

let db: Database;

export function getDb(): Database {
  if (!db) {
    db = new Database(config.dbPath, { create: true });
    db.run("PRAGMA journal_mode = WAL");
    db.run("PRAGMA foreign_keys = ON");
    migrate(db);
  }
  return db;
}

function migrate(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS ad_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      campaign_id TEXT NOT NULL,
      campaign_name TEXT,
      objective TEXT,
      status TEXT,
      daily_budget REAL,
      spend REAL DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      reach INTEGER DEFAULT 0,
      leads INTEGER DEFAULT 0,
      cpl REAL,
      ctr REAL,
      cpc REAL,
      cpm REAL,
      roas REAL,
      frequency REAL,
      fetched_at TEXT NOT NULL,
      UNIQUE(date, campaign_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS account_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      spend REAL DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      reach INTEGER DEFAULT 0,
      leads INTEGER DEFAULT 0,
      cpl REAL,
      ctr REAL,
      cpc REAL,
      cpm REAL,
      frequency REAL,
      video_views INTEGER DEFAULT 0,
      fetched_at TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meta_lead_id TEXT UNIQUE,
      name TEXT,
      phone TEXT,
      email TEXT,
      form_id TEXT,
      campaign_id TEXT,
      created_at TEXT,
      status TEXT DEFAULT 'new',
      notes TEXT,
      fetched_at TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS agent_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      event_type TEXT,
      summary TEXT,
      details TEXT,
      source TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      severity TEXT,
      category TEXT,
      message TEXT,
      resolved INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS telegram_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_message_id INTEGER,
      chat_id TEXT,
      sender TEXT,
      message_type TEXT DEFAULT 'text',
      text TEXT,
      file_path TEXT,
      processed INTEGER DEFAULT 0,
      timestamp TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo',
      priority TEXT DEFAULT 'P2',
      category TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      completed_at TEXT
    )
  `);

  db.run("CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)");
  db.run("CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)");

  // Seed tasks if table is empty
  const taskCount = db.query("SELECT COUNT(*) as n FROM tasks").get() as any;
  if (taskCount.n === 0) {
    const now = new Date().toISOString();
    const seedTasks = [
      // TODO
      { title: "WordPress credentials from Braj", status: "todo", priority: "P1", category: "monarch" },
      { title: "GMB access for local SEO", status: "todo", priority: "P1", category: "monarch" },
      { title: "Netstar API key for Turo tracking", status: "todo", priority: "P2", category: "highline" },
      { title: "Build micro-SOP framework", status: "todo", priority: "P1", category: "monarch" },
      { title: "Pre-Sale ad campaign creative", status: "todo", priority: "P1", category: "monarch" },
      { title: "B2B fleet pricing — start outreach to body shops", status: "todo", priority: "P1", category: "monarch" },
      { title: "Instagram outreach — start manual DMs", status: "todo", priority: "P2", category: "monarch" },
      { title: "Subscription model — finalise + add to Jobber", status: "todo", priority: "P2", category: "monarch" },
      { title: "Detailer ERP architecture doc", status: "todo", priority: "P1", category: "detailer-erp" },
      // DOING
      { title: "Dynamic kanban for Mission Control", status: "doing", priority: "P0", category: "mission-control" },
      { title: "B2B pitch document", status: "doing", priority: "P1", category: "monarch" },
      // DONE
      { title: "SQL injection fix in /api/leads", status: "done", priority: "P0", category: "mission-control" },
      { title: "Campaign consolidation + retargeting", status: "done", priority: "P0", category: "monarch" },
      { title: "Service menu v2.1 + PDF", status: "done", priority: "P0", category: "monarch" },
      { title: "Jobber OAuth connected", status: "done", priority: "P0", category: "monarch" },
      { title: "Google Drive connected", status: "done", priority: "P1", category: "monarch" },
      { title: "GitHub push", status: "done", priority: "P1", category: "mission-control" },
      { title: "Seat shampooing + paint correction SOPs", status: "done", priority: "P1", category: "monarch" },
      { title: "MUSE social media plan for Toyota content", status: "done", priority: "P1", category: "monarch" },
      { title: "Two-way Telegram bot", status: "done", priority: "P1", category: "mission-control" },
      { title: "Juan content review + posting schedule", status: "done", priority: "P1", category: "monarch" },
    ];

    const insert = db.prepare(
      "INSERT INTO tasks (title, status, priority, category, created_at, updated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    for (const t of seedTasks) {
      insert.run(t.title, t.status, t.priority, t.category, now, now, t.status === "done" ? now : null);
    }
  }

  // Indexes for common queries
  db.run("CREATE INDEX IF NOT EXISTS idx_telegram_ts ON telegram_messages(timestamp)");
  db.run("CREATE INDEX IF NOT EXISTS idx_ad_snapshots_date ON ad_snapshots(date)");
  db.run("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)");
  db.run("CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved)");
  db.run("CREATE INDEX IF NOT EXISTS idx_agent_events_ts ON agent_events(timestamp)");
}
