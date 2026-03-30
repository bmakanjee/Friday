import { Hono } from "hono";
import { getDb } from "../db/schema";

export const api = new Hono();

// KPI summary — last 7 days vs prior 7 days
api.get("/kpis", (c) => {
  const db = getDb();
  const period = c.req.query("period") ?? "7";
  const days = parseInt(period);

  const current = db.query(`
    SELECT
      COALESCE(SUM(spend), 0) as spend,
      COALESCE(SUM(impressions), 0) as impressions,
      COALESCE(SUM(clicks), 0) as clicks,
      COALESCE(SUM(reach), 0) as reach,
      COALESCE(SUM(leads), 0) as leads,
      COALESCE(SUM(video_views), 0) as video_views,
      CASE WHEN SUM(leads) > 0 THEN SUM(spend) / SUM(leads) ELSE NULL END as cpl,
      CASE WHEN SUM(impressions) > 0 THEN SUM(clicks) * 100.0 / SUM(impressions) ELSE 0 END as ctr,
      CASE WHEN SUM(clicks) > 0 THEN SUM(spend) / SUM(clicks) ELSE NULL END as cpc,
      CASE WHEN SUM(impressions) > 0 THEN SUM(spend) * 1000.0 / SUM(impressions) ELSE NULL END as cpm
    FROM account_snapshots
    WHERE date >= date('now', '-${days} days')
  `).get() as any;

  const previous = db.query(`
    SELECT
      COALESCE(SUM(spend), 0) as spend,
      COALESCE(SUM(leads), 0) as leads,
      CASE WHEN SUM(leads) > 0 THEN SUM(spend) / SUM(leads) ELSE NULL END as cpl,
      CASE WHEN SUM(impressions) > 0 THEN SUM(clicks) * 100.0 / SUM(impressions) ELSE 0 END as ctr
    FROM account_snapshots
    WHERE date >= date('now', '-${days * 2} days') AND date < date('now', '-${days} days')
  `).get() as any;

  return c.json({
    current,
    previous,
    period: days,
    changes: {
      spend: calcChange(current?.spend, previous?.spend),
      leads: calcChange(current?.leads, previous?.leads),
      cpl: calcChange(current?.cpl, previous?.cpl),
      ctr: calcChange(current?.ctr, previous?.ctr),
    },
  });
});

// Daily trends for charts
api.get("/kpis/trends", (c) => {
  const db = getDb();
  const days = parseInt(c.req.query("days") ?? "30");

  const rows = db.query(`
    SELECT date, spend, impressions, clicks, reach, leads, cpl, ctr, video_views
    FROM account_snapshots
    WHERE date >= date('now', '-${days} days')
    ORDER BY date ASC
  `).all();

  return c.json(rows);
});

// Campaign list with latest metrics
api.get("/campaigns", (c) => {
  const db = getDb();

  const rows = db.query(`
    SELECT
      campaign_id, campaign_name, objective, status, daily_budget,
      SUM(spend) as spend_7d,
      SUM(impressions) as impressions_7d,
      SUM(clicks) as clicks_7d,
      SUM(leads) as leads_7d,
      CASE WHEN SUM(leads) > 0 THEN SUM(spend) / SUM(leads) ELSE NULL END as cpl_7d,
      CASE WHEN SUM(impressions) > 0 THEN SUM(clicks) * 100.0 / SUM(impressions) ELSE 0 END as ctr_7d
    FROM ad_snapshots
    WHERE date >= date('now', '-7 days')
    GROUP BY campaign_id
    ORDER BY spend_7d DESC
  `).all();

  return c.json(rows);
});

// Lead pipeline
api.get("/leads", (c) => {
  const db = getDb();
  const status = c.req.query("status");

  let query = "SELECT * FROM leads ORDER BY created_at DESC";
  if (status) {
    query = `SELECT * FROM leads WHERE status = '${status}' ORDER BY created_at DESC`;
  }

  const rows = db.query(query).all();

  // Summary counts
  const counts = db.query(`
    SELECT status, COUNT(*) as count FROM leads GROUP BY status
  `).all() as any[];

  return c.json({
    leads: rows,
    counts: Object.fromEntries(counts.map((r: any) => [r.status, r.count])),
  });
});

// Update lead status
api.patch("/leads/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = getDb();

  if (body.status) {
    db.run("UPDATE leads SET status = ? WHERE id = ?", [body.status, id]);
  }
  if (body.notes !== undefined) {
    db.run("UPDATE leads SET notes = ? WHERE id = ?", [body.notes, id]);
  }

  return c.json({ ok: true });
});

// Agent activity feed
api.get("/agent/activity", (c) => {
  const db = getDb();
  const limit = parseInt(c.req.query("limit") ?? "50");

  const rows = db.query(`
    SELECT * FROM agent_events
    ORDER BY timestamp DESC
    LIMIT ?
  `).all(limit);

  return c.json(rows);
});

// Alerts
api.get("/alerts", (c) => {
  const db = getDb();
  const resolved = c.req.query("resolved") === "true" ? 1 : 0;

  const rows = db.query(`
    SELECT * FROM alerts
    WHERE resolved = ?
    ORDER BY
      CASE severity WHEN 'critical' THEN 0 WHEN 'warning' THEN 1 ELSE 2 END,
      timestamp DESC
  `).all(resolved);

  return c.json(rows);
});

// Resolve alert
api.patch("/alerts/:id", async (c) => {
  const id = c.req.param("id");
  const db = getDb();
  db.run("UPDATE alerts SET resolved = 1 WHERE id = ?", [id]);
  return c.json({ ok: true });
});

// Last collection timestamps
api.get("/status", (c) => {
  const db = getDb();

  const lastAd = db.query("SELECT MAX(fetched_at) as ts FROM account_snapshots").get() as any;
  const lastLead = db.query("SELECT MAX(fetched_at) as ts FROM leads").get() as any;
  const alertCount = db.query("SELECT COUNT(*) as n FROM alerts WHERE resolved = 0").get() as any;

  return c.json({
    lastAdFetch: lastAd?.ts,
    lastLeadFetch: lastLead?.ts,
    unresolvedAlerts: alertCount?.n ?? 0,
  });
});

// ---- Jobber OAuth ----
const JOBBER_CLIENT_ID = process.env.JOBBER_CLIENT_ID ?? "";
const JOBBER_CLIENT_SECRET = process.env.JOBBER_CLIENT_SECRET ?? "";
const JOBBER_REDIRECT_URI = "http://localhost:3737/api/jobber/callback";

api.get("/jobber/connect", (c) => {
  const authUrl = `https://api.getjobber.com/api/oauth/authorize?response_type=code&client_id=${JOBBER_CLIENT_ID}&redirect_uri=${encodeURIComponent(JOBBER_REDIRECT_URI)}&state=friday`;
  return c.redirect(authUrl);
});

api.get("/jobber/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  if (!code) return c.json({ error: "No authorization code received" }, 400);

  try {
    const resp = await fetch("https://api.getjobber.com/api/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: JOBBER_CLIENT_ID,
        client_secret: JOBBER_CLIENT_SECRET,
        redirect_uri: JOBBER_REDIRECT_URI,
      }),
    });
    const tokens = await resp.json() as any;

    if (tokens.access_token) {
      // Store tokens in DB
      const db = getDb();
      db.run(`CREATE TABLE IF NOT EXISTS jobber_tokens (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at TEXT,
        updated_at TEXT NOT NULL
      )`);
      db.run(`INSERT OR REPLACE INTO jobber_tokens (id, access_token, refresh_token, expires_at, updated_at)
        VALUES (1, ?, ?, datetime('now', '+60 minutes'), datetime('now'))`,
        [tokens.access_token, tokens.refresh_token ?? null]
      );
      console.log("[jobber] OAuth connected successfully");
      return c.html(`<html><body style="background:#1a1a1a;color:#D4AF37;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column">
        <h1>👑 Jobber Connected!</h1>
        <p style="color:#f0f0f0">FRIDAY now has access to your Jobber data.</p>
        <p style="color:#999">You can close this tab.</p>
      </body></html>`);
    } else {
      console.error("[jobber] Token exchange failed:", tokens);
      return c.json({ error: "Token exchange failed", details: tokens }, 500);
    }
  } catch (err) {
    console.error("[jobber] OAuth callback error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

api.get("/jobber/status", (c) => {
  const db = getDb();
  try {
    const row = db.query("SELECT updated_at, expires_at FROM jobber_tokens WHERE id = 1").get() as any;
    return c.json({ connected: !!row, updated_at: row?.updated_at, expires_at: row?.expires_at });
  } catch {
    return c.json({ connected: false });
  }
});

// ---- Google Drive OAuth ----
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
const GOOGLE_REDIRECT_URI = "http://localhost:3737/api/google/callback";

api.get("/google/connect", (c) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/drive.readonly",
    access_type: "offline",
    prompt: "consent",
  });
  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

api.get("/google/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.json({ error: "No auth code" }, 400);

  try {
    const resp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await resp.json() as any;

    if (tokens.access_token) {
      const db = getDb();
      db.run(`CREATE TABLE IF NOT EXISTS google_tokens (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at TEXT,
        updated_at TEXT NOT NULL
      )`);
      db.run(`INSERT OR REPLACE INTO google_tokens (id, access_token, refresh_token, expires_at, updated_at)
        VALUES (1, ?, ?, datetime('now', '+3600 seconds'), datetime('now'))`,
        [tokens.access_token, tokens.refresh_token ?? null]
      );
      console.log("[google] Drive OAuth connected");
      return c.html(`<html><body style="background:#1a1a1a;color:#4285f4;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column">
        <h1>Google Drive Connected!</h1>
        <p style="color:#f0f0f0">FRIDAY can now browse your Drive files.</p>
        <p style="color:#999">You can close this tab.</p>
      </body></html>`);
    } else {
      return c.json({ error: "Token exchange failed", details: tokens }, 500);
    }
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

api.get("/google/drive/list", async (c) => {
  const db = getDb();
  const row = db.query("SELECT access_token FROM google_tokens WHERE id = 1").get() as any;
  if (!row) return c.json({ error: "Not connected" }, 401);

  const folderId = c.req.query("folder") ?? "root";
  const resp = await fetch(
    `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,mimeType,modifiedTime,size,thumbnailLink)&orderBy=modifiedTime+desc&pageSize=50`,
    { headers: { Authorization: `Bearer ${row.access_token}` } }
  );
  return c.json(await resp.json());
});

function calcChange(current: number | null, previous: number | null): number | null {
  if (!current || !previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}
