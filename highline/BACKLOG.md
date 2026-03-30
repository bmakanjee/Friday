# Highline OS (Rental Car ERP) — Backlog

> Luxury rental car management system for Highline Exotics, Brisbane.
> Tech: Bun + Hono + Alpine.js + SQLite. Same stack as Mission Control.
> Priority: [P0] ship-blocking, [P1] important, [P2] nice-to-have

## [P0] — Rebuild Core (directory was lost, rebuild from spec)

- [ ] Scaffold project: server.ts, config.ts, package.json, tsconfig, public/
- [ ] Database schema: vehicles, bookings, customers, handovers, damage_reports, revenue, expenses, alerts, geofences
- [ ] API routes: vehicles CRUD, bookings CRUD, customers CRUD, handovers CRUD, damage CRUD, revenue/expenses
- [ ] Frontend SPA: 8-page Alpine.js app (Dashboard, Fleet, Bookings, Handover, Customers, GPS, Damage, Revenue)
- [ ] Dashboard page: KPIs (active rentals, revenue MTD, fleet utilisation, upcoming returns)
- [ ] Fleet page: vehicle list with status badges, add/edit vehicle modal
- [ ] Bookings page: booking list + calendar view, create/edit booking modal, stats
- [ ] Handover page: pickup/return checklists, photo placeholders, completion workflow
- [ ] Customers page: customer list, rating/history, CRUD
- [ ] Damage page: report damage, severity tracking, link to booking
- [ ] Revenue page: summary, per-vehicle P&L, expense tracking

## [P1] — Integrations & Features

- [ ] GPS tracking page: Netstar API integration (needs API key — blocked on Braj calling 1800 325 052)
- [ ] Turo iCal sync: import bookings from Turo calendar feeds
- [ ] Photo upload: multipart handler for handover/damage photos, store in uploads/
- [ ] Geofence alerts: define zones, alert when vehicle leaves boundary
- [ ] Maintenance tracker: scheduled services, cost tracking per vehicle
- [ ] Insurance claim linking: connect damage reports to insurance claims
- [ ] WebSocket live updates: push booking changes, GPS updates, alerts to dashboard

## [P2] — Polish

- [ ] Multi-tenant auth: login system, tenant isolation for SaaS
- [ ] Mobile PWA: service worker, offline capability, install prompt
- [ ] PDF handover report: generate printable pickup/return documents
- [ ] Vehicle timeline: visual history of bookings, damage, maintenance per vehicle
- [ ] SMS notifications: booking confirmations, return reminders
- [ ] Expense categorisation: fuel, insurance, maintenance, cleaning auto-tagged
