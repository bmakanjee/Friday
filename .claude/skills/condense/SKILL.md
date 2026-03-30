---
name: condense
description: Memory maintenance. Run weekly or when memory files exceed their caps. Condenses observations into patterns, archives stale entries, promotes recurring themes.
---

# Memory condensation

## Protocol

### 1. Check file sizes
Read each memory file. Check its YAML frontmatter for `cap`. Flag any that exceed their cap.

### 2. Hot memory (cap: 60 lines)
- Items older than 7 days with no recent reference → move to appropriate Tier 2 file
- Corrections older than 7 days → move to patterns/corrections.md
- Campaign data that's no longer current → move to ads-history.md
- Rewrite remaining items to be more concise

### 3. Corrections (cap: 100 entries)
- Group by category
- If 3+ corrections share the same root cause → merge into one rule
- Archive the full entries to memory/archive/corrections-[year].md
- Keep only THE RULE in the main file

### 4. Deep memory files (cap: 200 lines each)
- Ads history: archive completed tests, keep only the learnings
- Business knowledge: remove outdated competitive intel, update with current state
- Entities: archive inactive contacts (no interaction in 60+ days)

### 5. Pattern promotion
- Scan all Tier 2 files for themes that appear 3+ times
- Promote to hot-memory.md as a standing instruction
- Example: if corrections.md has 3 entries about "always check frequency before recommending scale" → promote to hot memory as a core rule

### 6. Update frontmatter
- Set `updated: [today's date]` on every file touched
- Log what was condensed in a brief summary at the end

### 7. Report
Tell the boss: "Memory maintenance complete. [X] items archived, [X] patterns promoted, [X] files condensed."
