# CHITEK: Tailwind CLI Migration & Netlify Deployment Design

## Overview

Migrate CHITEK from Tailwind CDN (Play) to local Tailwind CLI v4 build, then deploy to Netlify. This is the foundation for future i18n and Astro migration phases.

## Phase 1A — Tailwind CLI Local Build

### Current State

- All 6 HTML pages load `https://cdn.tailwindcss.com` (Play CDN)
- Tailwind config embedded inline via `<script>tailwind.config = {...}</script>`
- No local CSS output exists
- `tailwind.config.js` file exists but unused
- Fonts loaded from Google Fonts CDN (`fonts.googleapis.com`)
- CLAUDE.md specifies `variables.css → reset.css → layout.css → components.css → pages/*.css` structure, but none of these files exist yet

### Target State

- Tailwind v4 CLI generates `assets/css/tailwind.css` locally
- All HTML pages link to local CSS instead of CDN scripts
- Fonts self-hosted in `assets/fonts/` as WOFF2 files
- CLAUDE.md CSS structure created with proper import chain
- Build script in `package.json`

### Font Self-Hosting Strategy

| Font | Weights | Usage |
|------|---------|-------|
| Barlow | 300, 400, 500, 600 | Body text |
| Barlow Condensed | 400, 600, 700 | Headings |

**Approach:**
1. Fetch Google Fonts CSS API response to get `@font-face` declarations with WOFF2 URLs
2. Download all WOFF2 files to `assets/fonts/`
3. Add `@font-face` rules directly in the CSS entry point
4. Remove Google Fonts CDN `<link>` from all HTML pages

### CSS File Structure (Astro-simple)

```
assets/css/
├── input.css          # Single entry: @import "tailwindcss" + @theme + @font-face + custom CSS
└── tailwind.css       # CLI build output (gitignored)
```

One CSS entry point, everything in one place. Easy to migrate to Astro later.

### Implementation

1. **package.json**: `npm init -y`, add build scripts
2. **Dependencies**: `tailwindcss`, `@tailwindcss/cli`
3. **Create `assets/css/input.css`**: @import "tailwindcss" + @theme block + @font-face + custom CSS
4. **Download fonts**: Fetch from Google Fonts API, save WOFF2 to `assets/fonts/`
5. **Build**: `npx @tailwindcss/cli -i assets/css/input.css -o assets/css/tailwind.css`
6. **HTML updates** — each of 6 pages + includes files:
   - Remove `<script src="https://cdn.tailwindcss.com">`
   - Remove inline `tailwind.config` block
   - Remove Google Fonts `<link>` elements
   - Add `<link href="/assets/css/tailwind.css" rel="stylesheet">`
7. **Add** `.gitignore` (node_modules, tailwind.css)
8. **Add** `serve.bat` update
9. **Delete** unused `tailwind.config.js`

## Phase 1B — Netlify Deployment

### Target Architecture

```
Git Repo → Netlify → CDN → HTTPS (auto)
                → Form handling (built-in)
                → Custom domain + DNS
```

### Key Config

- **`netlify.toml`**: Build command, publish directory, redirect rules
- **Form handling**: Netlify's native form handler via `netlify` attribute on `<form>`
- **Custom domain**: Point DNS to Netlify nameservers
- **Deploy method**: Git-based (auto-deploy from push) or Netlify Drop

### Redirect Rules (future-proof)

```toml
[[redirects]]
  from = "/fr/*"
  to = "/fr/index.html"
  status = 200
```

## Future Phases (Outline)

### Phase 2 — 6 Languages (EN/FR/ES/PT/AR/RU)
- JSON-based i18n with runtime JS translation loading
- Language selector in nav (already partially built)
- Directory-based URLs (/fr/, /es/, etc.) via Netlify redirects

### Phase 3 — Astro Migration
- Replace raw HTML pages with Astro `.astro` components
- Island architecture for interactive elements (form, language switcher)
- Netlify adapter for deployment (unchanged infrastructure)

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tailwind version | v4 (latest) | Future-proof, simpler CSS-based config |
| Build tool | Tailwind CLI only | No PostCSS/other tooling needed for static site |
| Deployment | Netlify | Built-in CDN, HTTPS, forms, free tier |
| Local dev | `netlify dev` or `serve` | Simple, replicates production environment |
