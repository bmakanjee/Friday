# Mission Control — Backlog

> FORGE picks the highest-priority unblocked task each sprint.
> Priority: [P0] ship-blocking, [P1] important, [P2] nice-to-have
> Status: [ ] todo, [WIP] in progress, [DONE] complete

## [P0] — Ship-blocking

- [DONE] Mission Control v2 dashboard rebuild — 4-tab layout (Ops/Monarch/Ventures/Agents) with sidebar nav, kanban task board, inbox feed, venture cards, agent status — 2026-03-29
- [DONE] Mission Control v2 visual upgrade — pending approvals, for-review section, sidebar labels, gradient/glow styling, WS auto-reconnect w/ backoff, tab transitions — 2026-03-29
- [DONE] Mission Control v2 command centre enhancements — weather widget (wttr.in), revenue tracker, daily schedule, quick stats bar, notification badges, footer status bar — 2026-03-29
- [DONE] Fix SQL injection in `/api/leads` status query — parameterised all 4 interpolated queries in api.ts — 2026-03-31
- [DONE] Dynamic kanban task board — tasks table + CRUD API + dynamic frontend with add/move/delete, category pills, priority badges, 30s auto-refresh, seeded with current backlog — 2026-03-31
- [ ] Add error state UI — show user-facing errors when Meta API fails instead of silent failure
- [ ] Lead deduplication — prevent duplicate leads if Meta returns the same lead twice across collections

## [P1] — Important

- [ ] Agent activity collector — hook agent events into `agent_events` table (schema exists, no data flowing)
- [ ] Agent activity feed UI — render `/api/agent/activity` data in dashboard (backend exists, no frontend)
- [ ] Date range picker — replace hardcoded 7-day window with selectable date range on KPI cards
- [ ] Campaign drill-down modal — click a campaign row to see adset-level breakdown
- [ ] Mobile responsive pass — test and fix layout on 375px viewport
- [ ] Retry logic for Meta API — exponential backoff on collection failures, max 3 retries
- [ ] Backend: `/api/jobber/stats` endpoint — pull revenue, jobs completed, uninvoiced count from Jobber API (currently hardcoded in frontend)
- [ ] Backend: `/api/jobber/today` endpoint — pull today's schedule from Jobber API (currently empty array in frontend)
- [ ] Backend: `/api/services/status` endpoint — health check for Telegram, Jobber, Meta Ads connectivity (currently hardcoded in frontend)
- [DONE] WebSocket reconnection — auto-reconnect on drop with exponential backoff, "Reconnecting..." banner — 2026-03-29

## [P2] — Nice-to-have

- [ ] CSV export — download KPIs, campaigns, and leads as CSV
- [ ] Dark/light theme toggle
- [ ] Notification sound on new lead (browser notification API)
- [ ] Lead notes — editable notes field per lead in pipeline view
- [ ] Historical CPL trend chart — 30-day view
- [ ] Favicon + PWA manifest for "install to homescreen"
