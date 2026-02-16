# Saubh.Tech — Project Index
> Last updated: February 16, 2026 (saubh-lang Phase 2 — i18n website integration)

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
| **Ports Open** | 80/443 (web), 5104 (SSH), 3000 (Next.js), 3100 (Lang API) |

## 📂 Active Projects

### 1. saubh-tech (Main Website)
- **Local Path**: `C:\Projects\saubh-tech\`
- **Server Path**: `/data/projects/saubh-gig/`
- **GitHub**: https://github.com/saubhtech/saubh-tech (public)
- **Stack**: Next.js 16 + TypeScript + Custom CSS (no Tailwind PostCSS)
- **Package Manager**: pnpm
- **Port**: 3000
- **Domain**: https://saubh.tech
- **Logo**: `public/logo.jpg` (source: `C:\Projects\saubh-logo.jpg`)
- **Status**: ✅ Live (Feb 16, 2026 — with i18n Phase 2)

#### Component Architecture (src/components/)
| Component | File | Interactive | i18n |
|-----------|------|------------|------|
| Navbar | `Navbar.tsx` | ✅ Mobile menu, lang dropdown, scroll effect | ✅ `useTranslation` |
| Hero | `Hero.tsx` | Video background (`public/saubhtech.mp4`) | ✅ `useTranslation` |
| Phygital | `Phygital.tsx` | Scroll animations | ✅ `useTranslation` |
| Steps | `Steps.tsx` | Scroll animations | ✅ `useTranslation` |
| RealPeople | `RealPeople.tsx` | Scroll animations | ✅ `useTranslation` |
| Sectors | `Sectors.tsx` | 16 sector chips | ✅ `useTranslation` |
| Branding | `Branding.tsx` | — | ✅ `useTranslation` |
| ProvenResults | `ProvenResults.tsx` | — | ✅ `useTranslation` |
| SaubhOS | `SaubhOS.tsx` | — | ✅ `useTranslation` |
| Learning | `Learning.tsx` | — | ✅ `useTranslation` |
| Blog | `Blog.tsx` | 6 article cards | ✅ `useTranslation` |
| FAQ | `FAQ.tsx` | ✅ Accordion toggle | ✅ `useTranslation` |
| Community | `Community.tsx` | 6 voice cards | ✅ `useTranslation` |
| Pricing | `Pricing.tsx` | ✅ Tab switching (Q/H/A) | ✅ `useTranslation` |
| Newsletter | `Newsletter.tsx` | ✅ Form handling | ✅ `useTranslation` |
| Footer | `Footer.tsx` | — | ✅ `useTranslation` |
| ScrollAnimations | `ScrollAnimations.tsx` | IntersectionObserver hook | — (no text) |

#### i18n Architecture (src/lib/i18n/)
| File | Purpose |
|------|---------|
| `index.ts` | Barrel export for all i18n modules |
| `languages.ts` | 37 language definitions, geo-mapping, Accept-Language parser |
| `strings/en.ts` | Complete English strings dictionary (170+ keys) |
| `TranslationProvider.tsx` | React Context: lang detection, API fetch, caching, `t()` function |

#### i18n Language Detection Priority
| Priority | Method | Source |
|----------|--------|--------|
| 1 | URL `?lang=` param | User shares translated link |
| 2 | `saubh-lang` cookie | Returning visitor preference |
| 3 | IP geolocation | saubh-lang `/api/lang/detect` (500ms timeout) |
| 4 | `Accept-Language` header | Browser language setting |
| 5 | Default: `en` | Fallback |

#### Key Files
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main page — wraps with `<TranslationProvider>` |
| `src/app/layout.tsx` | Root layout, dynamic `<html lang>` from cookie, SEO metadata |
| `src/app/globals.css` | All custom CSS (1550 lines, extracted from HTML) |
| `src/middleware.ts` | Next.js middleware — geo-detect IP → set `saubh-lang` cookie |
| `src/lib/i18n/TranslationProvider.tsx` | Core i18n: Context, API fetch, caching |
| `src/lib/i18n/languages.ts` | 37 language configs with geo-mapping |
| `src/lib/i18n/strings/en.ts` | English base strings (source of truth) |
| `src/lib/constants.ts` | Shared constants (logo path) |
| `postcss.config.mjs` | Empty — Tailwind PostCSS disabled to preserve custom CSS |
| `next.config.ts` | Config with LANG_API env variable |
| `public/logo.jpg` | Saubh.Tech logo (used in Navbar + Footer) |
| `src/app/login/page.tsx` | Login/Register page (`/login` route) |

#### Environment Variables
| Variable | Where | Value |
|----------|-------|-------|
| `LANG_API_INTERNAL_URL` | Server `.env.local` | `http://localhost:3100` |
| `NEXT_PUBLIC_LANG_API_URL` | Server `.env.local` | `/api/lang` |

---

### 2. saubh-lang (Language Microservice)
- **Local Path**: `C:\Projects\saubh-lang\`
- **Server Path**: `/data/projects/saubh-lang/`
- **GitHub**: https://github.com/saubhtech/saubh-lang (private)
- **Stack**: Docker Compose — Node.js Gateway + Python FastAPI Services
- **Port**: 3100 (API Gateway)
- **Git**: `6f4d31a` Initial commit (Feb 15, 2026)
- **Status**: 🔧 Phase 1 Complete — Phase 2 Website Integration Ready

#### Language Support — 37 Languages

**22 Indian (IndicTrans2):** hi, bn, ta, te, mr, gu, kn, ml, pa, or, as, ur, ne, sa, mai, kok, doi, sd, brx, sat, mni, ks

**15 International (NLLB):** en (direct), ar, zh, fr, de, ja, ko, pt, ru, es, th, vi, id, ms, tr

#### Development Phases
| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Core Translation API + Docker setup | ✅ Code complete |
| 2 | Website i18n integration | ✅ Complete (Feb 16, 2026) |
| 3 | WhatsApp bot integration | Planned |
| 4 | Chat widget + STT | Planned |
| 5 | Polish, monitoring, load testing | Planned |

#### Caddy Config (when ready)
```
saubh.tech {
    reverse_proxy /api/lang/* localhost:3100
    reverse_proxy * localhost:3000
}
```

---

## 📂 GitHub Repositories (saubhtech)

| Repo | Type | Description | Status |
|------|------|-------------|--------|
| **saubh-tech** | Public | Main website (Next.js + i18n) | ✅ Live |
| **saubh-lang** | Private | Language microservice (Docker) | 🔧 Building |
| **saubh-opus** | Private | Monorepo (website, CRM, APIs) | Archived |
| **chatgpt** | Private | ChatGPT related | Recent |
| **whatsapp-crm-frontend** | Private | WhatsApp CRM UI | Paused |
| **whatsapp-crm-frontend1** | Private | WhatsApp CRM UI v2 | Paused |
| **learn-saubh-cms** | Public | Learning CMS | Paused |
| **temp-assets** | Public | Temporary image assets | Utility |
| **tata-webhook** | Public | Tata webhook | Utility |
| **Zugnuu** | Public | Zugnuu project | Inactive |
| **zuugnu-production** | Public | Zugnuu production | Inactive |

## 🔄 Development Workflow

```
Local PC (C:\Projects\saubh-tech)
    ↓ git push
GitHub (saubhtech/saubh-tech)
    ↓ git pull (on server)
Server (/data/projects/saubh-gig)
    ↓ pnpm build → pm2 restart
Live (https://saubh.tech)
```

```
Local PC (C:\Projects\saubh-lang)
    ↓ git push
GitHub (saubhtech/saubh-lang)
    ↓ git pull (on server)
Server (/data/projects/saubh-lang)
    ↓ docker compose up -d --build
Live (https://saubh.tech/api/lang/*)
```

## 🛡️ Backup Strategy (3-Copy Rule)

Every piece of code exists in **3 places** at all times: Local PC, GitHub, Google Drive.

### Copy 1: Local PC (Real-time)
| Item | Detail |
|------|--------|
| **Location** | `C:\Projects\saubh-tech\` + `C:\Projects\saubh-lang\` |
| **Method** | Git commits (version history) |
| **Frequency** | Every code change |
| **Dated Backups** | `C:\Backups\SaubhTech\YYYY-MM-DD\` |
| **Script** | `C:\Projects\saubh-tech\backup-local.ps1` |
| **Retention** | 30 days of date-stamped zips |
| **Run** | `powershell -ExecutionPolicy Bypass -File backup-local.ps1` |

### Copy 2: GitHub (Every Push)
| Item | Detail |
|------|--------|
| **Repos** | saubhtech/saubh-tech + saubhtech/saubh-lang |
| **Method** | `git push origin main` |
| **Frequency** | Every change |
| **Version Tags** | `git tag v1.0-description` before major changes |

### Copy 3: Google Drive (Daily Automated)
| Item | Detail |
|------|--------|
| **Location** | `gdrive:SaubhTech-Backups/YYYY-MM-DD/` |
| **Method** | rclone (server cron) |
| **Script** | `/home/admin1/scripts/backup-server.sh` |
| **Cron** | `30 18 * * *` (midnight IST = 18:30 UTC) |
| **Retention** | 15 days on server, unlimited on Drive |
| **Contents** | Source tar.gz + server configs + DB dump |

## 📋 Server Commands Cheatsheet

```bash
# SSH into server
ssh -p 5104 admin1@103.67.236.186

# Deploy saubh-tech (website)
cd /data/projects/saubh-gig
git pull origin main
pnpm install
pnpm build
pm2 restart saubh-gig

# Deploy saubh-lang (language service)
cd /data/projects/saubh-lang
git pull origin main
docker compose up -d --build

# Check status
pm2 status
docker compose -f /data/projects/saubh-lang/docker-compose.yml ps
pm2 logs saubh-gig
```

## 📋 Local Dev Commands

```powershell
# Start saubh-tech local development
cd C:\Projects\saubh-tech
pnpm dev

# Test language switching locally
# Visit: http://localhost:3000?lang=hi
# Visit: http://localhost:3000?lang=bn
# Visit: http://localhost:3000?lang=ar  (RTL test)

# Push changes to GitHub
git add .
git commit -m "description of change"
git push origin main
```

## ⚠️ Lessons Learned

1. **Always commit ALL project files to GitHub** — including `src/app/`, not just `app/`
2. **Server backups must include `/data/projects/`** — not just `/home/admin1/`
3. **Never edit live server directly** — always develop locally, test, then push
4. **Tag before major changes**: `git tag before-change-description`
5. **Next.js directory priority**: `app/` overrides `src/app/` when both exist — never have both
6. **Tailwind PostCSS strips custom CSS** — if using custom CSS, remove `@tailwindcss/postcss` from postcss.config.mjs
7. **Smart quotes break JS** — curly apostrophes in strings cause parse errors; use double quotes
8. **Split HTML into React components** — avoid `dangerouslySetInnerHTML`; use proper components
9. **Non-interactive SSH loses PATH** — `pnpm`, `pm2` not found via `ssh user@host "cmd"`. SSH in interactively
10. **Chrome autofill overrides placeholders** — use `autoComplete="off"` and autofill CSS overrides
11. **PowerShell `$` in SSH commands fails** — use single quotes to avoid variable expansion
12. **Docker model volumes persist** — AI model weights in named volumes survive container rebuilds
13. **i18n: Extract ALL strings to a central dictionary** — never hardcode text in components
14. **i18n: Use cookie for language persistence** — URL params alone don't survive navigation
15. **i18n: Always fall back to English** — if translation API is down, show English not blank
16. **i18n: Set 500ms timeout for middleware API calls** — never slow down page load for geo-detect
