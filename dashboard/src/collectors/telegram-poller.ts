import { config } from "../../config";
import { getDb } from "../db/schema";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const BOT_TOKEN = config.telegram.botToken;
const CHAT_ID = config.telegram.chatId;
const INBOX_DIR = join(config.fridayRoot, "inbox");
const UPLOADS_DIR = join(config.fridayRoot, "inbox/uploads");
const POLL_INTERVAL = 3_000; // 3 seconds

let lastUpdateId = 0;

if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function pollTelegram() {
  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=10&allowed_updates=["message"]`,
      { signal: AbortSignal.timeout(15_000) }
    );
    const data = (await resp.json()) as any;

    if (!data.ok || !data.result?.length) return;

    for (const update of data.result) {
      lastUpdateId = update.update_id;
      await processUpdate(update);
    }
  } catch (err) {
    console.error("[telegram-poller] Poll failed:", err);
  }
}

async function processUpdate(update: any) {
  const message = update.message;
  if (!message) return;

  const chatId = message.chat?.id;
  const from = message.from?.first_name ?? "Unknown";
  const timestamp = new Date(message.date * 1000).toISOString();
  const messageId = message.message_id;

  // Only process messages from the boss
  if (String(chatId) !== String(CHAT_ID)) {
    console.log(`[telegram-poller] Ignored message from chat: ${chatId}`);
    return;
  }

  const db = getDb();

  // Check for duplicate
  const existing = db
    .query("SELECT id FROM telegram_messages WHERE telegram_message_id = ?")
    .get(messageId);
  if (existing) return;

  // Handle photo messages
  if (message.photo && message.photo.length > 0) {
    const photo = message.photo[message.photo.length - 1];
    const caption = message.caption ?? "";
    const localPath = await downloadAndSave(photo.file_id, `photo_${messageId}`);

    db.run(
      `INSERT INTO telegram_messages (telegram_message_id, chat_id, sender, message_type, text, file_path, timestamp)
       VALUES (?, ?, ?, 'photo', ?, ?, ?)`,
      [messageId, chatId, from, caption, localPath, timestamp]
    );

    appendToInbox(`[PHOTO] ${caption || "(no caption)"}`, localPath, timestamp);
    await sendReply("Got it — photo saved to inbox.");
    console.log(`[telegram-poller] Photo saved: ${localPath}`);
    return;
  }

  // Handle text messages
  if (message.text) {
    const text = message.text;

    // Capture quoted/replied message context
    const replyTo = message.reply_to_message;
    let replyContext = "";
    if (replyTo) {
      const replyText = replyTo.text ?? replyTo.caption ?? "(media)";
      replyContext = `[Reply to: "${replyText.substring(0, 100)}"] `;
    }

    const fullText = replyContext + text;

    db.run(
      `INSERT INTO telegram_messages (telegram_message_id, chat_id, sender, message_type, text, timestamp)
       VALUES (?, ?, ?, 'text', ?, ?)`,
      [messageId, chatId, from, fullText, timestamp]
    );

    appendToInbox(fullText, null, timestamp);
    await sendReply("Noted — added to inbox.");
    console.log(`[telegram-poller] Text: ${fullText.substring(0, 80)}`);
    return;
  }

  // Handle documents
  if (message.document) {
    const doc = message.document;
    const fileName = doc.file_name ?? "file";
    const caption = message.caption ?? "";
    const localPath = await downloadAndSave(doc.file_id, fileName);

    db.run(
      `INSERT INTO telegram_messages (telegram_message_id, chat_id, sender, message_type, text, file_path, timestamp)
       VALUES (?, ?, ?, 'document', ?, ?, ?)`,
      [messageId, chatId, from, caption || fileName, localPath, timestamp]
    );

    appendToInbox(`[FILE: ${fileName}] ${caption}`, localPath, timestamp);
    await sendReply(`Got it — ${fileName} saved.`);
    console.log(`[telegram-poller] Document: ${fileName}`);
    return;
  }
}

async function downloadAndSave(fileId: string, nameHint: string): Promise<string | null> {
  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const data = (await resp.json()) as any;
    const filePath = data.result?.file_path;
    if (!filePath) return null;

    const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    const fileResp = await fetch(url);
    const buffer = await fileResp.arrayBuffer();

    const ext = filePath.split(".").pop() ?? "bin";
    const safeName = nameHint.replace(/[^a-zA-Z0-9_.-]/g, "_").substring(0, 50);
    const filename = `${Date.now()}_${safeName}.${ext}`;
    const localPath = join(UPLOADS_DIR, filename);

    writeFileSync(localPath, Buffer.from(buffer));
    return localPath;
  } catch (err) {
    console.error("[telegram-poller] Download failed:", err);
    return null;
  }
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

async function sendReply(text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
  } catch (err) {
    console.error("[telegram-poller] Send failed:", err);
  }
}

// Start polling loop
export function startTelegramPoller() {
  // First, delete any existing webhook so polling works
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`)
    .then(() => console.log("[telegram-poller] Webhook cleared, polling active"))
    .catch(() => {});

  // Poll every 3 seconds
  setInterval(pollTelegram, POLL_INTERVAL);
  // Run immediately
  pollTelegram();
  console.log("[telegram-poller] Started (3s interval)");
}
