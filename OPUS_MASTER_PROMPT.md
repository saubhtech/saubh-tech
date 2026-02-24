# SAUBH.TECH — OPUS MASTER PROMPT (Feb 24, 2026)

> **READ EVERY WORD. FOLLOW EVERY RULE. NO EXCEPTIONS.**

---

## 🚨 CRITICAL SAFETY RULES — READ FIRST, OBEY ALWAYS

### RULE 1: NEVER OVERWRITE WITHOUT BACKUP
Before modifying ANY existing file, you MUST:
1. `cp <file> <file>.bak.$(date +%Y%m%d_%H%M%S)` — create timestamped backup
2. Show the user the exact changes you intend to make
3. Wait for explicit confirmation before proceeding
4. Only then make the change

**VIOLATIONS THAT HAVE HAPPENED BEFORE AND MUST NEVER HAPPEN AGAIN:**
- Overwriting login/page.tsx and destroying the production login page
- Overwriting middleware.ts breaking all routing
- Replacing working components with broken ones
- Deleting or overwriting .env files
- Running `pnpm install` with wrong packages that break node_modules

### RULE 2: NEVER MODIFY THESE FILES WITHOUT EXPLICIT REQUEST
These files are SACRED. Do NOT touch them unless the user specifically asks:
- `apps/web/src/app/[locale]/login/page.tsx` — THE LOGIN PAGE (dark Gen-Z design)
- `apps/api/src/main.ts` — API entry point
- `apps/*/middleware.ts` — Routing middleware
- `prisma/schema.prisma` — Database schema
- Any `.env` or `.env.local` file
- `/etc/caddy/Caddyfile` — Reverse proxy config
- `docker-compose.yml` — Container orchestration
- `package.json` (root or any app) — Dependencies

### RULE 3: NEVER RUN DESTRUCTIVE COMMANDS WITHOUT CONFIRMATION
Always ask before running:
- `rm -rf` anything
- `git reset --hard` or `git checkout -- <file>`
- `git clean`
- `pnpm install` (can break working node_modules)
- `pnpm add` or `pnpm remove` (changes dependencies)
- `docker stop/rm/down`
- `pm2 delete`
- `prisma migrate reset`
- `prisma db push --force-reset`
- Any `DROP`, `DELETE`, `TRUNCATE` SQL commands
- Any `sed -i` on production files without backup

### RULE 4: TEST BEFORE DEPLOY
Before telling the user a change is complete:
1. Check for syntax errors (`bash -n` for scripts, `tsc --noEmit` for TS)
2. Verify the app builds (`pnpm build` for the specific app)
3. Verify the app starts without errors
4. NEVER say "done" if you haven't verified

### RULE 5: ONE CHANGE AT A TIME
- Make ONE change, test it, confirm it works
- NEVER make multiple file changes at once without testing between each
- If something breaks, STOP and restore from backup before continuing

---

## 📋 SESSION PROTOCOL — MANDATORY

### At the START of every session:
```bash
/data/scripts/session-start.sh <session-name>
```
This creates a git checkpoint, backup, and starts autosave. ALWAYS do this first.

### At the END of every session:
```bash
/data/scripts/session-end.sh <session-name>
```
This stops autosave, commits, backs up, and uploads to Google Drive. ALWAYS do this last.

### Before ANY risky change mid-session:
```bash
cd /data/projects/platform && git add -A && git commit -m "checkpoint: before <description>"
```

---

## 🖥️ SERVER SPECS

| Component | Details |
|-----------|---------|
| Hardware | Microsoft FXT6600 bare metal |
| CPU | Intel Xeon Gold 6134M @ 3.20GHz — 32 cores |
| RAM | 251 GB DDR4 |
| OS | Ubuntu 24.04.3 LTS |
| OS Disk | 379 GB (/) — 9% used |
| Data Disk | 3.5 TB (/data) — 1% used |

---

## 🛠️ STACK VERSIONS (as of Feb 24, 2026)

| Tool | Version |
|------|---------|
| Node.js | v24.13.1 |
| pnpm | 10.30.1 |
| Python | 3.12.3 |
| Docker | 29.2.1 |
| Docker Compose | v5.0.2 |
| PM2 | 6.0.14 |
| Caddy | 2.6.2 |
| Git | 2.43.0 |

**ALWAYS use pnpm — NEVER use npm. This is a pnpm workspace.**

---

## 🐳 DOCKER CONTAINERS

| Container | Image | Port | Purpose |
|-----------|-------|------|---------|
| saubh-postgres | postgres:18-alpine | 5432 | All databases (user: saubh_admin) |
| saubh-redis | redis:8-alpine | 6379 (localhost) | Cache/sessions/OTP |
| saubh-keycloak | keycloak:26.5 | 8080 (localhost) | Auth/SSO |
| saubh-evolution | evolution-api:latest | internal | WhatsApp Business API |

### Database access:
```bash
docker exec -it saubh-postgres psql -U saubh_admin -d saubhtech
```

### Databases:
| Database | Purpose |
|----------|---------|
| saubhtech | Main platform (36 tables, schemas: public/master/crm) |
| saubh_gig | Gig marketplace |
| evolution | WhatsApp Evolution API |
| keycloak | Authentication/SSO |

---

## 📁 MONOREPO STRUCTURE

**Root:** `/data/projects/platform`
**Git remote:** `https://github.com/saubhtech/platform` (branch: main)
```
apps/
  web/              → Next.js 16.1.6      → Port 3000 → saubh.tech
  api/              → NestJS 11           → Port 3001 → api.saubh.tech
  realtime/         → NestJS + Socket.io  → Port 3002 → rt.saubh.tech
  admin/            → Next.js 16.1.6      → Port 3003 → admin.saubh.tech
  crmwhats/         → Next.js 16.1.6      → Port 3004 → saubh.tech/crm
  whatsapp-service/ → Express 4.18        → Port 3010 → internal

packages/
  shared/           → @saubhtech/shared — Types, constants, utils (raw .ts)
```

### PM2 Process Management:
```bash
pm2 list                    # See all apps
pm2 logs <app>              # See logs
pm2 restart <app>           # Restart specific app
pm2 restart all             # Restart everything
```

**After building any Next.js app, restart it in PM2:**
```bash
cd /data/projects/platform
pnpm --filter @saubhtech/<app> build
pm2 restart <app>
```

---

## 🔑 KEY API DEPENDENCIES

| Package | Version | Purpose |
|---------|---------|---------|
| @nestjs/core | ^11.0.0 | API framework |
| @prisma/client | ^7.4.1 | Database ORM |
| prisma | ^7.4.1 | Schema/migrations |
| ioredis | ^5.4.2 | Redis client |
| @nestjs/passport + passport-jwt | ^11 / ^4 | Auth |
| bullmq | ^5.70.0 | Job queues |
| socket.io | ^4.8.0 | Realtime (in realtime app) |
| class-validator | ^0.14.1 | DTO validation |

---

## 🗄️ DATABASE SCHEMA — PRISMA (36 models, 3 schemas)

**Schemas:** public, master, crm

**Core:** Business, Client, User, UserMembership
**Chat:** Conversation, ConversationMember, Message, MessageAttachment
**Telephony:** TelephonyNumber, TelephonyCall, TelephonyEvent
**Geography:** Country, MasterState, District, Postal, Place, Locality, Area, Division, MasterRegion, Zone
**Marketplace:** Sector/SectorI18n, Field/FieldI18n, Market/MarketI18n, Language
**WhatsApp CRM:** WaChannel, WaContact, WaConversation, WaMessage, WaBroadcast, WaBroadcastRecipient, WaTemplate, BotConfig

**PRISMA RULES:**
- NEVER run `prisma migrate reset` — it wipes the database
- NEVER run `prisma db push --force-reset` — it wipes data
- For schema changes: `prisma migrate dev --name <description>` only
- Always backup DB before any migration: `docker exec saubh-postgres pg_dumpall -U saubh_admin > /data/backups/pre-migration-$(date +%Y%m%d_%H%M%S).sql`

---

## 🌐 CADDY ROUTING

| Domain | Routes To |
|--------|-----------|
| saubh.tech | :8081 (landing) → :3004 (CRM at /crm) → :3000 (web app) |
| api.saubh.tech | :3001 (NestJS API) |
| rt.saubh.tech | :3002 (Realtime WebSocket gateway) |
| admin.saubh.tech | :8080 (Keycloak at /auth) → :3003 (Admin dashboard) |

SSL: Caddy auto-TLS (Let's Encrypt via Cloudflare)

---

## 🌍 ML/TRANSLATION SERVICES (Python)

| Service | Port | Purpose |
|---------|------|---------|
| translation-server.py | 5050 | IndicTrans2 + NLLB (systemd) |
| transliteration-server.py | 5060 | IndicXlit |
| stt-server.py | 5070 | Speech-to-text |
| i18n-watcher.py | — | Auto-translate missing keys (systemd) |
| translation-qa-daemon.py | — | QA checks (systemd) |

**37 languages supported** across the platform.

---

## 🔒 SECURITY

| Feature | Status |
|---------|--------|
| UFW Firewall | Active — ports 80, 443, 5104 (SSH) |
| Fail2ban | Active |
| SSH | Port 5104 (non-standard) |
| Caddy auto-TLS | Active |

---

## 💾 BACKUP SYSTEM

**All scripts in /data/scripts/:**

| Script | Purpose |
|--------|---------|
| session-start.sh | Git commit + tag + full backup + autosave |
| session-end.sh | Stop autosave + commit + tag + backup + Google Drive upload |
| autosave.sh | Git commit every 5 min during sessions |
| nightly-backup.sh | Cron 2 AM daily + Google Drive |
| weekly-restore-drill.sh | Cron Sunday 3 AM |
| restore.sh | Restore with checksum verification |
| upload-offsite.sh | Upload to Google Drive |
| list-backups.sh | Show all backups |

**Backups include:** code.tar.gz, db.sql (pg_dumpall, all 5 DBs), 8 .env files, uploads, whatsapp-media, Redis dump, PM2 dump, Caddyfile, docker-compose.yml, checksums.sha256

---

## 🎨 LOGIN PAGE DESIGN — ABSOLUTELY DO NOT CHANGE

The correct login page is the **dark Gen-Z automated version**:
- Two-column glass cards layout
- API-driven register (calls backend, not static)
- OTP input boxes (individual digit inputs, not single field)
- Passcode fallback option
- Mesh gradient background color: #080b12
- Dark theme throughout
- Responsive two-column on desktop, stacked on mobile

**If you are asked to "fix" or "update" the login page, FIRST show the user what exists and ask what specifically needs changing. NEVER replace the entire file.**

---

## 📋 PORT MAP (Complete)

| Port | Service | Binding |
|------|---------|---------|
| 80 | Caddy (HTTP) | 0.0.0.0 |
| 443 | Caddy (HTTPS) | 0.0.0.0 |
| 2019 | Caddy admin | 127.0.0.1 |
| 3000 | web (Next.js) | 0.0.0.0 |
| 3001 | api (NestJS) | 0.0.0.0 |
| 3002 | realtime (Socket.io) | 0.0.0.0 |
| 3003 | admin (Next.js) | 0.0.0.0 |
| 3004 | crmwhats (Next.js) | 0.0.0.0 |
| 3010 | whatsapp-service | 0.0.0.0 |
| 5050 | translation-server | 127.0.0.1 |
| 5060 | transliteration-server | 127.0.0.1 |
| 5070 | stt-server | 127.0.0.1 |
| 5104 | SSH | 0.0.0.0 |
| 5432 | PostgreSQL (Docker) | 0.0.0.0 |
| 6379 | Redis (Docker) | 127.0.0.1 |
| 8080 | Keycloak (Docker) | 127.0.0.1 |
| 8081 | Landing page | 0.0.0.0 |

---

## 🔧 COMMON COMMANDS REFERENCE

### Build & Deploy:
```bash
cd /data/projects/platform

# Build specific app
pnpm --filter @saubhtech/web build
pnpm --filter @saubhtech/api build
pnpm --filter @saubhtech/admin build
pnpm --filter @saubhtech/crmwhats build
pnpm --filter @saubhtech/realtime build

# Restart after build
pm2 restart web    # or api, admin, crmwhats, realtime, whatsapp-service

# View logs
pm2 logs api --lines 50
pm2 logs admin --lines 50
```

### Database:
```bash
# Connect to DB
docker exec -it saubh-postgres psql -U saubh_admin -d saubhtech

# Dump all databases
docker exec saubh-postgres pg_dumpall -U saubh_admin > /data/backups/manual-dump-$(date +%Y%m%d).sql

# Prisma operations (from api directory)
cd /data/projects/platform/apps/api
pnpm prisma generate
pnpm prisma migrate dev --name <description>
pnpm prisma studio    # Visual DB browser
```

### Docker:
```bash
docker ps                                    # Running containers
docker logs saubh-evolution --tail 50        # Evolution logs
docker logs saubh-keycloak --tail 50         # Keycloak logs
docker restart saubh-evolution               # Restart Evolution
```

---

## ⚠️ KNOWN ISSUES TO FIX

| Priority | Issue | Details |
|----------|-------|---------|
| HIGH | PostgreSQL 5432 exposed | Bind to 127.0.0.1 in docker-compose.yml |
| HIGH | admin app: 7,869 restarts | Crash loop — check PM2 logs |
| HIGH | api app: 1,526 restarts | Frequent crashes — check PM2 logs |
| MEDIUM | Caddy 2.6.2 outdated | Upgrade to 2.9.x |
| MEDIUM | 20 .bak files in codebase | Clean up after confirming git has them |

---

## 🧠 BEHAVIORAL RULES FOR THE AI

1. **ASK before acting.** When in doubt, show the plan and wait for approval.
2. **Read files before editing.** Always cat or head a file before modifying it.
3. **One step at a time.** Never chain 5 changes together.
4. **Show diffs.** After any file edit, show what changed.
5. **Never assume.** If not sure about a file's current state, read it first.
6. **Respect what works.** If something is working, don't "improve" it unless asked.
7. **Backup before surgery.** Any file modification = backup first. No exceptions.
8. **Use pnpm.** Never npm. This is a pnpm workspace.
9. **Test builds.** After any code change, build the affected app and verify it starts.
10. **Commit often.** After each successful change, commit with a descriptive message.

---

## 📌 QUICK START CHECKLIST

When starting a new session:
- [ ] Run `/data/scripts/session-start.sh <n>`
- [ ] Read this prompt completely
- [ ] Ask user what they want to work on today
- [ ] Read relevant files BEFORE making any changes
- [ ] Make changes ONE AT A TIME with backups
- [ ] Test after each change
- [ ] Run `/data/scripts/session-end.sh <n>` when done
