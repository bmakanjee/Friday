import { Hono } from "hono";
import { config } from "../../config";
import { getDb } from "../db/schema";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export const telegram = new Hono();

const BOT_TOKEN = config.telegram.botToken;
const CHAT_ID = config.telegram.chatId;
const INBOX_DIR = join(config.fridayRoot, "inbox");
const UPLOADS_DIR = join(config.fridayRoot, "inbox/uploads");

// Ensure upload directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

// POST /telegram/webhook — receives updates from Telegram
telegram.post("/webhook", async (c) => {
  const update = await c.req.json();

  const message = update.message;
  if (!message) return c.json({ ok: true });

  const chatId = message.chat?.id;
  const from = message.from?.first_name ?? "Unknown";
  const timestamp = new Date(message.date * 1000).toISOString();
  const messageId = message.message_id;

  // Only process messages from the boss
  if (String(chatId) !== String(CHAT_ID)) {
    console.log(`[telegram] Ignored message from unknown chat: ${chatId}`);
    return c.json({ ok: true });
  }

  const db = getDb();

  // Handle photo messages
  if (message.photo && message.photo.length > 0) {
    // Get the largest photo (last in array)
    const photo = message.photo[message.photo.length - 1];
    const fileId = photo.file_id;
    const caption = message.caption ?? "";

    // Download the photo
    const filePath = await downloadTelegramFile(fileId);
    const localPath = filePath
      ? await saveFile(fileId, filePath)
      : null;

    // Store in DB
    db.run(
      `INSERT INTO telegram_messages (telegram_message_id, chat_id, sender, message_type, text, file_path, timestamp)
       VALUES (?, ?, ?, 'photo', ?, ?, ?)`,
      [messageId, chatId, from, caption, localPath, timestamp]
    );

    // Write to inbox for FRIDAY to pick up
    appendToInbox(`[PHOTO] ${caption || "(no caption)"}`, localPath, timestamp);

    // Acknowledge
    await sendMessage("Got it — photo saved. I'll review it next session.");

    console.log(`[telegram] Photo received: ${localPath}`);
    return c.json({ ok: true });
  }

  // Handle text messages
  if (message.text) {
    db.run(
      `INSERT INTO telegram_messages (telegram_message_id, chat_id, sender, message_type, text, timestamp)
       VALUES (?, ?, ?, 'text', ?, ?)`,
      [messageId, chatId, from, message.text, timestamp]
    );

    // Write to inbox
    appendToInbox(message.text, null, timestamp);

    // Acknowledge
    await sendMessage("Noted — added to inbox. I'll process it next session.");

    console.log(`[telegram] Text received: ${message.text.substring(0, 50)}...`);
    return c.json({ ok: true });
  }

  // Handle document/file messages
  if (message.document) {
    const doc = message.document;
    const fileId = doc.file_id;
    const fileName = doc.file_name ?? "unknown";
    const caption = message.caption ?? "";

    const filePath = await downloadTelegramFile(fileId);
    const localPath = filePath
      ? await saveFile(fileName, filePath)
      : null;

    db.run(
      `INSERT INTO telegram_messages (telegram_message_id, chat_id, sender, message_type, text, file_path, timestamp)
       VALUES (?, ?, ?, 'document', ?, ?, ?)`,
      [messageId, chatId, from, caption || fileName, localPath, timestamp]
    );

    appendToInbox(`[FILE: ${fileName}] ${caption}`, localPath, timestamp);
    await sendMessage(`Got it — ${fileName} saved.`);

    console.log(`[telegram] Document received: ${fileName}`);
    return c.json({ ok: true });
  }

  return c.json({ ok: true });
});

// GET /telegram/messages — view received messages
telegram.get("/messages", (c) => {
  const db = getDb();
  const limit = parseInt(c.req.query("limit") ?? "50");
  const rows = db
    .query("SELECT * FROM telegram_messages ORDER BY timestamp DESC LIMIT ?")
    .all(limit);
  return c.json(rows);
});

// POST /telegram/send — send a message from the dashboard
telegram.post("/send", async (c) => {
  const { text } = await c.req.json();
  if (!text) return c.json({ error: "text required" }, 400);
  const result = await sendMessage(text);
  return c.json(result);
});

// GET /telegram/setup — set webhook URL (run once to configure)
telegram.get("/setup", async (c) => {
  const webhookUrl = c.req.query("url");
  if (!webhookUrl) {
    return c.json({
      error: "Provide ?url=https://your-domain/telegram/webhook",
      hint: "Use ngrok or cloudflared to expose localhost:3737",
    }, 400);
  }

  const resp = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: `${webhookUrl}`,
        allowed_updates: ["message"],
      }),
    }
  );
  const data = await resp.json();
  return c.json(data);
});

// GET /telegram/webhook-info — check current webhook status
telegram.get("/webhook-info", async (c) => {
  const resp = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
  );
  const data = await resp.json();
  return c.json(data);
});

// --- Helpers ---

async function downloadTelegramFile(fileId: string): Promise<string | null> {
  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const data = (await resp.json()) as any;
    return data.result?.file_path ?? null;
  } catch (err) {
    console.error("[telegram] Failed to get file path:", err);
    return null;
  }
}

async function saveFile(nameHint: string, telegramPath: string): Promise<string> {
  const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${telegramPath}`;
  const resp = await fetch(url);
  const buffer = await resp.arrayBuffer();

  const ext = telegramPath.split(".").pop() ?? "bin";
  const ts = Date.now();
  const safeName = nameHint.replace(/[^a-zA-Z0-9_.-]/g, "_").substring(0, 50);
  const filename = `${ts}_${safeName}.${ext}`;
  const localPath = join(UPLOADS_DIR, filename);

  writeFileSync(localPath, Buffer.from(buffer));
  return localPath;
}

function appendToInbox(text: string, filePath: string | null, timestamp: string) {
  const inboxFile = join(INBOX_DIR, "braindump.md");
  const time = new Date(timestamp).toLocaleString("en-AU", { timeZone: "Australia/Brisbane" });
  let entry = `\n- **[Telegram ${time}]** ${text}`;
  if (filePath) {
    entry += `\n  - File: \`${filePath}\``;
  }
  entry += "\n";

  try {
    const existing = readFileSync(inboxFile, "utf-8");
    writeFileSync(inboxFile, existing + entry);
  } catch {
    writeFileSync(inboxFile, `# Inbox\n\n## Unprocessed\n${entry}`);
  }
}

export async function sendMessage(text: string, chatId?: string): Promise<any> {
  const targetChat = chatId ?? CHAT_ID;
  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: targetChat,
          text,
          parse_mode: "Markdown",
        }),
      }
    );
    return await resp.json();
  } catch (err) {
    console.error("[telegram] Failed to send message:", err);
    return { ok: false, error: String(err) };
  }
}
