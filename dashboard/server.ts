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

// Schedule collectors
setInterval(runMetaCollection, config.collectIntervals.metaAds);
setInterval(runLeadCollection, config.collectIntervals.metaLeads);
setInterval(runAlertCheck, config.collectIntervals.alertCheck);

// Start Telegram two-way bot (long-polling)
startTelegramPoller();

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
