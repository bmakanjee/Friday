import { readFileSync } from "fs";
import { join } from "path";
import { config } from "../../config";

export interface OpenLoop {
  text: string;
  done: boolean;
}

export interface HotMemoryData {
  openLoops: OpenLoop[];
  currentFocus: string[];
  raw: string;
}

export function readHotMemory(): HotMemoryData {
  try {
    const raw = readFileSync(join(config.fridayRoot, "memory/hot-memory.md"), "utf-8");

    const openLoops: OpenLoop[] = [];
    const currentFocus: string[] = [];

    const lines = raw.split("\n");
    let section = "";

    for (const line of lines) {
      if (line.startsWith("## ")) {
        section = line.replace("## ", "").trim().toLowerCase();
        continue;
      }

      if (section === "open loops") {
        const checkMatch = line.match(/^- \[([ x])\] (.+)/);
        if (checkMatch) {
          openLoops.push({
            done: checkMatch[1] === "x",
            text: checkMatch[2].trim(),
          });
        }
      }

      if (section === "current focus") {
        const bulletMatch = line.match(/^- (.+)/);
        if (bulletMatch) {
          currentFocus.push(bulletMatch[1].trim());
        }
      }
    }

    return { openLoops, currentFocus, raw };
  } catch {
    return { openLoops: [], currentFocus: [], raw: "" };
  }
}
