# Monarch Detailing ERP — Backlog

> Operations management system for Monarch Detailing (mobile car detailing, Brisbane).
> Tech: Bun + Hono + Alpine.js + SQLite. Same stack as Mission Control.
> Port: 3739
> Priority: [P0] ship-blocking, [P1] important, [P2] nice-to-have

## [P0] — Core MVP

- [ ] Scaffold project: server.ts, config.ts, package.json, tsconfig, public/
- [ ] Database schema: jobs, customers, employees, services, invoices, expenses, routes, reviews
- [ ] API routes: jobs CRUD, customers CRUD, employees CRUD, services CRUD, invoices, expenses, routes
- [ ] Frontend SPA: 7-page Alpine.js app (Dashboard, Jobs, Customers, Team, Services, Finances, Routes)
- [ ] Dashboard page: KPIs (jobs this week, revenue MTD, avg job value, employee utilisation, lead pipeline count)
- [ ] Jobs page: job list with status (scheduled/in-progress/complete/invoiced), create job modal, assign employee, link to customer
- [ ] Customers page: customer list, vehicle info, job history, lifetime value, notes
- [ ] Team page: employee list (Braj, Juan, future hires), schedule view, jobs assigned, pay tracking
- [ ] Services page: service catalogue (Signature Detail $200, Paint Correction, PPF), pricing, duration estimates
- [ ] Finances page: revenue summary, expenses, profit/loss, invoice list, outstanding payments
- [ ] Routes page: daily route view — jobs plotted by suburb, optimise drive order (Brisbane suburbs)

## [P1] — Integrations & Automation

- [ ] Jobber sync: pull jobs/customers from Jobber API (blocked on OAuth setup)
- [ ] Meta Ads lead import: auto-create customer record when new lead arrives
- [ ] Invoice generation: create PDF invoices from completed jobs
- [ ] Google Maps integration: suburb-based route optimisation, drive time estimates
- [ ] SMS reminders: day-before job confirmation to customer
- [ ] Review request: auto-send Google review link after job completion
- [ ] Weather check: flag outdoor jobs at risk from Brisbane weather (BOM API)
- [ ] Inventory tracking: supplies usage per job, reorder alerts

## [P2] — Growth Features

- [ ] Customer portal: let customers book online, view history, pay invoices
- [ ] Employee mobile app: checklist-driven job completion, before/after photos
- [ ] Upsell engine: flag customers due for paint correction based on last service date
- [ ] Recurring bookings: set up fortnightly/monthly maintenance details
- [ ] Referral tracking: track referral source per customer, measure word-of-mouth
- [ ] Break-even dashboard: live jobs-to-target tracker (47 jobs/month goal)
- [ ] Pricing optimiser: A/B test pricing changes, track conversion impact
