# Tailwind CLI Local Build Implementation Plan

> **For agentic workers:** Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace Tailwind CDN with local CLI v4 build, self-host fonts, and prepare for Netlify deployment.

**Architecture:** Single CSS entry point (`input.css`) containing `@import "tailwindcss"`, `@theme` design tokens (merged from all pages), `@font-face` declarations for locally hosted fonts, and custom CSS. Tailwind v4 CLI builds output to `tailwind.css`. All 6 HTML pages updated to reference local CSS instead of CDN.

**Tech Stack:** Tailwind CSS v4 CLI (`@tailwindcss/cli`), self-hosted WOFF2 fonts

---

### Task 1: Initialize package.json & install dependencies

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialize and install**

```bash
cd "F:/下载/CHITEK"
npm init -y
npm install tailwindcss @tailwindcss/cli
```

- [ ] **Step 2: Create .gitignore**

Write to `.gitignore`:
```
node_modules
assets/css/tailwind.css
.DS_Store
```

- [ ] **Step 3: Add build scripts to package.json**

```json
"scripts": {
  "dev": "tailwindcss -i assets/css/input.css -o assets/css/tailwind.css --watch",
  "build": "tailwindcss -i assets/css/input.css -o assets/css/tailwind.css --minify"
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json .gitignore
git commit -m "chore: init package.json with Tailwind v4 CLI"
```

---

### Task 2: Download & self-host fonts

**Files:**
- Create: `assets/fonts/` directory + WOFF2 files

- [ ] **Step 1: Check if curl is available and download fonts**

Fetch Google Fonts CSS to discover font file URLs:

```bash
curl -s "https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700&display=swap" -H "User-Agent: Mozilla/5.0"
```

This returns `@font-face` blocks with `src: url(https://fonts.gstatic.com/...)`. Parse out the WOFF2 URLs.

- [ ] **Step 2: Download each WOFF2 file**

For each URL from the CSS response, download to `assets/fonts/`:
- `Barlow-300.woff2`
- `Barlow-400.woff2`
- `Barlow-500.woff2`
- `Barlow-600.woff2`
- `BarlowCondensed-400.woff2`
- `BarlowCondensed-600.woff2`
- `BarlowCondensed-700.woff2`

```bash
# Example for each font file:
curl -s "https://fonts.gstatic.com/..." -o "assets/fonts/Barlow-400.woff2"
```

- [ ] **Step 3: Commit**

```bash
git add assets/fonts/
git commit -m "feat: self-host Barlow and Barlow Condensed fonts"
```

---

### Task 3: Create input.css with @theme + @font-face + custom CSS

**Files:**
- Create: `assets/css/input.css`

- [ ] **Step 1: Create input.css directory**

```bash
mkdir -p "F:/下载/CHITEK/assets/css"
```

- [ ] **Step 2: Write input.css**

```css
@import "tailwindcss";

@font-face {
  font-family: "Barlow";
  font-style: normal;
  font-weight: 300;
  src: url("../fonts/Barlow-300.woff2") format("woff2");
}

@font-face {
  font-family: "Barlow";
  font-style: normal;
  font-weight: 400;
  src: url("../fonts/Barlow-400.woff2") format("woff2");
}

@font-face {
  font-family: "Barlow";
  font-style: normal;
  font-weight: 500;
  src: url("../fonts/Barlow-500.woff2") format("woff2");
}

@font-face {
  font-family: "Barlow";
  font-style: normal;
  font-weight: 600;
  src: url("../fonts/Barlow-600.woff2") format("woff2");
}

@font-face {
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 400;
  src: url("../fonts/BarlowCondensed-400.woff2") format("woff2");
}

@font-face {
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  src: url("../fonts/BarlowCondensed-600.woff2") format("woff2");
}

@font-face {
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 700;
  src: url("../fonts/BarlowCondensed-700.woff2") format("woff2");
}

@theme {
  /* Brand colors */
  --color-brand-orange: #ff6b1a;
  --color-brand-orange-dark: #d9550f;
  --color-brand-orange-light: #ff8c4a;

  /* Dark backgrounds */
  --color-bg-dark: #07101e;
  --color-bg-mid: #0c1a2e;
  --color-footer-bg: #0f1923;

  /* Text colors */
  --color-text-dark: #1a1a1a;
  --color-text-mid: #444444;
  --color-text-muted: #6b7280;

  /* Borders */
  --color-border-light: #e5e7eb;

  /* Solutions page colors */
  --color-brand-navy: #264653;
  --color-brand-gray: #6d6875;
  --color-bg-page: #fff9f5;
  --color-bg-alt: #fef3e8;
  --color-bg-card: #ffffff;
  --color-bg-footer: #0f1923;
  --color-text-primary: #264653;
  --color-text-secondary: #6d6875;
  --color-border-subtle: #e8d5c8;
  --color-border-card: #fef3e8;
  --color-electric-orange: #ff6b1a;
  --color-electric-orange-hover: #d9550f;
  --color-commercial-green: #e9c46a;
  --color-bg-alt-1: #fef3e8;
  --color-bg-alt-2: #fdf0e5;
  --color-bg-alt-3: #fce8d5;

  /* Font families */
  --font-family-barlow: "Barlow", sans-serif;
  --font-family-barlow-condensed: "Barlow Condensed", sans-serif;

  /* Layout tokens */
  --spacing-nav: 72px;
  --max-width-page: 1280px;

  /* Z-index */
  --z-index-nav: 1000;
  --z-index-dropdown: 1001;
  --z-index-sidebar: 9999;
  --z-index-overlay: 999;

  /* Animations */
  --animate-slide-up-300: slideUp 0.5s ease-out 0.3s both;
  --animate-slide-up-450: slideUp 0.5s ease-out 0.45s both;
  --animate-slide-up-600: slideUp 0.5s ease-out 0.6s both;
  --animate-fade-in: fadeIn 0.7s ease-out 0.1s both;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Shared custom styles */
.fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fade-up.visible { opacity: 1; transform: none; }
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/input.css
git commit -m "feat: create Tailwind input.css with design tokens and self-hosted fonts"
```

---

### Task 4: Build & verify tailwind.css

- [ ] **Step 1: Run initial build**

```bash
cd "F:/下载/CHITEK"
npx @tailwindcss/cli -i assets/css/input.css -o assets/css/tailwind.css
```

Expected: No errors. `assets/css/tailwind.css` is created (~3-5MB for full framework, will shrink with --minify).

- [ ] **Step 2: Verify output exists**

```bash
ls -lh assets/css/tailwind.css
```

Expected: File exists and is not empty.

- [ ] **Step 3: Commit**

```bash
git add -f assets/css/tailwind.css  # binary file, will be gitignored later
git commit -m "chore: initial Tailwind CSS build output"
```

---

### Task 5: Update index.html

**File:**
- Modify: `index.html`

- [ ] **Step 1: Replace head section**

Remove (lines 23-52):
```html
<link
  href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = { ... }
</script>
<style>
  .tab.active { ... }
</style>
```

Add:
```html
<link href="/assets/css/tailwind.css" rel="stylesheet">
```

- [ ] **Step 2: Keep inline custom styles that aren't in input.css**

Check if `.tab.active` is used in index.html. If it is used but not in the shared CSS, add a `<style>` tag:
```html
<style>
  .tab.active { color: #ff6b1a; border-color: #ff6b1a; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: migrate index.html to local Tailwind CSS build"
```

---

### Task 6: Update pages/*.html (5 pages)

**Files:**
- Modify: `pages/about.html`
- Modify: `pages/contact.html`
- Modify: `pages/products.html`
- Modify: `pages/services.html`
- Modify: `pages/solutions.html`

Each page needs the same changes:
1. Remove `<link rel="preconnect" href="https://fonts.googleapis.com">`
2. Remove `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
3. Remove `<link href="https://fonts.googleapis.com/css2?family=Barlow..." rel="stylesheet">`
4. Remove `<script src="https://cdn.tailwindcss.com">`
5. Remove inline `<script>tailwind.config = {...}</script>`
6. Remove inline `<style>` blocks (CSS migrated to input.css)
7. Add `<link href="../assets/css/tailwind.css" rel="stylesheet">` (note: `../` because pages are in subdirectory)

**solutions.html special case:** Keep `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>` — this is a separate dependency, not related to Tailwind.

**contact.html special case:** The `<style>` block contains `.fade-up` which is already in input.css, safe to remove entirely. But verify it doesn't conflict.

- [ ] **Step 1: Update about.html**

Read the head section, make the replacements above. Verify nav.js path remains `../assets/js/nav.js`.

- [ ] **Step 2: Update contact.html**

Same as step 1. Remove the inline `<style>` with fade-up classes (now in input.css).

- [ ] **Step 3: Update products.html**

Same pattern.

- [ ] **Step 4: Update services.html**

Same pattern.

- [ ] **Step 5: Update solutions.html**

Same pattern, but keep the Lucide icons script:
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

- [ ] **Step 6: Verify all pages have correct CSS path**

For `index.html`: `<link href="/assets/css/tailwind.css" rel="stylesheet">`
For `pages/*.html`: `<link href="../assets/css/tailwind.css" rel="stylesheet">`

- [ ] **Step 7: Commit**

```bash
git add pages/
git commit -m "feat: migrate all subpages to local Tailwind CSS build"
```

---

### Task 7: Cleanup unused files

- [ ] **Step 1: Delete unused tailwind.config.js**

```bash
rm "F:/下载/CHITEK/tailwind.config.js"
```

- [ ] **Step 2: Update serve.bat**

Current content uses `npx serve .`. Update to use the `npm run dev` for Tailwind watch + serve:

```bat
@echo off
echo [CHITEK] 启动本地开发服务器...
echo.
echo Starting Tailwind CSS watcher...
start /B npx @tailwindcss/cli -i assets/css/input.css -o assets/css/tailwind.css --watch
echo Starting HTTP server...
npx serve . --listen 3000
pause
```

Or simpler — just add build step and serve:

```bat
@echo off
echo [CHITEK] Building CSS...
call npx @tailwindcss/cli -i assets/css/input.css -o assets/css/tailwind.css --minify
echo.
echo Starting server...
npx serve . --listen 3000
pause
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js -D  # Use -D for delete, if tracked
# or
git rm tailwind.config.js
git add serve.bat
git commit -m "chore: cleanup unused tailwind.config.js, update serve.bat"
```

---

### Task 8: Final verification

- [ ] **Step 1: Rebuild from clean state**

```bash
cd "F:/下载/CHITEK"
rm assets/css/tailwind.css
npx @tailwindcss/cli -i assets/css/input.css -o assets/css/tailwind.css --minify
```

Expected: No errors, tailwind.css is generated.

- [ ] **Step 2: Start local server and visually verify**

```bash
npx serve .
```

Open `http://localhost:3000` and verify:
- [ ] index.html loads with correct styles
- [ ] All fonts render correctly (Barlow body, Barlow Condensed headings)
- [ ] Navigation works and has correct hover states
- [ ] Language selector dropdown works
- [ ] Verify contact.html → no 404s, fade-up animations work
- [ ] Verify solutions.html → colors correct, animations work, Lucide icons still render
- [ ] Verify products.html, services.html, about.html

- [ ] **Step 3: Cross-check any missing styles**

Open DevTools, check for any missing Tailwind utility classes that aren't being generated. If missing classes are found, add them to input.css.

- [ ] **Step 4: Commit final state**

```bash
git add -A
git commit -m "chore: final build and verification"
```
