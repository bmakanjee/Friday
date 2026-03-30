---
node_type: archive
status: active
updated: 2026-03-29
connected:
  - memory/business-knowledge.md
  - memory/archive/chatgpt-extract.md
source: ChatGPT export — conversations "Monarch Operations Brain", "File management system", "Budget tracking assistance"
purpose: Requirements for Mission Control v3 build
---

# Mission Control Vision — Extracted from ChatGPT History

## What Braj Explicitly Asked For

### Central Operations Hub
- Wants **everything in one place** — tasks, scheduling, maps, payments, SMS reminders, team management, content calendar, marketing tracking, financials
- Asked: "What else can I use? what other options for systems can i use... that will allow tasks and maps, payments, sms reminders" (after Jobber limitations)
- Asked: "On jobber can I give side tasks to do? So it's all in one platform..."
- Wants to operate as a **"one man CEO running multiple companies, properties and vehicles"** with maximum automation
- The phrase "automation at its finest" was used explicitly
- Wants systems that are **"easy for future people to even access"**

### Dashboard / Overview
- Never explicitly said "build me a dashboard" in ChatGPT — the dashboard concept evolved from needing a single view across: ad performance (Meta/Google), job bookings, employee tasks, financials, and file management
- The closest request: wanting to see break-even KPIs, ad budget tracking, and job volume all tied together to give Amit (India SEM contractor) targets

## Features Discussed

### 1. Job/Booking Management
- Uses Jobber (paid ~$250/month) for CRM/booking but frustrated with payment limitations
- Considered switching to ServiceM8, Tradify, or Fergus
- Stayed with Jobber + Square for on-site payments
- Wants: online booking, SMS reminders, automated confirmations, invoice/quote generation
- Booking form: simple — name, address, phone, make/model, preferred time slot (Morning 7-10am, Midday 10am-2pm, Afternoon 2-6pm), service selection
- Confirmation via message (not webpage) — keep it simple

### 2. Task Management for Employees
- Needs non-invoiced "side tasks" for Jack (employee) during downtime: van restock, flyer drops, content filming, shelving install
- Uses Jobber Tasks feature: Schedule > New > Task, assigned to Jack with checklists
- Wants daily/weekly task lists with clear ownership
- Jack's downtime tasks: van organisation, microfibre system restock, photo content (10 before/after sets/week), Google reviews follow-up, flyer drops (50-100/day), SOP practice

### 3. Marketing & Content Calendar
- Stated priority order: "Social media content calendar and posting is first. Then the easy jobber square updates. Then my physical marketing then blinq which is see as digital marketing. After that Amit and the other marketing things."
- Manages multiple marketing channels: Meta Ads (Facebook/Instagram), Google Ads (via Amit in India at $200-250 AUD/month), physical flyer drops, Facebook Marketplace posts
- Needs content pipeline: before/after photos, satisfying cleaning reels, foam shots, wheel cleaning clips
- Wants referral tracking (name-based, no codes): "Refer 3 people get next detail free"
- Subscription model tracking: Monarch Maintenance (fortnightly) and Monarch Executive (weekly)

### 4. Financial Tracking (from Budget Tracking conversation)
- Tracks personal + business expenses via ChatGPT conversation (no dedicated tool)
- Categories: Home/Family (money to mum), Personal, Dating/Relationships, Business, Home Maintenance
- Tracks by: date, amount, purpose/bill type, payment method (cash vs card vs business account)
- Wants to see: monthly totals by category, YTD spending per person/category, annual forecasts, surplus/deficit
- Business financials: ~$8-10k/month revenue, break-even ~35 jobs/month at $200 avg
- Monthly fixed costs: van $1,000 + employee ~$4,600 + fuel/supplies + Jobber $250 + insurance $250
- Wants break-even point calculated and given to Amit as a KPI for bookings
- Key insight: was manually telling ChatGPT every expense and asking for running totals — clearly wants this automated

### 5. Employee/Team Management
- Jack Phillips: full-time detailer on 417 holiday visa, $55k/year
- Needs: onboarding pack (HR forms, TFN declaration, super choice), GPS tracking on van, uniform management
- Wants professional PDF forms with fillable fields and company logo
- Created Monarch Onboarding Pack with cover page, employee details form, offer letter
- Jack takes the van home — needs policy wording for that
- Wants intro scripts for Jack when arriving at customer sites

### 6. Scheduling & Calendar
- Preferred time slots: Morning (7am-10am), Midday (10am-2pm), Afternoon (2pm-6pm)
- Wants calendar view of jobs + non-job tasks
- Flyer drop scheduling: 3 afternoons/week, targeting specific suburbs by house value
- Content filming schedule for Jack

### 7. Territory/Route Management
- Target suburbs tiered by income/house value on Gold Coast
- Jack photographs streets covered during flyer drops for tracking
- Wants suburb-level tracking of which areas have been covered
- GPS tracker in van (contact Aaron for installation)

## File Management System (from File Management conversation)

### Structure (Final Approved — "File Cabinet v2")
```
File Cabinet v2/
  00_Inbox/
  01_Entities & Businesses/
    AMN Holdings (Trust) T-A Monarch Detailing/
      0_Inbox/
      Finance/
        Banking, Compliance & ATO/
          FY2024-25/ (Q1_Jul-Sep, Q2_Oct-Dec, Q3_Jan-Mar, Q4_Apr-Jun)
          FY2025-26/ (same quarters)
        Vendors/ (Autosmart, Wraptism, Bunnings, Repco, Autobarn...)
      Legal/ (Company & Trust, Insurance, Contracts)
      Operations/
      Brand & Marketing/ (Logos, Designs, Social Graphics, Ads, Reports)
      Sales/Customers/<Client>/ (Agreements, Proposals, Briefs, Deliverables)
  02_Properties/
    90 Rumrunner St/ (Legal, Finance, Insurance, Maintenance, Photos)
  03_Vehicles/
    YEAR Make Model (REGO)/ (Registration, Insurance, Finance, Maintenance, Warranties, Wrap & Mods, Photos)
  04_Personal/ (Finance, Insurance, ID & Licences)
  05_Shared/ (Logos)
```

### Key File Management Preferences
- **Platform**: iCloud (Mac-based)
- **Naming convention**: `YYYY-MM-DD - Vendor - Descriptor [INV/RCPT].pdf` for invoices/receipts
- **Vehicle naming**: YEAR Make Model (REGO) e.g. "2010 Lexus GS450h (240MXO)"
- **Quarterly folders** (not monthly — "too many subfolders")
- **Australian fiscal year** (Jul-Jun) for compliance folders
- **Vendors by supplier name**, not by month — keeps it simple
- **AMN Holdings + Monarch combined** (same legal entity, trading as)
- **Inbox system**: drop files in 00_Inbox, run maintenance script weekly/monthly to rename and sort
- **Archive originals** before restructuring — never delete
- **Copies in multiple locations are fine** (shortcuts preferred but iCloud doesn't support them well)
- **Insurance docs**: only save Certificate of Currency + Policy document

### Frustrations with File Management
- Multiple failed attempts at automation scripts (Python/shell scripts that didn't work on macOS)
- ChatGPT-generated scripts kept failing: parse errors, empty CSVs, wrong paths
- Too many subfolders initially (monthly folders for everything) — simplified to quarterly
- Naming conventions were too rigid at first — wanted more human-readable format
- "This is getting frustrating because we have tried so many times"

## UI/Design Preferences (inferred from all conversations)

### General Aesthetic
- **Black background with gold accents** (Monarch brand: black + gold)
- Wants things to look **premium, clean, simple**
- Dislikes clutter: "I just dont like how you have layout and worded the body"
- Prefers **less text, more visual**
- Repeated theme: **simplicity over completeness** — would rather have fewer features that work than many that confuse

### Communication Style in UI
- Short, direct copy — no fluff
- Australian English
- Prices ending in 9s ($169, $189, $349) for psychological pricing
- No time estimates shown to clients (avoids setting expectations)
- Professional but warm — "make it a bit less formal and more personal"

### Forms/Input
- Minimal required fields — only what's actually needed
- Confirmation via message, not separate page
- Mobile-first UX (most customers book on phone)
- "View Packages" button next to "Book Now" in header

## Frustrations with Current Tools

1. **Jobber** ($250/month): can't collect payments natively in Australia, limited automation, no native SMS in AU
2. **ChatGPT as a tracker**: manually reporting every expense in conversation — no persistent state, no visualisation, dates get lost
3. **File management scripts**: repeated failures with macOS shell scripts, ChatGPT couldn't reliably generate working automation
4. **Scattered systems**: Jobber for jobs, Xero for payroll, Square for payments, ChatGPT for expense tracking, iCloud for files — nothing connected
5. **No single view**: has to mentally piece together business health from multiple disconnected tools
6. **Script/code frustration**: "make this easy for me but make sure its accurate because if its easy and not accurate its not actually easy"

## What Mission Control v3 Should Address

Based on all extracted data, Braj needs:

1. **Single dashboard** showing: today's jobs, revenue vs target, ad performance, pending tasks
2. **Financial tracker**: automated expense/income logging with category breakdown, YTD totals, forecasts — replacing the manual ChatGPT conversation
3. **Task board**: assign tasks to employees (Jack) with checklists, track completion, separate from billable jobs
4. **Calendar view**: jobs + tasks + marketing activities in one view
5. **File management integration**: or at minimum, links to the iCloud File Cabinet structure
6. **Marketing tracker**: flyer drop coverage by suburb, ad spend/ROAS, content pipeline status
7. **Employee management**: onboarding docs, GPS tracking status, schedule, performance
8. **Break-even dashboard**: live calculation of jobs needed vs jobs completed, revenue vs fixed costs
9. **Simple, premium UI**: black + gold, minimal, mobile-friendly, no clutter
10. **Automation**: the system should do things for him, not create more work — "imagine I am a one man army running multiple companies"
