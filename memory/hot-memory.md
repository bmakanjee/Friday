---
node_type: memory
status: active
tier: hot
created: 2026-03-28
updated: 2026-04-06
cap: 60 lines
condense_to: memory/patterns/
---

# Hot memory

## Current focus

- #1: Lead form campaign ($20/day) is sole lead driver. Messages campaign ($10/day) generating DMs. Direct booking PAUSED. Review creatives urgently.
- Break-even: ~42 jobs/month (~10/week) with Jaydee's salary. Actually doing ~2.3 jobs/week (Jobber verified Apr 6). $364/week avg revenue. Gap = ~8 jobs/week. CRITICAL.
- Braj finishes uncle's job Apr 17 → Thailand → full Monarch focus
- Apr 4: 3 new leads — Alex Lanni (Hope Island), Peggy Hardiman (Coomera, $499 Executive, B2B prospect), Naomi Brownless (Upper Coomera). Best lead day in weeks.
- Steven Adams - RECURRING customer. Mercedes GLC, $150 Signature Detail, every 3 weeks Monday. Next: Apr 27. Phone: 0416 147 864.
- Apr 7: Jamie Atthews job COMPLETED (Chevy 2500, 4/10 Ivan St Arundel, Signature Detail). B2B prospect.
- Apr 7: Rob White Sprinter - decal glue removal INCOMPLETE. Jack couldn't get baked-on glue off. Needs 3M adhesive remover or Tardis. DO NOT use caramel block.
- Apr 9: Puiai Maukeni — 0401 310 358, 9 Karrinyup Pl Robina, BOOKED Sat 1pm.
- Apr 9: Peggy Hardiman — 0439 265 422, 10 Azura Way Coomera, BOOKED Tue Apr 14 (today) 2pm, Executive Detail $499, Range Rover Defender. B2B prospect (Diamond Care Support Services). Jobber #46.
- Apr 13: Amy Nguyen — Jobber #47 COMPLETED. Neighbour Special $125. NEEDS INVOICING.
- Apr 9: Kayla Pinkstone — 0421 223 177, tomnkaylap@gmail.com. Lead form Apr 9. UNCONTACTED.
- Apr 9: Michael Tuua — 0411 145 792, Marques2226@hotmail.com. Lead form Apr 9. UNCONTACTED.
- Apr 9: Deepanshu Talwar — 0401 667 643, Ipswich, Executive + One Step Polish, black Defender. Msg drafted, schedule on Brisbane day.
- Apr 9: Ann dela Paz — 0473 007 456, Eagleby, Executive Detail. Msg drafted, booking next week.
- Apr 9: Alex Lanni — 0414 751 321, Hope Island. Car getting fixed. CALL 3rd week May.
- Apr 7: Josiah Melsom (047 415 514 - short number?), Varun Rana (0430 089 844) — still uncontacted.
- Apr 12: Phillip White — 0407 472 883, Phillip@intrendbathrooms.com.au, 15 Meyer St Southport. BOOKED Fri Apr 17 8:30am-1pm. Executive Detail BMW M4 $499 + free engine bay ($80 value). Car has PPF/wrap matt finish. Business: Intrend Bathrooms (B2B prospect). Jobber #48.
- Apr 14: Ramzy (Handyman) — 0401 123 575, 20 Kerria Crescent Ashmore. BOOKED Wed Apr 15 8:30am-2pm. Pre-Sale Detail (Ute) exterior + 1-step cut & polish (Jack). $799 booked, mates rate discount after job. Free microfibres. Jobber #50.
- Apr 14: Luke Koning — RESCHEDULED from Wed Apr 15 to Fri Apr 17 2pm-5pm. Signature Detail Porsche 911, 112 Palm Meadows Dr Carrara. Jobber #49. Follows Phillip on same day.
- Apr 14: Susannah Shultz (Suz) — returning customer, 15 Kambalda Court Worongary. BOOKED Thu Apr 16 1pm-5pm. Navara Ute tidy $120 + Jayco exterior wash $80 = $200 total. Jobber #51. + Rosalind — Thu Apr 16 8am, Mitsubishi ASX, PENDING contact/address/service details for Jobber entry.
- Apr 6: Lily (CX5, Signature + Seat Shampoo) — replied. Edin (work van, Marketplace) — replied, awaiting photos.
- Shane Daly (Arundel, Mar 30) — stale.

## Active campaigns (UPDATED Apr 13 via API)

- Lead form (API Test - Mar 23): $20/day. MANUS High Income Ad generates ALL leads. G Wagon reel got $2.23 total — Meta starved it. 7-day: 7 leads at $19.37 CPL. DRY SPELL: 0 leads Apr 10-12 ($55 burned). Creative fatigue — single ad running since Mar 25.
- Messages/DMs (Apr 9): $10/day. G Wagon reel. 4 DM conversations in 7 days at $8.91 each. Check if DMs converting.
- Jobber traffic (26 Mar): $3/day. 162 landing page views in 7 days, still 0 bookings.
- Direct booking (Mar 30): PAUSED Apr 9.
- Total: $33/day (~$1,003/month). Lead Form $20 + Messages $10 + Jobber Traffic $3.
- ACTION NEEDED: Load 2-3 more creatives into lead campaign (Porsche Cayenne reel, "Upgrade your standard" reel, convenience-focused piece). Single-creative fatigue is killing leads.
- Best demographics: Males 35-44 (most leads), Females 35-44 (best CPL $17.83).
- Google Review Link: https://g.page/r/Ceh0DKXd8JDLEAI/review — needs adding to Jobber + website.

## Scheduled monitoring

- Remote triggers: telegram-responder (hourly 7am-10pm), nightly-build (daily 2am), code-review (daily 6:50am) — all Sonnet
- DONE Apr 5: Health-check disabled, orphan trigger disabled, telegram-responder created (trig_011RPA2tS2SWxEe3uBXjWaKN)
- Morning brief cron LIVE (trig_01RweG6ATGgTy4JaXGGrv6Xw, 6am AEST daily, Sonnet). Reads memory + inbox, sends to Telegram.
- Session crons (midday, wrap, lead alerts) — need re-creating each session
- API COST RULE: No Opus sub-agents for routine work. Direct MCP calls preferred. Tokens reset Sat 10am.

## Open loops — priority

- [ ] Curtis Walker — audit doc DONE at documents/curtis-walker-deliverables-audit.html. Braj texted Curtis already. Need remaining reels delivered.
- [x] Direct Booking ad → Jobber link DONE Apr 4. Monitoring for bookings.
- [x] Ads budget reallocation — DONE Apr 5. Lead Form $20/day, Direct Booking $10/day. Car Enthusiasts already paused.
- [ ] MC fixes — agent activity not visible, deliverables not findable
- [ ] Task lifecycle system — open/closed/pending status flow for comms
- [ ] B2B/Fleet tiered pricing model — body shops, dealerships, prestige
- [ ] Instagram outreach — collaborators + business partnerships
- [ ] Subscription plans — finalise 3 tiers, add to Jobber + website
- [ ] SOP framework — equipment, chemicals, dilutions. Jack leaves end of May.
- [ ] Jaydee James Into — hired $55k/38hrs, 482 dependent visa (Philippines), ex-Audi Centre GC. Starting casual, transition to full-time. Needs study days. Draft offer email pending.
- [ ] Website service menu update — add Seat Shampoo & Extraction ($100), refresh sections. Parked for later.
- [ ] Pre-Sale ad campaign — organic inquiries, create paid creative
- [ ] Drone pressure washing — China factories, franchise, body corp market
- [x] SEO brief for Jeff — DONE at documents/seo-brief-jeff.md
- [x] Ads optimisation analysis — DONE at documents/ads-optimisation-apr4.md
- [ ] Telegram Channel plugin installed, paired. Needs --channels restart for real-time.
- [ ] Social media audit — new posts up, review content quality
- [ ] SMS marketing — pull Jobber customer history for maintenance subscription re-engagement campaigns
- [ ] Elma Halilovic (#38) — Mercedes 250 Signature, Labrador. Status LATE (since Apr 3). Needs rescheduling or closing.
- [ ] Check emails (jarvismonarch42@gmail.com)

## Blocked (need Braj)

- [x] WordPress credentials — UNBLOCKED Apr 1, Editor role, saved to private/sensitive.md
- [x] GMB access — UNBLOCKED Apr 1, Google review link obtained
- [ ] Netstar API key (1800 325 052)

## Critical rules

- Customer name: Harry. Pricing source: knowledge/monarch-pricing.md ONLY.
- Lead form: 969764435579475. Deprecated: 2105390046875617.
- Match service to what customer asks (don't assume Signature). Cut & polish = paint correction.
- Telegram: direct API for urgent sends, scheduler for recurring only.
