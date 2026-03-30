---
node_type: reference
status: active
---

# Obsidian setup

> FRIDAY writes memory files. You browse them in Obsidian. Best of both worlds.

## Install (2 minutes)

1. Download Obsidian from https://obsidian.md (free for personal use)
2. Open Obsidian → "Open folder as vault"
3. Point it at your `friday/memory/` folder
4. Done. You can now browse FRIDAY's entire brain visually.

## What you get

- **Search**: instant full-text search across all memory files
- **Graph view**: visual map of connections between entities, campaigns, people
- **Daily notes**: optionally add your own braindumps that FRIDAY can read
- **Mobile**: install Obsidian on your phone, sync via iCloud/Syncthing, browse FRIDAY's memory on the go
- **Tags**: FRIDAY uses YAML frontmatter — Obsidian reads this natively for filtering

## Recommended plugins (all free)

- **Dataview**: query memory files like a database ("show me all active campaigns")
- **Calendar**: see when memory entries were last updated
- **Tasks**: track open loops visually across all files
- **Graph Analysis**: find clusters and connections FRIDAY hasn't spotted

## Sync options for mobile browsing

- **iCloud** (Mac/iPhone): put friday/memory/ inside iCloud Drive
- **Syncthing** (cross-platform): free, encrypted, peer-to-peer sync
- **Obsidian Sync** (paid, $4/mo): official, end-to-end encrypted

## Important

- Obsidian is READ-ONLY for you in this workflow. Don't edit FRIDAY's memory files
  in Obsidian unless you want to — FRIDAY might overwrite your edits.
- Exception: the `memory/private/sensitive.md` file — feel free to edit that directly.
- If you want to add notes for FRIDAY to read, create an `inbox/` folder.
  FRIDAY can check it at session start and process your braindumps.
