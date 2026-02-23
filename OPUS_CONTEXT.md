# Saubh.Tech Platform — OPUS_CONTEXT.md
## Complete Feature Summary & Architecture Reference
### Date: 23 February 2026

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Infrastructure & Services](#infrastructure--services)
3. [Session 1: Evolution API Restoration](#session-1-evolution-api-restoration)
4. [Session 2: WhatsApp Authentication System](#session-2-whatsapp-authentication-system)
5. [Session 3: Production Hardening & Security](#session-3-production-hardening--security)
6. [Session 4: Dashboard UI Development & Deployment](#session-4-dashboard-ui-development--deployment)
7. [Session 5: WhatsApp Failover, CRM Realtime Sync](#session-5-whatsapp-failover-crm-realtime-sync)
8. [Architecture Diagrams](#architecture-diagrams)
9. [Environment Variables Reference](#environment-variables-reference)
10. [Key Files Reference](#key-files-reference)
11. [Runbooks & Emergency Procedures](#runbooks--emergency-procedures)
12. [Pending / Future Work](#pending--future-work)

---

## Platform Overview

**Saubh.Tech** is a phygital gig marketplace platform bridging physical and digital services across India. The platform consists of:

- **Web App** — Next.js multilingual marketplace (37 languages)
- **API** — NestJS backend with Prisma + PostgreSQL
- **Admin** — CRM dashboard at admin.saubh.tech
- **Realtime** — WebSocket gateway for live updates
- **WhatsApp Service** — Standalone bot/auth service
- **Evolution API** — WhatsApp Baileys bridge (unofficial API)
- **WABA** — Meta WhatsApp Business API (official)

### Domains
| Domain | Purpose |
|--------|---------|
| saubh.tech | Main web app |
| api.saubh.tech | NestJS API |
| admin.saubh.tech | CRM Admin Panel |
| saubh.cloud | Infrastructure |
| saubh.in | Alternate domain |

---

## Infrastructure & Services

### PM2 Process Manager
| ID | Name | Port | Description |
|----|------|------|-------------|
| 0 | web | 3000 | Next.js web app |
| 1 | api | 3001 | NestJS API |
| 2 | realtime | 3002 | WebSocket gateway (Socket.IO) |
| 3 | admin | 3003 | Admin panel (Next.js) |
| 6 | crmwhats | — | CRM WhatsApp processes |
| 7 | whatsapp-service | 3010 | Standalone WhatsApp bot/auth |

### External Services
| Service | Location | Purpose |
|---------|----------|---------|
| Evolution API | localhost:8081 | WhatsApp Baileys bridge |
| PostgreSQL | localhost:5432 | Primary database |
| Redis | localhost:6379 | OTP, rate limiting, pub/sub |
| Caddy | :80/:443 | Reverse proxy, SSL |

### Tech Stack
- **Runtime:** Node.js v24, pnpm (preferred over npm)
- **Backend:** NestJS, Prisma ORM, PostgreSQL
- **Frontend:** Next.js, React, Tailwind CSS
- **Realtime:** Socket.IO, Redis pub/sub
- **WhatsApp:** Evolution API (Baileys) + Meta WABA Cloud API
- **Infra:** Docker, PM2, Caddy, Bare metal server

---

## Session 1: Evolution API Restoration

### Problem
Evolution API instance `saubh-sim` (918800607598) was completely disconnected from WhatsApp due to session corruption. Docker container networking issues prevented reconnection.

### Fixes Implemented

1. **Docker Network Fix**
   - Root cause: Evolution API Docker container couldn't reach external WhatsApp servers
   - Fix: Switched to `network_mode: host` in docker-compose
   - File: `/data/docker/evolution-api/docker-compose.yml`

2. **Instance Recreation**
   - Deleted corrupted `saubh-sim` instance
   - Created fresh instance with QR code scanning
   - Re-established WhatsApp Web connection

3. **Webhook Configuration**
   - Set webhook URL: `https://api.saubh.tech/api/crm/webhooks/evolution`
   - Events: `MESSAGES_UPSERT`, `MESSAGES_UPDATE`, `CONNECTION_UPDATE`, `SEND_MESSAGE`
   - Both CRM API (port 3001) and WhatsApp service (port 3010) receive webhooks

### Key Commands
```bash
# Check instance status
curl -s http://localhost:8081/instance/connectionState/saubh-sim \
  -H 'apikey: <API_KEY>'

# Recreate instance
curl -s -X POST http://localhost:8081/instance/create \
  -H 'apikey: <API_KEY>' -H 'Content-Type: application/json' \
  -d '{"instanceName":"saubh-sim","qrcode":true,"integration":"WHATSAPP-BAILEYS"}'
```

---

## Session 2: WhatsApp Authentication System

### Features Built

1. **WhatsApp-Based User Registration**
   - Users send `Register <Name> <UserType>` to 918800607598
   - System creates user in PostgreSQL
   - Static passcode = last 4 digits of phone number
   - Welcome message sent with login credentials
   - Idempotent: re-registering returns existing user

2. **OTP Authentication Flow**
   - Users send `Passcode` or `OTP` to get temporary login code
   - 4-digit OTP stored in Redis with 120s TTL
   - Rate limited: max 3 OTP requests per 5 minutes
   - Never written to database (Redis-only)

3. **Login & JWT**
   - POST `/api/auth/whatsapp/login` with phone + code
   - Verifies: Redis OTP first → static passcode fallback
   - Returns JWT token (24h expiry) + user object
   - Static passcode NEVER cleared (permanent)

4. **Auth Command Service**
   - Intercepts WhatsApp messages before CRM processing
   - Handles: `Register`, `Passcode`, `OTP` commands
   - Works on both Evolution and WABA webhooks

5. **Next.js Login Page**
   - Route: `/[locale]/login`
   - Phone number input → OTP request → code verify → redirect to dashboard
   - Responsive, Gen-Z aesthetic (purple/cyan gradients, glass-morphism)
   - Auto-handles country code normalization

### API Endpoints
```
POST /api/auth/whatsapp/register     {whatsapp, fname, usertype}
POST /api/auth/whatsapp/request-otp  {whatsapp}
POST /api/auth/whatsapp/login        {whatsapp, code}
```

### Files
```
apps/api/src/auth/whatsapp-auth.service.ts    — Registration, OTP, login logic
apps/api/src/auth/whatsapp-auth.controller.ts — REST endpoints
apps/api/src/auth/auth-command.service.ts      — WhatsApp command interceptor
apps/api/src/auth/otp.service.ts               — Redis OTP store
apps/api/src/auth/rate-limit.guard.ts          — Redis rate limiter
apps/api/src/auth/normalize-phone.ts           — Phone number normalization
apps/api/src/auth/whatsapp-auth.module.ts      — Module with Redis provider
apps/web/src/app/[locale]/login/page.tsx       — Login UI
```

---

## Session 3: Production Hardening & Security

### Fixes & Improvements

1. **Passcode Bug Fix**
   - Bug: `whatsapp-service/handler.js` was overwriting permanent passcodes with temporary OTP
   - Fix: Auth service uses Redis-only OTP, never touches Prisma passcode field
   - Validation: Static passcode persists across OTP requests

2. **Redis Rate Limiting**
   - Auth endpoints protected by `AuthRateLimitGuard`
   - Max 5 failed login attempts per 5 minutes per IP+phone combo
   - Max 3 OTP requests per 5 minutes per phone
   - Uses Redis `INCR` + `EXPIRE` pattern

3. **Docker Compose Hardening**
   - `network_mode: host` enforced for Evolution API
   - `restart: always` policy
   - Container name: `evolution-api`

4. **Evolution Manager Access Blocked**
   - `evo-manager.html` was publicly accessible (security risk)
   - Blocked via Caddy reverse proxy config
   - Admin-only access pattern

5. **Firewall Rules**
   - Port 8081 (Evolution API) blocked from public access
   - Only localhost access allowed
   - UFW rules configured

6. **Auto-Healing Health Monitor**
   - Script: monitors Evolution API connection state every 60 seconds
   - Detects: disconnected, connection closed, duplicate connections
   - Actions: auto-restart container, clear sessions, reconnect
   - Runs as PM2 process or cron job
   - Duplicate detection: if multiple instances detected, cleans up extras

### Files
```
/data/docker/evolution-api/docker-compose.yml   — Hardened Docker config
apps/api/src/auth/rate-limit.guard.ts            — Rate limiting guard
apps/whatsapp-service/src/handler.js             — Fixed passcode handler
/data/scripts/evolution-health-monitor.sh         — Auto-healing monitor
```

---

## Session 4: Dashboard UI Development & Deployment

### Features Built

1. **Dashboard Page** (`/[locale]/dashboard`)
   - Full marketplace dashboard with Requirements and Offerings tabs
   - Converted from two HTML designs (requirements.html, offerings.html)
   - All content preserved verbatim from original designs

2. **Requirements Tab**
   - Full-width card layout
   - Rating display (⭐ 4.8) with client info (CN avatar)
   - DV/PV badges (Digital Verified / Physical Verified)
   - Title: "Required Web Developer"
   - Subtitle: "E-Commerce Website for Fashion Brand"
   - 5-column grid: Delivery, Location, Eligibility, Budget, Bids
   - Action buttons: Call, Chat, Video
   - Live badge with pulse animation

3. **Offerings Tab**
   - 3-column responsive grid (3→2→1 on mobile)
   - Provider cards with gradient avatar backgrounds
   - Ratings, DV/PV badges, status indicators (Live/Off/Away)
   - Delivery modes (Physical/Digital)
   - Call/Chat/Video action buttons

4. **Sidebar**
   - Saubh.Tech brand with logo
   - User card (RP Singh / Gig Worker / logout button)
   - Requirements/Offerings tab switcher
   - Filters: 9 dropdowns (Sector/Field/Product/Service/Country/State/District/Postcode/Place)
   - 2 checkboxes: Verified, Top Rated
   - Budget range slider (₹1 – ₹999K)
   - Quick links: Income, My Bids, Escrow Money

5. **Top Bar & Hero**
   - "🚀 Gig Marketplace" title
   - Tagline: "|| Real Clients || Verified Providers || Secured Payments ||"
   - 10-field search panel (Sector/Field/Product/Service/Country/State/District/Postcode/Place/Keyword)

6. **Footer**
   - Pagination
   - Legend (Product/Service/Physical/Digital/Phygital/DV/PV/Live/Off/Away)
   - Messages link

7. **Responsive Design**
   - Mobile hamburger menu → sidebar overlay
   - Offerings grid: 3→2→1 columns
   - Stacked layouts on small screens

8. **Styling (Gen-Z/Alpha Aesthetic)**
   - Dark theme (#05070d background)
   - Purple (#7c3aed) + Cyan (#06b6d4) gradients
   - Glass-morphism (backdrop-filter blur)
   - Radial gradients for depth
   - Custom scrollbars (4-5px)
   - Blink animation for Live badges
   - Hover transforms
   - Fonts: Outfit + Plus Jakarta Sans

### Deployment
- File: 775 lines TypeScript
- Transfer: gzip + base64 method (9KB compressed)
- Build: Compiled in 3.9s, TypeScript check in 4.4s
- 33/33 static pages generated
- Live at: https://saubh.tech/en-in/dashboard

### Files
```
apps/web/src/app/[locale]/dashboard/page.tsx  — Dashboard page (775 lines)
apps/web/src/app/[locale]/dashboard/page.tsx.bak — Backup
```

---

## Session 5: WhatsApp Failover, CRM Realtime Sync

### Feature 1: WhatsApp Provider Failover System

**Problem:** Single point of failure — if WhatsApp bans 918800607598, entire auth system (registration, OTP, bot) fails with no recovery path.

**Solution:** Dual-provider architecture with automatic failover.

#### How It Works
```
Message Request (OTP / Welcome / Bot)
         │
    WHATSAPP_PRIMARY (env)
         │
    ┌────▼────┐
    │ Primary  │ (Evolution: 918800607598)
    └────┬────┘
         │
    Success? ──YES──→ Done
         │
         NO (or circuit open)
         │
    ┌────▼─────┐
    │ Secondary │ (WABA: 918130960040)
    └────┬─────┘
         │
    Success? ──YES──→ Done
         │
         NO
         │
    Message DROPPED (both down)
```

#### Circuit Breaker
- Threshold: **1 failure** → circuit opens (instant failover, user never notices)
- Reset: **5 minutes** → half-open → retry primary
- State: In-memory per provider (resets on restart)

#### Components Updated
| File | Change |
|------|--------|
| `whatsapp-sender.service.ts` | Full rewrite: primary/fallback with circuit breaker |
| `whatsapp-service/sender.js` | Same failover for bot service |
| `api/.env` | Added `WHATSAPP_PRIMARY=evolution` |
| `whatsapp-service/.env` | Added `WHATSAPP_PRIMARY`, WABA credentials |

#### Quick Switch Commands
```bash
# Instant switch to WABA (if Evolution banned):
sed -i 's/WHATSAPP_PRIMARY=evolution/WHATSAPP_PRIMARY=waba/' \
  apps/api/.env apps/whatsapp-service/.env
pm2 restart api whatsapp-service
# ~10 seconds, zero code changes

# Switch back:
sed -i 's/WHATSAPP_PRIMARY=waba/WHATSAPP_PRIMARY=evolution/' \
  apps/api/.env apps/whatsapp-service/.env
pm2 restart api whatsapp-service
```

#### Verified Working
- ✅ OTP via Evolution: `[EVOLUTION] Sent to 919212401007: 3EB057CB...`
- ✅ OTP via WABA: `[WABA] Sent to 919212401007: wamid.HBgM...`
- ✅ Circuit breaker: 1 failure → instant WABA fallback
- ✅ Env switch: `WHATSAPP_PRIMARY=waba` → immediate routing change

### Feature 2: Number Swap Procedure

**Scenario:** 918800607598 permanently banned, need new number.

**Steps (< 5 minutes):**
1. Switch primary to WABA (instant, zero downtime)
2. Create new Evolution instance (`saubh-sim2`)
3. Scan QR with new phone
4. Set webhook for new instance
5. Update `EVOLUTION_INSTANCE` in .env
6. Update DB channel record
7. Switch primary back to Evolution
8. Delete old banned instance

Full runbook: `WHATSAPP-FAILOVER-RUNBOOK.md`

### Feature 3: CRM Inbox Realtime Sync

**Problem:** `admin.saubh.tech/en-in/crm/inbox` was not showing messages in realtime — required manual refresh.

**Root Causes Found & Fixed:**

| # | Problem | Fix |
|---|---------|-----|
| 1 | `WebhookService` used `require('ioredis')` — failed silently under pnpm strict hoisting | Replaced with `@Inject('REDIS')` NestJS provider pattern |
| 2 | `InboxService` had no Redis publish | Added `publishEvent()` after outbound send/media |
| 3 | `InboxModule` missing Redis provider | Added `RedisProvider` (same proven pattern as auth) |
| 4 | Evolution webhook skipped all `fromMe: true` messages | Added `handleOutbound()` method to capture outgoing messages |
| 5 | Outbound handler filtered `status: { not: 'RESOLVED' }` | Removed filter, added auto-reopen for RESOLVED conversations |

#### Realtime Message Flow (Now Working)
```
INBOUND:
WhatsApp → Evolution/WABA webhook → EvolutionWebhookController/WabaWebhookController
  → WebhookService.processInbound() → Save to DB → Redis PUBLISH crm:events
  → CrmGateway (realtime) → WebSocket emit crm:message → Admin Inbox UI

OUTBOUND (from CRM):
Admin Inbox → InboxService.sendMessage() → ChannelService → Evolution/WABA
  → Save to DB → Redis PUBLISH crm:events → CrmGateway → WebSocket → Admin Inbox UI

OUTBOUND (from phone/bot/auth):
WhatsApp phone → Evolution SEND_MESSAGE webhook → handleOutbound()
  → Dedup check (externalId) → Save to DB → Redis PUBLISH → Admin Inbox UI
```

#### Redis Connections Verified
```
✅ [RedisProvider] Redis connected for OTP service
✅ [RedisProvider:Inbox] Redis connected for Inbox pub/sub
✅ [WebhookService] WebhookService Redis publisher ready
```

#### Files Modified
```
apps/api/src/crm/webhooks/webhook.service.ts           — @Inject('REDIS'), publishOutbound()
apps/api/src/crm/webhooks/evolution-webhook.controller.ts — handleOutbound(), reopen RESOLVED
apps/api/src/crm/inbox/inbox.service.ts                 — @Inject('REDIS'), publishEvent()
apps/api/src/crm/inbox/inbox.module.ts                  — RedisProvider added
```

---

## Architecture Diagrams

### WhatsApp Message Flow
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Phone   │────▶│ Evolution API │────▶│  API Webhook  │
│  918800607598 │     │  :8081       │     │  :3001       │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
┌──────────────┐     ┌──────────────┐            │
│  User Phone   │────▶│  Meta WABA   │────▶───────┤
│  918130960040 │     │  Cloud API   │            │
└──────────────┘     └──────────────┘     ┌──────▼───────┐
                                          │   Redis       │
                                          │   pub/sub     │
                                          └──────┬───────┘
                                                  │
                                          ┌──────▼───────┐
                                          │  Realtime     │
                                          │  WebSocket    │
                                          │  :3002       │
                                          └──────┬───────┘
                                                  │
                                          ┌──────▼───────┐
                                          │  Admin CRM    │
                                          │  Inbox UI     │
                                          └──────────────┘
```

### Auth Flow
```
User sends "Register Mani GW" to 918800607598
  → Evolution webhook → AuthCommandService.handleCommand()
  → WhatsappAuthService.registerUser()
  → PostgreSQL: create user (passcode = last 4 digits)
  → WhatsappSenderService.sendMessage() [with failover]
  → Welcome message sent via Evolution (or WABA fallback)

User sends "Passcode" to 918800607598
  → AuthCommandService → OtpService.generateOTP()
  → Redis: SET otp:wa:919212401007 = 1234 EX 120
  → WhatsappSenderService.sendOTP() [with failover]

User visits saubh.tech/login → enters phone → enters OTP
  → POST /api/auth/whatsapp/login {whatsapp, code}
  → Check Redis OTP → fallback to static passcode
  → Return JWT token (24h) + user object
  → Redirect to /dashboard
```

---

## Environment Variables Reference

### API (.env)
```env
# ─── Database ───
DATABASE_URL=postgresql://...

# ─── Redis ───
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=Red1sSecure2026
REDIS_URL=redis://:Red1sSecure2026@127.0.0.1:6379

# ─── JWT ───
JWT_SECRET=<secret>
JWT_EXPIRY=86400

# ─── Provider Failover ───
WHATSAPP_PRIMARY=evolution          # or 'waba'

# ─── Evolution API (SIM: +918800607598) ───
EVOLUTION_API_URL=http://localhost:8081
EVOLUTION_API_KEY=eec4e150ae057851d1f1d690d371d3844373fa963191e01a09064dc105c35540
EVOLUTION_INSTANCE=saubh-sim

# ─── WABA (Meta WhatsApp Business: +918130960040) ───
WABA_PHONE_NUMBER_ID=135600659640001
WABA_BUSINESS_ACCOUNT_ID=124563407414910
WABA_ACCESS_TOKEN=<meta-token>
WABA_VERIFY_TOKEN=a7f3c9e1b2d4068f5a9c7e3b1d204f68
```

---

## Key Files Reference

### Authentication
```
apps/api/src/auth/whatsapp-auth.service.ts      — Core auth logic
apps/api/src/auth/whatsapp-auth.controller.ts    — REST endpoints
apps/api/src/auth/auth-command.service.ts        — WhatsApp command handler
apps/api/src/auth/otp.service.ts                 — Redis OTP management
apps/api/src/auth/rate-limit.guard.ts            — Rate limiting
apps/api/src/auth/normalize-phone.ts             — Phone normalization
apps/api/src/auth/whatsapp-auth.module.ts        — Module + Redis provider
```

### WhatsApp Sender (Failover)
```
apps/api/src/whatsapp/whatsapp-sender.service.ts — Failover sender (Evolution + WABA)
apps/api/src/whatsapp/whatsapp.module.ts         — WhatsApp module
apps/whatsapp-service/src/sender.js              — Bot sender with failover
apps/whatsapp-service/src/handler.js             — Bot message handler
apps/whatsapp-service/src/index.js               — Express server (webhook listener)
```

### CRM
```
apps/api/src/crm/webhooks/evolution-webhook.controller.ts — Evolution inbound + outbound
apps/api/src/crm/webhooks/waba-webhook.controller.ts      — WABA inbound
apps/api/src/crm/webhooks/webhook.service.ts              — Message processing + Redis pub
apps/api/src/crm/channels/channel.service.ts              — Send via Evolution/WABA
apps/api/src/crm/inbox/inbox.service.ts                   — Inbox CRUD + Redis pub
apps/api/src/crm/inbox/inbox.controller.ts                — REST endpoints
apps/api/src/crm/bot/bot.service.ts                       — AI bot (Claude API)
```

### Realtime
```
apps/realtime/src/crm/crm.gateway.ts  — WebSocket CRM gateway (Redis sub → Socket.IO)
apps/realtime/src/redis/redis.service.ts — Redis pub/sub service
```

### Frontend
```
apps/web/src/app/[locale]/login/page.tsx      — Login page
apps/web/src/app/[locale]/dashboard/page.tsx  — Dashboard (775 lines)
```

### Infrastructure
```
/data/docker/evolution-api/docker-compose.yml  — Evolution API container
/data/scripts/evolution-health-monitor.sh      — Auto-healing monitor
```

---

## Runbooks & Emergency Procedures

### Evolution Number Banned
```bash
# Immediate (10 seconds):
sed -i 's/WHATSAPP_PRIMARY=evolution/WHATSAPP_PRIMARY=waba/' \
  /data/projects/platform/apps/api/.env \
  /data/projects/platform/apps/whatsapp-service/.env
pm2 restart api whatsapp-service
```

### New Number Registration (5 minutes)
```bash
# 1. Create new instance
curl -s -X POST http://localhost:8081/instance/create \
  -H 'apikey: <KEY>' -H 'Content-Type: application/json' \
  -d '{"instanceName":"saubh-sim2","qrcode":true,"integration":"WHATSAPP-BAILEYS"}'

# 2. Scan QR code
curl -s http://localhost:8081/instance/connect/saubh-sim2 \
  -H 'apikey: <KEY>'

# 3. Set webhook
curl -s -X POST http://localhost:8081/webhook/set/saubh-sim2 \
  -H 'apikey: <KEY>' -H 'Content-Type: application/json' \
  -d '{"webhook":{"url":"https://api.saubh.tech/api/crm/webhooks/evolution","enabled":true,"webhookBase64":false,"events":["MESSAGES_UPSERT","MESSAGES_UPDATE","CONNECTION_UPDATE","SEND_MESSAGE"]}}'

# 4. Update .env
sed -i 's/EVOLUTION_INSTANCE=.*/EVOLUTION_INSTANCE=saubh-sim2/' \
  apps/api/.env apps/whatsapp-service/.env

# 5. Switch back
sed -i 's/WHATSAPP_PRIMARY=waba/WHATSAPP_PRIMARY=evolution/' \
  apps/api/.env apps/whatsapp-service/.env
pm2 restart api whatsapp-service
```

### WABA Token Expired
```bash
# Get new token from Meta Business Manager
# Update in .env
sed -i "s/^WABA_ACCESS_TOKEN=.*/WABA_ACCESS_TOKEN=NEW_TOKEN/" \
  apps/api/.env apps/whatsapp-service/.env
pm2 restart api whatsapp-service
```

### Service Recovery
```bash
# Check all services
pm2 status

# Check Evolution connection
curl -s http://localhost:8081/instance/connectionState/saubh-sim \
  -H 'apikey: <KEY>'

# Check Redis
redis-cli -a Red1sSecure2026 ping

# Restart all
pm2 restart all

# Check logs
pm2 logs api --lines 50
pm2 logs realtime --lines 20
pm2 logs whatsapp-service --lines 20
```

---

## Pending / Future Work

| Priority | Item | Description |
|----------|------|-------------|
| HIGH | JWT Auth Middleware | Protect API routes with JWT verification |
| HIGH | Session Management | Logout, token refresh, expired session handling |
| MEDIUM | WABA Templates | Pre-approve `saubh_otp` and `saubh_welcome` for 24h+ messaging |
| MEDIUM | Dashboard API Integration | Replace mock data with real API calls |
| MEDIUM | Multilingual Auth Messages | OTP/welcome messages in user's preferred language |
| LOW | Provider Health Endpoint | `GET /api/whatsapp/provider-status` for monitoring |
| LOW | Circuit Breaker Reset Endpoint | `POST /api/whatsapp/reset-circuit/:provider` |
| LOW | Redis Eviction Policy | Change from `allkeys-lru` to `noeviction` |
| LOW | Email Verification | Alternate auth method |

---

## Backup Files

All critical files have `.bak.safe` backups:
```
apps/api/src/crm/webhooks/webhook.service.ts.bak.safe
apps/api/src/crm/webhooks/evolution-webhook.controller.ts.bak.safe
apps/api/src/crm/webhooks/evolution-webhook.controller.ts.bak.safe2
apps/api/src/crm/webhooks/webhooks.module.ts.bak.safe
apps/api/src/crm/inbox/inbox.service.ts.bak.safe
apps/api/src/crm/inbox/inbox.module.ts.bak.safe
apps/api/src/whatsapp/whatsapp-sender.service.ts.bak.*
apps/whatsapp-service/src/sender.js.bak.*
apps/web/src/app/[locale]/dashboard/page.tsx.bak
```

---

*Last updated: 23 February 2026, 12:00 IST*
*Sessions covered: 5 (Evolution restore → Auth system → Hardening → Dashboard → Failover + CRM sync)*
