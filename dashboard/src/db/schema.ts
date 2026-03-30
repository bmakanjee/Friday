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

  // Indexes for common queries
  db.run("CREATE INDEX IF NOT EXISTS idx_telegram_ts ON telegram_messages(timestamp)");
  db.run("CREATE INDEX IF NOT EXISTS idx_ad_snapshots_date ON ad_snapshots(date)");
  db.run("CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)");
  db.run("CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved)");
  db.run("CREATE INDEX IF NOT EXISTS idx_agent_events_ts ON agent_events(timestamp)");
}
