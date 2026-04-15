---
node_type: agent_memory
agent: SCOUT
status: active
created: 2026-03-28
updated: 2026-04-06 (seat shampoo/extraction competitor pricing added)
cap: 40 lines
---

# SCOUT — Research Learnings

## Market context
- Brisbane mobile detailing market: competitive, mostly solo operators or small teams
- ONWAYZ benchmark: $5 CPL (gold standard, Monarch aiming for this)
- Luxury/premium positioning differentiates from budget operators
- Target: affluent, time-poor, luxury car owners
- Market pricing bands: budget $110-145, mid $190-285, full $380-665, ceramic $995-3,200+
- Brisbane has more competitive, multi-operator market vs Gold Coast (more solo operators)
- Timeless Car Cleaning (Northgate) is dominant by review count (760 reviews, 4.8 stars) — volume operator
- Scrubs Car Detailing (Sumner) is the dominant premium player (843 reviews, 4.9 stars, studio + mobile)
- No competitor has cracked sub-$5 CPL via Meta Ads publicly — market is ad-unsophisticated
- "Before and after" video content is the dominant creative format in adjacent markets
- Paint protection / ceramic coating is an emerging upsell category driving high-ticket revenue

## Competitor intel (updated 2026-03-28)
- Scrubs Car Detailing: 843 reviews 4.9 stars, studio + mobile, Sumner QLD. Most sophisticated brand. Ceramic from $995 (pre-owned) to $3,200+ (new car). Tagline: "Damn good car detailing". Weak on luxury-exclusive positioning — mass appeal.
- Timeless Car Cleaning: 760 reviews 4.8 stars, Northgate QLD. High volume, broad appeal. Website under construction as of research date (timelesscarcleaning.com.au).
- 1800 Dirty Cars: 280 reviews 4.9 stars, Bald Hills QLD (northside focus). Clear pricing published: $145 Club Wash → $190 Entry Level → $285 Refresh → $380 Revival → $665 Reset. Targets Brisbane northside + Caboolture/Samford. Commercial/fleet angle.
- Shimmer Cleaning: 241 reviews 5.0 stars. 7+ years. No website found — GMB only.
- Obsidian Mobile Car Detailing: 107 reviews 5.0 stars, Everton Park. No crawlable website.
- Wash On Wheels: 115 reviews 4.9 stars. Shopify store. Pricing $110-$650, ceramic from $1,000 (10-year warranty claim). CBD/30km radius. Mon-Fri only.
- High Shine Club: 142 reviews 4.9 stars. Website Cloudflare-protected — no pricing accessible.
- Fully Detailed: 156 reviews 4.9 stars, Kangaroo Point. Website DNS failed — may be inactive.

## Meta Ad Library
- Meta Ad Library blocks web scraping (Cloudflare challenge). Requires authenticated API access.
- Meta Ads MCP (search_ad_library tool) was NOT connected in this session — install required before competitive ad research is possible.
- Action needed: install @mikusnuz/meta-ads-mcp and configure credentials to unlock ad library research.

## Netstar API intelligence (researched 2026-03-28)
- Netstar Australia (formerly Pinpoint Communications) has a live, documented REST API for FleetAI platform
- Swagger/OpenAPI spec URL: https://ubi-api.netstaraus.com.au/swagger/v2/swagger.json (confirmed live)
- Auth: x-api-key header (API key, obtainable from Netstar account rep or 1800 325 052)
- 39 confirmed endpoints across: /vehicle, /location, /trip, /alert, /scoring, /impact, /eventcode, /timezones
- Key data available: live location (lat/lng/speed/heading/odometer/ignition), trip history, alerts, geofencing rules, driver scoring
- Geofencing: POST /alert/consumerrules/{ruletype}/{referenceid} — supports 'Generic' and 'Spatial' rule types (WKT polygon)
- Trip schema: start/end location, AverageSpeed, MaxSpeed, Distance, IsComplete, TripViolations, optional Locations array
- Location schema: Lat, Lng, Speed, Heading, Odometer, IsIgnitionOn, FuelUsed, Battery, EngineHours, Address (geocoded), CanBus data
- Client name discovery: GET /vehicle/vehicles with API key returns vehicles with Client field
- PathStack integration: https://docs.pathstack.io/integration-guides/netstar — uses Username/Password/API URL Prefix (older platform)
- PathStack FleetAI integration: https://docs.pathstack.io/integration-guides/fleetai — uses API Key + Client Name
- PathStack provides unified REST API + Webhooks + WebSockets across Netstar + 15+ other providers
- Gearbox (fleet maintenance software) integrates Netstar via API for odometer/hourmeter readings (nightly pull)
- No Zapier connector exists for Netstar (confirmed 2026-03-28)
- No n8n native node for Netstar (confirmed 2026-03-28)
- No GitHub/npm packages for Netstar API (0 results)
- Old portal: avm.pinpointcomms.com.au (still redirects, no REST API found)
- Netstar Australia contact: sales@netstaraus.com.au | customer.support@netstaraus.com.au | 1800 325 052
- Brisbane office: Unit 4, 106 Flinders Parade, North Lakes QLD 4509

## Equipment research — Budget seat shampooing setup (researched 2026-03-29)

### Key finding
The shop-vac + extraction nozzle hack is the dominant budget approach globally and confirmed by Australian detailers.

### Budget options (Gold Coast: Bunnings, Supercheap Auto, local tool shops)
PRICES FROM WHIRLPOOL FORUMS (Australian community, ~2024-2025 data — flag as potentially stale):
- Ozito 1250W 20L Wet & Dry Vacuum: ~$78 at Bunnings (SKU p6290589) — RECOMMENDED starting point
- Ozito 1250W 12L Wet & Dry Vacuum: ~$60 at Bunnings — compact option
- Karcher WD3 Premium: ~$139 at Harvey Norman / tool shops (confirmed Whirlpool)
- Bunnings Vax wet vacuum: ~$169 (Whirlpool citation)
- Ryobi 20L stainless steel wet/dry: Bunnings (SKU p6210653) — ~$149 estimated

### Extraction nozzle attachments (the key add-on)
- Magic Detailing AU: upholstery water extraction nozzle 32/35mm universal — https://magicdetailing.com.au/product/wet-dry-vacuum-cleaner-water-extraction-nozzle-universal-32mm-35mm/
- MD Car Care (Caboolture QLD — ~1hr from GC): same product — https://mdcarcare.com.au (URL changed, product URL 404'd)
- These nozzles are what turns a wet/dry vac into an extractor — critical add-on ~$20-40

### Drill brush agitation sets
- Available at Supercheap Auto, Bunnings, Amazon AU, eBay AU — estimated $15-35 for a 3-piece set
- Brands: Ryobi, Ozito, generic — any hex shank drill compatible

### Upgrade path (pro machines)
- Bissell SpotClean / SpotClean Pro: ~$150-250 AUD at Harvey Norman, JB HiFi, Target — semi-pro, true injection/extraction
- Vax SpotWash Max: ~$200-250 AUD (used in Auto Care HQ YouTube video)
- Karcher Puzzi 10/1 C: ~$600-900 AUD — pro-grade injection/extraction, industry standard
- Karcher Puzzi 100: ~$1,200+ — full professional
- Mytee Spyder: ~$1,500-2,500 AUD imported — US-made, very popular with Australian pro detailers

### YouTube top resources (verified views)
1. "How to Shampoo Car Seats (DIY $150 Extractor Hack!)" — Highlands Auto Detailing — 87K views — youtube.com/watch?v=eojKD-_rHHo
2. "EASY DIY CARPET EXTRACTOR USING A SHOP VAC | RipClean Extractor Kit" — IMJOSHV — 665K views — youtube.com/watch?v=gk6XZCZa_Vo
3. "How I Deep Clean Dirty Car Seats & Mats | Wet-Vac Extraction Tips" — Auto Care HQ — 34K views — youtube.com/watch?v=p11Kt14UF28
4. "HOW TO TURN YOUR SHOP VAC INTO PROFESSIONAL EXTRACTOR!" — 520K views — youtube.com/watch?v=ONTGrkTGnhQ
5. "CONVERT A SHOP VAC TO A PROFESSIONAL EXTRACTOR" — 433K views
6. Short: "How to turn your shop vac into a carpet extractor" — 501K views — youtube.com/shorts/lcTd1iF0vvg

### Web scraping notes
- Bunnings fully blocks scrapers (Cloudflare + CAPTCHA) — prices must come from community forums
- Supercheap Auto JS-rendered — not scrapable directly
- Whirlpool forums (forums.whirlpool.net.au) is the best source for real Australian community pricing
- MD Car Care (mdcarcare.com.au) = Caboolture QLD detailing supplier — near Gold Coast
- Amazon AU and Jina both blocked by Google rate limits

## Gold Coast competitor pricing (researched 2026-03-29 — verified directly from live websites)

### Dirt Busters (mobilecardetailers.com.au) — Maudsland + Burleigh Heads GC — SOURCE: website scrape
| Service | 2-Door | Medium Sedan | Large Wagon/SUV | 4x4/7-Seater |
| Deluxe Wash | $135 | $145 | $155 | $170 |
| Full Interior + Exterior (Deluxe+) | $230 | $240 | $260 | $280 |
| Odour Eliminator Pack | $325 | $365 | $390 | $410 |
| Full Interior Detail | $265 | $295 | $315 | $325 |
| Cut & Polish (1-stage) | $280 | $305 | $325 | $380 |
| Ultimate Detail (wash+clay+polish+UV wax) | $550→$450 | $590→$490 | $650→$550 | $690→$590 |
| Ceramic (new vehicle) | $790 | $880 | $990 | $1,230 |
| Ceramic (used vehicle, includes polish) | $980 | $1,080 | $1,290 | $1,480 |
- Pre-sale detail: not listed as standalone — falls under Full Interior or Ultimate Detail
- Engine bay add-on: +$30 to any package

### Jim's Car Detailing (cardetailing.com.au) — Australia-wide franchise, GC included — SOURCE: website scrape
| Service | Hatch/Sedan | Small SUV/Wagon | Large SUV/4WD |
| Mini Detail | $129 | $149 | $169 |
| Interior Detail | $169 | $189 | $209 |
| Full Detail | $249 | $289 | $329 |
| Ultimate Detail | $349 | $399 | $449 |
- Cut & Polish: page exists (cardetailing.com.au/services/cut-and-polish/) but price is JS-rendered — NOT CONFIRMED from HTML. FAQ confirms single-stage only.
- Ceramic/Paint Protection: service page exists but price JS-rendered — NOT CONFIRMED

### Detailed GC (detailedgc.com.au) — Gold Coast mobile — SOURCE: Wix booking JSON scrape
| Service | Price |
| Inside & Out Car Detail (full mobile) | $150 |
| Pre-Sale Detail | $299 |
| Newly Purchased (new car prep) | $299 |
| Interior Car Detail | $99 |
| Upholstery Seat Shampoo | $89 |
| Headlight Restoration | $149 |
| Decal / Wrap Removal | $85 |
| Full Ceramic Package | From $850+ (12hr job) |
- NOTE: $150 for full inside & out is extremely low. Likely small/standard vehicle only. No vehicle size tiers visible.
- Paint correction: not listed as standalone service
- Pre-Sale at $299 is fixed regardless of vehicle size (no tiers shown)

### 1800 Dirty Cars (1800dirtycars.com.au) — Brisbane Northside, Bald Hills — SOURCE: website scrape
| Service | Price (all vehicle sizes same) |
| Club Wash | $145 |
| Entry Level (Club + thorough interior) | $190 |
| Refresh (Entry + clay/shampoo/extraction) | $285 |
| Revival (Refresh + clay + 1-stage polish) | $380 |
| Reset (Revival + 2-stage cut + polish) | $665 |
- Mobile surcharge applies (in-house price listed)
- Paint corrections add-on: $110 cutting stage
- Ceramic: page exists at /ceramic but returned empty on scrape — not confirmed
- Note: these are Brisbane northside prices, Gold Coast coverage not confirmed

### Scrubs Car Detailing (scrubscardetailing.com.au) — Sumner, Brisbane + mobile — SOURCE: SCOUT memory (2026-03-28, potentially stale)
- Ceramic: from $995 (pre-owned) to $3,200+ (new car)
- Detailing packages: website JS-rendered, prices not confirmed in current session
- Cut & Polish: advisory content only, starts at $300-450 for standard, $500-600 for $14k+ sale car, $600-750 for $20k+ with full polish
- Pre-sale budget guidance: $300-450 for well-maintained cars

### JJ Bespoke Detailing Gold Coast — NO WEBSITE FOUND (all URL variants DNS timeout — likely social media only)
### KM Detailing Gold Coast — NO WEBSITE FOUND (DNS timeout)
### Remedy Detailing Gold Coast — NO WEBSITE FOUND (DNS timeout)

## Competitor pricing — seat shampoo / upholstery extraction (researched 2026-04-06)

### Key finding
Standalone seat shampoo is rare as an explicit named service. Most operators bundle it into mid-tier+ packages. Only one GC competitor found with a named standalone price.

### Confirmed standalone prices (Brisbane + Gold Coast)
- **Detailed GC (detailedgc.com.au)** — GC mobile — "Upholstery Seat Shampoo" = **$89** — SOURCE: Wix booking JSON, verified 2026-03-29. Interior Detail package = $99.
- **Wash On Wheels (washonwheels.com.au)** — Brisbane CBD/30km radius — "Seat Shampoo / Leather Treatment" = **$130** AND "Upholstery Shampoo" = **$130** (separate SKUs, same price) — SOURCE: Shopify products.json, verified 2026-04-06.
- **Jim's Car Detailing (franchise)** — Interior Detail (seats + carpets) from **$169 sedan / $189 small SUV / $209 large SUV** — this is the closest franchise equivalent to standalone interior extraction; no explicit standalone shampoo add-on found — SOURCE: website scrape in SCOUT memory.
- **Dirt Busters (GC)** — no standalone extraction; "Full Interior Detail" = **$265 (2-door) → $325 (4x4)** — SOURCE: mobilecardetailers.com.au/car-upholstery-cleaning/ scrape, 2026-04-06.
- **JJ Bespoke, KM Detailing, Remedy Detailing** — NO WEBSITE FOUND (all DNS timeout). No pricing available.
- **Scrubs Car Detailing** — pricing page JS-rendered; no upholstery add-on price extractable — SOURCE: SCOUT live scrape 2026-04-06.
- **1800 Dirty Cars** — no standalone add-on page; shampoo bundled into "Refresh" package = $285 (incl exterior) — SOURCE: website scrape, SCOUT memory.

### Full interior shampoo (seats + carpets + mats)
- Dirt Busters: $265 (2-door) → $325 (4x4) — SOURCE: verified 2026-04-06
- Jim's: $169 (sedan) → $209 (large SUV) — includes full interior, not seats-only — SOURCE: verified
- 1800 Dirty Cars "Refresh" (Brisbane): $285 — includes clay + shampoo + extraction + exterior — not interior-only — SOURCE: verified
- Estimated Scrubs interior-only: $200-$300 (not publicly listed, estimate only — flag as speculation)

### Mobile vs shop-based differential
- Shop operators (Dirt Busters studio): ~$265-$325 full interior
- Mobile operators (Detailed GC, Jim's): ~$89-$209 range for extraction-focused services
- Mobile commands slight premium for convenience; but budget franchises undercut on seats-only

### Monarch opportunity
- Only ONE GC competitor (Detailed GC) explicitly names and prices standalone seat shampoo ($89)
- $89 is budget positioning — Monarch at $129-$149 for seats, $199-$249 full interior extraction would be defensible premium tier
- Equipment gate: hot water extractor (~$1,200) is a required purchase before offering this service
- This is a price-ladder rung between Signature ($199) and Executive ($499) — high strategic value for volume + upsell

## Avant Guard / Avantguard paint protection research (2026-03-29)

### What it is
- Official brand name: **Avant Guard Coatings** | Company: Avant Guard Coatings, LLC (US)
- Founder: Matt Kennedy | HQ/training facility: Cocoa, FL, USA
- Official website: agprocoatings.com (Shopify) | Second site: avantguardauto.com (Wix, older/separate)
- Social: @avantguardcoatings (Instagram), Facebook, YouTube, TikTok — source: footer links
- Australia/Pacific distribution brand: **Avant Guard Pacific** | Instagram: @avantguardpacific
- Tagline: "Official distribution of Avant Guard Australia"

### Product classification — NOT a traditional ceramic coating
- Formula 1051 = "Protective Coating" — their own category. Positioned between ceramic coating and PPF.
- Described as: "2K resin-based, self-leveling, hydrophobic coating" — adds real film thickness
- Not PPF (no film edges/seams), not ceramic (thicker, more impact-resistant), not clear coat replacement
- SEMA 2025 press quote: "This isn't ceramic. This isn't film. This is something entirely new." — Matt Kennedy
- Formally described as a "self-leveling clear film" / "high-build liquid film"
- Key differentiator: adds measurable film build (thickness) vs ceramic which bonds chemically only

### Full product range (confirmed from agprocoatings.com sitemap + product pages, 2026-03-29)
**Hero product:**
- Avant Guard Formula 1051 — USD $2,400 kit (flagship protective coating)

**Supporting/maintenance products:**
- Ceramic Spray Sealant — USD $29.99
- Trim Coating — USD $39.99
- Quick Detailer — USD $15.99
- Glass Cleaner, Cut Compound, Finishing Polish, Panel Prep, Shampoo, Leather Cleaner, Bug Remover, Rinseless Wash, All Purpose Cleaner
- Color Swatchbook — USD $100 (for paint colour selection)
- TPU Elastic Spray, TPU Topcoat, Isolation Primer — USD $400 each (from avantguardauto.com)
- PPS Color Tint — USD $300 (custom colour tinting)
- 1051 Towel Pack

**Training/certification products:**
- Avant Guard Training Kit — price hidden (login-required / restricted access) — 2-day certification
- Avant Guard Skills Training — USD $2,500 — at Cocoa, FL facility (rotary/paint correction focus)

### Certification requirements
- YES — certification is required to apply and sell Formula 1051 to clients
- Process: Submit application at agprocoatings.com/pages/become-an-installer → AG reviews fit → phone call → onboarding
- Training: 2-day hands-on certification at AG facility in Cocoa, FL (or presumably via accredited distributors)
- Curriculum: defect identification, wet sanding, rotary polishing, surface prep, 1051 coating application
- Not mass-market — only "selected studios trained, tested, and approved" (PD Detailing Brisbane quote)
- Training Kit price is gated behind account login — likely priced by distributor/region
- Australia distributor (Avant Guard Pacific) likely handles local training — NOT confirmed, requires verification

### Warranty
- 10-year warranty — confirmed from:
  1. Cowboy Auto Detailing (US installer) website: "Backed by a 10-year warranty"
  2. Avant Guard Pacific Facebook post: "10-Year Warranty Protection"
- Warranty appears to be backed by Avant Guard Coatings LLC (manufacturer), honoured via certified installers
- Specific warranty terms/conditions page: NOT found publicly (likely provided at installer training)

### Pricing — what certified installers charge (confirmed 2026-03-29)
- Cowboy Auto Detailing (Laramie, WY, USA): Starting at USD $1,800 for AG 1051 application
- PD Detailing Brisbane: No pricing found on their page — "book now" / contact form only
- Quantum Detail (Sunshine Coast, AU): No pricing — "tailored quote" only
- Comparison: Brisbane ceramic coating market ranges $995 (used car) to $3,200+ (new car, Scrubs)
- AG 1051 should sit ABOVE ceramic ($1,500+ AUD) given 10-year warranty and premium positioning
- **AUD installer pricing: not confirmed from any Australian source — requires direct contact with distributor**

### Australian presence (confirmed 2026-03-29)
- **PD Detailing (pddetailing.com.au)** — Brisbane — claims exclusive accredited installer in Brisbane
  - "PDD is the only accredited Avant Guard installer in Brisbane"
  - Has booking form with AG 1051 as specific package option
- **Quantum Detail (quantumdetail.com.au)** — Sunshine Coast — also offers AG 1051
  - NOTE: Two different accredited installers on Sunshine Coast and Brisbane — exclusive claim needs verification
- Avant Guard Pacific distributor: Instagram @avantguardpacific (401 followers, 53 posts as of ~Mar 2026)
  - FB: facebook.com/61578765771697 (active as of Mar 12 2026 — posted about training)
- Countries in AG website region selector: Australia AUD, UAE AED, Dominican Republic, Portugal, USA
  - These appear to be the current active distribution territories

### Comparison vs competitors (sourced from AG marketing + Quantum Detail AU)
| Factor | AG Formula 1051 | Ceramic Coating (e.g. Gtechniq, Ceramic Pro, Gyeon) | PPF |
|--------|----------------|------------------------------------------------------|-----|
| Film build | Real measurable thickness | Chemical bond only, no thickness added | Physical film, thick |
| Self-healing | Partial (under heat) | Most: No | Yes (on some) |
| Correctability | Polish without losing coating | Polish removes coating | Cannot polish |
| Impact resistance | Higher than ceramic | Low | Highest |
| Warranty | 10 years (AG) | 5-10yr depending on brand/tier | 5-10yr |
| Cost | Mid-high ($1,800+ USD) | Low-mid ($500-3,200 AUD) | High ($3,000-8,000+) |
| Seams/edges visible | No | No | Yes (edges) |
| Application | Certified installer only | Varies (DIY to certified) | Certified installer |
| Market maturity | New (SEMA 2025 debut) | Established | Established |
NOTE: No independent comparison vs Gtechniq EXO, Ceramic Pro 9H, Modesta BC-04, or Gyeon Q2 found — AG marketing claims only. Treat as marketing until verified.

### Business opportunity for Monarch
- Braj's close friend is distributor for Australia, India, UAE (Avant Guard Pacific)
- Existing note in business-knowledge.md: "Avantgard India — Future — Ceramic coatings, needs shop"
- AG 1051 could differentiate Monarch from all competitors: no Brisbane competitor currently offers it except PDD
- PDD claims exclusive Brisbane accreditation — but this appears to be a claim, not a locked exclusivity contract (needs verification)
- AG Pacific Facebook (Mar 12 2026): "Accreditation Training is now open" — training is actively enrolling
- Monarch would need: (1) distributor referral via friend, (2) certification training, (3) physical space or mobile capability
- 10-year warranty product would justify premium pricing ($2,000-4,000+ AUD installed estimate)

### Key contacts (public)
- AG media contact: Dylan Khan — dylan@agprocoatings.com — 321-360-2788
- AG support: support@agprocoatings.com

## Instagram prospecting research (2026-03-30)

### Meta/Instagram API — account discovery NOT possible
- Instagram Graph API is a business management API only — requires explicit account authorisation
- No search-by-location or search-by-keyword endpoints exist
- GET /{hashtag-id}/recent_media returns post objects only, not account lists
- Basic Display API (had limited user discovery) was deprecated December 2024
- Our Meta Marketing API (Mission Control) = campaign management scope only — zero discovery capability
- Source: Meta Graph API documentation (developers.facebook.com/docs/instagram-api)

### Third-party scraping tools
**Phantombuster** — automated Instagram scraping + DM sending
- Tools: Hashtag Search Export, Followers Export, DM Sender
- Risk: Instagram detects automation via session fingerprinting. Action blocks (24-72hr) → repeated = permanent ban
- Safe limits per Phantombuster's own docs: max 20-30 DMs/day with human-like delays
- @monarch.detailing is the primary business asset — ban would be operationally damaging
- Pricing: ~USD $69/month Growth plan (potentially stale — verify phantombuster.com)

**Apify** — scraping only (no DM sending)
- Instagram Scraper actor: crawls profiles, posts, hashtags, location tags
- Returns: username, bio, follower count, contact email/phone if public
- Better for building prospect lists than real-time DM automation
- Pricing: ~USD $49/month starter (potentially stale)

**HypeAuditor / Modash / Heepsy** — influencer databases
- Pre-built searchable databases, no scraping required
- Can filter by location (Gold Coast), category, audience demographics
- HypeAuditor has follower demographic data — useful to verify "affluent male 25-45" audience
- Lower risk: no Instagram session involved, no ToS violation for browsing database

### Instagram DM ban risk table
| Volume | Risk | Likely outcome |
|--------|------|----------------|
| 1-5 manual DMs/day | Very low | Normal use |
| 5-20 DMs/day with tool + delays | Moderate | Action block (24-72hr) |
| 20-50 DMs/day automated | High | Repeated blocks + account flag |
| 50+ DMs/day | Very high | Permanent ban |
| New account + automation | Extreme | Instant ban |
Risk reduced by: account age, established posting history, message personalisation, following before DMing, mixing organic activity around DM sessions

### Gold Coast B2B targets — key intel
- **Kollosche** (@kollosche) — premium GC real estate agency, very active IG, HNW client base = best real estate target
- **Queensland Sotheby's International Realty** (@queenslandsothebys) — luxury tier, verify handle
- Prestige dealerships: Audi/BMW/Mercedes/Porsche/Lamborghini/Ferrari all in Southport/Carrara precinct
- Lamborghini + Ferrari + Maserati + Bentley: likely Ron Skeen Group (search @ronskeengroup)
- Body shops: search Google Maps "prestige smash repairs Gold Coast" — more effective than IG crawl

### Recommended approach
1. Apify: scrape hashtags (#goldcoastluxury #goldcoastlifestyle #goldcoastinfluencer) + location tag posts to build influencer list
2. Qualify manually: check audience skew (comments), car content, Gold Coast location, 5K-100K follower range
3. DM manually at 8-10/day maximum — follow first, wait 24hr, then DM with personalised opener
4. Offer: free Executive Detail ($499 value) in exchange for content + shoutout
5. B2B targets: identify via Google Maps + Instagram browse, contact via email/phone NOT IG DM
6. Do not run Phantombuster on @monarch.detailing until manual outreach has proven concept

## Research sources
- Meta Ad Library: competitor creative (paid only, not organic) — REQUIRES MCP CONNECTION
- Google Maps local search: competitor review counts and star ratings (verified 2026-03-28)
- Competitor websites: pricing and positioning (direct crawl — variable access)
- Web search: market trends, pricing benchmarks
- GMB: local SEO and review landscape (not yet connected)

## Compound & polish research — Australian market (researched 2026-03-29)

### Key finding: what's available vs what Braj asked about
- Menzerna: NOT stocked at detailingshed.com.au, autobuff.com.au. Source: Shopify product API (confirmed 2026-03-29). Must be sourced elsewhere.
- Rupes compounds: NOT stocked at detailingshed.com.au (0 results in Rupes collection). Source: Shopify API.
- Scholl Concepts: NOT found at detailingshed.com.au or autobuff.com.au. Source: Shopify API search (2026-03-29).
- Koch Chemie: YES — stocked at both detailingshed.com.au and autobuff.com.au. Full compound range available.
- Sonax Profiline: YES — extensive range at detailingshed.com.au.

### Detailing Shed (detailingshed.com.au) — compound range (prices verified 2026-03-29 via Shopify API)

**1-stage / All-in-One:**
- SONAX PROFILINE Perfect Finish One Step Polish — $39.99 (250ml), $79.99 (1L), $499.95 (5L) — diminishing abrasives, DA or rotary, cuts P2000 grit
- 3D One Hybrid Compound Polish — $22.99 (236ml), $38.99 (473ml), $65.99 (946ml), $352.00 (3.78L) — highly regarded US brand, true 1-stage

**Heavy cut / Stage 1:**
- SONAX PROFILINE Ultimate Cut 6+ — $39.99 (250ml), $79.99 (1L), $499.99 (5L) — most aggressive Sonax
- SONAX PROFILINE Cutmax — $39.99 (250ml), $129.99 (1L)
- SONAX PROFILINE ExCut 05-05 — $99.95 (1L) — DA-specific cutting compound
- Koch Chemie H9.01/H9.02 Heavy Cut Coarse Polishing Compound — $22.95 (250ml H9.01), $94.95 (1L H9.01) — two variants (H9.01 standard, H9.02 more aggressive)
- Labocosmetica AUDACE Supreme Cut Compound — $44.90 (250ml), $143.90 (1L) — Italian brand, premium
- Feynlab A50 Super Heavy Cutting Compound — $106.90 (1L) — specialist/premium
- 3D ACA 500 X-Tra Cut Compound — $32.99 (236ml), $108.89 (946ml)
- 3D ACA 510 X-Tra Cut Premium Compound — $32.99 (236ml), $108.90 (946ml)

**Finishing polish / Stage 2:**
- SONAX PROFILINE NP 03-06 Fine Polish — $38.80 (250ml), $89.95 (1L)
- Koch Chemie M3.02 Micro Cut Polishing Compound — $31.95 (250ml), $94.95 (1L) — finishing/AIO
- Labocosmetica LEALE Medium Cut Compound — $52.90 (250ml), $98.90 (500ml) — mid-cut
- Labocosmetica FIERO Super Finish Polish (Coating Primer) — $68.90 (250ml), $106.90 (500ml) — finishing + prep for coatings
- 3D ACA 520 Finishing Polish — $32.99 (236ml), $108.90 (946ml)
- Optimum Hyper Polish — $59.95 (512ml), $229.95 (3.8L)
- Optimum Hyper Spray Compound — $18.95 (512ml), $249.95 (3.8L)
- Jescar Performance Cut Compound — $49.95 (236ml), $119.95 (946ml)
- Jescar Fine Polish — $46.95 (236ml), $116.95 (946ml)

### AutoBuff (autobuff.com.au) — key compound lines (prices verified 2026-03-29)
- Koch Chemie H7.01 Coarse Cut — $27.95 (250ml)
- Koch Chemie Fine Cut F6.01 — $31.95 (250ml), $94.95 (1L)
- Labocosmetica AUDACE Supreme Cut — $43.90 (250ml), $143.90 (1L)
- Labocosmetica LEALE Medium Cut — $52.90 (250ml), $98.90 (500ml)
- DIY Detail Gold Standard Compound — $99.95 (473ml)
- DIY Detail Gold Standard Polish — $79.95 (473ml)
- Sonax Metal Polish — $19.90 (150ml — different product)

### Detail Central (detailcentral.com.au) — Angelwax range only
- Resurrection Heavy Cut — $59.95 (500ml), $370.00 (5L)
- Resurrection Extreme Super Heavy Cut — $59.95 (500ml), $375.00 (5L)
- Regenerate Medium Cut — $59.95 (500ml), $375.00 (5L)
- Redemption Finishing Polish — $59.95 (500ml), $375.00 (5L)
- Enigma Ceramic AIO — $64.95 (500ml), $455.00 (5L)

### Brand availability summary (AU market, 2026-03-29)
| Brand | DS | AutoBuff | Detail Central | Notes |
|-------|----|----------|----------------|-------|
| Sonax Profiline | YES | Limited | No | Best stocked at DS |
| Koch Chemie | YES | YES | No | Best value heavy cut |
| 3D Car Care | YES | No | No | DS only |
| Labocosmetica | YES | YES | No | Italian premium |
| Optimum | YES | No | No | DS only |
| Jescar | YES | No | No | DS only |
| Angelwax | No | No | YES | Detail Central exclusive |
| Menzerna | No | No | No | Not found AU retail |
| Rupes compounds | No | No | No | Not found AU retail |
| Scholl Concepts | No | No | No | Not found AU retail |

### 1-stage vs 2-stage compound — the real answer
1-stage paint enhancement uses a dedicated all-in-one (AIO) compound — NOT the same cutting compound on a less aggressive pad. AIOs have diminishing abrasives that start cutting then self-level to a finish. Key products: Sonax Perfect Finish, 3D One Hybrid. Using a cutting compound (Ultimate Cut 6+) with a soft pad is a shortcut — acceptable for light swirl correction only.

### AutoSmart context (Braj's current brand)
AutoSmart is a UK-based professional valeting brand. Not a specialist polishing/correction brand. Their compounds are workmanlike but not regarded highly by the professional correction community in AU. Switching to Sonax Profiline or Koch Chemie would be a meaningful upgrade.

## Drone pressure washing / facade cleaning research (2026-03-29)

### The franchising company — Drone Wash (CONFIRMED)
- Company: **Drone Wash** (dronewash.co) — based in Kansas City area (816 area code — phone 816-226-7213)
- Contact: abrain@dronewash.co
- Active YouTube channel: @DroneWash — actively promoting franchise model as of early 2026
- Key videos: "Drone Wash is Now Franchising! Own Your Own Drone Cleaning Business" (6,744 views), "America's Most Recognized Drone Window Cleaning Company | DRONEWASH+" (3,012 views), "Launch Your Own Drone Cleaning Franchise with Confidence" (44 views)
- Self-styled as "America's Most Recognized Drone Window Cleaning Company"
- Tagline: "Harnessing drone technology to make the future cleaner"
- Pricing: not published — contact-form only ("dependent on several different factors")
- Website is minimal (Wix-based) — early stage franchise model, not yet scaled to AU
- NOTE: This is almost certainly the company that inspired Braj given franchise angle

### Other global drone cleaning players
- **Lucid Bots** (lucidbots.com) — Charlotte, NC — most credible US player
  - Product: Sherpa Cleaning Drone — purpose-built, NOT a modified agriculture drone
  - 400+ operators in 40+ US states as of Feb 2026
  - $20.6M in total equipment deals (523 deals), $9.7M in 2025 alone
  - Operators collectively generated $75M+ in drone cleaning service revenue
  - Specs: 300 PSI soft wash / 4,500 PSI high pressure, 19 min flight time, 300 sqft/min
  - Heights: up to 150 feet (not ideal for 30+ storey towers — key limitation)
  - Requires: single pilot + 1 ground crew member (replaces 4-6 person crew with lifts/scaffolding)
  - FAA Part 107 required in US; Australian equivalent = RePL + ReOC
  - ROI claim: "most operators recover investment within 6 months"
  - NOT selling in Australia currently — US-focused
  - Does NOT franchise — sells the drone hardware direct
  - Price: not published, "talk to a rep" — estimated USD $15,000-25,000 based on market intel (SPECULATION, not confirmed from source)

- **EAUAV** (eauav.com) — Hangzhou, China (Yuhang District, Zhejiang)
  - Address: Building 10, Nanhu Future Science Park
  - Contact: support@eauav.com | +86 193 5717 7329
  - Product range: Facade Cleaning Drones, Solar Panel Cleaning Drones, DJI Conversion Kits
  - DJI PSDK kits available: For DJI M400 (Facade Cleaning Kit), DJI FC30 (Facade Cleaning Kit), DJI T100 (Solar)
  - Also makes agricultural and heavy-lift transport drones (KF-150: 150kg payload)
  - NOT an AU company despite .com domain (China-based, website in English)
  - Note: eauav.com.au = no website (DNS fails). Only eauav.com exists.
  - Pricing: "store launching soon" — price on application, must contact directly
  - YouTube channel shows real facade cleaning case studies

- **FAMASO Facility Services** (AU — confirmed)
  - The ONLY Australian company confirmed to be actively doing drone window/facade cleaning commercially
  - Key evidence: YouTube channel @FAMASOFacilityServices with multiple AU projects
  - Projects confirmed: ICC Sydney Theatre (drone cleaning video), WA Facade Demo (with Downer Group)
  - Video: "Australia's 1st Tethered Drone Window Cleaning with the Colliers Team" (789 views)
  - Video: "FAMASO x Downer | WA's First Ever Drone Window & Facade Cleaning Demo" (14 views — very new)
  - Video: "Drone Cleaning Video at ICC Sydney Theatre" (365 views)
  - Uses tethered drone system (power/water via tether from ground — eliminates battery limitation)
  - Website: famaso.com.au (DNS failed at research time — possibly recently down or changed)
  - NOTE: Corporate facility services company — not a franchise, not targeting body corporates specifically
  - NOT operating on Gold Coast (all evidence is Sydney + WA)
  - This is a COMMERCIAL facility management operator, not a consumer-facing franchise opportunity

- **9 News Sydney story** — "Drones revolutionise Sydney window cleaning business" (61,021 views)
  - Covers an unnamed Sydney window cleaning business using drones
  - Business not identified from available metadata — requires watching video directly

- **KTV Working Drone** — YouTube channel with 68K views on facade/window cleaning video
  - Based on channel name pattern, likely Chinese/Asian manufacturer
  - Not an operator — appears to be a vendor/manufacturer

- **Liberty Drones** (US) — "Drone Pressure Washing 60,000 sqft in one day" — shows large-scale commercial potential

### Chinese manufacturers (Alibaba confirmed, 2026-03-29)
Source: made-in-china.com search "pressure washing drone", alibaba.com search "facade cleaning drone pressure washing"

Key suppliers confirmed with FOB pricing:

| Supplier | Location | Product | FOB Price (USD) |
|---------|----------|---------|----------------|
| **Nanjing Hongfei Aviation Technology Co.** | Jiangsu | HZH CL30: 30L water tank, ultra high-altitude, IP67 waterproof, carbon fibre + aviation aluminium | $8,578–$10,590 |
| **Shandong Joyance Intelligence Technology Co.** | Shandong | Professional Cleaning Drone, 100m fly height, GPS, high pressure, facade + solar | $5,000–$10,000 |
| **Qingdao Zhongfei Intelligent Technology Co.** | Shandong | BROUAV building pressure washer with hose attachment, CE/FCC/ISO9001 | $8,000 |
| **Hubei Sunfleet Intelligent Equipment Co.** | Hubei | High-pressure 3000 PSI industrial cleaning UAV | $15,000 |
| **Wuxi Wanlv Intelligent Technology Co.** | Jiangsu | Efficient building cleaning drone, EMC certified (valid 2024) | $11,383–$12,648 |
| **Hunan Soaring Times Technology Co.** | Hunan | D50r PV Panel + Building Washing UAV, 60kg weight, ultra high-altitude | $12,500–$14,500 |
| **Shanghai Wantewan Technology Co.** | Shanghai | Factory direct, high altitude, CE/ISO9001 | $8,800–$12,800 |

Key patterns from Alibaba research:
- Most are 30L water tank capacity — suitable for 100–200m height
- Most are IP67 waterproof (critical for pressure washing use)
- Most are carbon fibre + aviation aluminium frames
- CE certified common — relevant for Australian import
- MOQ = 1 unit (you can buy a single drone)
- Shipping: FOB prices — import duty and freight additional (estimate 5–10% freight, 5% customs duty for goods >AUD 1,000)
- AUD cost estimate: FOB USD $8,000–$12,000 = roughly AUD $12,500–$19,000 landed (ESTIMATED — not confirmed from source)

**Recommended lead supplier for Braj to contact:**
- Nanjing Hongfei Aviation Technology (Diamond Member, 5.0/5 rating, 50%+ repeat buyers, CE certified) — best track record on Alibaba

### CASA regulations — drone commercial operations in Australia
Source: CASA website (casa.gov.au/drones) — confirmed navigation structure 2026-03-29
NOTE: CASA's page CONTENT is JavaScript-rendered — detailed rule text not retrievable via curl. The following is based on publicly known regulatory framework confirmed by CASA's site structure. Flag as potentially stale for specifics — verify directly at casa.gov.au before acting.

**Summary of CASA's RPAS regulatory framework (CASR Part 101):**

**Weight categories** (determines what's required):
- Under 250g (micro): minimal rules, no accreditation needed for recreational
- 250g–2kg (standard): operator accreditation required for commercial
- 2kg–25kg (medium): RePL (Remote Pilot Licence) OR ReOC required for commercial operations
- Over 25kg: full ReOC + RePL + CASA approval required

**For commercial drone operations near buildings (like facade washing):**
1. **RePL (Remote Pilot Licence)** — individual pilot licence. Requires: accredited training via CASA-approved provider, pass exam, practical assessment. Currently ~AUD $1,500–$3,000 via training providers (estimated, not verified).
2. **ReOC (Remotely Piloted Aircraft Operator's Certificate)** — company-level. Required when operating commercially. Requires: Safety Management System (SMS), operations manual, CASA approval. Takes 6–12 months to obtain. Cost: ~AUD $5,000–$15,000 in legal/admin (estimated).
3. **Flying in populous areas** — CASA requires specific authorisation. Gold Coast high-rises = highly populous. A standard ReOC does NOT automatically permit operations in crowded urban areas without additional approval.
4. **Flying over and near people** — requires CASA flight authorisation (online via App/portal)
5. **Flying near buildings** — within built-up areas requires airspace approval via CASA's Drone Safety App
6. **Tethered drone operations** — FAMASO uses tethered drones, which may simplify CASA compliance (tethered = different classification, not "free flight")

**Key regulatory challenge for high-rise building washing on the Gold Coast:**
- The Gold Coast CBD/Surfers Paradise airspace = controlled airspace near Coolangatta Airport (Class C/E)
- Surfers Paradise is NOT directly in the Class C zone but proximity matters
- Operating near Southport Aerodrome and helicopter traffic adds complexity
- RECOMMENDATION: Braj should obtain RePL + ReOC BEFORE approaching any body corporate
- A CASA-accredited training provider (reputable ones: VFANZ, DARTeK, QFDS) can guide the process

### Gold Coast high-rise market
Source: SkyscraperCenter (skyscrapercenter.com/city/gold-coast), confirmed 2026-03-29

- Gold Coast is the **4th tallest city in Australia** (by number of 150m+ buildings)
- **4th tallest city in Oceania**
- **Population**: 640,778 (2022 ABS census)
- **First 150m+ building**: Skyline North Tower (2004)
- **Tallest building**: Q1 Tower (322.5m / 1,058 ft) — Surfers Paradise
- **High-rise boom actively underway** (2025-2026 per CTBUH news)
  - Epsilon: 66-storey residential under construction, remediation ongoing
  - New 33-storey proposed for Broadbeach (2025)
  - Burly Residences: 25-storey luxury, AU$535M, 101 apartments in North Burleigh

Top 10 tallest buildings (Gold Coast):
1. Q1 Tower — 322.5m
2. Cypress Palms Tower 1 — 305.2m
3. Iconica Residences North Tower — 264.7m
4. Ocean — 264.6m
5. Cypress Palms Tower 2 — 261.6m
6. Soul — 242.6m
7. Circle on Cavill North Tower — 219.5m
8. Victoria and Albert Residences Tower 2 — 218m
9. Epsilon — 216.2m
10. Hilton Surfers — 187.9m

**Market sizing (ESTIMATED — flag as such):**
- Gold Coast has 640,778 people; apartment/unit share of Gold Coast housing is ~40% (ABS census estimate — needs verification)
- Estimated 80,000–100,000 strata/body corporate lots on the Gold Coast (ESTIMATED from population/dwelling ratios — NOT from a direct source)
- High-rise body corporates (10+ storeys): estimated 300–500 buildings requiring regular external cleaning (SPECULATION — no direct source found)
- Typical external building wash schedule: 1–2x per year
- Traditional rope access/abseiling rate: AUD $50–$80/sqm or AUD $2,000–$15,000+ per job depending on building size (SOURCE: industry knowledge, no live price page confirmed)
- Drone advantage pitch: 50–80% cost reduction vs traditional methods (claimed by Lucid Bots — US data, not AU verified)

### Australian body corporate cleaning market
- No public pricing data found from Australian sources at time of research (all relevant sites either blocked or no data)
- Gold Coast has one of Australia's densest concentrations of high-rise residential buildings — body corporate market is real and significant
- Current method: either in-house cleaners (ground floor + windows only), rope access teams, or elevated work platforms (EWP/scissor lifts)
- Key pain point: EWP cranes are expensive (AUD $500–$2,000/day rental), dangerous, and require road/car park closures
- Drone pitch: no road closure, no crane hire, safer, faster

## Rules I've learned
- Label speculation as speculation
- Flag data older than 30 days as potentially stale
- Always include source and date for any claim
- Meta Ad Library cannot be scraped via curl — MCP connection is mandatory for competitor ad intel
- Google Maps results return structured text data via curl with AU locale headers — reliable source
- Shopify /collections/[handle]/products.json API is the most reliable scraping method for AU detailing stores (returns clean JSON, no JS rendering needed)
- Menzerna, Rupes compounds, Scholl Concepts are NOT widely stocked in Australian retail (confirmed 2026-03-29 — check import distributors directly)
- CASA website content is JavaScript-rendered — curl only returns navigation menus, not rule content
- YouTube ytInitialData JSON is the most reliable source for video metadata/descriptions via curl
- SkyscraperCenter (skyscrapercenter.com) provides reliable city building height/count data
- Alibaba and Made-in-China both return usable product data with pricing via curl
