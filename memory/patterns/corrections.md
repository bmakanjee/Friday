---
node_type: patterns
status: active
tier: deep
created: 2026-03-28
updated: 2026-04-06
cap: 100 entries then condense
connected:
  - "[[memory/hot-memory]]"
---

# Corrections

> Every mistake becomes a permanent rule. FRIDAY checks this every session.

## Data integrity rules

- 2026-03-18 | CRITICAL | $541 wasted — lead forms disconnected, zero leads captured | THE RULE: Health-check lead forms daily. Verify form IDs match active campaigns before reporting metrics.
- 2026-03-27 | CRITICAL | Old lead form quoted $349 instead of $499, affected 3 leads | THE RULE: ALWAYS read pricing from knowledge/monarch-pricing.md. Never quote from research files. Correct form: 969764435579475.
- 2026-03-26 | Sweden targeting bug found in ads | THE RULE: Verify geo-targeting on every new campaign — Gold Coast/Brisbane only.

## Campaign rules

- Never claim "done" without evidence — show screenshots, data, or links
- Pricing file is the ONLY source of truth for customer-facing prices
- Ad budget: $33/day total ($15 lead + $15 booking + $3 traffic). A/B test until Apr 12.
- Paint correction = "cut and polish" in customer language. Use "paint correction" in marketing. Exterior only. Always requires inspection — see monarch-pricing.md for tier pricing (1-stage/2-stage/3-stage).
- Engine bay: included only in Pre-Sale, otherwise $80 add-on
- Premium positioning — never compete on price

## Communication rules

- Customer-facing name: Harry (not Braj, not Jarvis, not FRIDAY)
- Format: "Hey [Name]! Harry from Monarch Detailing here"
- No em dashes anywhere — use regular dashes in all output (customer messages, Telegram, drafts, everything)
- Skip intro for FB Marketplace inquiries
- 2026-04-06 | Recruitment messages: don't hype candidates about their experience. Keep outreach neutral - "we saw your application, keen for a chat?" Not "your experience is exactly what we're after." THE RULE: Neutral tone in all candidate outreach.
- Always mention availability: "We've got availability tomorrow!"
- 2026-03-30 | CRITICAL: We do NOT have our own power and water. Customer needs to provide access. NEVER say "we come with our own power and water" — this was WRONG in multiple customer messages and ad copy. THE RULE: Say "we just need access to power and water on-site" or "we just need a power point and tap access".
- New customer discount: $30 off first service (Signature Detail only)
- 2026-04-06 | CRITICAL: NEVER invent prices or services. ALL customer-facing pricing MUST come from memory/knowledge/monarch-pricing.md. If a service isn't on the menu, ASK Braj before quoting. THE RULE: Read monarch-pricing.md before every customer reply. No exceptions.
- 2026-03-29 | ALWAYS reference service menu (business-knowledge.md) when replying to customers. Apply SUV pricing for SUVs/4WDs. Show value but keep it concise — convert, don't lecture.
- 2026-03-29 | Don't assume Signature Detail. Listen to what the customer actually asks for and match the right service. If they ask for cut & polish = paint correction (needs inspection). If they ask inside/out = Signature Detail. If they ask for both, quote each separately.
- (merged into campaign rules — paint correction entry above)
- 2026-03-29 | Executive Detail = Monarch's version of what competitors call "Full Detail". Benchmark against competitor full detail pricing, not as a separate premium tier above it.
- Juan: keep briefs simple (English is second language), give creative freedom with structure, music = vibes not prescriptive

## Technical rules

- Never claim capabilities not possessed (Jarvis claimed it could watch videos — it couldn't)
- Route specialist work to sub-agents, don't do it directly
- 2026-03-31 | CRITICAL: ALWAYS verify agent output before sending to Braj. JARVIS gave false data (said C3 active at $21/day when it was C2 and already dead). THE RULE: Pull the same data independently, cross-check key numbers, only send verified data. Agents are researchers, FRIDAY is the fact-checker. Never forward unverified agent reports.
- Operational fixes don't need approval — just do them
- Customer messages: draft and show before sending. Always include at least 1 emoji.
- 2026-03-31 | Website/SEO guardrails: Never modify live website without explicit approval. Draft all changes first, get sign-off, then implement. No auto-publishing. No deleting pages. No changing URLs without redirect plan. WordPress access = read + draft only until approved.
- 2026-03-31 | Instagram handle is @monarch.detailing (NOT @monarch_detail). Use existing Meta Graph API for IG monitoring — same API as ads.
- 2026-03-30 | DO NOT send email confirmations to customers. Jobber confirmations = manual via UI only. FRIDAY branded emails = NOT approved for customer-facing sends. Draft only, never send without explicit approval.
- 2026-03-28 | Telegram line break bug: Claude Code channel handler may truncate messages after line breaks. If a Telegram message seems incomplete, ask the user to resend the rest or send as separate messages. Use Shift+Enter for line breaks on Telegram.
- 2026-03-29 | Telegram scheduler one-shot jobs don't fire reliably (runCount stays 0). THE RULE: For urgent/immediate Telegram sends, use direct Bot API call via curl instead of mcp__telegram_scheduler__schedule_job with one-shot. Scheduler is fine for recurring jobs.
- 2026-03-29 | Drone PW research initially said "GC is uncontested" — WRONG. Aerowash, Washed By Drones, iDrone Clean, DCI Drones all operate on GC. THE RULE: Always verify competitive landscape claims with a direct Google search before stating "no competitors." Check first page of Google, not just specialist databases.
- 2026-04-01 | CRITICAL: API spend blew out — $20 in 15 minutes from aggressive Opus sub-agent spawns + frequent remote triggers. THE RULE: (1) Never spawn Opus agents for routine tasks — use Sonnet or do it directly. Opus only for deep strategy. (2) Pull MCP data directly instead of delegating to agents when possible. (3) Keep remote triggers lean — health checks 2x/day max. (4) Before spawning multiple agents in parallel, consider if one direct call would suffice. Budget is tight — optimise every token.
- 2026-04-04 | Telegram responsiveness: FRIDAY cannot reply in real-time on Telegram between sessions. Bot polls and saves to inbox but only sends canned replies. THE RULE: Set up a remote trigger to spin up a session on incoming Telegram messages for near-instant intelligent replies. Until then, Braj should use Claude Code desktop for real-time conversation. Telegram = async only.
- 2026-04-06 | Without --channels flag, FRIDAY has ZERO Telegram visibility — no real-time messages AND no dashboard poller capturing to DB/inbox. THE RULE: Always start sessions with `start-friday.bat` (runs `claude --channels "plugin:telegram@claude-plugins-official"`). If Braj says "check Telegram" and session lacks channels, tell him immediately — don't waste time diagnosing. Batch file lives at C:\Users\bmaka\friday\start-friday.bat.
- 2026-04-06 | Dashboard Telegram poller and channel plugin CANNOT coexist — both call getUpdates, only one wins. THE RULE: Lock file `.telegram-channel-active` gates the poller. start-friday.bat creates it on launch + heartbeat every 60s. Poller skips when lock exists (< 5min old). When session ends, lock is deleted and poller resumes. If Telegram stops working mid-session, check if dashboard is stealing updates.
- 2026-04-08 | Foreign email domains on leads (yahoo.co.in, hotmail.co.nz) don't mean targeting is wrong. GC has large Indian-Australian and NZ communities. THE RULE: Before assuming geo-targeting leak, pull ad set targeting from Meta API and verify. Check location_types and geo_locations fields. Don't alarm the boss over normal multicultural demographics.
- 2026-04-04 | Ads analysis: recommended pausing Car Enthusiasts Ad but it was already paused. THE RULE: Before recommending an action on any ad/campaign, ALWAYS check its current status (active/paused) first. Don't recommend doing something already done — it makes the analysis look sloppy.
- 2026-04-04 | Jobber OAuth tokens expire after 60 mins. THE RULE: Always refresh the token before making Jobber API calls. Check jobber_tokens table, refresh if expired.
- 2026-03-29 | Jobber API job creation requires 4 steps: clientCreate → propertyCreate (with clientId as top-level arg, properties as list in input) → jobCreate (needs propertyId + invoicing{invoicingType, invoicingSchedule} + lineItems with saveToProductsAndServices:false) → visitEditSchedule (needs visit ID + startAt/endAt as LocalDateTimeAttributes{date, time, timezone}). Job creation alone does NOT schedule the visit times.

---

- 2026-04-09 | Jobber job titles: format as "Package Type - Vehicle" (e.g. "Executive Detail - Range Rover Defender"). THE RULE: Always include vehicle make/model in Jobber job title when known.
- 2026-04-10 | Jobber visits left UNSCHEDULED after job creation. Root cause: jobCreate without scheduling block OR without timeframe.startAt creates a visit with no date/time. THE RULE: (1) ALWAYS include scheduling{createVisits:true, startTime, endTime} AND timeframe{startAt, durationUnits:DAYS, durationValue:1} in jobCreate. (2) ALWAYS verify visit status after creation — re-query and confirm visitStatus=UPCOMING, not UNSCHEDULED. (3) If unscheduled, fix immediately with visitEditSchedule. Use the /jobber skill for all Jobber operations.
- 2026-04-10 | Jobber refresh tokens expire if dashboard hasn't been running to auto-refresh. THE RULE: If refresh token fails with 401, tell Braj immediately to re-auth at http://localhost:3737/api/jobber/connect. Don't waste time debugging — expired refresh tokens can only be fixed by re-authorising.
- 2026-04-10 | Jobber jobs created WITHOUT team member assignment — jobs don't appear on Jack's schedule/calendar. THE RULE: jobCreate does NOT accept assignedServicers. After creating the job, ALWAYS assign team with: `visitEditAssignedUsers(visitId: "...", input: { assignedUserIds: ["..."] })`. Jack's ID: Z2lkOi8vSm9iYmVyL1VzZXIvMzY1MDI3MQ==. Verify assignedUsers in response. NEVER create a job without assigning it to someone.
- 2026-04-12 | Told Braj it was Saturday when it was Sunday. THE RULE: Always verify the actual day of the week before giving time-sensitive advice (e.g. "dealer closes at midday on Saturdays"). Use the system-provided date and calculate the day, don't assume.

> At 100+ entries: group by category, keep only THE RULE, archive full entries
> to memory/archive/corrections-[year].md
