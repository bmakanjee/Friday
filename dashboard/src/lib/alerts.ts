import { getDb } from "../db/schema";
import { config } from "../../config";
import { broadcast } from "../routes/ws";

export function runAlertCheck() {
  const db = getDb();
  const now = new Date().toISOString();

  // Check CPL threshold (last 3 days)
  const cplData = db.query(`
    SELECT CASE WHEN SUM(leads) > 0 THEN SUM(spend) / SUM(leads) ELSE NULL END as cpl
    FROM account_snapshots WHERE date >= date('now', '-3 days')
  `).get() as any;

  if (cplData?.cpl) {
    if (cplData.cpl >= config.alertThresholds.cplCritical) {
      insertAlert(db, now, "critical", "budget", `CPL at $${cplData.cpl.toFixed(2)} — above critical threshold of $${config.alertThresholds.cplCritical}`);
    } else if (cplData.cpl >= config.alertThresholds.cplWarning) {
      insertAlert(db, now, "warning", "budget", `CPL at $${cplData.cpl.toFixed(2)} — above warning threshold of $${config.alertThresholds.cplWarning}`);
    }
  }

  // Check lead drought
  const lastLead = db.query(`
    SELECT MAX(created_at) as last_lead FROM leads
  `).get() as any;

  if (lastLead?.last_lead) {
    const hoursSince = (Date.now() - new Date(lastLead.last_lead).getTime()) / 3600000;
    if (hoursSince >= config.alertThresholds.leadDroughtHours) {
      insertAlert(db, now, "warning", "leads", `No new leads in ${Math.round(hoursSince)} hours`);
    }
  }

  console.log("[alerts] Check complete");
}

function insertAlert(db: any, timestamp: string, severity: string, category: string, message: string) {
  // Don't duplicate recent alerts with same message
  const existing = db.query(`
    SELECT id FROM alerts WHERE message = ? AND resolved = 0 AND timestamp >= datetime('now', '-6 hours')
  `).get(message);

  if (!existing) {
    db.run(
      "INSERT INTO alerts (timestamp, severity, category, message) VALUES (?, ?, ?, ?)",
      [timestamp, severity, category, message]
    );
    broadcast("alert", { severity, category, message, timestamp });
  }
}
