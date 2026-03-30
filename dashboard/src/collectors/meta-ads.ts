import { config } from "../../config";
import { getDb } from "../db/schema";

const { meta } = config;
const API = `${meta.baseUrl}/${meta.apiVersion}`;

async function metaFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${API}${endpoint}`);
  url.searchParams.set("access_token", meta.accessToken);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Meta API ${res.status}: ${err}`);
  }
  return res.json();
}

// Collect account-level insights
export async function collectAccountInsights(datePreset = "last_7d") {
  const data = await metaFetch(`/act_${meta.adAccountId}/insights`, {
    fields: "impressions,clicks,spend,reach,frequency,cpc,cpm,ctr,actions,cost_per_action_type",
    date_preset: datePreset,
    time_increment: "1",
  });

  const db = getDb();
  const now = new Date().toISOString();

  const upsert = db.prepare(`
    INSERT INTO account_snapshots (date, spend, impressions, clicks, reach, leads, cpl, ctr, cpc, cpm, frequency, video_views, fetched_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      spend=excluded.spend, impressions=excluded.impressions, clicks=excluded.clicks,
      reach=excluded.reach, leads=excluded.leads, cpl=excluded.cpl, ctr=excluded.ctr,
      cpc=excluded.cpc, cpm=excluded.cpm, frequency=excluded.frequency,
      video_views=excluded.video_views, fetched_at=excluded.fetched_at
  `);

  for (const row of data.data ?? []) {
    const leads = extractActionValue(row.actions, "lead");
    const videoViews = extractActionValue(row.actions, "video_view");
    const cpl = extractCostPerAction(row.cost_per_action_type, "lead");

    upsert.run(
      row.date_start,
      parseFloat(row.spend) || 0,
      parseInt(row.impressions) || 0,
      parseInt(row.clicks) || 0,
      parseInt(row.reach) || 0,
      leads,
      cpl,
      parseFloat(row.ctr) || 0,
      parseFloat(row.cpc) || 0,
      parseFloat(row.cpm) || 0,
      parseFloat(row.frequency) || 0,
      videoViews,
      now
    );
  }

  console.log(`[meta-ads] Account insights collected: ${data.data?.length ?? 0} days`);
  return data.data?.length ?? 0;
}

// Collect campaign-level data
export async function collectCampaignInsights(datePreset = "last_7d") {
  // Get campaign list
  const campaigns = await metaFetch(`/act_${meta.adAccountId}/campaigns`, {
    fields: "name,status,objective,daily_budget,lifetime_budget",
    limit: "50",
  });

  // Get campaign-level insights
  const insights = await metaFetch(`/act_${meta.adAccountId}/insights`, {
    fields: "campaign_id,campaign_name,impressions,clicks,spend,reach,frequency,cpc,cpm,ctr,actions,cost_per_action_type",
    date_preset: datePreset,
    level: "campaign",
    time_increment: "1",
  });

  const db = getDb();
  const now = new Date().toISOString();

  // Build campaign metadata map
  const campaignMeta: Record<string, any> = {};
  for (const c of campaigns.data ?? []) {
    campaignMeta[c.id] = c;
  }

  const upsert = db.prepare(`
    INSERT INTO ad_snapshots (date, campaign_id, campaign_name, objective, status, daily_budget, spend, impressions, clicks, reach, leads, cpl, ctr, cpc, cpm, frequency, fetched_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(date, campaign_id) DO UPDATE SET
      campaign_name=excluded.campaign_name, objective=excluded.objective, status=excluded.status,
      daily_budget=excluded.daily_budget, spend=excluded.spend, impressions=excluded.impressions,
      clicks=excluded.clicks, reach=excluded.reach, leads=excluded.leads, cpl=excluded.cpl,
      ctr=excluded.ctr, cpc=excluded.cpc, cpm=excluded.cpm, frequency=excluded.frequency,
      fetched_at=excluded.fetched_at
  `);

  for (const row of insights.data ?? []) {
    const meta = campaignMeta[row.campaign_id] ?? {};
    const leads = extractActionValue(row.actions, "lead");
    const cpl = extractCostPerAction(row.cost_per_action_type, "lead");

    upsert.run(
      row.date_start,
      row.campaign_id,
      row.campaign_name,
      meta.objective ?? null,
      meta.status ?? null,
      meta.daily_budget ? parseFloat(meta.daily_budget) / 100 : null,
      parseFloat(row.spend) || 0,
      parseInt(row.impressions) || 0,
      parseInt(row.clicks) || 0,
      parseInt(row.reach) || 0,
      leads,
      cpl,
      parseFloat(row.ctr) || 0,
      parseFloat(row.cpc) || 0,
      parseFloat(row.cpm) || 0,
      parseFloat(row.frequency) || 0,
      now
    );
  }

  console.log(`[meta-ads] Campaign insights collected: ${insights.data?.length ?? 0} rows`);
  return insights.data?.length ?? 0;
}

// Collect leads from lead form
export async function collectLeads() {
  const data = await metaFetch(`/${config.leadFormId}/leads`, {
    fields: "id,created_time,field_data",
  });

  const db = getDb();
  const now = new Date().toISOString();

  const upsert = db.prepare(`
    INSERT OR IGNORE INTO leads (meta_lead_id, name, phone, email, form_id, created_at, status, fetched_at)
    VALUES (?, ?, ?, ?, ?, ?, 'new', ?)
  `);

  let newCount = 0;
  for (const lead of data.data ?? []) {
    const fields = parseLeadFields(lead.field_data);
    const result = upsert.run(
      lead.id,
      fields.full_name ?? fields.name ?? null,
      fields.phone_number ?? fields.phone ?? null,
      fields.email ?? null,
      config.leadFormId,
      lead.created_time,
      now
    );
    if (result.changes > 0) newCount++;
  }

  console.log(`[meta-leads] Collected ${data.data?.length ?? 0} leads, ${newCount} new`);
  return newCount;
}

// Helpers
function extractActionValue(actions: any[], actionType: string): number {
  if (!actions) return 0;
  const action = actions.find((a: any) => a.action_type === actionType);
  return action ? parseInt(action.value) || 0 : 0;
}

function extractCostPerAction(costs: any[], actionType: string): number | null {
  if (!costs) return null;
  const cost = costs.find((c: any) => c.action_type === actionType);
  return cost ? parseFloat(cost.value) || null : null;
}

function parseLeadFields(fieldData: any[]): Record<string, string> {
  const result: Record<string, string> = {};
  if (!fieldData) return result;
  for (const field of fieldData) {
    result[field.name] = Array.isArray(field.values) ? field.values[0] : field.values;
  }
  return result;
}
