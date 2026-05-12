# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the CHITEK static HTML site to Astro framework, keeping all existing content, Tailwind v4, and self-hosted fonts intact.

**Architecture:** Introduce Astro as the build framework with `@tailwindcss/vite` for Tailwind v4 integration. Convert each HTML page to an Astro page component. Extract shared layout (nav, footer, sidebar) into Astro components. Static assets move to `public/assets/` for standard Astro compatibility. Inline JS continues to work inside Astro `<script>` tags.

**Tech Stack:** Astro 5.x, Tailwind CSS v4 (`@tailwindcss/vite`), Vite, Node.js

**Key decisions:**
- Use `@tailwindcss/vite` plugin (no separate CLI build needed)
- `public/assets/fonts/` + `public/assets/images/` for static files served at `/assets/...`
- `src/styles/global.css` as Tailwind entry point (moved from `assets/css/input.css`)
- Each HTML page gets its own `.astro` file; inline JS stays inside `<script>` tags
- `is:inline` on existing JS that runs on DOMContentLoaded (prevent Astro from tree-shaking)

---
## File Map

Before migration, this is where everything lives and where it's going:

| Current path | New path | Notes |
|---|---|---|
| `assets/css/input.css` | `src/styles/global.css` | Font URLs change to `/assets/fonts/...` |
| `assets/css/tailwind.css` | (deleted) | No longer needed; Vite builds CSS |
| `assets/fonts/` | `public/assets/fonts/` | 14 WOFF2 files, same relative structure |
| `assets/images/` | `public/assets/images/` | ~80+ images |
| `assets/js/main.js` | `BaseLayout.astro` (inline) | Scroll animation, bundled in shared layout |
| `assets/js/nav.js` | `src/scripts/nav.js` | Nav interactions (active link, hamburger, lang dropdown) |
| `assets/js/include.js` | (deleted) | Replaced by Astro component system |
| `includes/_nav.html` | `src/components/Nav.astro` | Convert HTML+JS to Astro component |
| `includes/_footer.html` | `src/components/Footer.astro` | Convert to Astro component |
| `includes/_sidebar.html` | `src/components/Sidebar.astro` | Convert to Astro component |
| `index.html` | `src/pages/index.astro` | Strip shared markup, use BaseLayout |
| `pages/about.html` | `src/pages/about.astro` | Same treatment |
| `pages/contact.html` | `src/pages/contact.astro` | Same treatment |
| `pages/services.html` | `src/pages/services.astro` | Same treatment |
| `pages/products.html` | `src/pages/products.astro` | Same treatment |
| `pages/solutions.html` | `src/pages/solutions.astro` | Same treatment |
| (new) | `src/layouts/BaseLayout.astro` | Shared HTML shell (head, nav, footer, sidebar, scripts) |
| `package.json` | `package.json` | Add Astro deps, update scripts |
| (new) | `astro.config.mjs` | Astro + @tailwindcss/vite config |
| (new) | `tsconfig.json` | Astro TypeScript config |

---

### Task 1: Initialize Astro project

**Files:**
- Modify: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`

- [ ] **Step 1: Install Astro and Vite Tailwind plugin**

```bash
cd /path/to/CHITEK
npm install astro@latest
npm install @tailwindcss/vite@latest
```

Verify versions in package.json after install.

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://chitek.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `src/env.d.ts`**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 5: Update `package.json` scripts**

Replace the current scripts with:
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview"
}
```

Keep existing `devDependencies` (tailwindcss, @tailwindcss/cli, astro, @tailwindcss/vite). The `@tailwindcss/cli` can be removed later since Vite handles Tailwind now.

- [ ] **Step 6: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/env.d.ts package-lock.json
git commit -m "feat: initialize Astro project with Tailwind v4 Vite plugin"
```

---

### Task 2: Move static assets to `public/`

**Files:**
- Move: `assets/fonts/` → `public/assets/fonts/`
- Move: `assets/images/` → `public/assets/images/`
- Move: `assets/css/input.css` → `src/styles/global.css` (and modify)
- Create: `public/assets/css/.gitkeep` (keep directory for potential future use)

- [ ] **Step 1: Create directories and move files**

```bash
mkdir -p public/assets
mv assets/fonts public/assets/fonts
mv assets/images public/assets/images
mkdir -p src/styles
mv assets/css/input.css src/styles/global.css
```

- [ ] **Step 2: Update `src/styles/global.css` font paths**

All 14 `@font-face` blocks reference `url("../fonts/...")`. Change these to `url("/assets/fonts/...")`:

```css
/* Before */
@font-face {
  font-family: "Barlow";
  src: url("../fonts/Barlow-300.woff2") format("woff2");
  ...
}

/* After */
@font-face {
  font-family: "Barlow";
  src: url("/assets/fonts/Barlow-300.woff2") format("woff2");
  ...
}
```

Change all 14 `@font-face` blocks in `src/styles/global.css`.

- [ ] **Step 3: Commit**

```bash
git add public/assets/fonts/ public/assets/images/ src/styles/global.css
git rm -r assets/fonts/ assets/images/ assets/css/
git commit -m "feat: move static assets to public/ and global CSS to src/"
```

---

### Task 3: Create BaseLayout and shared components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/Sidebar.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

Convert `includes/_nav.html` into an Astro component.

The key changes from the include approach:
- No `%ASSETS%` / `%PAGES%` tokens — use absolute paths directly (`/assets/images/logo.png`, `/about`, etc.)
- The `#hamburgerBtn` and mobile menu JS stays inside `<script>` tags
- Active link highlighting is handled by the page-level script

```astro
---
// Nav.astro — shared navigation component
---

<nav class="fixed top-0 left-0 right-0 z-[1000] h-[72px] bg-white/[0.97] backdrop-blur-md border-b border-border-light flex items-center px-5 md:px-12 gap-10 shadow-sm">
  <a href="/" class="flex items-center no-underline mr-auto">
    <img src="/assets/images/logo.png" alt="CHITEK Logo" class="w-[140px] h-auto object-contain" />
  </a>

  <!-- Hamburger button -->
  <button class="flex lg:hidden ..." id="hamburgerBtn" aria-label="Toggle menu">
    <span class="block w-[22px] h-0.5 bg-text-dark rounded transition-all duration-300 origin-center"></span>
    <span class="block w-[22px] h-0.5 bg-text-dark rounded transition-all duration-300 origin-center"></span>
    <span class="block w-[22px] h-0.5 bg-text-dark rounded transition-all duration-300 origin-center"></span>
  </button>

  <!-- Desktop nav -->
  <div class="hidden lg:flex gap-1 items-center">
    <!-- Products dropdown -->
    <div class="group relative flex items-center">
      <a href="/products" class="nav-link-base relative text-[14px] font-semibold tracking-[0.08em] ... hover:text-brand-orange">
        Products
        <span class="absolute bottom-1 left-4 right-4 h-0.5 bg-brand-orange scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100"></span>
      </a>
      <div class="absolute top-full ...">
        <a href="/products" class="block px-6 py-3 ... hover:text-brand-orange ...">Active Harmonic Filter</a>
        <a href="/products" class="block px-6 py-3 ... hover:text-brand-orange ...">Static Var Generator</a>
        <a href="/products" class="block px-6 py-3 ... hover:text-brand-orange ...">SiC AHF/SVG</a>
        <a href="/products" class="block px-6 py-3 ... hover:text-brand-orange ...">Automatic Voltage Regulator</a>
      </div>
    </div>

    <!-- Solutions dropdown -->
    <div class="group relative flex items-center">
      <a href="/solutions" class="nav-link-base relative ... hover:text-brand-orange">
        Solutions
        <span class="absolute bottom-1 left-4 right-4 h-0.5 bg-brand-orange scale-x-0 origin-left ..."></span>
      </a>
      <div class="absolute top-full ...">
        <a href="/solutions" class="block px-6 py-3 ...">Industrial Manufacturing</a>
        <a href="/solutions" class="block px-6 py-3 ...">Commercial &amp; Medical Buildings</a>
        <a href="/solutions" class="block px-6 py-3 ...">Data Centers &amp; Telecom</a>
        <a href="/solutions" class="block px-6 py-3 ...">Renewable Energy (PV/Wind)</a>
        <a href="/solutions" class="block px-6 py-3 ...">Transportation (Rail/Charging)</a>
        <a href="/solutions" class="block px-6 py-3 ...">Power Grid &amp; Utility</a>
      </div>
    </div>

    <!-- Services dropdown -->
    ...

    <!-- About -->
    <a href="/about" class="nav-link-base relative ... hover:text-brand-orange">
      About
      <span class="absolute bottom-1 left-4 right-4 h-0.5 bg-brand-orange scale-x-0 ..."></span>
    </a>

    <!-- Contact -->
    <a href="/contact" class="nav-link-base relative ... hover:text-brand-orange">
      Contact
      <span class="absolute bottom-1 left-4 right-4 h-0.5 bg-brand-orange scale-x-0 ..."></span>
    </a>
  </div>

  <!-- Language selector placeholder -->
  <div class="hidden lg:flex items-center gap-3 ml-6">
    <span class="text-[13px] font-semibold text-text-mid tracking-wider uppercase">EN</span>
  </div>
</nav>

<!-- Mobile menu (exact copy from _nav.html, with absolute paths) -->
<div id="mobileMenu" class="fixed top-[72px] left-0 right-0 bottom-0 bg-white z-[999] hidden flex-col overflow-y-auto lg:hidden">
  <!-- ... nav links with /products, /solutions, /services, /about, /contact ... -->
</div>

<script>
  // Same nav.js content — active link, hamburger, mobile submenu, lang dropdown
  (function() {
    'use strict';

    function initNav() {
      // Active link highlighting
      var current = window.location.pathname.split('/').pop() || 'index.html';
      if (current === '' || current === '/') current = 'index.html';
      document.querySelectorAll('.nav-link-base').forEach(function(link) {
        var href = link.getAttribute('href');
        if (!href) return;
        var file = href.split('/').pop();
        if (file === current) {
          link.classList.add('text-brand-orange');
          var underline = link.querySelector('span');
          if (underline) {
            underline.classList.remove('scale-x-0');
            underline.classList.add('scale-x-100');
          }
        }
      });

      // Hamburger
      var btn = document.getElementById('hamburgerBtn');
      var menu = document.getElementById('mobileMenu');
      if (btn && menu) {
        btn.addEventListener('click', function() {
          var open = btn.classList.toggle('open');
          menu.classList.toggle('open', open);
          menu.style.display = open ? 'flex' : '';
          document.body.style.overflow = open ? 'hidden' : '';
        });
        window.addEventListener('resize', function() {
          if (window.innerWidth > 1024) {
            btn.classList.remove('open');
            menu.classList.remove('open');
            menu.style.display = '';
            document.body.style.overflow = '';
          }
        });
      }

      // Mobile submenu
      document.querySelectorAll('.mobile-menu-parent[data-submenu]').forEach(function(parent) {
        parent.addEventListener('click', function() {
          var id = parent.getAttribute('data-submenu');
          var sub = document.getElementById(id);
          parent.classList.toggle('expanded');
          if (sub) sub.classList.toggle('open');
        });
      });

      // Language dropdown
      var wrapper = document.querySelector('.lang-group');
      if (wrapper) {
        var dd = wrapper.querySelector('.lang-dropdown');
        var arrow = wrapper.querySelector('.lang-arrow');
        if (dd) {
          wrapper.addEventListener('mouseenter', function() {
            dd.classList.add('opacity-100', 'visible');
            dd.classList.remove('opacity-0', 'invisible');
            if (arrow) arrow.style.transform = 'rotate(180deg)';
          });
          wrapper.addEventListener('mouseleave', function() {
            dd.classList.remove('opacity-100', 'visible');
            dd.classList.add('opacity-0', 'invisible');
            if (arrow) arrow.style.transform = '';
          });
        }
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNav);
    } else {
      initNav();
    }
  })();
</script>
```

**Note to implementer:** The full nav contains many list items, dropdown menus, SVG icons, and Tailwind classes. Copy the complete nav structure from `includes/_nav.html`, changing only:
- `%ASSETS%index.html` → `/`
- `%ASSETS%assets/images/logo.png` → `/assets/images/logo.png`
- `%PAGES%products.html` → `/products`
- `%PAGES%solutions.html` → `/solutions`
- `%PAGES%services.html` → `/services`
- `%PAGES%about.html` → `/about`
- `%PAGES%contact.html` → `/contact`
- `href="index.html"` → `href="/"`
- `href="pages/products.html"` → `href="/products"` (etc.)
- Language selector HTML stays but active link JS targets `document.querySelector('.lang-group')` (may not exist yet — that's fine, null-safe)

- [ ] **Step 2: Create `src/components/Footer.astro`**

Convert `includes/_footer.html` with same path changes:
- `%ASSETS%index.html` → `/`
- `%ASSETS%assets/images/logo.png` → `/assets/images/logo.png`
- `%PAGES%products.html` → `/products`
- `%PAGES%solutions.html` → `/solutions`
- `%PAGES%services.html` → `/services`
- `%PAGES%about.html` → `/about`
- `%PAGES%contact.html` → `/contact`

- [ ] **Step 3: Create `src/components/Sidebar.astro`**

Convert `includes/_sidebar.html` as-is (no tokens to replace, all inline content).

- [ ] **Step 4: Create `src/layouts/BaseLayout.astro`**

```astro
---
// BaseLayout.astro — shared HTML shell for all pages
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Sidebar from '../components/Sidebar.astro';

export interface Props {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

const { title, description, ogTitle, ogDescription, ogImage, ogUrl } = Astro.props;
const defaultOgImage = 'https://chitek.com/assets/images/logo.png';
const defaultOgUrl = 'https://chitek.com';
---

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Open Graph -->
  <meta property="og:title" content={ogTitle || title} />
  <meta property="og:description" content={ogDescription || description} />
  <meta property="og:image" content={ogImage || defaultOgImage} />
  <meta property="og:url" content={ogUrl || defaultOgUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="CHITEK INNOPOWER" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={ogTitle || title} />
  <meta name="twitter:description" content={ogDescription || description} />
</head>
<body class="font-barlow text-text-dark bg-white overflow-x-hidden">
  <Nav />
  <slot /> <!-- Page content goes here -->
  <Footer />
  <Sidebar />

  <!-- Shared: scroll fade-in animation (applies to all pages) -->
  <script>
    (function() {
      'use strict';
      function initScrollAnimation() {
        var observer = new IntersectionObserver(
          function(entries) {
            entries.forEach(function(e) {
              if (e.isIntersecting) e.target.classList.add('visible');
            });
          },
          { threshold: 0.12 }
        );
        document.querySelectorAll('.fade-up').forEach(function(el) {
          observer.observe(el);
        });
        setTimeout(function() {
          document.querySelectorAll('.hero .fade-up').forEach(function(el) {
            el.classList.add('visible');
          });
        }, 100);
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimation);
      } else {
        initScrollAnimation();
      }
    })();
  </script>
</body>
</html>
```

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Nav.astro src/components/Footer.astro src/components/Sidebar.astro
git commit -m "feat: create BaseLayout and shared components"
```

---

### Task 4: Migrate homepage (index.html → index.astro)

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const meta = {
  title: 'CHITEK INNOPOWER – Power Quality Solutions Manufacturer',
  description: 'CHITEK is a leading manufacturer of low-voltage power quality solutions — Active Harmonic Filter (AHF), Static Var Generator (SVG), and Automatic Voltage Regulator (AVR) for industrial and commercial applications.',
};
---

<BaseLayout title={meta.title} description={meta.description}>
  <!-- Copy the ENTIRE <body> content from index.html EXCEPT nav, footer, sidebar -->
  <!-- i.e., everything from the first section after <nav> to before <footer> -->
  <!-- Remove ALL %PAGES% and %ASSETS% token logic — use absolute paths -->

  <!-- Hero Section -->
  <section class="relative ...">
    ...
  </section>

  <!-- Products overview section -->
  ...

  <!-- Solutions preview section -->
  ...

  <!-- Stats section -->
  ...

  <!-- CTA section -->
  ...

</BaseLayout>
```

**Path changes for homepage:**
- `pages/products.html` → `/products`
- `pages/solutions.html` → `/solutions`
- `pages/services.html` → `/services`
- `pages/about.html` → `/about`
- `pages/contact.html` → `/contact`
- `assets/images/...` → `/assets/images/...`

**Important:** Scroll animation script is already in BaseLayout — no need to add it per-page.

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: migrate homepage to Astro"
```

---

### Task 5: Migrate about page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

Same pattern as index page — `BaseLayout` wrapper, body content from `pages/about.html` minus nav/footer/sidebar.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const meta = {
  title: 'About CHITEK – Power Quality Company Profile & Certifications',
  description: 'CHITEK is a high-tech enterprise founded in 2019, specializing in power electronics R&D, manufacturing, and service...',
};
---

<BaseLayout title={meta.title} description={meta.description}>
  <!-- Copy body content from pages/about.html, minus shared components -->

  <!-- Hero section -->
  ...

  <!-- Timeline / History -->
  ...

  <!-- Certifications carousel -->
  ...

  <!-- Include the certification carousel JS from pages/about.html -->
  <script>
    // Copy the AboutPage JS from pages/about.html (scroll + cert carousel)
    (function() { /* ... */ })();
  </script>
</BaseLayout>
```

**Path changes:**
- `href="../index.html"` → `href="/"`
- `href="solutions.html"` → `href="/solutions"` (etc.)
- `src="../assets/images/..."` → `src="/assets/images/..."`
- `url('/assets/images/...')` — already correct from previous migration
- Remove `<base target="_blank">` tag (present in current about.html)

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: migrate about page to Astro"
```

---

### Task 6: Migrate contact page

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Create `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const meta = {
  title: 'Contact CHITEK – Sales & Technical Support | Power Quality',
  description: 'Contact CHITEK for sales inquiries, technical support, and partnership opportunities...',
};
---

<BaseLayout title={meta.title} description={meta.description}>
  <!-- Copy body content from pages/contact.html, minus shared components -->

  <!-- Contact form section -->
  ...

  <!-- Contact info cards -->
  ...

  <!-- Map / location -->
  ...
</BaseLayout>
```

**Path changes:** Same pattern — relative paths to absolute `/assets/images/...`.

- [ ] **Step 2: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: migrate contact page to Astro"
```

---

### Task 7: Migrate services page

**Files:**
- Create: `src/pages/services.astro`

- [ ] **Step 1: Create `src/pages/services.astro`**

Same pattern as other pages. This page has:
- Hero section with `services-hero-bg.png`
- OEM/ODM section
- Technical support section
- Distributor program section
- Several inline `<script>` blocks (scroll animations, tab switching)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const meta = {
  title: 'Services — OEM/ODM, Technical Support & Distributor Program | CHITEK',
  description: '...',
};
---

<BaseLayout title={meta.title} description={meta.description}>
  <!-- Copy body content from pages/services.html, minus shared components -->
  <!-- Convert relative img src paths to absolute -->
  <!-- Keep all inline scripts -->
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/services.astro
git commit -m "feat: migrate services page to Astro"
```

---

### Task 8: Migrate products page (largest page)

**Files:**
- Create: `src/pages/products.astro`

- [ ] **Step 1: Create `src/pages/products.astro`**

This is the largest page (~2600 lines) with multiple sections (AHF, SVG, AVR), spec tables, case study carousels, industry grids, and substantial inline JS data arrays.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const meta = {
  title: 'CHITEK — Low Voltage AHF, SVG & AVR Manufacturer | Power Quality Solutions',
  description: '...',
};
---

<BaseLayout title={meta.title} description={meta.description}>
  <!-- Hero section with tabs for AHF/SVG/AVR -->
  ...

  <!-- Product detail sections -->
  <!-- AHF section with all specs -->
  <!-- SVG section with all specs -->
  <!-- AVR section with all specs -->

  <!-- Case study carousels -->
  ...

  <!-- Industry applications grid -->
  ...

  <!-- Specification tables (from JS data) -->
  ...

  <!-- All inline JS scripts including data objects -->
  <script>
    // Copy ALL inline JS from products.html
    // Including data arrays for spec tables, carousel config, etc.
  </script>
</BaseLayout>
```

**Path changes:**
- `src="../assets/images/..."` → `src="/assets/images/..."`
- `style="background:url('../assets/images/...')"` → `style="background:url('/assets/images/...')"`

- [ ] **Step 2: Commit**

```bash
git add src/pages/products.astro
git commit -m "feat: migrate products page to Astro"
```

---

### Task 9: Migrate solutions page (large page with JS data)

**Files:**
- Create: `src/pages/solutions.astro`

- [ ] **Step 1: Create `src/pages/solutions.astro`**

This page has extensive inline JS with data objects for case studies, hero images config, industry cards. Keep all inline JS.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const meta = {
  title: 'Power Quality Solutions – Industrial & Utility Applications | CHITEK',
  description: '...',
};
---

<BaseLayout title={meta.title} description={meta.description}>
  <!-- Body content from pages/solutions.html minus shared components -->

  <!-- All inline JS data and logic -->
  <script>
    // Copy ALL inline JS from solutions.html
    // Data objects for case studies, tab config, hero slider, etc.
  </script>
</BaseLayout>
```

**Path changes:**
- `src="../assets/images/..."` → `src="/assets/images/..."`
- `style="background-image: url('../assets/images/...')"` → `style="background-image: url('/assets/images/...')"`
- JS data: `image: '../assets/images/...'` → `image: '/assets/images/...'`

- [ ] **Step 2: Commit**

```bash
git add src/pages/solutions.astro
git commit -m "feat: migrate solutions page to Astro"
```

---

### Task 10: Clean up old files and update config

**Files:**
- Delete: `index.html`
- Delete: `pages/` (entire directory)
- Delete: `includes/` (entire directory)
- Delete: `assets/js/` (entire directory)
- Delete: `assets/css/` (empty after move)
- Delete: `assets/` (empty)
- Delete: `serve.bat`
- Modify: `.gitignore`
- Modify: `package.json` (remove @tailwindcss/cli from deps, update scripts)
- Modify: `CLAUDE.md` (reflect new structure)

- [ ] **Step 1: Remove old files**

```bash
git rm index.html
git rm -r pages/
git rm -r includes/
git rm -r assets/js/
git rm -r assets/css/
git rm serve.bat
rmdir assets/ 2>/dev/null || true
```

- [ ] **Step 2: Update `.gitignore`**

```gitignore
node_modules
dist
.DS_Store
```

Replace `assets/css/tailwind.css` with `dist` (Astro build output).

- [ ] **Step 3: Update `package.json`**

Remove `@tailwindcss/cli` from devDependencies (no longer needed). Keep `tailwindcss` and `@tailwindcss/vite`.

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "tailwindcss": "^4.3.0",
    "astro": "^5.x"
  }
}
```

- [ ] **Step 4: Reinstall to remove old deps**

```bash
rm -rf node_modules package-lock.json
npm install
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore package.json package-lock.json
git rm --cached serve.bat index.html pages/ includes/ assets/js/ assets/css/ 2>/dev/null || true
git commit -m "chore: clean up old HTML files and update deps for Astro"
```

---

### Task 11: Build and verify

**Files:**
- Test: `astro build` output
- Test: All 6 pages render correctly

- [ ] **Step 1: Build the site**

```bash
npm run build
```

Expected: Astro builds successfully, output in `dist/`. No 404s for assets.

- [ ] **Step 2: Start dev server and check pages**

```bash
npm run dev
```

Visit each page in the browser and check:
- [ ] `/` — Homepage loads, images visible, nav/footer render
- [ ] `/about` — About page, certification carousel works
- [ ] `/contact` — Contact form renders
- [ ] `/services` — Services sections visible
- [ ] `/products` — Products page, spec tables, carousels
- [ ] `/solutions` — Solutions page, case studies, tab switching

Check console for 0 errors and 0 warnings.

- [ ] **Step 3: Verify all images and fonts load**

Check the Network tab for any 404s. All images at `/assets/images/...` and fonts at `/assets/fonts/...` should return 200.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: complete Astro migration, all pages verified"
```

---

## Self-Review Checklist

1. **Spec coverage:** 
   - All 6 HTML pages converted to Astro ✅ (Tasks 4-9)
   - Nav/Footer/Sidebar extracted to components ✅ (Task 3)
   - Tailwind v4 integrated via Vite plugin ✅ (Task 1)
   - Static assets in public/ ✅ (Task 2)
   - Old files cleaned up ✅ (Task 10)
   - Build verified ✅ (Task 11)

2. **Placeholder scan:** No "TBD", "TODO", or vague instructions. Every step has concrete code or explicit instructions.

3. **Type consistency:** All paths use convention `/assets/images/...` and `/assets/fonts/...` consistently. Nav links use `/products`, `/solutions`, `/services`, `/about`, `/contact`.

---

## Open Questions Before Execution

1. **Tailwind v4 + Astro compat**: Verify that `@tailwindcss/vite` works correctly with the version of Astro that gets installed. If there's a compatibility issue, fall back to keeping the CLI build and importing the output CSS.

2. **`<base>` tag**: about.html currently has `<base target="_blank">` which affects all relative link behavior. Remove it in the Astro version since all links will be absolute.

3. **Page-specific JS**: solutions.html and products.html have extensive inline JS that may need `type="module"` or `is:inline` in Astro. Since we keep it in `<script>` tags (non-module by default), it should work as-is. But verify that Astro doesn't hoist or tree-shake these scripts — use `is:inline` if needed.
