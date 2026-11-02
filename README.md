# LH Bank Website Revamp 2027 — Interactive Prototype

UX/UI prototype for the bid presentation (deadline 10 Nov 2026).
Design direction: **Modern Wealth Lifestyle**. It's a static site (HTML/CSS/vanilla JS) with no build step.

## Run locally

```bash
python3 -m http.server 8080
```

Open http://localhost:8080. It redirects to `/personal/`, which is the site's start page. The site has no separate root homepage.

## Pages (7 + variants)

| Priority | Page | Path |
|---|---|---|
| P0 | 1. Personal Landing | `/personal/` |
| P0 | 2. Product Listing | `/personal/products/?cat=home-loan` (`deposit`, `personal-loan`, `card`, `sme`, `business`) |
| P0 | 3. Product Detail | `/personal/product/?id=saen-sabai` (works for every product id) |
| P0 | 4. Loan Calculator | `/personal/calculator/home-loan/` (`?mode=afford`) |
| P1 | 5. Investment Landing | `/personal/investments/` |
| P1 | 6. Branch Locator | `/branch-locations/` (`?type=sme`) |
| P1 | 7. Exchange Rates | `/exchange-rates/` |
| Variant | SME / Business Landing | `/sme/`, `/business/` |
| System | Design System & Component Library | `/design-system/` |

During a presentation, use the **Prototype Map** button (bottom-left) to jump between pages.

## Journeys

- **Primary:** Personal Landing → Product Listing → Product Detail → Loan Calculator → Apply / Contact CTA
- **Secondary:** Landing → Investment · Navigation → Branch Locator → filter → detail · Navigation → Exchange Rates → history · utility bar → SME / Business

## Structure

```
assets/css/main.css      Design tokens + all components (sectioned)
assets/js/core.js        Header, mega menu, mobile nav, search, footer, modals, shared UI
assets/js/data.js        Example content (products, branches, currencies, funds)
assets/js/landing.js     Shared Landing template (personal / sme / business configs)
assets/js/listing.js     Product Listing template (filters, sort, compare)
assets/js/detail.js      Product Detail template
assets/js/calculator.js  Reusable calculator pattern (Home Loan reference)
assets/js/investments.js Investment landing, fund drawer, risk quiz
assets/js/branches.js    Branch locator (vector map, pan/zoom, filters)
assets/js/rates.js       Exchange rates table, converter, history chart
```

## Notes

- All rates, fees, branches and market figures are **illustrative example data**.
- Real brand assets live in `assets/img/lhbank/`: the LH Bank logo (`logo.svg`, plus `logo-white.svg` for dark backgrounds), the favicon, campaign banners from lhbank.co.th, and the **LHB You** app icon and App Store screenshots. The brief allows these as example assets (§5).
- Lifestyle images are hotlinked from Unsplash. If they fail to load, the page shows soft gradient placeholders.
- Application forms and campaign pages use the bank's existing system, so only the CTAs are designed here (see brief §8).
