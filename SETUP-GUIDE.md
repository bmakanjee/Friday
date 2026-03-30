# FRIDAY install guide

> Do steps 1-4. FRIDAY handles the rest.

---

## Step 1: Install the tools (10 min)

Open PowerShell (or Terminal) and run:

```powershell
# Install Node.js if you don't have it
# Download from https://nodejs.org (LTS version)
# Then verify:
node --version

# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Verify Claude Code (need v2.1.80+)
claude --version

# Install Bun (needed for Telegram later)
powershell -c "irm bun.sh/install.ps1 | iex"
bun --version
```

---

## Step 2: Unpack FRIDAY (2 min)

Move the `friday/` folder you downloaded to your home directory:

```powershell
# The folder should be at:
# C:\Users\[YOU]\friday\
#
# Or wherever you want FRIDAY to live.
# Just remember the path.
```

If you have Jarvis/OpenClaw files you want FRIDAY to learn from,
copy them into `friday/` before proceeding. FRIDAY will scan for
them during onboarding.

---

## Step 3: Connect Meta Ads (10 min)

```powershell
cd C:\Users\[YOU]\friday
claude

# Inside Claude Code, run:
claude mcp add --transport http pipeboard-meta-ads https://meta-ads.mcp.pipeboard.co/

# Then authenticate:
# Type /mcp and follow the prompts to connect your Meta account
```

---

## Step 4: Launch FRIDAY (5 min)

```powershell
cd C:\Users\[YOU]\friday
claude
```

Then type:

```
Run the onboarding skill
```

**FRIDAY takes over from here.** It will:

1. Scan for any Jarvis/OpenClaw files and extract useful context
2. Interview you about your business (10 questions, conversational)
3. Populate all memory files with your actual details
4. Fill in every placeholder in CLAUDE.md
5. Verify what it learned back to you
6. Ask for corrections (which become permanent rules)
7. Ask what you want it to tackle first
8. Pull live data from Meta Ads if connected
9. Give you a real insight to prove it's operational

---

## Step 5: Set up Telegram (10 min, optional — do when ready)

1. Open Telegram → search @BotFather → send `/newbot`
2. Name: "FRIDAY" | Username: `friday_[yourname]_bot`
3. Copy the token

```powershell
cd C:\Users\[YOU]\friday
claude

# Inside Claude Code:
/plugin marketplace add anthropics/claude-plugins-official
/plugin install telegram@claude-plugins-official
/reload-plugins
/telegram:configure [PASTE YOUR TOKEN]
```

4. Exit Claude Code, restart with channels:

```powershell
claude --channels plugin:telegram@claude-plugins-official --dangerously-skip-permissions
```

5. Message your bot on Telegram — enter the pairing code when prompted

---

## Step 6: Set up scheduled tasks (10 min, optional — do when ready)

Inside a Claude Code session:

```
# Morning brief at 7am
/loop 24h at 7:00am Run morning brief: check Meta ad performance via MCP,
summarise overnight changes, flag urgent items, send via Telegram.

# Ad performance check every 2 hours
/loop 2h Check all active Meta campaigns via MCP. Compare ROAS, CPA, CPM
against thresholds in CLAUDE.md. Flag anomalies. Update hot-memory.md.
If anything urgent, alert via Telegram.
```

For persistent scheduling (survives restarts), use Claude Desktop app:
Settings → Scheduled Tasks → New Task

---

## Step 7: Set up Git (5 min, optional — do when ready)

```powershell
cd C:\Users\[YOU]\friday
git init
git add .
git commit -m "FRIDAY v1 initial setup"

# Optional: push to a PRIVATE GitHub repo
# (never make this public — it contains business data)
gh repo create friday --private
git push -u origin main
```

This lets you:
- Track what FRIDAY changes in memory over time
- Sync to Mac Studio in May with one `git pull`
- Roll back if something goes wrong

---

## Step 8: Install Obsidian (2 min, optional — do when ready)

1. Download from https://obsidian.md
2. Open → "Open folder as vault" → select `friday/memory/`
3. Browse FRIDAY's brain visually

See `OBSIDIAN-SETUP.md` for recommended plugins.

---

## Step 9: Install planning skill (2 min, optional)

```powershell
cd C:\Users\[YOU]\friday
npx skills add OthmanAdi/planning-with-files --skill planning-with-files -g
```

---

## What happens next

**Day 1:** FRIDAY knows your business basics. Can pull live ad data.
You correct mistakes — they become permanent rules.

**Week 1:** Memory building. FRIDAY learns your patterns and preferences.
Fewer corrections needed. Scheduled tasks running.

**Week 2-3:** FRIDAY proactively flags issues. "Campaign X frequency
hit 3.2, recommend refreshing creative." The corrections file has 20+
entries. Early mistakes are now impossible.

**Month 2:** FRIDAY is your operations layer. You think strategy,
FRIDAY handles execution and monitoring.

**May:** Mac Studio arrives. `git clone` the friday repo.
Add iMessage + Calendar. Spin up 5 persistent agents.
FRIDAY runs 24/7 on hardware that never sleeps.

---

## If something goes wrong

- **FRIDAY hallucinating:** Check that `.claude/rules/validation.md` is loading.
  Run `/memory` to verify auto-memory is on.
- **MCP not connecting:** Run `/mcp` to check status. Re-authenticate if needed.
- **Memory not loading:** Verify hooks in `.claude/settings.json` are intact.
  Run the SessionStart hook manually to test.
- **Need to restart fresh:** Your memory files are safe. Delete `.claude/logs/`
  and restart Claude Code. Memory persists.
- **Kill switch:** Close the terminal. Everything stops. Nothing runs without
  an active Claude Code session.

---

## File inventory

```
friday/
├── CLAUDE.md                           ← FRIDAY's soul
├── SETUP-GUIDE.md                      ← This file
├── OBSIDIAN-SETUP.md                   ← Obsidian integration guide
├── .gitignore                          ← Protects sensitive files
├── memory/
│   ├── hot-memory.md                   ← Always loaded (Tier 1)
│   ├── business-knowledge.md           ← Products, audiences, brand (Tier 2)
│   ├── ads-history.md                  ← Campaign patterns (Tier 2)
│   ├── entities.md                     ← People, tools, contacts (Tier 2)
│   ├── life-context.md                 ← Personal life CFO/CTO (Tier 2)
│   ├── entities/                       ← Detailed entity files
│   ├── patterns/
│   │   ├── corrections.md              ← Every mistake → permanent rule
│   │   ├── preferences.md              ← How the boss likes things
│   │   ├── strategies.md               ← Business strategies
│   │   └── boundaries.md              ← Guardrails (boss-only edits)
│   ├── private/
│   │   └── sensitive.md                ← Financial actuals (never synced)
│   └── archive/                        ← Condensed historical entries
├── planning/                           ← Manus-style planning files
├── .claude/
│   ├── settings.json                   ← Hooks + permissions config
│   ├── agents/
│   │   ├── ads-agent.md                ← Meta Ads specialist
│   │   ├── research-agent.md           ← Market + competitor intel
│   │   ├── ops-agent.md                ← Email, calendar, operations
│   │   ├── reports-agent.md            ← Briefings + dashboards
│   │   └── creative-agent.md           ← Ad copy + content
│   ├── skills/
│   │   ├── onboarding/SKILL.md         ← First-run interview + setup
│   │   └── condense/SKILL.md           ← Weekly memory maintenance
│   ├── rules/
│   │   └── validation.md               ← Anti-hallucination rules
│   ├── hooks/                          ← Custom hook scripts
│   ├── commands/                       ← Custom slash commands
│   └── logs/                           ← Session logs (not synced)
```

20 files. Everything FRIDAY needs to run your business and life.
