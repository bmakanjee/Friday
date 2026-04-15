/**
 * Telegram Message Queue Processor
 *
 * Call processQueue() at session start to handle unprocessed messages.
 * Marks each message as processed after handling.
 * Only processes messages from the last 2 hours to avoid replying to stale msgs.
 */

import { getDb } from "../db/schema";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";

interface QueuedMessage {
  id: number;
  text: string;
  message_type: string;
  file_path: string | null;
  timestamp: string;
}

/**
 * Get unprocessed messages from the last N hours
 */
export function getUnprocessedMessages(hoursBack: number = 2): QueuedMessage[] {
  const db = getDb();
  const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();

  return db.prepare(`
    SELECT id, text, message_type, file_path, timestamp
    FROM telegram_messages
    WHERE processed = 0
      AND sender != 'FRIDAY'
      AND timestamp > ?
    ORDER BY timestamp ASC
  `).all(cutoff) as QueuedMessage[];
}

/**
 * Mark messages as processed
 */
export function markProcessed(ids: number[]) {
  if (ids.length === 0) return;
  const db = getDb();
  const placeholders = ids.map(() => "?").join(",");
  db.run(`UPDATE telegram_messages SET processed = 1 WHERE id IN (${placeholders})`, ids);
}

/**
 * Mark ALL messages as processed (bulk clear)
 */
export function markAllProcessed() {
  const db = getDb();
  db.run("UPDATE telegram_messages SET processed = 1 WHERE processed = 0");
}

/**
 * Send a reply via Telegram Bot API
 */
export async function sendTelegramReply(text: string): Promise<boolean> {
  try {
    const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "Markdown" }),
    });
    const data = await resp.json() as any;
    return data.ok ?? false;
  } catch {
    return false;
  }
}

/**
 * Get a summary of the queue for FRIDAY to process
 */
export function getQueueSummary(): string {
  const msgs = getUnprocessedMessages(4); // last 4 hours
  if (msgs.length === 0) return "No unprocessed Telegram messages.";

  const lines = msgs.map(m => {
    const time = new Date(m.timestamp).toLocaleTimeString("en-AU", {
      timeZone: "Australia/Brisbane",
      hour: "2-digit",
      minute: "2-digit"
    });
    return `[${time}] ${m.text?.substring(0, 150) ?? "(media)"}`;
  });

  return `${msgs.length} unprocessed Telegram messages:\n${lines.join("\n")}`;
}
