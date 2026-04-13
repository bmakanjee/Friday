---
node_type: knowledge
status: active
tier: deep
created: 2026-03-28
updated: 2026-04-06
cap: 200 lines then archive
connected:
  - "[[memory/business-knowledge]]"
---

# Ads history

## What works
- Before/after transformation content — highest engagement on Instagram
- Reels massively outperform static posts (234 likes/18 comments/2840 reach vs 89 likes/654 reach)
- Formula: show disgust then delight, satisfying visuals, ASMR-like audio
- Top performing content: Ferrari 488 Full Detail (312 likes), AMG GT Interior (234 likes), Porsche 911 (189 likes)
- Lead form on website converts better than direct Jobber booking for paid traffic
- Lead form campaign (Apr 4): best day = 3 leads at $5.20 CPL. "MANUS - High Income Ad" generates 100% of leads.
- Apr 13 analysis: MANUS High Income Ad carrying entire lead campaign since Mar 25. 7 leads in last 7 days at $19.37 CPL. Hit 3-day zero-lead dry spell Apr 10-12 ($55 burned) — classic single-creative fatigue. G Wagon reel added Apr 9 but Meta's algorithm starved it ($2.23 total spend). Need 3+ creatives loaded for proper split testing.
- Messages campaign (Apr 9-12): 4 DM conversations at $8.91/each. Conversion unknown — depends on Braj's DM replies.

## What doesn't work (updated Apr 6)
- Direct Booking via Jobber request form: 792 clicks, 0 conversions in 7 days. Ad works, landing page kills it.
- Amit currently getting $20/lead vs $5 target — 4x above benchmark

- Leads have slowed recently (as of 2026-03-28) — needs diagnosis
- Static image posts underperform reels significantly

## Creative insights
- Best hooks: extreme transformations, luxury vehicles, satisfying cleaning processes
- Best formats: Reels (video) >> static images/carousel
- Best CTAs: "Book Now" to /book page, sticky header/footer with "Call Now"
- Content modelled after: @thedetailgeek, @ammodetailing, @staatisfying
- Posting schedule: Reels Mon/Thu/Sat, Stories Tue/Fri, Posts Wed/Sun

## Marketing setup (Amit manages)
- Google Analytics 4, Google Tag Manager, Microsoft Clarity
- Google Search Console, Google Business Profile
- Facebook Page, Instagram Business Account
- Meta Business Manager + Ads Manager + Facebook Pixel via GTM
- Google Ads conversion tracking + remarketing audiences (Google + Meta)

## Top audiences
| Audience | CPL | CTR | CPC | Campaign | Last verified |
|----------|-----|-----|-----|----------|---------------|
| High Income (Golf + Luxury Travel) | $8.11 | 2.08% | $1.16 | C2 - API Test | 2026-03-28 |
| Car Enthusiasts (Porsche/BMW/Merc) | $13.10 | 2.74% | $0.87 | C2 - API Test | 2026-03-28 |
| Homeowners + Property | $15.12 | 2.42% | $1.01 | C2 - API Test | 2026-03-28 |
| Business Owners (Frequent Travelers) | $51.77 | 1.48% | $2.88 | C3 - LG Feb 7 | 2026-03-28 |

## Geo-targeting (researched)
- Tier 1: Mermaid Beach, Broadbeach Waters, Paradise Waters, Sanctuary Cove, Sovereign Islands, Hope Island
- Tier 2: Bonogin, Tallai, Tallebudgera, Reedy Creek, Gilston, Wongawallan

## Audiences to avoid
| Audience | Why | Last tested |
|----------|-----|-------------|
| Amit's Luxury Interest (17 Feb adset) | $87.77 CPL, Advantage Audience ON, broad geo | 2026-03-28 |
| MANUS Optimized ALL Gold Coast | $0 leads, 1.0% CTR, $3.53 CPC — paused | 2026-03-28 |

## Placement performance (verified Mar 31)
| Placement | CPL | Leads | % of Spend | Verdict |
|-----------|-----|-------|-----------|---------|
| Facebook Reels | $18.90 | 6 | 21.6% | BEST — scale |
| Facebook Stories | $12.26 | 1 | 2.3% | Promising — test more |
| Instagram Feed | $34.58 | 2 | 13.1% | Acceptable |
| Facebook Feed | $213.78 | 1 | 40.6% | WORST — restrict |
| Instagram Reels | - | 0 | 9.6% | Zero leads — monitor |
| Instagram Stories | - | 0 | 7.4% | Good traffic (40 LPVs), no leads |

## Demographic performance (verified Mar 31)
| Segment | CPL | Leads | Verdict |
|---------|-----|-------|---------|
| Males 35-44 | $21.51 | 5 | BEST — target aggressively |
| Males 65+ | $28.30 | 1 | Decent but small |
| Females 35-44 | $57.50 | 1 | Expensive |
| Males 45-54 | $57.93 | 2 | Overspending |
| Females 45-54 | $76.57 | 1 | Worst converters |

## Testing log
### Active tests
- [ ] A/B test: Lead form ($20/day) vs Direct booking ($10/day) — rebalanced Apr 5. Direct booking has 792 clicks, 0 bookings after 7 days. Landing page is the bottleneck, not the ad.
- [ ] Diagnose: is Jobber Cloudflare challenge blocking mobile users from booking page?
- [ ] Diagnose: is FB Feed overspend algorithm-driven or targeting-driven?

### Completed tests
- 2026-03-31 | Deep analysis completed: C3 confirmed worst performer, Consolidated Winners best adset, FB Reels best placement, Males 35-44 best demographic
- 2026-04-06 | Direct Booking campaign audit: 792 clicks in 7 days (Mar 30-Apr 5), $103 spend, ZERO bookings. Ad performance is excellent (6.87% CTR, $0.13 CPC) but conversion is broken. Likely causes: (1) Jobber "request" form is a lead form not instant booking - friction kills conversion, (2) Cloudflare challenge may block mobile users, (3) no pricing/branding on landing page. Recommendation: needs Jobber online scheduling (pick date + service) instead of request form, or redirect budget to lead form campaign.
