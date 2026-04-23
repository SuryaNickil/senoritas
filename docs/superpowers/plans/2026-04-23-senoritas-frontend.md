# Senoritas Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Senoritas restaurant frontend — a 5-page dark-themed HTML/CSS/JS website with Remotion-generated video backgrounds, CSS scroll animations, and Toast POS ordering integration.

**Architecture:** Two sub-projects that produce independent artifacts. First, a Remotion project (`senoritas-videos/`) that renders 5 branded `.mp4` files using Unsplash placeholder images and brand animations. Second, the website (`senoritas/`) consumes those videos as HTML5 `<video>` backgrounds across 5 pages sharing one `style.css` and one `script.js`.

**Tech Stack:** HTML5, Tailwind CSS CDN, custom CSS, Vanilla JS, Remotion (React), Google Fonts CDN, IntersectionObserver API

---

## File Map

```
senoritas-videos/              ← Remotion project (video generation)
├── package.json
├── remotion.config.ts
└── src/
    ├── index.ts               ← registers all compositions
    ├── Root.tsx               ← Remotion Root
    ├── compositions/
    │   ├── Hero.tsx           ← hero video (sizzling food, title reveal)
    │   ├── Breakfast.tsx      ← breakfast band video
    │   ├── Lunch.tsx          ← lunch band video
    │   ├── Dinner.tsx         ← dinner band video
    │   └── Atmosphere.tsx     ← about page atmosphere video
    └── lib/
        └── theme.ts           ← shared brand colors, fonts, easing

senoritas/                     ← Website
├── index.html                 ← Home
├── menu.html                  ← Menu
├── about.html                 ← About
├── gallery.html               ← Gallery
├── contact.html               ← Contact
├── style.css                  ← brand system, animations, components
├── script.js                  ← nav, tabs, lightbox, IntersectionObserver
└── assets/
    ├── logo.png               ← placeholder (client to replace)
    └── videos/
        ├── hero.mp4           ← rendered by Remotion
        ├── breakfast.mp4
        ├── lunch.mp4
        ├── dinner.mp4
        └── atmosphere.mp4
```

---

## Task 1: Remotion Project Setup

**Files:**
- Create: `senoritas-videos/package.json`
- Create: `senoritas-videos/remotion.config.ts`
- Create: `senoritas-videos/src/Root.tsx`
- Create: `senoritas-videos/src/index.ts`
- Create: `senoritas-videos/src/lib/theme.ts`

- [ ] **Step 1: Scaffold Remotion project**

```bash
cd "/Users/surya_reddy/Claude Code"
mkdir senoritas-videos && cd senoritas-videos
npm init -y
npm install remotion @remotion/cli react react-dom
npm install --save-dev typescript @types/react @types/react-dom
```

- [ ] **Step 2: Create `src/lib/theme.ts`**

```ts
export const theme = {
  colors: {
    orange: '#f47c20',
    orangeLight: '#f5a623',
    red: '#c0392b',
    dark: '#0a0a0a',
    black: '#000000',
  },
  fonts: {
    display: 'Bebas Neue',
    ui: 'Oswald',
  },
};
```

- [ ] **Step 3: Create `remotion.config.ts`**

```ts
import { Config } from '@remotion/cli/config';
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
```

- [ ] **Step 4: Create `src/Root.tsx`**

```tsx
import { Composition } from 'remotion';
import { Hero } from './compositions/Hero';
import { Breakfast } from './compositions/Breakfast';
import { Lunch } from './compositions/Lunch';
import { Dinner } from './compositions/Dinner';
import { Atmosphere } from './compositions/Atmosphere';

export const RemotionRoot = () => (
  <>
    <Composition id="Hero" component={Hero} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="Breakfast" component={Breakfast} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="Lunch" component={Lunch} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="Dinner" component={Dinner} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="Atmosphere" component={Atmosphere} durationInFrames={300} fps={30} width={1920} height={1080} />
  </>
);
```

- [ ] **Step 5: Create `src/index.ts`**

```ts
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';
registerRoot(RemotionRoot);
```

- [ ] **Step 6: Add scripts to `package.json`**

```json
{
  "scripts": {
    "start": "npx remotion studio",
    "render:hero": "npx remotion render Hero ../senoritas/assets/videos/hero.mp4",
    "render:breakfast": "npx remotion render Breakfast ../senoritas/assets/videos/breakfast.mp4",
    "render:lunch": "npx remotion render Lunch ../senoritas/assets/videos/lunch.mp4",
    "render:dinner": "npx remotion render Dinner ../senoritas/assets/videos/dinner.mp4",
    "render:atmosphere": "npx remotion render Atmosphere ../senoritas/assets/videos/atmosphere.mp4",
    "render:all": "npm run render:hero && npm run render:breakfast && npm run render:lunch && npm run render:dinner && npm run render:atmosphere"
  }
}
```

- [ ] **Step 7: Commit**
```bash
cd "/Users/surya_reddy/Claude Code/senoritas-videos"
git init && git add . && git commit -m "feat: scaffold Remotion video project"
```

---

## Task 2: Hero Video Composition

**Files:**
- Create: `senoritas-videos/src/compositions/Hero.tsx`

- [ ] **Step 1: Create `Hero.tsx`**

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Img, spring } from 'remotion';
import { theme } from '../lib/theme';

export const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 300], [1, 1.08], { extrapolateRight: 'clamp' });
  const overlayOpacity = interpolate(frame, [0, 30], [0, 0.65], { extrapolateRight: 'clamp' });
  const titleY = spring({ fps, frame, from: 60, to: 0, delay: 20, damping: 80 });
  const titleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: theme.colors.dark, fontFamily: 'sans-serif' }}>
      {/* Background food image with slow zoom */}
      <AbsoluteFill style={{ transform: `scale(${bgScale})`, transformOrigin: 'center' }}>
        <Img
          src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1920&q=90"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Dark overlay */}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${overlayOpacity})` }} />

      {/* Gradient overlay bottom */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)'
      }} />

      {/* Text content */}
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 140,
          fontWeight: 900,
          letterSpacing: 12,
          background: `linear-gradient(180deg, ${theme.colors.orangeLight}, ${theme.colors.red})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          lineHeight: 1,
        }}>
          SENORITAS
        </div>

        {/* Banner */}
        <div style={{
          opacity: subtitleOpacity,
          marginTop: 20,
          background: `linear-gradient(90deg, #8b1a12, ${theme.colors.red}, #8b1a12)`,
          padding: '14px 60px',
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 10,
          color: '#fff',
          clipPath: 'polygon(20px 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0% 50%)',
        }}>
          BREAKFAST · LUNCH · DINNER
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Preview in Remotion Studio**
```bash
cd "/Users/surya_reddy/Claude Code/senoritas-videos"
npm start
# Open http://localhost:3000, select "Hero" composition
```

- [ ] **Step 3: Commit**
```bash
git add src/compositions/Hero.tsx && git commit -m "feat: Hero video composition"
```

---

## Task 3: Meal Band Videos (Breakfast, Lunch, Dinner)

**Files:**
- Create: `senoritas-videos/src/compositions/Breakfast.tsx`
- Create: `senoritas-videos/src/compositions/Lunch.tsx`
- Create: `senoritas-videos/src/compositions/Dinner.tsx`

- [ ] **Step 1: Create a shared `MealBand` base component in `src/lib/MealBand.tsx`**

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Img } from 'remotion';
import { theme } from './theme';

interface MealBandProps {
  label: string;
  hours: string;
  imageUrl: string;
  accentColor?: string;
}

export const MealBand: React.FC<MealBandProps> = ({ label, hours, imageUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 300], [1, 1.1], { extrapolateRight: 'clamp' });
  const labelOpacity = interpolate(frame, [30, 70], [0, 1], { extrapolateRight: 'clamp' });
  const labelY = spring({ fps, frame, from: 40, to: 0, delay: 30, damping: 90 });
  const dividerW = interpolate(frame, [60, 120], [0, 160], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${bgScale})`, transformOrigin: 'center' }}>
        <Img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' }} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          fontSize: 96,
          fontWeight: 900,
          letterSpacing: 10,
          color: '#fff',
          textAlign: 'center',
        }}>{label}</div>
        <div style={{
          width: dividerW,
          height: 4,
          background: `linear-gradient(90deg, ${theme.colors.orange}, ${theme.colors.red})`,
          borderRadius: 2,
          marginTop: 20,
        }} />
        <div style={{
          opacity: labelOpacity,
          marginTop: 16,
          fontSize: 32,
          letterSpacing: 6,
          color: 'rgba(255,255,255,0.6)',
          fontWeight: 500,
        }}>{hours}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Create `Breakfast.tsx`, `Lunch.tsx`, `Dinner.tsx`**

```tsx
// Breakfast.tsx
import { MealBand } from '../lib/MealBand';
export const Breakfast: React.FC = () => (
  <MealBand label="BREAKFAST" hours="7:00 AM – 11:00 AM"
    imageUrl="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=1920&q=90" />
);

// Lunch.tsx
import { MealBand } from '../lib/MealBand';
export const Lunch: React.FC = () => (
  <MealBand label="LUNCH" hours="11:00 AM – 4:00 PM"
    imageUrl="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=1920&q=90" />
);

// Dinner.tsx
import { MealBand } from '../lib/MealBand';
export const Dinner: React.FC = () => (
  <MealBand label="DINNER" hours="4:00 PM – 10:00 PM"
    imageUrl="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1920&q=90" />
);
```

- [ ] **Step 3: Commit**
```bash
git add src/ && git commit -m "feat: Breakfast, Lunch, Dinner video compositions"
```

---

## Task 4: Atmosphere Video

**Files:**
- Create: `senoritas-videos/src/compositions/Atmosphere.tsx`

- [ ] **Step 1: Create `Atmosphere.tsx`**

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Img } from 'remotion';
import { theme } from '../lib/theme';

export const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const img1Opacity = interpolate(frame, [0, 30, 200, 240], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const img2Opacity = interpolate(frame, [200, 240, 300], [0, 1, 1], { extrapolateRight: 'clamp' });
  const textOpacity = interpolate(frame, [40, 80], [0, 1], { extrapolateRight: 'clamp' });
  const textY = spring({ fps, frame, from: 30, to: 0, delay: 40, damping: 90 });

  return (
    <AbsoluteFill style={{ background: '#0a0a0a' }}>
      <AbsoluteFill style={{ opacity: img1Opacity }}>
        <Img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=90"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: img2Opacity }}>
        <Img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1920&q=90"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))' }} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          opacity: textOpacity, transform: `translateY(${textY}px)`,
          fontSize: 72, fontWeight: 900, letterSpacing: 8, color: '#fff', textAlign: 'center',
        }}>FOOD MADE WITH HEART.</div>
        <div style={{
          width: 80, height: 4, marginTop: 20,
          background: `linear-gradient(90deg, ${theme.colors.orange}, ${theme.colors.red})`,
          borderRadius: 2,
        }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Render all videos to `senoritas/assets/videos/`**
```bash
cd "/Users/surya_reddy/Claude Code/senoritas-videos"
mkdir -p ../senoritas/assets/videos
npm run render:all
# Each video: ~2-3 min to render. Total: ~10-15 min.
```

- [ ] **Step 3: Commit**
```bash
git add . && git commit -m "feat: Atmosphere composition + render all videos"
```

---

## Task 5: Shared CSS & JS Foundation

**Files:**
- Create: `senoritas/style.css`
- Create: `senoritas/script.js`

- [ ] **Step 1: Create `style.css`**

```css
/* ── RESET ───────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: #0a0a0a; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }

/* ── BRAND VARS ──────────────────────────── */
:root {
  --orange: #f47c20;
  --orange-light: #f5a623;
  --red: #c0392b;
  --dark: #0a0a0a;
  --surface: #111111;
  --surface-2: #1a1a1a;
  --text: #ffffff;
  --text-muted: rgba(255,255,255,.6);
  --text-dim: rgba(255,255,255,.3);
  --gradient: linear-gradient(135deg, var(--orange), var(--red));
  --gradient-text: linear-gradient(180deg, var(--orange-light), var(--red));
}

/* ── TYPOGRAPHY ──────────────────────────── */
.font-display { font-family: 'Bebas Neue', sans-serif; }
.font-ui      { font-family: 'Oswald', sans-serif; }
.gradient-text {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── NAV ─────────────────────────────────── */
.site-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 64px;
  background: rgba(10,10,10,.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(244,124,32,.15);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px;
  transition: height .3s ease, border-color .3s ease;
}
.site-nav.scrolled {
  height: 52px;
  border-bottom-color: rgba(244,124,32,.35);
}
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px; letter-spacing: 4px;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
}
.nav-links { display: flex; gap: 32px; list-style: none; }
.nav-links a {
  font-family: 'Oswald', sans-serif;
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--text-muted); text-decoration: none;
  transition: color .2s;
}
.nav-links a:hover, .nav-links a.active { color: var(--text); }
.nav-links a.active { color: var(--orange); }
.nav-order {
  background: var(--gradient);
  padding: 9px 22px;
  font-family: 'Oswald', sans-serif;
  font-size: 12px; letter-spacing: 2px; color: #fff;
  border-radius: 2px; text-decoration: none;
  transition: opacity .2s;
}
.nav-order:hover { opacity: .85; }
.nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
.nav-hamburger span { display: block; width: 24px; height: 2px; background: #fff; transition: .3s; }
.nav-drawer {
  display: none; position: fixed; top: 64px; left: 0; right: 0;
  background: rgba(10,10,10,.98); padding: 24px 48px; z-index: 99;
  border-bottom: 1px solid #222;
}
.nav-drawer.open { display: block; }
.nav-drawer a {
  display: block; padding: 14px 0;
  font-family: 'Oswald', sans-serif;
  font-size: 18px; letter-spacing: 3px;
  color: var(--text-muted); text-decoration: none;
  border-bottom: 1px solid #1a1a1a;
}

/* ── PAGE OFFSET ─────────────────────────── */
main { padding-top: 64px; }

/* ── VIDEO BG ────────────────────────────── */
.video-bg-wrap { position: relative; overflow: hidden; }
.video-bg-wrap video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; z-index: 0;
}
.video-bg-wrap .video-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(to bottom, rgba(0,0,0,.45) 0%, rgba(0,0,0,.7) 100%);
}
.video-bg-wrap .video-content { position: relative; z-index: 2; }

/* ── SECTION SHARED ──────────────────────── */
.section-eyebrow {
  font-family: 'Oswald', sans-serif;
  font-size: 11px; letter-spacing: 4px;
  color: var(--orange); text-transform: uppercase;
  margin-bottom: 8px;
}
.section-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 6vw, 80px);
  letter-spacing: 3px; line-height: 1;
}
.section-rule {
  width: 60px; height: 3px;
  background: var(--gradient);
  border-radius: 2px; margin: 16px 0 40px;
}

/* ── BUTTONS ─────────────────────────────── */
.btn-primary {
  display: inline-block;
  background: var(--gradient);
  padding: 13px 32px;
  font-family: 'Oswald', sans-serif;
  font-size: 13px; letter-spacing: 2px; color: #fff;
  border-radius: 2px; text-decoration: none;
  transition: opacity .2s, transform .1s;
}
.btn-primary:hover { opacity: .88; }
.btn-primary:active { transform: scale(.97); }
.btn-outline {
  display: inline-block;
  border: 1.5px solid rgba(255,255,255,.4);
  padding: 13px 32px;
  font-family: 'Oswald', sans-serif;
  font-size: 13px; letter-spacing: 2px; color: #fff;
  border-radius: 2px; text-decoration: none;
  transition: border-color .2s, color .2s;
}
.btn-outline:hover { border-color: var(--orange); color: var(--orange); }

/* ── SCROLL ANIMATIONS ───────────────────── */
.reveal { opacity: 0; transform: translateY(30px); transition: opacity .5s ease, transform .5s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-scale { opacity: 0; transform: scale(.95); transition: opacity .4s ease, transform .4s ease; }
.reveal-scale.visible { opacity: 1; transform: scale(1); }

/* ── FOOTER ──────────────────────────────── */
.site-footer {
  background: #050505;
  border-top: 1px solid #1a1a1a;
  padding: 32px 48px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 16px;
}
.footer-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px; letter-spacing: 3px;
  background: var(--gradient-text);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.footer-links { display: flex; gap: 24px; }
.footer-links a {
  font-family: 'Oswald', sans-serif; font-size: 11px;
  letter-spacing: 2px; color: var(--text-dim); text-decoration: none;
}
.footer-copy { font-size: 11px; letter-spacing: 1px; color: var(--text-dim); }

/* ── RESPONSIVE ──────────────────────────── */
@media (max-width: 1024px) {
  .nav-links, .nav-order { display: none; }
  .nav-hamburger { display: flex; }
  .site-nav { padding: 0 24px; }
  .site-footer { flex-direction: column; text-align: center; padding: 24px; }
}
```

- [ ] **Step 2: Create `script.js`**

```js
/* ── NAV ─────────────────────────────────── */
const nav = document.querySelector('.site-nav');
const hamburger = document.querySelector('.nav-hamburger');
const drawer = document.querySelector('.nav-drawer');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger?.addEventListener('click', () => {
  drawer?.classList.toggle('open');
});

// Mark active nav link
document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(link => {
  if (link.href === location.href) link.classList.add('active');
});

/* ── SCROLL REVEAL ───────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Stagger children if parent has data-stagger
      if (e.target.dataset.stagger) {
        e.target.querySelectorAll('.reveal, .reveal-scale').forEach((child, i) => {
          child.style.transitionDelay = `${i * 80}ms`;
          child.classList.add('visible');
        });
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));
document.querySelectorAll('[data-stagger]').forEach(el => observer.observe(el));
```

- [ ] **Step 3: Commit**
```bash
cd "/Users/surya_reddy/Claude Code/senoritas"
git add style.css script.js && git commit -m "feat: shared CSS system and JS utilities"
```

---

## Task 6: HTML Shared Partials (Nav + Footer template)

Since HTML has no native includes, define the nav/footer as a reusable string in `script.js` and inject on load.

- [ ] **Step 1: Add nav/footer injection to `script.js` — MUST be first code block, before all other selectors**

```js
/* ── INJECT NAV + FOOTER (runs first — all other selectors depend on this) ── */
const NAV_HTML = `
<nav class="site-nav" id="siteNav">
  <a href="index.html" class="nav-logo">SENORITAS</a>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="menu.html">Menu</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="gallery.html">Gallery</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
  <a href="https://www.toasttab.com/senoritas" target="_blank" class="nav-order">ORDER NOW</a>
  <div class="nav-hamburger" id="hamburger">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="nav-drawer" id="navDrawer">
  <a href="index.html">Home</a>
  <a href="menu.html">Menu</a>
  <a href="about.html">About</a>
  <a href="gallery.html">Gallery</a>
  <a href="contact.html">Contact</a>
  <a href="https://www.toasttab.com/senoritas" target="_blank" style="color:var(--orange)">Order Online →</a>
</div>`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div>
    <div class="footer-logo">SENORITAS</div>
    <p style="font-size:11px;color:rgba(255,255,255,.3);letter-spacing:2px;margin-top:4px">BREAKFAST · LUNCH · DINNER</p>
    <p style="font-size:11px;color:rgba(255,255,255,.3);margin-top:4px"><!-- TODO: update hours --> Mon–Sun: 7:00 AM – 10:00 PM</p>
  </div>
  <nav class="footer-links">
    <a href="menu.html">Menu</a>
    <a href="about.html">About</a>
    <a href="gallery.html">Gallery</a>
    <a href="contact.html">Contact</a>
  </nav>
  <p class="footer-copy">© 2025 SENORITAS RESTAURANT · ALL RIGHTS RESERVED</p>
</footer>`;

document.getElementById('nav-placeholder')?.insertAdjacentHTML('afterend', NAV_HTML);
document.getElementById('footer-placeholder')?.insertAdjacentHTML('afterend', FOOTER_HTML);
```

- [ ] **Step 2: Commit**
```bash
git add script.js && git commit -m "feat: inject shared nav and footer via JS"
```

---

## Task 7: Home Page (`index.html`)

**Files:**
- Modify: `senoritas/index.html`

**Required IDs/classes (must match script.js exactly):**
- `id="nav-placeholder"` — nav injection target
- `id="footer-placeholder"` — footer injection target
- `.video-bg-wrap` + `<video>` + `.video-overlay` + `.video-content` — video section structure
- `.reveal` on headings/text, `.reveal-scale` on cards, `data-stagger` on card containers

- [ ] **Step 1: Build `index.html`**

Full page structure:
1. `<div id="nav-placeholder"></div>` at top of body
2. `<main>`:
   - Hero section: `div.video-bg-wrap` at 100vh height, `<video src="assets/videos/hero.mp4" autoplay muted loop playsinline>`, `.video-overlay`, `.video-content` centered with SENORITAS title + tagline + 2 CTAs (`.btn-primary` → `menu.html`, `.btn-outline` → Toast URL)
   - Meal bands: `div` with `display:grid; grid-template-columns: repeat(3,1fr)`, each child a `div.video-bg-wrap` 280px tall, `<video>` src breakfast/lunch/dinner.mp4, `.video-content` with meal label + hours
   - Feature strip: dark bg `#111`, 3-column grid, each card has icon + `.section-eyebrow` label + description, wrap in `div[data-stagger]` with `.reveal` on each card
   - CTA banner: `background: var(--gradient)`, centered "HUNGRY? ORDER ONLINE." + `.btn-outline` linking to Toast URL
3. `<div id="footer-placeholder"></div>`
4. `<script src="script.js"></script>`

- [ ] **Step 2: Verify in preview server**
```bash
# Preview already running at localhost:3001
# Check: nav visible, hero video plays, meal bands show, CTA works
```

- [ ] **Step 3: Commit**
```bash
git add index.html && git commit -m "feat: Home page"
```

---

## Task 8: Menu Page (`menu.html`)

**Required IDs/classes:**
- `id="nav-placeholder"`, `id="footer-placeholder"`
- Tab buttons: `<button data-tab-btn="breakfast">`, `data-tab-btn="lunch"`, `data-tab-btn="dinner"`
- Tab panels: `<div data-tab-panel="breakfast">`, hidden via `class="hidden"` (add `.hidden { display:none }` to style.css)
- Active tab button: `.active` class (added by JS)

- [ ] **Step 1: Build `menu.html`**

Structure:
1. `<div id="nav-placeholder"></div>`
2. Short page hero (300px, dark bg `#0a0a0a`, `.section-eyebrow` + `.section-title` "OUR MENU" + `.section-rule`)
3. Tab bar: 3 `<button data-tab-btn="breakfast|lunch|dinner">` with active styling
4. Tab panels `<div data-tab-panel="breakfast|lunch|dinner">` (lunch+dinner have `class="hidden"`):
   - 2-col grid (`@media` single col on mobile)
   - 4 placeholder cards per panel: item name (Oswald 15px), description (Inter 12px muted), price (Bebas Neue 22px orange)
5. Mobile sticky bar: `position:fixed; bottom:0; left:0; right:0` on `< lg`, "ORDER ONLINE →" → Toast URL
6. `<div id="footer-placeholder"></div>` + `<script src="script.js"></script>`

- [ ] **Step 2: Add tab switcher to `script.js`**

```js
/* ── MENU TABS ───────────────────────────── */
document.querySelectorAll('[data-tab-btn]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tabBtn;
    document.querySelectorAll('[data-tab-btn]').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('[data-tab-panel]').forEach(p => p.classList.add('hidden'));
    btn.classList.add('active');
    document.querySelector(`[data-tab-panel="${target}"]`)?.classList.remove('hidden');
  });
});
```

- [ ] **Step 3: Commit**
```bash
git add menu.html script.js && git commit -m "feat: Menu page with tab switcher"
```

---

## Task 9: About Page (`about.html`)

**Required IDs/classes:**
- `id="nav-placeholder"`, `id="footer-placeholder"`
- `.reveal` on text blocks, `data-stagger` on values container

- [ ] **Step 1: Build `about.html`**

Structure:
1. `<div id="nav-placeholder"></div>`
2. Split hero: `display:grid; grid-template-columns:1fr 1fr` (stacks on mobile). Left = `div.video-bg-wrap` with `atmosphere.mp4`, height 500px. Right = dark panel (`background:#111`) with `.section-eyebrow`, blockquote "FOOD MADE WITH HEART.", `.section-rule`, 2 `<p>` body paragraphs (placeholder). Both sides use `.reveal`
3. Values: dark bg `#0a0a0a`, `div[data-stagger]` with 3 children `.reveal`, each: icon (emoji), `.section-eyebrow` label, short `<p>`
4. Full-width image strip: `<img>` Unsplash restaurant interior, `width:100%; height:320px; object-fit:cover; filter:brightness(.6)`
5. `<div id="footer-placeholder"></div>` + `<script src="script.js"></script>`

- [ ] **Step 2: Commit**
```bash
git add about.html && git commit -m "feat: About page"
```

---

## Task 10: Gallery Page (`gallery.html`)

**Required IDs/classes (must match lightbox JS exactly):**
- `id="lightbox"` — lightbox overlay div
- `id="lightbox-img"` — `<img>` inside lightbox
- `.gallery-item` — every clickable gallery image
- Initial state: `<div id="lightbox" class="lightbox hidden">`

- [ ] **Step 1: Build `gallery.html`**

Structure:
1. `<div id="nav-placeholder"></div>`
2. Short page hero: `.section-eyebrow` + `.section-title` "OUR GALLERY"
3. Masonry grid: `<div style="columns:3; gap:8px; padding:40px 48px">` (responsive: `columns:2` at md, `columns:1` at sm). 12 `<img class="gallery-item reveal-scale">` using Unsplash food photo URLs. Each img: `width:100%; margin-bottom:8px; cursor:pointer; display:block; border-radius:2px`
4. Lightbox: `<div id="lightbox" class="lightbox hidden"><img id="lightbox-img" src="" alt=""/></div>`
5. `<div id="footer-placeholder"></div>` + `<script src="script.js"></script>`

- [ ] **Step 2: Add lightbox to `script.js`**

```js
/* ── LIGHTBOX ────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.gallery-item').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
});

lightbox?.addEventListener('click', () => {
  lightbox.classList.add('hidden');
  document.body.style.overflow = '';
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    lightbox?.classList.add('hidden');
    document.body.style.overflow = '';
  }
});
```

- [ ] **Step 3: Add lightbox CSS to `style.css`**

```css
.lightbox {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,.92);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.lightbox.hidden { display: none; }
.lightbox img { max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 4px; }
```

- [ ] **Step 4: Commit**
```bash
git add gallery.html style.css script.js && git commit -m "feat: Gallery page with lightbox"
```

---

## Task 11: Contact Page (`contact.html`)

- [ ] **Step 1: Build `contact.html`**

Structure:
1. Nav placeholder
2. Short page hero: "FIND YOUR TABLE."
3. Split layout: left = address/hours/phone, right = Google Maps iframe
4. Contact form: Name, Email, Message, Submit (`mailto:` action)
5. Footer placeholder

Placeholder values (all marked `<!-- TODO -->`):
- Address: `<!-- TODO: client address -->`
- Maps iframe src: `<!-- TODO: generate from maps.google.com -->`
- Email: `<!-- TODO: client email -->`
- Phone: `(555) 000-0000`
- Hours: Mon–Sun 7am–10pm

- [ ] **Step 2: Commit**
```bash
git add contact.html && git commit -m "feat: Contact page"
```

---

## Task 12: Responsive Polish & Final Verification

- [ ] **Step 1: Test all pages at mobile (375px)**
  - Nav collapses to hamburger
  - Meal bands stack vertically
  - Menu grid is single column
  - Gallery is 1 column
  - Contact is single column

- [ ] **Step 2: Test all pages at tablet (768px)**
  - 2-column layouts activate
  - Gallery is 2 columns

- [ ] **Step 3: Test all pages at desktop (1280px)**
  - Full layout, inline nav, 3-column meal bands, 3-column gallery

- [ ] **Step 4: Verify videos autoplay on all pages**
  - Chrome: should autoplay (muted)
  - Safari: should autoplay (muted + playsinline)

- [ ] **Step 5: Verify scroll animations**
  - Headings fade up on enter
  - Cards stagger in

- [ ] **Step 6: Create final zip for Hostinger**
```bash
cd "/Users/surya_reddy/Claude Code"
zip -r senoritas-final.zip senoritas/ --exclude "senoritas/.git/*" --exclude "senoritas/docs/*" --exclude "senoritas/.superpowers/*"
```

- [ ] **Step 7: Push to GitHub**
```bash
cd "/Users/surya_reddy/Claude Code/senoritas"
git add . && git commit -m "feat: complete frontend — 5 pages, Remotion videos, scroll animations"
git push
```

---

## Execution Order Summary

1. Task 1 — Remotion setup
2. Task 2 — Hero video
3. Task 3 — Meal band videos
4. Task 4 — Atmosphere video + render all
5. Task 5 — style.css + script.js
6. Task 6 — Nav/footer injection
7. Task 7 — Home page
8. Task 8 — Menu page
9. Task 9 — About page
10. Task 10 — Gallery page
11. Task 11 — Contact page
12. Task 12 — Polish + zip + push
