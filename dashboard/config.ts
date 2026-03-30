import { readFileSync } from "fs";
import { join } from "path";

const FRIDAY_ROOT = "C:/Users/bmaka/friday";

// Read Meta credentials from .mcp.json
function loadMcpConfig() {
  try {
    const raw = readFileSync(join(FRIDAY_ROOT, ".mcp.json"), "utf-8");
    const config = JSON.parse(raw);
    const metaEnv = config.mcpServers?.["meta-ads"]?.env ?? {};
    return {
      metaAccessToken: metaEnv.META_ADS_ACCESS_TOKEN ?? "",
      metaAdAccountId: metaEnv.META_AD_ACCOUNT_ID ?? "",
      metaAppId: metaEnv.META_APP_ID ?? "",
      metaAppSecret: metaEnv.META_APP_SECRET ?? "",
    };
  } catch {
    console.error("Failed to load .mcp.json — Meta Ads data will be unavailable");
    return { metaAccessToken: "", metaAdAccountId: "", metaAppId: "", metaAppSecret: "" };
  }
}

const mcp = loadMcpConfig();

export const config = {
  port: 3737,
  host: "0.0.0.0",
  fridayRoot: FRIDAY_ROOT,
  dbPath: join(FRIDAY_ROOT, "dashboard/data/friday.db"),

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
    chatId: process.env.TELEGRAM_CHAT_ID ?? "",
  },

  meta: {
    accessToken: mcp.metaAccessToken,
    adAccountId: mcp.metaAdAccountId,
    appId: mcp.metaAppId,
    appSecret: mcp.metaAppSecret,
    apiVersion: "v21.0",
    baseUrl: "https://graph.facebook.com",
  },

  collectIntervals: {
    metaAds: 30 * 60_000,
    metaLeads: 15 * 60_000,
    agentActivity: 5 * 60_000,
    memoryReader: 10 * 60_000,
    alertCheck: 30 * 60_000,
  },

  alertThresholds: {
    cplWarning: 30,
    cplCritical: 50,
    roasMinimum: 1.0,
    leadDroughtHours: 48,
    budgetPaceWarning: 0.8,
  },

  leadFormId: "969764435579475",
};
