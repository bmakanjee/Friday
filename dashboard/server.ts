import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { config } from "./config";
import { api } from "./src/routes/api";
import { telegram } from "./src/routes/telegram";
import { addClient, removeClient, broadcast } from "./src/routes/ws";
import { getDb } from "./src/db/schema";
import { collectAccountInsights, collectCampaignInsights, collectLeads } from "./src/collectors/meta-ads";
import { readHotMemory } from "./src/collectors/memory-reader";
import { runAlertCheck } from "./src/lib/alerts";
import { startTelegramPoller } from "./src/collectors/telegram-poller";
import { checkFollowUps } from "./src/collectors/jobber-followups";

const app = new Hono();

// Middleware
app.use("*", cors());

// API routes
app.route("/api", api);

// Telegram webhook
app.route("/telegram", telegram);

// Memory endpoint (reads live from files)
app.get("/api/memory", (c) => {
  const data = readHotMemory();
  return c.json(data);
});

// Telegram message queue
import { getUnprocessedMessages, markProcessed, markAllProcessed } from "./src/lib/telegram-queue";

app.get("/api/telegram/queue", (c) => {
  const hours = parseInt(c.req.query("hours") ?? "4");
  const msgs = getUnprocessedMessages(hours);
  return c.json({ count: msgs.length, messages: msgs });
});

app.post("/api/telegram/queue/mark-processed", async (c) => {
  const body = await c.req.json();
  if (body.all) {
    markAllProcessed();
  } else if (body.ids?.length) {
    markProcessed(body.ids);
  }
  return c.json({ ok: true });
});

// Static files
app.use("/*", serveStatic({ root: "./public" }));

// Initialise database
console.log("[init] Database initialising...");
getDb();
console.log("[init] Database ready");

// Collection runners
async function runMetaCollection() {
  try {
    await collectAccountInsights("last_7d");
    await collectCampaignInsights("last_7d");
    broadcast("refresh", { source: "meta-ads" });
    console.log("[collector] Meta Ads collection complete");
  } catch (err) {
    console.error("[collector] Meta Ads failed:", err);
  }
}

async function runLeadCollection() {
  try {
    const newCount = await collectLeads();
    if (newCount > 0) {
      broadcast("new_leads", { count: newCount });
    }
    console.log("[collector] Lead collection complete");
  } catch (err) {
    console.error("[collector] Lead collection failed:", err);
  }
}

// Run initial collection on startup
console.log("[init] Running initial data collection...");
runMetaCollection();
runLeadCollection();

// Jobber token auto-refresh — keeps the token alive so Braj never has to re-auth manually
async function refreshJobberToken() {
  try {
    const db = getDb();
    const row = db.query("SELECT access_token, refresh_token, expires_at FROM jobber_tokens WHERE id = 1").get() as any;
    if (!row?.refresh_token) return;

    // Only refresh if expiring within 15 minutes
    const expires = new Date(row.expires_at + "Z");
    const now = new Date();
    if (expires.getTime() - now.getTime() > 15 * 60_000) return;

    const resp = await fetch("https://api.getjobber.com/api/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: row.refresh_token,
        client_id: process.env.JOBBER_CLIENT_ID ?? "97b34a2d-282c-4925-90ab-a87e15155c87",
        client_secret: process.env.JOBBER_CLIENT_SECRET ?? "16ff37d16144269fabbf56df85ed5d063850233c6e156973d8a4ff299f45bcb6",
      }),
    });

    if (!resp.ok) {
      console.error("[jobber] Token refresh failed:", resp.status, await resp.text());
      return;
    }

    const tokens = await resp.json() as any;
    if (tokens.access_token) {
      const nowStr = new Date().toISOString().replace("T", " ").slice(0, 19);
      const expiresStr = new Date(Date.now() + 3600000).toISOString().replace("T", " ").slice(0, 19);
      db.run(
        "UPDATE jobber_tokens SET access_token = ?, refresh_token = ?, expires_at = ?, updated_at = ? WHERE id = 1",
        [tokens.access_token, tokens.refresh_token ?? row.refresh_token, expiresStr, nowStr]
      );
      console.log("[jobber] Token auto-refreshed successfully");
    }
  } catch (err) {
    console.error("[jobber] Token auto-refresh error:", err);
  }
}

// Refresh token check every 10 minutes — catches it well before expiry
refreshJobberToken();
setInterval(refreshJobberToken, 10 * 60_000);

// Schedule collectors
setInterval(runMetaCollection, config.collectIntervals.metaAds);
setInterval(runLeadCollection, config.collectIntervals.metaLeads);
setInterval(runAlertCheck, config.collectIntervals.alertCheck);

// Daily follow-up checker — runs ONCE at 7:30am AEST only (not hourly)
// Hourly was spamming Telegram — disabled Apr 14

// Schedule the 7:30am AEST daily ping
function scheduleDaily730() {
  const now = new Date();
  // Calculate next 7:30am AEST (UTC+10)
  const aest = new Date(now.toLocaleString("en-US", { timeZone: "Australia/Brisbane" }));
  let next = new Date(aest);
  next.setHours(7, 30, 0, 0);
  if (aest >= next) next.setDate(next.getDate() + 1);
  // Convert back to UTC
  const utcNext = new Date(next.getTime() + (now.getTime() - aest.getTime()));
  const delay = utcNext.getTime() - now.getTime();
  console.log(`[followups] Next 7:30am AEST ping in ${Math.round(delay / 60000)}min`);
  setTimeout(() => {
    checkFollowUps();
    // Re-schedule for tomorrow
    setInterval(checkFollowUps, 24 * 60 * 60_000);
  }, delay);
}
scheduleDaily730();

// Telegram poller DISABLED by default — conflicts with Claude Code channel plugin.
// Only enable with: TELEGRAM_POLLER=1 bun run server.ts
// When Claude Code is running with --channels telegram, the channel plugin handles messages.
// When no session is active, start dashboard with TELEGRAM_POLLER=1 for offline capture.
if (process.env.TELEGRAM_POLLER === "1") {
  startTelegramPoller();
  console.log("[telegram-poller] ENABLED via TELEGRAM_POLLER=1");
} else {
  console.log("[telegram-poller] DISABLED (default) — channel plugin handles Telegram");
}

// Start server with WebSocket support
const server = Bun.serve({
  port: config.port,
  hostname: config.host,
  fetch(req, server) {
    // Handle WebSocket upgrade
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      const upgraded = server.upgrade(req);
      if (upgraded) return undefined;
      return new Response("WebSocket upgrade failed", { status: 400 });
    }
    // Pass everything else to Hono
    return app.fetch(req);
  },
  websocket: {
    open(ws) {
      addClient(ws);
    },
    close(ws) {
      removeClient(ws);
    },
    message(ws, msg) {
      if (msg === "refresh") {
        runMetaCollection();
      }
    },
  },
});

console.log(`
  ╔══════════════════════════════════════════╗
  ║   FRIDAY Mission Control                 ║
  ║   http://localhost:${config.port}               ║
  ║                                          ║
  ║   Collectors: Meta Ads (30m), Leads (15m)║
  ║   Alerts: every 30m                      ║
  ║   Telegram: two-way polling (3s)         ║
  ╚══════════════════════════════════════════╝
`);
