# SAUBH.TECH — MASTER SPECIFICATION
# This file is STATIC. Do not modify unless hardware or stack fundamentally changes.
# For session-specific context, see SESSION_*.md files in this directory.
# Last updated: Feb 24, 2026

---

## 🚨 SACRED RULES — VIOLATE NONE

### RULE 1: NEVER OVERWRITE WITHOUT BACKUP
Before modifying ANY existing file:
1. `cp <file> <file>.bak.$(date +%Y%m%d_%H%M%S)`
2. Show user the exact changes
3. Wait for explicit confirmation
4. Only then make the change

### RULE 2: SACRED FILES — DO NOT TOUCH WITHOUT EXPLICIT REQUEST
- `apps/web/src/app/[locale]/login/page.tsx` — Login page
- `apps/api/src/main.ts` — API entry point
- `apps/*/middleware.ts` — Routing middleware
- `prisma/schema.prisma` — Database schema
- Any `.env` or `.env.local` file
- `/etc/caddy/Caddyfile` — Reverse proxy
- `docker-compose.yml` — Containers
- `package.json` (root or any app) — Dependencies

### RULE 3: DESTRUCTIVE COMMANDS NEED CONFIRMATION
Never run without asking:
- `rm -rf`, `git reset --hard`, `git checkout -- <file>`, `git clean`
- `pnpm install`, `pnpm add`, `pnpm remove`
- `docker stop/rm/down`, `pm2 delete`
- `prisma migrate reset`, `prisma db push --force-reset`
- `DROP`, `DELETE`, `TRUNCATE` SQL
- `sed -i` on production files without backup

### RULE 4: TEST BEFORE DEPLOY
1. Syntax check (`bash -n` / `tsc --noEmit`)
2. Build the app (`pnpm build`)
3. Verify app starts
4. Never say "done" without verification

### RULE 5: ONE CHANGE AT A TIME
One change → test → confirm → next change.
If something breaks, STOP and restore from backup.

### RULE 6: USE PNPM — NEVER NPM

### RULE 7: READ BEFORE EDIT
Always `cat` or `head` a file before modifying it.

---

## 📋 SESSION PROTOCOL
```bash
# START (mandatory — auto-creates SESSION_<name>.md):
/data/scripts/session-start.sh <session-name>

# END (mandatory — auto-updates SESSION_<name>.md, uploads to Google Drive):
/data/scripts/session-end.sh <session-name>

# Before risky changes mid-session:
cd /data/projects/platform && git add -A && git commit -m "checkpoint: before <description>"
```

---

## 🖥️ HARDWARE

| Component | Details |
|-----------|---------|
| Machine | Microsoft FXT6600 bare metal |
| CPU | Intel Xeon Gold 6134M @ 3.20GHz — 32 cores (HT) |
| RAM | 251 GB DDR4 |
| OS | Ubuntu 24.04.3 LTS, Kernel 6.8.0-100 |
| OS Disk | 379 GB XFS (/) |
| Data Disk | 3.5 TB ext4 (/data) |

---

## 🛠️ STACK

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
| Prisma | ^7.4.1 |
| NestJS | ^11.0.0 |
| Next.js | 16.1.6 |
| Socket.io | ^4.8.0 |

---

## 🐳 DOCKER CONTAINERS

| Container | Image | Port | Purpose |
|-----------|-------|------|---------|
| saubh-postgres | postgres:18-alpine | 5432 | All DBs (user: saubh_admin) |
| saubh-redis | redis:8-alpine | 6379 (localhost) | Cache/sessions |
| saubh-keycloak | keycloak:26.5 | 8080 (localhost) | Auth/SSO |
| saubh-evolution | evolution-api:latest | internal | WhatsApp API |

### Databases:
- **saubhtech** — Main platform (36 tables, schemas: public/master/crm)
- **saubh_gig** — Gig marketplace
- **evolution** — WhatsApp Evolution API
- **keycloak** — Authentication/SSO
```bash
docker exec -it saubh-postgres psql -U saubh_admin -d saubhtech
```

---

## 📁 MONOREPO: /data/projects/platform

**Git:** https://github.com/saubhtech/platform (branch: main)
```
apps/
  web/              → Next.js 16.1.6      → Port 3000 → saubh.tech
  api/              → NestJS 11           → Port 3001 → api.saubh.tech
  realtime/         → NestJS + Socket.io  → Port 3002 → rt.saubh.tech
  admin/            → Next.js 16.1.6      → Port 3003 → admin.saubh.tech
  crmwhats/         → Next.js 16.1.6      → Port 3004 → saubh.tech/crm
  whatsapp-service/ → Express 4.18        → Port 3010 → internal
packages/
  shared/           → @saubhtech/shared — Types, constants, utils
```

---

## 🗄️ PRISMA (36 models, 3 schemas: public/master/crm)

**Core:** Business, Client, User, UserMembership
**Chat:** Conversation, ConversationMember, Message, MessageAttachment
**Telephony:** TelephonyNumber, TelephonyCall, TelephonyEvent
**Geography:** Country, MasterState, District, Postal, Place, Locality, Area, Division, MasterRegion, Zone
**Marketplace:** Sector/SectorI18n, Field/FieldI18n, Market/MarketI18n, Language
**WhatsApp CRM:** WaChannel, WaContact, WaConversation, WaMessage, WaBroadcast, WaBroadcastRecipient, WaTemplate, BotConfig

### Prisma Rules:
- NEVER `prisma migrate reset` or `prisma db push --force-reset`
- Schema changes: `prisma migrate dev --name <desc>` only
- Backup before migration: `docker exec saubh-postgres pg_dumpall -U saubh_admin > /data/backups/pre-migration-$(date +%Y%m%d_%H%M%S).sql`

---

## 🌐 CADDY ROUTING

| Domain | Routes To |
|--------|-----------|
| saubh.tech | :8081 (landing) → :3004 (CRM) → :3000 (web) |
| api.saubh.tech | :3001 |
| rt.saubh.tech | :3002 |
| admin.saubh.tech | :8080 (Keycloak) → :3003 |

---

## 🌍 ML/TRANSLATION (Python, 37 languages)

| Service | Port | Systemd |
|---------|------|---------|
| translation-server (IndicTrans2+NLLB) | 5050 | ✅ |
| transliteration-server (IndicXlit) | 5060 | manual |
| stt-server | 5070 | manual |
| i18n-watcher | — | ✅ |
| translation-qa-daemon | — | ✅ |

---

## 🔒 SECURITY

UFW: 80, 443, 5104 (SSH). Fail2ban: active. Caddy auto-TLS.

---

## 📋 PORT MAP

80/443 Caddy | 3000 web | 3001 api | 3002 realtime | 3003 admin | 3004 crmwhats | 3010 whatsapp-service | 5050 translation | 5060 transliteration | 5070 stt | 5104 SSH | 5432 PostgreSQL | 6379 Redis | 8080 Keycloak | 8081 Landing

---

## 💾 BACKUP SYSTEM (/data/scripts/)

session-start.sh → session-end.sh → autosave.sh (5min) → nightly-backup.sh (2AM) → weekly-restore-drill.sh (Sun 3AM) → restore.sh → upload-offsite.sh → list-backups.sh

Backups: code, DB (all 5), 8 .env, uploads, whatsapp-media, Redis, PM2, Caddy, docker-compose, checksums. Offsite: Google Drive.

---

## 🎨 LOGIN PAGE — DO NOT CHANGE

Dark Gen-Z: two-column glass cards, API-driven register, OTP boxes, passcode fallback, mesh bg #080b12. NEVER replace entire file.

---

## 🔧 COMMANDS
```bash
pnpm --filter @saubhtech/<app> build && pm2 restart <app>
docker exec saubh-postgres pg_dumpall -U saubh_admin > /data/backups/dump.sql
cd apps/api && pnpm prisma generate && pnpm prisma migrate dev --name <desc>
/data/scripts/list-backups.sh
```
