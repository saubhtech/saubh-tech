# Saubh.Tech — Project Index
> Last updated: February 19, 2026 (monorepo migration complete, S2 verified, 13 languages active)

## 🏗️ Infrastructure

| Item | Detail |
|------|--------|
| **Server** | Microsoft FXT6600 Bare Metal |
| **IP** | 103.67.236.186 |
| **OS** | Ubuntu 24 |
| **SSH Port** | 5104 (key-only, user: admin1) |
| **Web Server** | Caddy (auto HTTPS) |
| **Domain** | saubh.tech |
| **Database** | PostgreSQL |
| **Cache** | Redis |
| **Process Manager** | PM2 |
| **Container Runtime** | Docker + Docker Compose |
| **Firewall** | UFW + fail2ban |
| **Ports Open** | 80/443 (web), 5104 (SSH), 3000 (Next.js) |

## 📂 Monorepo Structure

```
platform/                          ← repo root
├── Makefile                       ← make dev / make build / make deploy
├── package.json                   ← workspace root (zero deps, only scripts)
├── pnpm-workspace.yaml            ← apps/* + packages/*
├── pnpm-lock.yaml
├── PROJECT-INDEX.md               ← this file
├── README.md
├── .gitignore
├── backup-local.ps1
├── scripts/                       ← repo-level tooling
│   ├── auto-translate.py          ← automated i18n translation engine
│   ├── install-auto-translate.sh  ← server installer for auto-translate
│   └── validate-i18n.ts           ← CLI i18n key validator
├── apps/
│   └── web/                       ← @saubhtech/web (Next.js 16)
│       ├── package.json
│       ├── next.config.ts
│       ├── postcss.config.mjs
│       ├── tsconfig.json
│       ├── public/                ← static assets (logo.jpg, SVGs)
│       └── src/
│           ├── middleware.ts
│           ├── app/               ← Next.js App Router pages + API routes
│           ├── components/        ← 17 React components
│           └── lib/               ← i18n system, constants
└── packages/
    └── shared/                    ← @saubhtech/shared
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── types/             ← LangCode, Language, TranslationMap
            ├── constants/         ← RTL_LANGS, APP_NAME, etc.
            └── utils/             ← isRtl(), getDir()
```

### GitHub
- **Repo**: https://github.com/saubhtech/platform (public, branch: main)
- **Local Path**: `C:\Users\Rishutosh Kumar\Documents\platform`
- **Server Path**: `/data/projects/saubh-gig/`

### Workspaces
| Package | Name | Description |
|---------|------|-------------|
| `apps/web` | `@saubhtech/web` | Next.js 16 + TypeScript + Tailwind v4 web app |
| `packages/shared` | `@saubhtech/shared` | Shared types, constants, utilities |

---

## 🌐 i18n System — Architecture

### Translation Loading (Direct Dynamic Imports)
```
Page loads → useEffect detects ?lang=hi (or cookie)
           → LANG_LOADERS['hi']() = import('./strings/hi')
           → Webpack chunk loads (code-split, no API)
           → Merge with English fallback: { ...enBase, ...hiStrings }
           → All components re-render via React Context t() function
```

**No API dependency.** Translations are bundled as webpack chunks.

### Type Safety (3-Layer Protection)
| Layer | Mechanism | What it catches |
|-------|-----------|-----------------|
| **TypeScript** | `TranslationStrings` type from `en.ts` | `pnpm build` FAILS if any key missing |
| **CLI Script** | `scripts/validate-i18n.ts` | Batch check all files, list exact missing keys |
| **Runtime API** | `GET /api/lang/validate` | Live coverage % per deployed language |

### React Keys Rule (Critical!)
All `.map()` in components MUST use **stable non-translated keys** (`id`, `index`, or i18n key string). Never `key={t('...')}` — causes invisible sections when language switches due to `anim-up` animation conflict.

### How to Add a New Language
```
1. Create: apps/web/src/lib/i18n/strings/xx.ts
   - Import type: import type { TranslationStrings } from './en';
   - Use type: const xx: TranslationStrings = { ...212 keys... };
   - TypeScript will ERROR if any key is missing

2. Register loader in apps/web/src/lib/i18n/TranslationProvider.tsx:
   const LANG_LOADERS: Record<string, LangLoader> = {
     hi: () => import('./strings/hi'),
     xx: () => import('./strings/xx'),  // ← add this line
   };

3. Deploy:
   make deploy
   # or manually:
   ssh -p 5104 admin1@103.67.236.186
   cd /data/projects/saubh-gig && git pull origin main && pnpm install && pnpm build && pm2 restart saubh-gig

4. Test:
   https://saubh.tech/?lang=xx
```

---

## 📁 Key Files (Must-Read for New Sessions)

### ⭐ Files Opus Must Read Before Any Task
| Priority | File | Purpose |
|----------|------|---------|
| 1 | `PROJECT-INDEX.md` | This file — full project context, architecture, i18n status |
| 2 | `apps/web/src/lib/i18n/strings/en.ts` | Master English strings (212 keys, source of truth) |
| 3 | `apps/web/src/lib/i18n/TranslationProvider.tsx` | Translation loading + LANG_LOADERS map |
| 4 | `apps/web/src/lib/i18n/languages.ts` | All 37 language definitions |
| 5 | `apps/web/src/lib/i18n/strings/hi.ts` | Reference translation file (Hindi) — use as template |

### Component Files (apps/web/src/components/)
| Component | File | React Key |
|-----------|------|-----------|
| Navbar | `Navbar.tsx` | N/A (static) |
| Hero | `Hero.tsx` | N/A (static) |
| Phygital | `Phygital.tsx` | `key={card.id}` ✅ |
| Steps | `Steps.tsx` | `key={step.num}` ✅ |
| RealPeople | `RealPeople.tsx` | `key={card.id}` ✅ |
| Sectors | `Sectors.tsx` | `key={i}` ✅ |
| Branding | `Branding.tsx` | `key={card.id}` ✅ |
| ProvenResults | `ProvenResults.tsx` | `key={stat.num}` ✅ |
| SaubhOS | `SaubhOS.tsx` | `key={card.id}` ✅ |
| Learning | `Learning.tsx` | `key={feat.id}` ✅ |
| Blog | `Blog.tsx` | `key={i}` ✅ |
| FAQ | `FAQ.tsx` | `key={i}` ✅ |
| Community | `Community.tsx` | `key={voice.id}` ✅ |
| Pricing | `Pricing.tsx` | `key={plan.id}` ✅ |
| Newsletter | `Newsletter.tsx` | N/A (static) |
| Footer | `Footer.tsx` | `key={i18nKey}` ✅ |
| ScrollAnimations | `ScrollAnimations.tsx` | N/A (no text) |

### Other Key Files
| File | Purpose |
|------|---------|
| `apps/web/src/app/page.tsx` | Main page — wraps all components in `<TranslationProvider>` |
| `apps/web/src/app/layout.tsx` | Root layout, dynamic `<html lang>` from cookie, SEO metadata |
| `apps/web/src/app/globals.css` | All custom CSS (~1550 lines) |
| `apps/web/src/app/api/lang/page/route.ts` | API route for translations (kept for external tools) |
| `apps/web/src/app/api/lang/validate/route.ts` | Runtime i18n validation endpoint |
| `apps/web/src/lib/constants.ts` | Shared constants (logo path) |
| `apps/web/next.config.ts` | Next.js config |
| `apps/web/package.json` | Web app dependencies (Next.js, React, Tailwind) |
| `packages/shared/src/types/index.ts` | Shared types (LangCode, Language, TranslationMap) |
| `packages/shared/src/constants/index.ts` | Shared constants (RTL_LANGS, APP_NAME) |
| `packages/shared/src/utils/index.ts` | Shared utilities (isRtl, getDir) |

---

## 🌍 i18n Translation Status

### ✅ Active Languages (in LANG_LOADERS, deployed)
| # | Code | Language | Script | Keys | File | Loader |
|---|------|----------|--------|------|------|--------|
| 1 | en | English | Latin | 212 | `strings/en.ts` | Direct import (base) |
| 2 | hi | Hindi | Devanagari | 212 | `strings/hi.ts` | ✅ Active |
| 3 | bn | Bengali | Bengali | 212 | `strings/bn.ts` | ✅ Active |
| 4 | te | Telugu | Telugu | 212 | `strings/te.ts` | ✅ Active |
| 5 | mr | Marathi | Devanagari | 212 | `strings/mr.ts` | ✅ Active |
| 6 | ta | Tamil | Tamil | 212 | `strings/ta.ts` | ✅ Active |
| 7 | gu | Gujarati | Gujarati | 212 | `strings/gu.ts` | ✅ Active |
| 8 | kn | Kannada | Kannada | 212 | `strings/kn.ts` | ✅ Active |
| 9 | ml | Malayalam | Malayalam | 212 | `strings/ml.ts` | ✅ Active |
| 10 | pa | Punjabi | Gurmukhi | 212 | `strings/pa.ts` | ✅ Active |
| 11 | or | Odia | Odia | 212 | `strings/or.ts` | ✅ Active |
| 12 | as | Assamese | Bengali | 212 | `strings/as.ts` | ✅ Active |
| 13 | ur | Urdu | Arabic (RTL) | 212 | `strings/ur.ts` | ✅ Active |

### ⏳ Pending — Indian Languages (remaining 10)
| # | Code | Language | Script | Status |
|---|------|----------|--------|--------|
| 14 | ne | Nepali | Devanagari | ⏳ Next |
| 15 | sa | Sanskrit | Devanagari | ⏳ Pending |
| 16 | mai | Maithili | Devanagari | ⏳ Pending |
| 17 | kok | Konkani | Devanagari | ⏳ Pending |
| 18 | doi | Dogri | Devanagari | ⏳ Pending |
| 19 | sd | Sindhi | Arabic (RTL) | ⏳ Pending |
| 20 | ks | Kashmiri | Arabic (RTL) | ⏳ Pending |
| 21 | brx | Bodo | Devanagari | ⏳ Pending |
| 22 | sat | Santali | Ol Chiki | ⏳ Pending |
| 23 | mni | Manipuri | Bengali | ⏳ Pending |

### ⏳ Pending — International Languages (14)
| # | Code | Language | Script | Status |
|---|------|----------|--------|--------|
| 24 | es | Spanish | Latin | ⏳ Pending |
| 25 | fr | French | Latin | ⏳ Pending |
| 26 | ar | Arabic | Arabic (RTL) | ⏳ Pending |
| 27 | zh | Chinese | CJK | ⏳ Pending |
| 28 | pt | Portuguese | Latin | ⏳ Pending |
| 29 | ru | Russian | Cyrillic | ⏳ Pending |
| 30 | de | German | Latin | ⏳ Pending |
| 31 | ja | Japanese | CJK | ⏳ Pending |
| 32 | ko | Korean | Hangul | ⏳ Pending |
| 33 | tr | Turkish | Latin | ⏳ Pending |
| 34 | th | Thai | Thai | ⏳ Pending |
| 35 | vi | Vietnamese | Latin | ⏳ Pending |
| 36 | id | Indonesian | Latin | ⏳ Pending |
| 37 | ms | Malay | Latin | ⏳ Pending |

---

## 🔄 Development Workflow

```
Local PC (C:\Users\Rishutosh Kumar\Documents\platform)
    ↓ git push
GitHub (saubhtech/platform)
    ↓ git pull (on server)
Server (/data/projects/saubh-gig)
    ↓ pnpm install → pnpm build → pm2 restart
Live (https://saubh.tech)
```

### Makefile Commands
```bash
make install        # pnpm install
make dev            # Start dev server (Turbopack)
make build          # Production build
make start          # Start production server
make lint           # Lint all packages
make typecheck      # Type-check shared package
make validate-i18n  # Validate translation files
make translate      # Show translation status
make clean          # Remove build artifacts
make deploy         # Deploy to production (SSH)
```

## 📋 Server Deploy Commands

```bash
# Quick deploy via Makefile
make deploy

# Manual deploy
ssh -p 5104 admin1@103.67.236.186
cd /data/projects/saubh-gig
git pull origin main
pnpm install
pnpm build
pm2 restart saubh-gig

# Check status
pm2 status
pm2 logs saubh-gig --lines 20
```

## ⚠️ Lessons Learned

1. **Always commit ALL project files to GitHub** — including `src/app/`, not just `app/`
2. **Never edit live server directly** — always push to GitHub, pull on server
3. **Tag before major changes**: `git tag before-change-description`
4. **Smart quotes break JS** — curly apostrophes in strings cause parse errors
5. **i18n: Extract ALL strings to en.ts** — never hardcode text in components
6. **i18n: Use cookie for language persistence** — URL params alone don't survive navigation
7. **i18n: Always fall back to English** — `{ ...enBase, ...langStrings }` merge
8. **i18n: Use TranslationStrings type** — TypeScript enforces complete translations at build time
9. **i18n: NEVER use translated text as React key** — causes invisible sections due to anim-up/ScrollAnimations conflict. Always use stable `id` or `index`
10. **i18n: Use explicit LANG_LOADERS map** — not template literal `` import(`./strings/${code}`) `` which Turbopack can't resolve
11. **i18n: en.ts uses `as const`** — need `const enBase: Record<string, string> = en` for dynamic key lookups in TranslationProvider
12. **i18n: API route imports must match existing files** — never import a language file that hasn't been pushed yet
13. **i18n: Smart quotes / curly apostrophes** — NEVER use ' ' " " in translation strings; always use straight quotes ' " or escaped \'
14. **Monorepo: deps belong in workspace packages** — root package.json has zero dependencies, only scripts

---

## 🚀 New Session Prompt Template

### What Opus Must Read & Why

| # | File Path | Why It's Needed |
|---|-----------|-----------------|
| 1 | `PROJECT-INDEX.md` | **Start here always.** Full project context: infra, architecture, i18n status, component map, React key rules, lessons learned. |
| 2 | `apps/web/src/lib/i18n/strings/en.ts` | **Master key list.** All 212 translation keys with English values. Source of truth. |
| 3 | `apps/web/src/lib/i18n/TranslationProvider.tsx` | **Loader registry.** Shows which languages are active in `LANG_LOADERS`. |
| 4 | `apps/web/src/lib/i18n/languages.ts` | **Language definitions.** All 37 languages with codes, native names, scripts, RTL/LTR. |
| 5 | `apps/web/src/lib/i18n/strings/hi.ts` | **Translation template.** Use as format reference for new language files. |

### ── PROMPT FORMAT ──

```
Project: Saubh.Tech — Phygital Gig Marketplace (pnpm monorepo)
Repo: github.com/saubhtech/platform (public, branch: main)
Server: 103.67.236.186:5104, path: /data/projects/saubh-gig

BEFORE doing anything, read these files in order using github:get_file_contents (owner=saubhtech, repo=platform):

1. path=PROJECT-INDEX.md — Full project context, monorepo structure, i18n status, lessons learned
2. path=apps/web/src/lib/i18n/strings/en.ts — Master English strings (212 keys, source of truth)
3. path=apps/web/src/lib/i18n/TranslationProvider.tsx — Translation loading + LANG_LOADERS map
4. path=apps/web/src/lib/i18n/languages.ts — All 37 language definitions

For i18n translation tasks, also read:
5. path=apps/web/src/lib/i18n/strings/hi.ts — Reference translation (Hindi, use as template format)

TASK: [Describe your task here]

RULES:
- Monorepo: apps/web = @saubhtech/web, packages/shared = @saubhtech/shared
- Never use translated text as React key (causes invisible sections)
- Use TranslationStrings type for compile-time enforcement
- Register new languages in LANG_LOADERS after pushing the .ts file
- Never use smart quotes/curly apostrophes in translation strings
- Deploy: make deploy (or manually via SSH)
```
