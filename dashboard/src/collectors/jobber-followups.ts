import { getDb } from "../db/schema";
import { config } from "../../config";

const JOBBER_GQL = "https://api.getjobber.com/api/graphql";
const JOBBER_VERSION = "2026-03-10";
const TELEGRAM_API = `https://api.telegram.org/bot${config.telegram.botToken}`;
const CHAT_ID = config.telegram.chatId;

async function getJobberToken(): Promise<string | null> {
  const db = getDb();
  const row = db.query("SELECT access_token FROM jobber_tokens WHERE id = 1").get() as any;
  return row?.access_token ?? null;
}

async function jobberQuery(token: string, query: string) {
  const resp = await fetch(JOBBER_GQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-JOBBER-GRAPHQL-VERSION": JOBBER_VERSION,
    },
    body: JSON.stringify({ query }),
  });
  return resp.json() as any;
}

async function sendTelegram(text: string) {
  if (!config.telegram.botToken || !CHAT_ID) return;
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });
}

export async function checkFollowUps() {
  // DISABLED Apr 14 — was spamming Telegram hourly + on every restart.
  // Re-enable when dashboard has proper once-daily scheduling only.
  console.log("[followups] DISABLED — skipping");
  return;
  try {
    const token = await getJobberToken();
    if (!token) {
      console.log("[followups] No Jobber token, skipping");
      return;
    }

    const data = await jobberQuery(
      token,
      `{ tasks(first: 50) { nodes { id title startAt instructions isComplete } } }`
    );

    const allTasks = data?.data?.tasks?.nodes ?? [];
    const tasks = allTasks.filter((t: any) => !t.isComplete);
    if (tasks.length === 0) {
      console.log("[followups] No incomplete tasks");
      return;
    }

    // Filter tasks due today or overdue
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const dueTasks = tasks.filter((t: any) => {
      if (!t.startAt) return true; // no date = show it
      const taskDate = t.startAt.slice(0, 10);
      return taskDate <= todayStr;
    });

    if (dueTasks.length === 0) {
      console.log("[followups] No tasks due today");
      return;
    }

    // Build message
    const lines = [`DAILY FOLLOW-UP LIST (${todayStr}):\n`];
    for (const t of dueTasks) {
      const note = t.instructions ? ` — ${t.instructions.slice(0, 80)}` : "";
      lines.push(`- ${t.title}${note}`);
    }
    lines.push(`\n${dueTasks.length} follow-ups pending. Open Jobber to mark complete after calls.`);

    await sendTelegram(lines.join("\n"));
    console.log(`[followups] Sent ${dueTasks.length} follow-ups to Telegram`);
  } catch (err) {
    console.error("[followups] Error:", err);
  }
}
