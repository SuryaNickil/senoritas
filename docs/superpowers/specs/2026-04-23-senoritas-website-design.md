# Senoritas Restaurant Website — Design Spec
**Date:** 2026-04-23  
**Status:** Approved by client

---

## Overview

A premium, dark-themed multi-page restaurant website for **Senoritas** (Breakfast · Lunch · Dinner). Inspired by the Twin Peaks restaurant website aesthetic — cinematic food photography, bold oversized typography, and dramatic dark color palette. Includes Seedance AI video backgrounds (pre-generated `.mp4` files), CSS scroll animations, and Toast POS online ordering integration. Hosted on Hostinger as a static site — no backend, no build step.

---

## Brand

| Element | Value |
|---|---|
| Primary | Orange gradient `#f5a623 → #e8621a` |
| Accent | Red `#c0392b` |
| Background | `#0a0a0a` |
| Surface | `#111111` |
| Text primary | `#ffffff` |
| Text muted | `rgba(255,255,255,.6)` |
| Font — Display | Bebas Neue — loaded via Google Fonts CDN |
| Font — UI | Oswald — loaded via Google Fonts CDN |
| Font — Body | Inter — loaded via Google Fonts CDN |

Google Fonts `<link>` tag (shared across all pages):
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
```

---

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `menu.html` | Menu |
| `about.html` | About |
| `gallery.html` | Gallery |
| `contact.html` | Contact |

---

## File Structure

```
senoritas/
├── index.html
├── menu.html
├── about.html
├── gallery.html
├── contact.html
├── style.css          ← brand colors, typography, animation classes, custom components
├── script.js          ← nav, mobile menu, tabs, lightbox, IntersectionObserver
└── assets/
    ├── logo.png       ← client logo (expected: PNG with transparency, ~400px wide)
    └── videos/
        ├── hero.mp4          ← Seedance: cinematic food hero (16:9, H.264, ≤15MB)
        ├── breakfast.mp4     ← Seedance: morning breakfast scene
        ├── lunch.mp4         ← Seedance: vibrant taco assembly
        ├── dinner.mp4        ← Seedance: dramatic grill/flames
        └── atmosphere.mp4    ← Seedance: warm restaurant interior
```

**Seedance AI workflow:** Client generates `.mp4` clips independently using the provided prompts, exports as H.264 MP4 (max 15MB each), and drops into `assets/videos/`. Site uses HTML5 `<video autoplay muted loop playsinline>` with an Unsplash poster image fallback for slow connections/mobile.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Markup | HTML5 (5 separate files) | No build step, works directly on Hostinger |
| Styling | **Tailwind CSS CDN for layout/spacing utilities** + **`style.css` for brand, typography, animations** | Tailwind handles responsive grid/flex; `style.css` owns all brand-specific CSS |
| Animations | Pure CSS (`@keyframes` + `IntersectionObserver` in JS) | No external library, fast, zero dependencies |
| Video | HTML5 `<video autoplay muted loop playsinline>` | Native browser support |
| Ordering | Toast POS — **link-out approach** (button → Toast URL) | Simplest, zero maintenance, works immediately |
| Hosting | Hostinger File Manager (zip upload) | Client already has account |

**Tailwind/CSS split rule:** Tailwind utility classes handle layout, spacing, and responsive breakpoints. `style.css` owns all brand colors, custom font sizes, gradient definitions, animation keyframes, and component styles. Never define brand colors in Tailwind inline styles.

---

## Responsive Breakpoints (Tailwind defaults)

| Name | Min-width | Layout |
|---|---|---|
| Mobile (default) | 0px | Single column, hamburger nav, stacked sections |
| `sm` | 640px | 2-column menu grid |
| `md` | 768px | 2-column about/contact split |
| `lg` | 1024px | Full desktop layout, inline nav links |

---

## Scroll Animations

Implemented via `IntersectionObserver` in `script.js` adding/removing CSS classes. No GSAP, no external library.

| Element | Class added | CSS effect | Values |
|---|---|---|---|
| Section headings | `.animate-in` | Fade up | `opacity 0→1, translateY 30px→0, 500ms ease-out` |
| Menu cards | `.animate-in` | Fade up staggered | Each card: `delay: index × 80ms` |
| Gallery photos | `.animate-in` | Scale in | `opacity 0→1, scale .95→1, 400ms ease-out` |
| Feature cards | `.animate-in` | Fade up staggered | `delay: 0ms, 120ms, 240ms` |
| Meal bands | CSS only | Subtle parallax | `background-position` shifts `20px` on scroll via JS |
| Nav | `.scrolled` class on `<nav>` | Shrinks + adds border | Height `64px→52px, border-bottom: 1px solid rgba(244,124,32,.25)` |

IntersectionObserver threshold: `0.15` (trigger when 15% of element is visible).

---

## Shared Components

### Navigation
- Sticky, `position: fixed`, full width, `z-index: 100`
- Background: `rgba(10,10,10,.95)` + `backdrop-filter: blur(12px)`
- Left: SENORITAS logo (CSS gradient text, falls back to `logo.png` when provided)
- Center: Home · Menu · About · Gallery · Contact (Oswald, 12px, letter-spacing 2px)
- Right: "ORDER NOW" CTA button → Toast URL
- Active page: current link highlighted in `#f47c20`
- Mobile: hamburger icon → full-width slide-down drawer

### Footer
- Logo + tagline "Breakfast · Lunch · Dinner"
- Quick nav links
- Hours summary
- Copyright line

---

## Page Designs

### Home (`index.html`)
1. **Hero** — Full-screen `<video>` (`hero.mp4`). Poster: Unsplash food photo. Dark overlay. Centered: SENORITAS logo, eyebrow text, tagline "BOLD FLAVORS. WARM VIBES.", two CTAs: `VIEW MENU` (→ menu.html) + `ORDER NOW` (→ Toast URL)
2. **Meal Bands** — Three equal-width horizontal bands side by side (desktop) / stacked (mobile). Each: video background, icon, meal name, hours, gradient divider. Hover: video brightens + slight scale
3. **Feature Strip** — "WHY SENORITAS" — 3 cards: Fresh Ingredients / Family Recipes / Made Fresh Daily
4. **CTA Banner** — Full-width red gradient: "HUNGRY? ORDER ONLINE." + Toast button

### Menu (`menu.html`)
1. **Page hero** — Short 300px dark hero, "OUR MENU" heading, red underline accent
2. **Tab bar** — BREAKFAST / LUNCH / DINNER. JS `show/hide` panels (no page reload, no URL fragments). Active tab: white text + red bottom border
3. **Menu grid** — 2-column cards (1-column mobile). Each card: item name (Oswald), description (Inter), price (Bebas Neue orange). Staggered fade-in on tab switch
4. **Sticky mobile CTA** — Fixed bottom bar on `< lg`: "ORDER ONLINE →" → Toast URL

### About (`about.html`)
1. **Split hero** — Left 50%: `atmosphere.mp4` / photo. Right 50%: dark panel, eyebrow + "FOOD MADE WITH HEART." headline + story text (placeholder)
2. **Values** — 3-column: 🌿 Fresh · 👨‍👩‍👧 Family · 🔥 Flavour, each with short description
3. **Full-width image strip** — Wide restaurant interior photo (Unsplash until client provides)

### Gallery (`gallery.html`)
1. **Page hero** — Short hero, "OUR GALLERY" heading
2. **Masonry grid** — CSS `columns: 3` (desktop) / `columns: 2` (tablet) / `columns: 1` (mobile). Mix of portrait/landscape Unsplash food photos as placeholders
3. **Lightbox** — Vanilla JS custom implementation. Click photo → full-screen dark overlay, centered image, close button (×), keyboard ESC to close. No third-party library.

### Contact (`contact.html`)
1. **Split layout** — Left: address block, hours table, phone, email. Right: Google Maps `<iframe>` embed
2. **Contact form** — Name, Email, Message fields. Action: `mailto:` → **<!-- TODO: client to provide contact email address -->`**
3. **Hours table** — Clean dark-styled table

---

## Toast POS Integration

- **Approach:** Link-out (all "ORDER NOW" / "ORDER ONLINE" buttons link to Toast URL)
- **Placeholder URL:** `https://www.toasttab.com/senoritas` — **<!-- TODO: client to provide actual Toast ordering URL -->`**
- All ordering buttons open in a **new tab** (`target="_blank"`)

---

## Placeholder / TODO Items (client to provide)

| Item | Used in | Notes |
|---|---|---|
| Toast ordering URL | All pages (nav CTA, home CTA, menu CTA) | Replace `https://www.toasttab.com/senoritas` |
| Restaurant address | contact.html | Replace placeholder + update Google Maps embed src |
| Google Maps embed src | contact.html | Generate at maps.google.com once address known |
| Contact email | contact.html form | Replace in `mailto:` action |
| Opening hours | contact.html, footer | Replace placeholder hours |
| Phone number | contact.html | Replace `(555) 000-0000` |
| Real food photos | All pages | Replace Unsplash URLs with client's photos |
| Seedance videos | index.html, menu bands, about.html | Drop into `assets/videos/` |
| Menu items & prices | menu.html | Replace placeholder menu with real items |
| About story text | about.html | Client rewrites placeholder copy |
| Logo file | All pages (nav) | Drop `logo.png` into `assets/` |

---

## Deliverables

- [ ] 5 HTML pages with shared nav/footer
- [ ] `style.css` — brand system, animation classes, component styles
- [ ] `script.js` — nav scroll behavior, mobile menu, tab switcher, lightbox, IntersectionObserver
- [ ] `assets/` folder scaffolded with placeholder images wired in
- [ ] All TODO items clearly commented in source code
- [ ] Zip file ready for Hostinger upload
- [ ] GitHub repo (`SuryaNickil/senoritas`) updated
