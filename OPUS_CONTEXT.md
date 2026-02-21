# OPUS_CONTEXT.md — Session Context for Claude/Opus
> Last updated: February 21, 2026

## Quick Reference

| Item | Value |
|------|-------|
| **Repo** | github.com/saubhtech/platform (public, branch: main) |
| **Local Path** | `C:\Users\Rishutosh Kumar\Documents\platform` |
| **Server Path** | `/data/projects/platform` (also symlinked from `/data/projects/saubh-gig`) |
| **SSH** | `ssh -p 5104 admin1@103.67.236.186` |
| **API Domain** | api.saubh.tech |
| **Admin Domain** | admin.saubh.tech |
| **Web Domain** | saubh.tech |
| **Package Manager** | pnpm (never npm) |

## What's Been Built

### Apps in Monorepo
| App | Path | Stack | Status |
|-----|------|-------|--------|
| web | `apps/web` | Next.js 16, Tailwind v4, i18n (13 active languages) | ✅ Live |
| api | `apps/api` | NestJS, Prisma, PostgreSQL, Keycloak + WhatsApp OTP auth | ✅ Live |
| admin | `apps/admin` | Next.js, Tailwind, Keycloak SSO | ✅ Live |
| realtime | `apps/realtime` | WebSocket server | ✅ Live |

### Completed: P3 — WhatsApp OTP Login ✅ (Feb 21, 2026)

**Users Table** (`public.user`):
- Unified table for all user types (BO/CL/GW/SA/AD)
- Key fields: `userid` (BigInt PK), `whatsapp` (unique), `passcode`, `passcodeExpiry`, `fname`, `lname`, `usertype`, `email`, `status`
- Enums preserved: Gender, VerifiedType, UserStatus
- New fields added: `lname`, `passcodeExpiry` (mapped `passcode_expiry`), `usertype` (default "GW")

**WhatsApp Auth Endpoints** (all under `/api/` prefix):
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/whatsapp/register` | POST | Register user (whatsapp, fname, usertype) |
| `/api/auth/whatsapp/request-otp` | POST | Send 4-digit OTP via WhatsApp (rate limited: 3/hr) |
| `/api/auth/whatsapp/verify-otp` | POST | Verify OTP, return JWT (24hr expiry) |
| `/api/auth/whatsapp/logout` | POST | Client-side cookie clear |
| `/api/webhooks/whatsapp` | POST | Evolution API webhook (Register/Login commands) |

**Backend Files**:
- `apps/api/src/auth/otp.service.ts` — OTP generation/verification
- `apps/api/src/auth/whatsapp-auth.service.ts` — register, requestOTP, loginWithOTP
- `apps/api/src/auth/whatsapp-auth.controller.ts` — 4 auth endpoints
- `apps/api/src/auth/whatsapp-auth.module.ts` — module wiring
- `apps/api/src/whatsapp/whatsapp-sender.service.ts` — Evolution API sender (sendOTP, sendWelcome)
- `apps/api/src/whatsapp/whatsapp-webhook.controller.ts` — webhook handler
- `apps/api/src/whatsapp/whatsapp.module.ts` — module wiring

**Frontend Files**:
- `apps/web/src/app/[locale]/login/page.tsx` — Register tab (WhatsApp deep link) + Sign In tab (OTP flow)
- `apps/web/src/app/[locale]/dashboard/page.tsx` — Protected stub (JWT check, user info, logout)
- `apps/web/src/proxy.ts` — Updated with dashboard auth guard (saubh_token cookie check)

**Environment Variables** (added to `.env.example`):
- `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE`
- `WHATSAPP_NUMBER_1=+918800607598`, `WHATSAPP_NUMBER_2=+918130960040`
- `JWT_SECRET`, `JWT_EXPIRY=86400`
- `OTP_EXPIRY_SECONDS=120`, `OTP_MAX_PER_HOUR=3`

**Note**: Evolution API container is not running. WhatsApp message delivery is silently skipped. OTP can be read from DB for testing. Evolution setup deferred to P4.

### Database Schema (Current)
- **public schema**: Business, Client, User (with WhatsApp OTP fields), UserMembership, Conversation, Message, Telephony models
- **master schema**: Geographic hierarchy (Country → State → District → Postal → Place), Organizational hierarchy (Locality → Area → Division → Region → Zone), Industry classification (Sector → Field → Market), Language (basic — langid + language only)

### Existing Master API
- `apps/api/src/master/` — generic MasterModule with controller/service handling all master tables
- `apps/admin/src/app/[locale]/master/[table]/page.tsx` — dynamic generic master table viewer (52KB)

---

## What's Next: P4 — WhatsApp CRM Audit + /crmwhats

- Audit existing WhatsApp CRM (`whats-backend`, `whats-frontend` Docker containers)
- Integrate or replace with platform-native CRM at `/crmwhats`
- Start Evolution API container and configure sender service
- Connect webhook to live Evolution instance

---

## DB Policy (Permanent — apply every session)

- **Master tables**: schema `master`, no businessId
- **Tenant tables**: always include businessId
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

## Master Tables Status

| Table | Current State | Target State | Status |
|-------|--------------|--------------|--------|
| Language | Basic (langid, language) | Add locale, isActive, isRtl, sortOrder | 🔜 NEXT |
| Sector | Basic (sectorid, sector) | Add code, sortOrder, isActive, createdAt, updatedAt + SectorI18n | ⏳ PENDING |
| Field | Basic (fieldid, field, sectorid) | Add code, sortOrder, isActive, createdAt, updatedAt + FieldI18n | ⏳ PENDING |
| Market → Item | Basic (marketid, sectorid, fieldid, p_s_ps, item) | Evolve into Item with i18n, or create ItemI18n alongside | ⏳ PENDING |
| DeliveryMode enum | Does not exist | `PHYSICAL, DIGITAL, PHYGITAL` | ⏳ PENDING |
| SectorI18n | Does not exist | New table | ⏳ PENDING |
| FieldI18n | Does not exist | New table | ⏳ PENDING |
| ItemI18n | Does not exist | New table | ⏳ PENDING |

## Admin UI Pattern (Permanent)

- **Route**: `admin.saubh.tech/[locale]/master/[table]`
- **All routes**: Keycloak protected (ADMIN or SUPER_ADMIN)
- **All tables**: paginated list + create + edit + soft delete
- **Existing generic viewer**: `apps/admin/src/app/[locale]/master/[table]/page.tsx`
- **API base**: `api.saubh.tech/master/`

## Session Rules

- **WRONG PATH** (never use): `Desktop\15.02.2026\project\saubh-tech`
- **Correct local path**: `C:\Users\Rishutosh Kumar\Documents\platform`
- One task at a time. Print ✓ DONE. Wait for NEXT.
- Files under 20KB → GitHub API
- Files over 20KB → give PowerShell command
- SSH commands → give one block, wait for output
- Never paste prompts into SSH terminal
