# WebCrawler — Frontend Redesign Plan

> **Goal:** Transform the current prototype (gimmicky canvas animations, gradient-overloaded dark theme) into a mature, data-first developer tool that feels closer to Grafana, Posthog, or Screaming Frog than a hackathon demo.
>
> **Decision:** Graph page cut entirely. The 3D force graph is visually impressive but provides no actionable value. The product is the report — tables, numbers, links you can act on.

---

## 1. Current State Audit

### What exists
| File | Status | Notes |
|------|--------|-------|
| `HomePage.jsx` | Working | Particle canvas background, gradient title, Space Grotesk |
| `StatusPage.jsx` | Working | Polling every 2s, animated counter, redirects to Graph |
| `ReportPage.jsx` | **Placeholder** | Only shows stub text; ReportTable not integrated |
| `GraphPage.jsx` | **Remove** | Cut entirely — 3D graph adds no actionable value |
| `NetworkBackground.jsx` | **Remove** | Canvas particle animation — the "Three.js problem" |
| `Graph3D.jsx` | **Remove** | Cut with GraphPage |
| `StatusCard.jsx` | Refactor | Animated counter is fine; visual language needs updating |
| `CrawlInput.jsx` | Refactor | Functional, needs layout cleanup |
| `ReportTable.jsx` | Build | Currently a stub |

### What to kill immediately
- `NetworkBackground.jsx` — remove from codebase entirely
- Gradient text (`bg-clip-text text-transparent`) used as a default style — reserve it for zero or one branding moment
- `"Orbitron"` font — gaming aesthetic, not technical tool
- Decorative `box-shadow` glows on every element
- Animated pulse rings on the status badge (keep a single subtle one)

---

## 2. Design System

### 2.1 Typography

| Role | Font | Weights | Where |
|------|------|---------|-------|
| UI / Body | `Inter` (or `system-ui` fallback) | 400, 500, 600 | Everything except data |
| Monospace | `JetBrains Mono` | 400, 500 | URLs, status codes, response times, crawl log |
| Display (one use only) | `Fira Code` | 600 | App name / logo mark |

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

- Body size: `14px` base (developer tools are information-dense)
- Scale: `11 / 12 / 13 / 14 / 16 / 20 / 24 / 32`
- Line height: `1.6` body, `1.3` headings, `1.5` monospace

### 2.2 Color Palette

Base: **Developer Tool / Dark OLED** (palette #1 from audit)

```
Background:      #0F172A   (deep navy — not pure black, avoids OLED burn look)
Surface:         #1B2336   (cards, panels)
Surface Raised:  #1E293B   (hover state surfaces, dropdowns)
Border:          #2D3A52   (subtle dividers)
Border Strong:   #475569   (active borders, focus rings)

Text Primary:    #F1F5F9
Text Secondary:  #94A3B8
Text Muted:      #64748B

Primary:         #2563EB   (blue — actions, links, active nav)
Primary Hover:   #1D4ED8
Primary Subtle:  #1E3A5F   (primary bg tint for badges/chips)

Success:         #22C55E   (2xx status)
Success Subtle:  #052E16
Warning:         #F59E0B   (3xx redirects, slow pages)
Warning Subtle:  #431407
Error:           #EF4444   (4xx/5xx, broken links)
Error Subtle:    #1F0A0A

Code Green:      #4ADE80   (crawl log — successful fetches)
Code Dim:        #64748B   (crawl log — skipped/filtered)
```

Tailwind `tailwind.config.js` — extend with the above as CSS custom properties in `index.css`, then reference via Tailwind arbitrary values or extend the config.

### 2.3 Spacing & Layout

- Base unit: `4px`
- Component padding: `12px / 16px`
- Section gaps: `24px / 32px`
- Max content width: `1280px` centered
- Sidebar width (ReportPage): `240px`
- No full-width layouts on desktop — always inset

### 2.4 Shadows & Elevation

Remove glowing box-shadows. Use elevation only:

```
Level 0: no shadow (flat surfaces)
Level 1: box-shadow: 0 1px 3px rgba(0,0,0,0.4)        (cards)
Level 2: box-shadow: 0 4px 16px rgba(0,0,0,0.5)        (modals, dropdowns)
```

### 2.5 Status Code Color System (used site-wide)

| Code Range | Color | Background Badge | Tailwind Approx |
|---|---|---|---|
| 2xx | `#22C55E` | `#052E16` | `text-green-400 bg-green-950` |
| 3xx | `#F59E0B` | `#431407` | `text-amber-400 bg-amber-950` |
| 4xx | `#F87171` | `#1F0A0A` | `text-red-400 bg-red-950` |
| 5xx | `#EF4444` | `#1F0A0A` | `text-red-500 bg-red-950` |
| Timeout/Err | `#94A3B8` | `#1E293B` | `text-slate-400 bg-slate-800` |

---

## 3. Navigation & App Shell

### Top Navigation Bar (persistent across all pages post-crawl)

```
[●] WebCrawler   ──────────────────────────────   [Status] [Report] [Graph]
                  breadcrumb: crawling example.com
```

- Height: `52px`
- Background: `#0F172A` with `border-bottom: 1px solid #2D3A52`
- Left: logo mark (Fira Code, text-based, no emoji/image)
- Center: job breadcrumb showing the seed URL being crawled (truncated with tooltip)
- Right: tab links — Status / Report / Graph (grayed out until job exists)
- Active tab: `border-bottom: 2px solid #2563EB` on the tab
- On HomePage: no breadcrumb center, just logo + tagline

### Routing stays the same. Navigation just becomes explicit instead of redirect-only.

---

## 4. Page-by-Page Redesign

---

### Page 1: HomePage `/`

**Goal:** Confident first impression of a professional tool. One clear action.

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [navbar — logo only, no tabs]                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│               WebCrawler                            │
│    Audit any website. Analyze structure,            │
│    broken links, and page performance.              │
│                                                      │
│    ┌──────────────────────────────┐  [Crawl →]      │
│    │ https://example.com          │                  │
│    └──────────────────────────────┘                  │
│                                                      │
│    ── ── ── ── ── ── ── ── ── ── ── ──              │
│    ⬡ BFS multi-threaded   ⬡ SEO analysis            │
│    ⬡ Broken link scan     ⬡ Graph visualization     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Changes from current:**
- Remove `NetworkBackground` entirely
- Background: flat `#0F172A` with optional **CSS-only subtle dot grid** (no JS):
  ```css
  background-image: radial-gradient(circle, #1E293B 1px, transparent 1px);
  background-size: 28px 28px;
  ```
- Title: Inter 700, `#F1F5F9` — no gradient, no Orbitron
- Subtitle: Inter 400, `#94A3B8`
- Input: full-width container up to `520px`, `height: 44px`, border `#2D3A52`, focus ring `#2563EB`
- Button: `bg-[#2563EB]` inline with input (attached right side)
- Feature badges: 4 items in 2×2 grid, small `12px` caps text, Lucide icon (stroke, 16px)
- Error state: `text-red-400` below input, no box

**Remove:** Space Grotesk import, Orbitron import, NetworkBackground, gradient title

---

### Page 2: StatusPage `/status/:id`

**Goal:** Real-time progress that feels like watching a CI/CD pipeline run. Information density over animation.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  navbar — breadcrumb: crawling example.com           │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [● RUNNING]  Crawling example.com                   │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │   347    │  │    12    │  │   1.2s   │           │
│  │  Pages   │  │  Errors  │  │  Avg RT  │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Live Crawl Log                              │   │
│  │  ──────────────────────────────────────     │   │
│  │  ✓ /about                             142ms │   │
│  │  ✓ /products/widget-a                 89ms  │   │
│  │  ✗ /old-page                          404   │   │
│  │  → /news  (→ /news/)                  301   │   │
│  │  ✓ /contact                          201ms  │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Changes from current:**
- Stat cards: 3 cards side-by-side — Pages Crawled, Errors Found (4xx/5xx), elapsed time (calculated client-side)
- Status badge: solid pill `RUNNING` / `DONE` / `FAILED` — no pulse rings, just a subtle 4px dot with pulse
- Remove: gigantic `text-9xl` number — replace with normal card stat (`text-4xl font-mono`)
- Add: **Live crawl log panel** — scrolling list of last ~30 URLs. Backend currently doesn't push individual URL events, so this is a stretch goal (Phase 2). For Phase 1: just the stat cards + status.
- When DONE: Two buttons — `View Report` (primary) and `View Graph` (secondary outlined)
- When FAILED: Error card with message + "Start New Crawl" button

---

### Page 3: ReportPage `/report/:id` ← **Needs to be fully built**

**Goal:** The most valuable page. A proper audit report like Lighthouse or Screaming Frog.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  navbar — breadcrumb: example.com / Report           │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐│
│  │ 0 Broken │  │ 5 SEO    │  │ 3 Slow   │  │2 Dup.││
│  │   Links  │  │  Issues  │  │  Pages   │  │Pages ││
│  └──────────┘  └──────────┘  └──────────┘  └──────┘│
│                                                      │
│  [Broken Links] [SEO Issues] [Slow Pages] [Duplicates] [View Graph →]
│  ─────────────────────────────────────────────────  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ URL                     │ Status │ Found On   │  │
│  │ ─────────────────────── │ ────── │ ────────── │  │
│  │ /old-page               │  404   │ /sitemap   │  │
│  │ /assets/missing.png     │  404   │ /about     │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Tabs and their content:**

| Tab | Data source (backend) | Columns |
|-----|----------------------|---------|
| Broken Links | `report.brokenLinks[]` | URL · Status Code · Source Page |
| SEO Issues | `report.seoIssues[]` | URL · Issue Type · Details |
| Slow Pages | `report.slowPages[]` | URL · Response Time (ms) · Status |
| Duplicates | `report.duplicatePages[]` | URL A · URL B · Similarity |

**Table features:**
- Monospace font for URLs
- Status code badges (color system from §2.5)
- Click URL row → opens in new tab
- Copy URL button on hover
- Empty state: "No issues found" with check icon — not a blank table

---

### ~~Page 4: GraphPage~~ — Cut

The 3D force graph (`react-force-graph-3d`) and its page are removed entirely. The dependency can be uninstalled. The `/graph/:id` route is deleted. The backend graph endpoint remains untouched — it's a backend concern and costs nothing to leave in place.

---

## 5. Component Inventory

### Keep & Refactor
| Component | What changes |
|-----------|-------------|
| `CrawlInput.jsx` | Simpler, attached button, remove inline font overrides |
| `StatusCard.jsx` | Replace with `StatCard.jsx` — smaller, 3-column grid |
| ~~`Graph3D.jsx`~~ | Removed |
| `ReportTable.jsx` | Rebuild completely — tabbed, sortable, with empty states |

### Remove
| Component | Reason |
|-----------|--------|
| `NetworkBackground.jsx` | The gimmick we're killing |
| `Graph3D.jsx` | Cut with graph page |

### Add
| Component | Purpose |
|-----------|---------|
| `NavBar.jsx` | Persistent top bar with breadcrumb + job tabs |
| `StatCard.jsx` | Reusable number + label card for stats rows |
| `StatusBadge.jsx` | Pill badge: RUNNING / DONE / FAILED / PENDING |
| `CodeBadge.jsx` | HTTP status code pill with color system |
| `EmptyState.jsx` | Reusable empty/no-data state with icon + message |
| `CrawlLog.jsx` | (Phase 2) Scrolling live log of crawled URLs |

---

## 6. What Stays the Same

- React Router routes — same 4 routes
- `api.js` — no changes needed
- Vite proxy configuration
- `react-force-graph-3d` library
- Tailwind CSS v3
- Polling logic in StatusPage

---

## 7. Phased Implementation Plan

---

### Phase 1 — Foundation (kill the gimmicks, establish the design system)

**Goal:** Ship a clean, professional shell. No broken pages. Remove all "try-hard" elements.

**Tasks:**
1. Update `index.css`:
   - Add Inter + JetBrains Mono font imports
   - Add CSS custom properties for the color palette
   - Add `.font-mono` override to use JetBrains Mono
   - Add subtle dot-grid background class
   - Remove Orbitron/Space Grotesk imports

2. Update `tailwind.config.js`:
   - Extend colors with the named palette (surface, border, etc.)

3. Build `NavBar.jsx`:
   - Logo (text: "WebCrawler" in Fira Code or Inter mono)
   - Tab links: Status / Report / Graph (disabled when no jobId in URL)
   - Breadcrumb from job URL (passed via React Router context or prop)

4. Rebuild `HomePage.jsx`:
   - Remove `NetworkBackground`
   - Flat background with CSS dot grid
   - Inter typography, no gradients
   - Feature badge row below input (4 items, Lucide icons)

5. Refactor `CrawlInput.jsx`:
   - Remove inline font styles
   - Clean border/focus ring using design tokens

6. Refactor `StatusPage.jsx`:
   - Replace `StatusCard` with a 3-column `StatCard` row
   - Add `StatusBadge` component
   - Add "View Report" + "View Graph" CTAs when DONE
   - Remove gradient text

7. Add `StatCard.jsx`, `StatusBadge.jsx`, `EmptyState.jsx`

8. Add `CodeBadge.jsx` (used in Report + Graph)

**Deliverable:** App looks clean and professional. No canvas animations. No gradient abuse. All existing functionality works.

---

### Phase 2 — ReportPage (the missing piece)

**Goal:** Build the most valuable user-facing feature that currently doesn't exist.

**Tasks:**
1. Call `GET /api/crawl/:id/report` and understand the response shape
2. Build `ReportPage.jsx`:
   - Summary stat cards (broken links count, SEO issues count, slow pages count, duplicates count)
   - Tab navigation component (inline, not a sidebar)
   - Active tab renders the appropriate table
3. Build `ReportTable.jsx` properly:
   - Columns per tab (see §4 above)
   - Monospace URLs
   - `CodeBadge` for status columns
   - Sortable by clicking column header
   - Empty state per tab
4. Update `StatusPage.jsx` to link to `/report/:id` after DONE (currently goes to `/graph/:id`)

**Deliverable:** Complete working report page with all 4 data sections.

---

### Phase 3 — Polish & Accessibility

**Goal:** Production-quality finish. The app works without this phase but it elevates it.

**Tasks:**
1. Elapsed timer on StatusPage (client-side, no backend changes)
2. `document.title` updates per page/status
3. Keyboard accessibility pass: tab order, focus management after form submit
4. `prefers-reduced-motion` — disable any remaining transitions
5. Empty states on all ReportPage tabs ("No issues found ✓")
6. Error boundary on ReportPage if the API call fails
7. URL copy button on table rows (hover reveals a copy icon)

**Deliverable:** Solid, accessible, complete.

---

### Phase 4 — Live Feed (stretch)

**Goal:** Turn the status page into something more engaging with real data density.

**Tasks:**
1. Check if backend can be extended to push per-URL events (SSE or WebSocket) — if yes, proceed; if no, skip
2. Build `CrawlLog.jsx` — a virtualized scrolling list of crawled URLs with status badges
3. Add elapsed timer to StatusPage (purely client-side, no backend changes)
4. Add page title updates (`document.title`) reflecting current status
5. Keyboard accessibility pass: tab order, focus management after form submit
6. `prefers-reduced-motion` check — disable/simplify any remaining transitions

**Deliverable:** Production-quality polish. The app works well without these but they elevate it.

---

## 8. File Diff Summary (what gets touched)

```
REMOVE:
  src/components/NetworkBackground.jsx
  src/components/Graph3D.jsx
  src/pages/GraphPage.jsx
  (npm uninstall react-force-graph-3d)

REFACTOR:
  src/index.css                    — full design token setup
  tailwind.config.js               — extend colors
  src/App.jsx                      — add NavBar, remove /graph route
  src/components/CrawlInput.jsx    — clean up styles
  src/components/StatusCard.jsx    — refactor to StatCard
  src/components/ReportTable.jsx   — rebuild from scratch
  src/pages/HomePage.jsx           — remove NetworkBackground, clean design
  src/pages/StatusPage.jsx         — new layout, stat cards, redirect to /report
  src/pages/ReportPage.jsx         — build from placeholder
  src/services/api.js              — remove getGraph() call

ADD:
  src/components/NavBar.jsx
  src/components/StatCard.jsx
  src/components/StatusBadge.jsx
  src/components/CodeBadge.jsx
  src/components/EmptyState.jsx
  src/components/CrawlLog.jsx      — Phase 4 only
```

---

## 9. Design References

These are the design directions to pull inspiration from. Look at:
- **Screaming Frog** — information density, tabbed reports, monospace URLs
- **Vercel Dashboard** — dark theme done right, clean typography, stat cards
- **Linear** — Inter typography, clean navigation, badge system
- **Posthog** — developer tool feel, tab navigation, table-first data
- **Ahrefs Site Audit** — the gold standard for what a mature crawler UI looks like

The common thread: **information first, decoration never.**

---

## 10. Anti-Patterns to Avoid in This Rewrite

| Avoid | Why |
|-------|-----|
| Gradient text as a default style | Overused, loses meaning — use at most once (logo or zero times) |
| Canvas/WebGL background animations | Pure decoration, adds 0 information, hits performance |
| `font-family: "Orbitron"` | Gaming / sci-fi feel — wrong audience |
| `text-8xl` / `text-9xl` for live stats | Numbers this large feel like a toy, not a tool |
| `box-shadow: 0 0 20px rgba(...)` glow everywhere | Unearned visual weight |
| Emoji in UI (`✓` is fine as code; 🚀 is not) | Inconsistent cross-platform rendering |
| Redirecting anywhere except the report | The report is the product. Status → Report, full stop. |
| Placeholder pages in a "mature project" | ReportPage must ship in Phase 2, not someday |
| A 3D graph as a core feature | Looks impressive, provides zero actionable information |
