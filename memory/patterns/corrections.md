---
node_type: patterns
status: active
tier: deep
created: 2026-03-28
updated: 2026-03-30
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
- No em dash in customer messages — use regular dash
- Skip intro for FB Marketplace inquiries
- Always mention availability: "We've got availability tomorrow!"
- 2026-03-30 | CRITICAL: We do NOT have our own power and water. Customer needs to provide access. NEVER say "we come with our own power and water" — this was WRONG in multiple customer messages and ad copy. THE RULE: Say "we just need access to power and water on-site" or "we just need a power point and tap access".
- New customer discount: $30 off first service (Signature Detail only)
- 2026-03-29 | ALWAYS reference service menu (business-knowledge.md) when replying to customers. Apply SUV pricing for SUVs/4WDs. Show value but keep it concise — convert, don't lecture.
- 2026-03-29 | Don't assume Signature Detail. Listen to what the customer actually asks for and match the right service. If they ask for cut & polish = paint correction (needs inspection). If they ask inside/out = Signature Detail. If they ask for both, quote each separately.
- (merged into campaign rules — paint correction entry above)
- 2026-03-29 | Executive Detail = Monarch's version of what competitors call "Full Detail". Benchmark against competitor full detail pricing, not as a separate premium tier above it.
- Juan: keep briefs simple (English is second language), give creative freedom with structure, music = vibes not prescriptive

## Technical rules

- Never claim capabilities not possessed (Jarvis claimed it could watch videos — it couldn't)
- Route specialist work to sub-agents, don't do it directly
- Operational fixes don't need approval — just do them
- Customer messages: draft and show before sending. Always include at least 1 emoji.
- 2026-03-30 | DO NOT send email confirmations to customers. Jobber confirmations = manual via UI only. FRIDAY branded emails = NOT approved for customer-facing sends. Draft only, never send without explicit approval.
- 2026-03-28 | Telegram line break bug: Claude Code channel handler may truncate messages after line breaks. If a Telegram message seems incomplete, ask the user to resend the rest or send as separate messages. Use Shift+Enter for line breaks on Telegram.
- 2026-03-29 | Telegram scheduler one-shot jobs don't fire reliably (runCount stays 0). THE RULE: For urgent/immediate Telegram sends, use direct Bot API call via curl instead of mcp__telegram_scheduler__schedule_job with one-shot. Scheduler is fine for recurring jobs.
- 2026-03-29 | Drone PW research initially said "GC is uncontested" — WRONG. Aerowash, Washed By Drones, iDrone Clean, DCI Drones all operate on GC. THE RULE: Always verify competitive landscape claims with a direct Google search before stating "no competitors." Check first page of Google, not just specialist databases.
- 2026-03-29 | Jobber API job creation requires 4 steps: clientCreate → propertyCreate (with clientId as top-level arg, properties as list in input) → jobCreate (needs propertyId + invoicing{invoicingType, invoicingSchedule} + lineItems with saveToProductsAndServices:false) → visitEditSchedule (needs visit ID + startAt/endAt as LocalDateTimeAttributes{date, time, timezone}). Job creation alone does NOT schedule the visit times.

---

> At 100+ entries: group by category, keep only THE RULE, archive full entries
> to memory/archive/corrections-[year].md
