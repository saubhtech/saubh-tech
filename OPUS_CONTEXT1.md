# OPUS_CONTEXT.md — Session Context for Claude/Opus
> Last updated: February 22, 2026

## Quick Reference

| Item | Value |
|------|-------|
| **Repo** | github.com/saubhtech/platform (public, branch: main) |
| **Local Path** | `C:\Users\Rishutosh Kumar\Documents\platform` |
| **Server Path** | `/data/projects/platform` (only project folder on server) |
| **SSH** | `ssh -p 5104 admin1@103.67.236.186` |
| **API Domain** | api.saubh.tech |
| **Admin Domain** | admin.saubh.tech |
| **Web Domain** | saubh.tech |
| **CRM WhatsApp** | saubh.tech/crmwhats |
| **Realtime WS** | realtime.saubh.tech |
| **Package Manager** | pnpm (never npm) |

## Server Layout (Current)

| Item | Details |
|------|---------| 
| **Filesystem** | ~41G used / 379G total (11%) |
| **Docker containers** | saubh-keycloak (8080), saubh-postgres (5432), saubh-redis (6379), saubh-evolution (8081) |
| **PM2 apps** | web (3000), api (3001), realtime (3002), admin (3003), crmwhats (3004) |
| **Projects** | `/data/projects/platform` — only project remaining |
| **Redis password** | `Red1sSecure2026` |
| **Media uploads** | `/data/uploads/crm/` |

## What's Been Built

### Apps in Monorepo (PM2)
| App | Path | Stack | Port | Status |
|-----|------|-------|------|--------|
| web | `apps/web` | Next.js 16, Tailwind v4, i18n (13 active languages) | 3000 | ✅ Live |
| api | `apps/api` | NestJS, Prisma 7, PostgreSQL, Keycloak + WhatsApp OTP + CRM + Bot + Templates + Media | 3001 | ✅ Live |
| admin | `apps/admin` | Next.js, Tailwind, Keycloak SSO, CRM UI with channel switcher | 3003 | ✅ Live |
| realtime | `apps/realtime` | WebSocket server, Socket.io, Redis pub/sub, CRM gateway | 3002 | ✅ Live |
| crmwhats | `apps/crmwhats` | Next.js 16, dark glassmorphism UI, JWT auth (BO/GW only), WebSocket real-time, **FULLY WIRED to backend API** ✅ | 3004 | ✅ Live |

### Docker Services
| Container | Image | Port | Role |
|-----------|-------|------|------|
| saubh-keycloak | keycloak/keycloak | 8080 | SSO/Auth |
| saubh-postgres | postgres:16 | 5432 | Main DB (`saubhtech` + `evolution`) |
| saubh-redis | redis:7 | 6379 | Cache + BullMQ queues + CRM pub/sub |
| saubh-evolution | atendai/evolution-api:v2.2.0 | 8081 | WhatsApp API (v2.3.7) |

---

### Completed: P3 — WhatsApp OTP Login ✅ (Feb 21, 2026)

**Users Table** (`public.user`):
- Unified table for all user types (BO/CL/GW/SA/AD)
- Key fields: `userid` (BigInt PK), `whatsapp` (unique), `passcode`, `passcodeExpiry`, `fname`, `lname`, `usertype`, `email`, `status`

**WhatsApp Auth Endpoints** (all under `/api/` prefix):
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/whatsapp/register` | POST | Register user (whatsapp, fname, usertype) |
| `/api/auth/whatsapp/request-otp` | POST | Send 4-digit OTP via WhatsApp (rate limited: 3/hr) |
| `/api/auth/whatsapp/verify-otp` | POST | Verify OTP, return JWT (24hr expiry) |
| `/api/auth/whatsapp/logout` | POST | Client-side cookie clear |
| `/api/webhooks/whatsapp` | POST | Evolution API webhook (Register/Login commands) |

---

### Completed: P4 — WhatsApp CRM Audit ✅ (Feb 21, 2026)

Audited old WhatsApp CRM at `/opt/whatsapp-ai-platform/` (now removed in P5):
- Was: 8 Docker containers, 81 DB tables, 19 API modules, 12 frontend pages
- Integration plan created: `docs/crm-integration-plan.md`

---

### Completed: P5 — Remove Old WhatsApp Platform + Free Disk Space ✅ (Feb 21, 2026)

Old CRM removed entirely (architecturally incompatible). Disk freed: 52G.

---

### Completed: P6 — Fresh CRM WhatsApp Inside Monorepo ✅ (Feb 21, 2026)

**Evolution API Setup**:
- Container `saubh-evolution` running v2.3.7 on port 8081
- Instance `saubh-sim` connected to +918800607598 via QR
- Separate `evolution` database on saubh-postgres
- API Key: `eec4e150ae057851d1f1d690d371d3844373fa963191e01a09064dc105c35540`
- Webhook: `https://api.saubh.tech/api/crm/webhooks/evolution` (must use public URL — Docker can't reach localhost)
- Docker config: `infra/compose/evolution/docker-compose.yml`

**CRM Database** (`crm` schema in `saubhtech` DB — 9 tables):
| Model | Purpose |
|-------|---------|
| `WaChannel` | Phone numbers + provider type (EVOLUTION/WABA) + `defaultBotEnabled` |
| `WaContact` | WhatsApp contacts, links to `public.user` |
| `WaConversation` | Threads (OPEN/ASSIGNED/RESOLVED), bot toggle |
| `WaMessage` | Messages (IN/OUT), media, delivery status |
| `WaBroadcast` | Bulk message campaigns |
| `WaBroadcastRecipient` | Per-recipient delivery tracking |
| `BotConfig` | Per-channel bot settings (systemPrompt, greetingMessage, handoffKeywords) |
| `WaTemplate` | WABA message templates (MARKETING/UTILITY/AUTHENTICATION) |

**Seeded Channels**:
- Saubh SIM (+918800607598) → EVOLUTION, instance: `saubh-sim`
- Saubh Business (+918130960040) → WABA, instance: null

**CRM Backend Modules** (`apps/api/src/crm/`):
| Module | Key Files | Endpoints |
|--------|-----------|-----------|
| channels | `channel.service.ts`, `channels.controller.ts` | `GET /crm/channels`, dual-provider routing (Evolution + WABA), `sendMediaMessage()` |
| inbox | `inbox.controller.ts`, `inbox.service.ts` | `GET/POST /crm/conversations`, messages, assign, resolve, toggle-bot, send media |
| contacts | `contacts.controller.ts`, `contacts.service.ts` | `GET/POST/PATCH /crm/contacts`, findOrCreate, auto-link to user |
| broadcast | `broadcast.controller.ts`, `broadcast.service.ts`, `broadcast.processor.ts` | `GET/POST /crm/broadcasts`, BullMQ queue `crm-broadcast`, 1msg/sec throttle |
| webhooks | `evolution-webhook.controller.ts`, `waba-webhook.controller.ts`, `webhook.service.ts` | Inbound message processing, auto-create contacts + conversations, Redis pub/sub |
| bot | `bot.service.ts`, `bot.controller.ts`, `bot.module.ts` | AI auto-reply (Claude Haiku), greeting, handoff, per-channel config |
| templates | `template.service.ts`, `template.controller.ts`, `template.module.ts` | WABA template CRUD, Meta Graph API sync, listAll |
| media | `media.controller.ts`, `media.module.ts` | File upload (16MB max), serve uploaded files |

**CRM API Endpoints** (all under `/api/crm/`):
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/crm/channels` | GET | List all channels |
| `/api/crm/conversations` | GET | List conversations (filter: channelId, status) |
| `/api/crm/conversations/:id/messages` | GET | Message thread (paginated) |
| `/api/crm/conversations/:id/messages` | POST | Send message via channel |
| `/api/crm/conversations/:id/media` | POST | Send media message (image/video/audio/document) |
| `/api/crm/conversations/:id/assign` | PATCH | Assign to agent |
| `/api/crm/conversations/:id/resolve` | PATCH | Mark resolved |
| `/api/crm/conversations/:id/toggle-bot` | PATCH | Toggle bot on/off |
| `/api/crm/contacts` | GET | List contacts (search, channelId filter) |
| `/api/crm/contacts` | POST | Create contact |
| `/api/crm/contacts/:id` | GET | Contact detail + conversations |
| `/api/crm/contacts/:id` | PATCH | Update contact |
| `/api/crm/broadcasts` | GET | List broadcasts |
| `/api/crm/broadcasts/:id` | GET | Broadcast detail + recipients |
| `/api/crm/broadcasts` | POST | Create broadcast (immediate or scheduled) |
| `/api/crm/bot/config/:channelId` | GET | Get bot config for channel |
| `/api/crm/bot/config/:channelId` | PATCH | Update bot config (isEnabled, systemPrompt, greetingMessage, handoffKeywords) |
| `/api/crm/bot/status` | GET | All channels with bot status |
| `/api/crm/templates` | GET | List all templates (optional ?status=) |
| `/api/crm/templates/channel/:channelId` | GET | Templates for channel |
| `/api/crm/templates/detail/:id` | GET | Single template |
| `/api/crm/templates` | POST | Create template (submits to Meta for WABA) |
| `/api/crm/templates/:id` | PATCH | Update template |
| `/api/crm/templates/:id` | DELETE | Delete template (+ Meta cleanup) |
| `/api/crm/templates/sync/:channelId` | POST | Sync templates from Meta |
| `/api/crm/media/upload` | POST | Upload file (multipart, 16MB max) |
| `/api/crm/media/:filename` | GET | Serve uploaded file |
| `/api/crm/webhooks/evolution` | POST | Evolution inbound webhook |
| `/api/crm/webhooks/waba` | GET/POST | WABA verification + inbound webhook |

---

### Completed: P7 — WABA Activation + AI Bot ✅ (Feb 21, 2026)

**WABA (WhatsApp Business Cloud API)**:
- +918130960040 activated via Meta Graph API
- Webhook registered: `https://api.saubh.tech/api/crm/webhooks/waba`
- Meta webhook verified with `hub.challenge` ✅
- Subscribed to: `messages` field
- Outbound test: message delivered via Graph API ✅
- Inbound test: webhook received, contact + conversation auto-created ✅
- HMAC SHA256 signature verification implemented (skipped if `WABA_APP_SECRET` not set)

**WABA Env Vars** (apps/api/.env):
- `WABA_PHONE_NUMBER_ID=135600659640001`
- `WABA_BUSINESS_ACCOUNT_ID=124563407414910`
- `WABA_ACCESS_TOKEN=EAAImsV1nxWk...` (long-lived token)
- `WABA_VERIFY_TOKEN=a7f3c9e1b2d4068f5a9c7e3b1d204f68`

**Channel Switcher**:
- `GET /api/crm/channels` endpoint added
- Inbox + Contacts pages now have channel tabs (SIM vs WABA)
- Conversations and contacts filtered by selected channel
- Purple tabs for Evolution/SIM, green tabs for WABA

**Dependencies Added** (apps/api):
- `@anthropic-ai/sdk ^0.78.0`

---

### Completed: P8 — CRM WhatsApp App (crmwhats) ✅ (Feb 21, 2026)

**Standalone Next.js app** for Business Owners + Gig Workers (not admins).
- URL: `saubh.tech/crmwhats/[locale]/inbox|contacts|broadcast|settings`
- Auth: WhatsApp JWT (`saubh_token` cookie from P3), only BO/GW usertypes allowed
- Port: 3004 (Caddy reverse proxy via `handle /crmwhats*`)
- Design: Dark glassmorphism Gen-Z/Alpha UI

**Design System**:
- Background: #0A0A0F, #13131A, #1C1C27
- Primary: #7C3AED (violet), Secondary: #EC4899 (pink), Accent: #F97316 (orange)
- Glass cards: `rgba(255,255,255,0.05)` + `backdrop-filter: blur(12px)`
- Gradient buttons: `linear-gradient(135deg, #7C3AED, #EC4899)`

**App Structure** (`apps/crmwhats/src/`):
| Component | Description |
|-----------|-------------|
| `middleware.ts` | Locale detection (`saubh_locale` cookie), JWT auth, BO/GW gate, expiry check |
| `components/Sidebar.tsx` | Desktop collapsible sidebar + mobile bottom nav, channel switcher pills, user footer |
| `context/UserContext.tsx` | Decodes JWT, provides userid/fname/usertype/whatsapp + logout |
| `context/ChannelContext.tsx` | ALL/EVOLUTION/WABA filter, persists to localStorage, fetches real channels from API |
| `lib/api.ts` | Typed fetch wrapper — reads JWT from cookie, Bearer auth, 401 redirect, get/post/patch/delete/upload |
| `lib/types.ts` | WaChannel, WaContact, WaConversation, WaMessage, WaBroadcast, BotConfig, PaginatedResponse |
| `components/ui/*` | GlassCard, GradientButton, Avatar, ChannelBadge, StatusDot, UnreadBadge, SkeletonLoader |

**Pages**:
| Page | Route | Features |
|------|-------|----------|
| Inbox | `/[locale]/inbox` | Two-panel (list + thread), search, status filters, channel filter, gradient chat bubbles, bot banner + take over, media display + upload, WebSocket real-time (fallback: 30s polling), Live/Polling indicator |
| Contacts | `/[locale]/contacts` | Grid/list toggle, search, add contact, detail panel (hero, info, recent conversations), block/unblock |
| Broadcast | `/[locale]/broadcast` | List with status pills (DRAFT/SCHEDULED/SENDING/DONE/FAILED), detail panel with recipients |
| Broadcast Create | `/[locale]/broadcast/create` | 4-step wizard: Channel → Message (live preview) → Recipients (checkbox list) → Confirm (send now/schedule) |
| Templates | `/[locale]/templates` | Template Studio: list with channel/status filters, create form (channel, category, name, language, header, body, footer, variables), WhatsApp-style preview, delete with Meta cleanup |
| Settings | `/[locale]/settings` | Profile, channel status cards, notification toggles, default channel filter, AI Bot Configuration (per-channel toggle, greeting, system prompt, handoff keywords), bot activity stats, sign out |
| Health | `/api/healthz` | `{ status: ok, app: crmwhats }` |

**Infrastructure**:
- Caddy: `handle /crmwhats*` → localhost:3004 (added inside saubh.tech block)
- PM2: `crmwhats` process, cwd `apps/crmwhats`, Next.js start --port 3004
- basePath: `/crmwhats` in next.config.ts

---

### Completed: P9 — Bot Activation + Templates + Media + Real-time ✅ (Feb 22, 2026)

**Bot Activation** (Tasks 1-6):
- `ANTHROPIC_API_KEY` added to `apps/api/.env`
- `BotConfig` model: per-channel settings (systemPrompt, greetingMessage, handoffKeywords)
- `defaultBotEnabled` field on `WaChannel`
- `BotService` enhanced: dynamic system prompts from DB, greeting on new conversations, handoff detection
- Bot API: `GET/PATCH /api/crm/bot/config/:channelId`, `GET /api/crm/bot/status`
- Bot Settings UI in crmwhats Settings page: per-channel toggle, greeting message, system prompt, handoff keywords tag input, bot activity stats

**WABA Templates** (Tasks 7-9):
- `WaTemplate` model: name, category (MARKETING/UTILITY/AUTHENTICATION), language, status (PENDING/APPROVED/REJECTED), body, header, footer, variables, metaId
- Template API: full CRUD + Meta Graph API sync for WABA channels, auto-approve for non-WABA
- Template Studio UI: list with channel/status filters, create form with WhatsApp preview, delete

**Media Messages** (Tasks 10-12):
- `ChannelService.sendMediaMessage()`: routes to Evolution or WABA Graph API
- `MediaModule`: upload endpoint (Multer, 16MB max, image/video/audio/document), serve endpoint
- Storage: `/data/uploads/crm/`
- `InboxService.sendMediaMessage()`: sends via channel + saves to DB
- Inbox UI: `MediaBubble` component (inline images, video player, audio player, document download), 📎 attachment button with file upload

**Real-time WebSocket** (Tasks 13-14):
- `CrmGateway` in realtime app (`/crm` namespace)
  - Client events: `crm:join` (conversation room), `crm:leave`, `crm:join:all` (inbox feed)
  - Server events: `crm:message`, `crm:update`
  - Redis subscriber on `crm:events` channel → fans out to WebSocket rooms
- `WebhookService` Redis publisher: publishes `message` and `conversation:update` events on inbound
- Inbox UI: Socket.io client connects to `realtime.saubh.tech/crm`, real-time message delivery, 30s fallback polling when WS disconnected, Live/Polling indicator

**Dependencies Added**:
- `ioredis ^5.9.3` (apps/api — Redis pub/sub for webhook→realtime)
- `socket.io-client ^4.8.3` (apps/crmwhats — WebSocket client)

**Env Vars Added**:
- `apps/api/.env`: `REDIS_URL=redis://:Red1sSecure2026@127.0.0.1:6379`, `ANTHROPIC_API_KEY`
- `apps/realtime/.env`: `REDIS_URL=redis://:Red1sSecure2026@127.0.0.1:6379`
- `apps/crmwhats/.env.local`: `NEXT_PUBLIC_WS_URL=https://realtime.saubh.tech`

---

### Completed: P11 — Wire crmwhats to Backend API ✅ (Feb 22, 2026)

**Problem**: crmwhats had UI shell with raw `fetch()` calls — no auth headers, no error handling, no 401 redirect. All API calls would fail on protected endpoints.

**Solution**: Replaced all raw `fetch()` calls with authenticated `api` client (`lib/api.ts`) across all pages.

**Files Modified**:
| File | Changes |
|------|---------|
| `app/[locale]/inbox/page.tsx` | 9 raw fetch → `api.get/post/patch/upload`, WebSocket JWT auth added |
| `app/[locale]/contacts/page.tsx` | 6 raw fetch → `api.get/post/patch` |
| `app/[locale]/broadcast/page.tsx` | 3 raw fetch → `api.get` |
| `app/[locale]/broadcast/create/page.tsx` | 4 raw fetch → `api.get/post` |
| `context/ChannelContext.tsx` | Enhanced: fetches real channels from API, exposes `channels[]`, `getChannelByType()`, `refreshChannels()` |
| `.env.example` | Created: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`, `NEXT_PUBLIC_BASE_URL` |

**API Client** (`lib/api.ts`):
- Reads `saubh_token` JWT from cookie automatically
- Sets `Authorization: Bearer` header on every request
- On 401: redirects to `saubh.tech/[locale]/login`
- Methods: `get<T>`, `post<T>`, `patch<T>`, `delete<T>`, `upload<T>`

**Env Vars Added** (`apps/crmwhats/.env.local`):
- `NEXT_PUBLIC_API_URL=https://api.saubh.tech`
- `NEXT_PUBLIC_BASE_URL=https://saubh.tech`

**E2E Verified**:
- ✅ Inbox: conversations load, messages display, send works, Bot/Resolve buttons functional
- ✅ Contacts: 5 contacts load in grid, search + add + block functional
- ✅ Broadcast: page loads, "New Broadcast" wizard accessible
- ✅ Sidebar: user shown (Mani/BO), channel switcher works
- ✅ Auth: unauthenticated → redirects to login page
- ⚠️ WebSocket shows "Polling" (fallback works, WS auth needs server-side gateway update — pre-existing)

---

## What's Next: P12 — CRM Pipeline (Deals, Tasks, SLA)

- Deal stages + pipeline board (Kanban)
- Lead tracking + contact tagging
- Task assignment per conversation
- SLA timers (first response, resolution)
- Agent performance metrics

**Future phases**:
- P13 = Analytics Dashboard (message volumes, response times, bot performance, channel comparison)
- P14 = n8n Automation (workflow triggers, CRM events → actions)
- P15 = Multi-tenant (business-scoped CRM data)
- P16 = Marketplace Integration

---

## DB Policy (Permanent — apply every session)

- **Master tables**: schema `master`, no businessId
- **Tenant tables**: always include businessId
- **CRM tables**: schema `crm`
- **Every table must have**: id, createdAt, updatedAt (except legacy tables being modified in-place)
- **i18n split pattern** for all translatable master data:
  - Base table: code (UPPERCASE, unique), sortOrder, isActive
  - i18n table: parentId, locale, name, description, isFallback
  - `@@unique([parentId, locale])` on i18n tables
  - `@@index` on all foreign keys
- **Enums**: UPPERCASE codes only
- **Never delete columns** in migrations — only add or deprecate
- **Never force migrations**: always use `prisma migrate dev --name descriptive_name`
- **Soft delete only**: set `isActive=false`, never hard delete
- **All migrations must be reversible**

## Database Schema (Current)

### Main Platform DB (`saubhtech`)
- **public schema**: Business, Client, User (with WhatsApp OTP fields), UserMembership, Conversation, Message, Telephony
- **master schema**: Geographic hierarchy (Country → State → District → Postal → Place), Organizational hierarchy (Locality → Area → Division → Region → Zone), Industry classification (Sector → Field → Market), Language (basic — langid + language only)
- **crm schema**: WaChannel, WaContact, WaConversation, WaMessage, WaBroadcast, WaBroadcastRecipient, BotConfig, WaTemplate

### Evolution DB (`evolution`)
- Managed by Evolution API internally

## Admin UI Pattern (Permanent)

- **Route**: `admin.saubh.tech/[locale]/master/[table]`
- **CRM Route**: `admin.saubh.tech/[locale]/crm/inbox|contacts|broadcasts`
- **All routes**: Keycloak protected (ADMIN or SUPER_ADMIN)
- **All tables**: paginated list + create + edit + soft delete
- **Existing generic viewer**: `apps/admin/src/app/[locale]/master/[table]/page.tsx`
- **API base**: `api.saubh.tech/api/`

## CRM WhatsApp UI Pattern (Permanent)

- **Route**: `saubh.tech/crmwhats/[locale]/inbox|contacts|broadcast|templates|settings`
- **Auth**: WhatsApp JWT (`saubh_token` cookie), BO/GW usertypes only
- **API client**: `lib/api.ts` — authenticated fetch wrapper (Bearer token from cookie)
- **Design**: Dark glassmorphism, violet/pink gradient accents
- **Real-time**: Socket.io client → `realtime.saubh.tech/crm` namespace
- **API base**: `api.saubh.tech/api/crm/`

## Session Rules

- **WRONG PATH** (never use): `Desktop\15.02.2026\project\saubh-tech`
- **Correct local path**: `C:\Users\Rishutosh Kumar\Documents\platform`
- One task at a time. Print ✓ DONE. Wait for NEXT.
- Files under 20KB → GitHub API
- Files over 20KB → give PowerShell command
- SSH commands → give one block, wait for output
- Never paste prompts into SSH terminal
