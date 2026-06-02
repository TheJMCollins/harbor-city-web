# Harbor City Church Website

The Harbor City Church public website. Built with **Astro** and deployed to **Cloudflare Pages**.

**Source of truth:** Astro Build Brief v2.0 — OpenLibrary doc `2f7f308e-15a9-411d-8d1f-4968eede0bca`

---

## Quick start

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Brand architecture

This site uses a **"loud children of a quiet parent"** brand system. The main Harbor City Church brand is the editorial-restrained anchor (navy + gold, Cormorant Garamond + Outfit). Each ministry fully expresses its own personality on its page via a `[data-brand="…"]` scope that re-points semantic CSS aliases.

**Six brands:**

| Brand | Scope | URL |
|---|---|---|
| Main (Harbor City) | default | `/`, `/our-story`, `/give`, `/contact`, etc. |
| NextGen (Youth) | `[data-brand="nextgen"]` | `/ministries/youth` |
| Dream Team | `[data-brand="dreamteam"]` | `/dreamteam` |
| Next Steps | `[data-brand="nextsteps"]` | `/nextsteps` |
| Harbor Kids | `[data-brand="harborkids"]` | `/ministries/kids` |
| Groups | `[data-brand="groups"]` | `/groups` |

Nav and Footer hardcode the main brand tokens (`--hcc-*`) so they're immune to ministry scope overrides — users always have a visual anchor home on every page.

See `src/styles/tokens.css` for raw tokens and `src/styles/brands.css` for scope overrides. Component CSS only ever references semantic aliases (`--color-brand`, `--color-accent`, `--font-display`, etc.), never raw ministry colors. Drop a `<Button>` on any ministry page and it automatically takes that ministry's primary color.

---

## Project structure

```
harbor-city-web/
├── public/
│   ├── images/          # Photography per section/ministry
│   │   ├── home/        # Hero photos, pastor photo, HCC icon
│   │   ├── nextgen/
│   │   ├── dreamteam/
│   │   ├── nextsteps/
│   │   ├── harborkids/
│   │   └── groups/
│   ├── fonts/           # Reserved for future self-hosted licensed fonts
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── global/      # Nav, Footer, HarborCityIcon, SectionLabel
│   │   ├── home/        # Hero, OurStory, Mission, ThisSunday, GetConnected, PlanVisitCTA
│   │   ├── nextgen/     # (stubs — built out when ministry page is authored)
│   │   ├── dreamteam/
│   │   ├── nextsteps/
│   │   ├── harborkids/
│   │   └── groups/
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Shared HTML shell, fonts, SEO
│   │   └── MinistryLayout.astro   # Wraps BaseLayout, forces ministry brand
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   ├── 404.astro              # Not-found page
│   │   ├── blog/                  # Blog index + dynamic [slug]
│   │   ├── sermons/               # Sermons index + dynamic [slug]
│   │   └── ministries/            # kids, youth, worship, outreach, prayer
│   ├── content/
│   │   ├── config.ts              # Content collection schemas
│   │   ├── blog/
│   │   └── sermons/
│   └── styles/
│       ├── tokens.css             # Design tokens (raw + semantic)
│       ├── brands.css             # Per-ministry scope overrides
│       ├── base.css               # Reset, typography, focus, animations
│       └── utilities.css          # Containers, spacing, helpers
├── functions/
│   └── api/                       # Cloudflare Pages Functions (forms, etc.)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Adding a new page

**Main brand page** (About, Give, Contact, Blog, etc.):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page Title" description="Short description.">
  <!-- Your content -->
</BaseLayout>
```

**Ministry page** (Next Steps, Groups, Dream Team, etc.):

```astro
---
import MinistryLayout from '../layouts/MinistryLayout.astro';
---
<MinistryLayout
  title="Next Steps"
  description="You're not alone. Get to know our church."
  brand="nextsteps"
>
  <!-- Content uses --color-brand, --color-accent, --font-display -->
  <!-- These resolve to Next Steps' Rhythm Blue, Fire Red, Poppins Black -->
</MinistryLayout>
```

---

## Design tokens

All hex values, font families, spacing, type scale, motion, and radius values live in `src/styles/tokens.css`. **Never hardcode a color or font in a component** — always reference a token:

```css
/* Good */
background: var(--color-bg-dark);
color: var(--color-accent);
font-family: var(--font-display);

/* Bad — breaks ministry scoping */
background: #0E1B2E;
color: #C8A96E;
```

Exception: `Nav.astro` and `Footer.astro` hardcode `--hcc-*` tokens directly. This is intentional — they should render the main brand on every page.

---

## Fonts

All brand fonts load from Google Fonts in a single request from `BaseLayout.astro`. This covers **all six brands**:

- Cormorant Garamond (main)
- Outfit (main)
- Poppins (NextGen, Next Steps)
- DM Sans (NextGen)
- Oswald (Dream Team)
- Inter (Dream Team)
- Libre Franklin (Next Steps)
- DM Serif Display (Harbor Kids)
- Manrope (Harbor Kids, Groups)
- Fraunces (Groups)
- Source Serif 4 (Groups)

Julius has licensed versions of several of these (Balboa Condensed, Owners Text, Handsome Pro Bold, Stolzl, Halyard Display Book, Roc Grotesk, Mrs Eaves XL Serif) that can be self-hosted later for pixel-exact matches. Drop `.woff2` files in `public/fonts/` and swap the font-family token.

---

## Deployment

### Cloudflare Pages (primary host)

1. Push this repo to GitHub (private).
2. Cloudflare Dashboard → Workers & Pages → Create → Connect to GitHub.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `20`
4. First deploy lands at `harborcitychurch.pages.dev`.
5. Bind `harborcitychurch.com` as the Pages custom domain.

### harbor.city → harborcitychurch.com 301

**⚠ DO NOT bind `harbor.city` as a Pages custom domain.** That would break Cloudflare Email Routing on `hello@harbor.city`.

Use **Bulk Redirects** instead:

- Cloudflare Dashboard → Rules → Redirect Rules → Bulk Redirects
- Source: `https://harbor.city/*` → Target: `https://harborcitychurch.com/$1`
- Type: `301 Permanent`
- Preserve query string: yes
- Preserve path suffix: yes

Email Routing (MX records on `harbor.city`) stays untouched.

---

## Assets still to stage

Copy these from `/Users/godfrey/Downloads/HCC-deploy/` on the Mac Mini:

- [ ] `pastors.jpg` → `public/images/home/` (currently missing; OurStory section will show a gradient fallback until this is in place)
- [ ] `og-image.jpg` → `public/`
- [ ] `favicon.svg` → `public/`
- [ ] `favicon-32.png` → `public/`
- [ ] `apple-touch-icon.png` → `public/`
- [ ] All Yellowbox ministry logos + illustrations (nest under `public/images/<ministry>/`)

The canonical Harbor City icon (`Blue-HC_Icon.png`) is already staged at `public/images/home/hcc-icon-blue.png`.

---

## Related docs (OpenLibrary)

| Topic | Doc ID |
|---|---|
| ⭐ **Astro Build Brief v2.0** (primary reference) | `2f7f308e-15a9-411d-8d1f-4968eede0bca` |
| Main Brand Design Guide v1.1 | `57fedd2b-5338-4460-8c04-26f0dbb37772` |
| Youth (NextGen) Design Guide | `220c6565-71df-42cb-87af-fbf823d4d5f9` |
| Dream Team Design Guide | `3bd53d39-c4cc-4b01-91e9-5c4aebb9e0c2` |
| Next Steps Design Guide | `e9149d6f-c339-4a7c-b9ea-c6283910848d` |
| Harbor Kids Design Guide | `fff51bb8-aca1-43c4-8c29-d220858afe17` |
| Groups Design Guide | `31f876e2-801e-46d4-93bc-bc3f479bd4db` |

---

## Build order (from Brief Part 2.17)

1. ✅ **Homepage**
2. **Next Steps** (visitor pipeline — highest-value page)
3. Our Story
4. Groups
5. Dream Team
6. Give
7. Contact
8. Youth / NextGen
9. Kids / Harbor Kids
10. Growth Track
11. Blog + Sermons indexes
12. Worship / Outreach / Prayer

---

© Harbor City Church
