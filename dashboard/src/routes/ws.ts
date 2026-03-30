import type { ServerWebSocket } from "bun";

const clients = new Set<ServerWebSocket<unknown>>();

export function addClient(ws: ServerWebSocket<unknown>) {
  clients.add(ws);
  console.log(`[ws] Client connected (${clients.size} total)`);
}

export function removeClient(ws: ServerWebSocket<unknown>) {
  clients.delete(ws);
  console.log(`[ws] Client disconnected (${clients.size} total)`);
}

export function broadcast(type: string, data: any) {
  const msg = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  for (const ws of clients) {
    try {
      ws.send(msg);
    } catch {
      clients.delete(ws);
    }
  }
}
