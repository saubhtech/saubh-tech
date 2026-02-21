# CRM Integration Plan — WhatsApp AI Platform ↔ Saubh.Tech Main Platform

> Created: February 21, 2026 (P4 Audit)

## 1. Auth Integration (P3 JWT → CRM)

### Current State
- **Main platform**: JWT issued via WhatsApp OTP (`/api/auth/whatsapp/verify-otp`), stored in `saubh_token` cookie, 24hr expiry. User data in `public.user` table (PostgreSQL `saubhtech` DB).
- **CRM platform**: Separate JWT auth (`auth.controller.ts`), own `users` + `user` tables in `whatsapp_platform` DB.

### Target State
- CRM accepts main platform JWT as a valid session (SSO).
- CRM backend validates `saubh_token` cookie against shared `JWT_SECRET`.
- On first CRM access, auto-provision a CRM user record linked to `public.user.userid`.

### Implementation (P5)
1. Share `JWT_SECRET` between main platform API and CRM backend.
2. Add JWT validation middleware in CRM backend that accepts main platform tokens.
3. Map main platform `userid` → CRM `users.id` via a `platform_user_id` column.
4. Auto-create CRM user on first valid JWT access (lazy provisioning).
5. Preserve CRM's own auth for standalone/API-key access.

---

## 2. User Table Mapping

### Main Platform (`saubhtech.public.user`)
| Field | Type | Notes |
|-------|------|-------|
| userid | BigInt (PK) | Auto-increment |
| whatsapp | String (unique) | E.164 format |
| fname, lname | String | Name |
| email | String? | Optional |
| usertype | String | BO/CL/GW/SA/AD |
| status | Enum | A/I/S/D |

### CRM Platform (`whatsapp_platform.public.users`)
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| email | String | Login identifier |
| name | String | Display name |
| tenant_id | UUID (FK) | Multi-tenant |
| role | String | admin/agent/viewer |

### Mapping Strategy
- Add `platform_user_id BIGINT UNIQUE` to CRM `users` table.
- On SSO login: lookup by `platform_user_id`, create if missing.
- Usertype mapping: `BO` → CRM admin, `SA/AD` → CRM admin, `CL` → CRM viewer, `GW` → no CRM access by default.
- Tenant assignment: `BO` users auto-create a tenant; `CL` users join their linked business tenant.

---

## 3. Shared Services

### PostgreSQL
- **Current**: Two separate databases (`saubhtech` on host, `whatsapp_platform` in Docker).
- **Target**: Keep separate for now. Cross-DB queries via API calls, not direct DB access.
- **Future (P8+)**: Consider migrating CRM tables into `saubhtech` DB under a `crm` schema.

### Redis
- **Current**: CRM has its own Redis container (`whats-redis`).
- **Target**: Keep separate. Main platform doesn't use Redis yet.
- **Future**: Share Redis instance when main platform adds caching/queues.

### MinIO (S3 Storage)
- **Current**: CRM uses MinIO for media/attachments (`whats-minio`, port 9000).
- **Target**: Main platform can use same MinIO for file uploads (separate bucket).
- **Bucket plan**: `whats-attachments` (CRM), `platform-uploads` (main).

### Evolution API
- **Current**: Container not running. CRM has `EVOLUTION_API_URL` + `EVOLUTION_API_KEY` configured.
- **Target (P5)**: Start Evolution container, connect both CRM webhooks and main platform OTP sender.

---

## 4. API Boundaries

### Main Platform API (`api.saubh.tech/api/`)
- User registration + OTP auth
- Master data (places, markets, languages)
- Business/client management
- Platform-level analytics

### CRM API (`saubh.tech/crmwhats/api/v1/`)
- WhatsApp channel management
- Contact management + notes
- Conversations + messages
- Broadcasts + templates
- CRM pipeline (deals, tasks)
- AI bot configuration
- Team/agent management
- Consent/policy management
- n8n workflow triggers

### Shared Endpoints (future)
- `/api/auth/validate` — main platform token validation for CRM SSO
- `/api/users/:id/crm-profile` — link main user to CRM user
- `/api/webhooks/whatsapp` — unified webhook handler (routes to CRM or platform)

---

## 5. Phase Plan

| Phase | Scope | Key Deliverables |
|-------|-------|-----------------|
| **P4** ✅ | Audit + URL migration | Gap analysis, `/crmwhats` URL, this document |
| **P5** | Connect CRM auth to main platform JWT | Shared JWT_SECRET, SSO middleware, user provisioning |
| **P6** | WABA connector | WhatsApp Business Cloud API integration, phone number verification |
| **P7** | AI agent + human handoff | AI bot routing, agent assignment, chat hub live |
| **P8** | CRM pipeline | Deals, tasks, pipeline stages linked to conversations |
| **P9** | Broadcast engine | Campaign builder, scheduling, recipient management, delivery tracking |
| **P10** | Analytics | Unified dashboard: message volume, response times, agent performance, campaign ROI |

### Dependencies
- P5 requires: Evolution API container running (for OTP delivery + CRM webhooks)
- P6 requires: Meta Business verification + WABA phone number
- P7 requires: P5 (auth) + P6 (WABA) for production AI routing
- P8–P10: Can proceed in parallel after P5

---

## 6. Infrastructure Notes

| Service | Host | Port | Access |
|---------|------|------|--------|
| Main API | PM2 | 3001 | api.saubh.tech |
| Main Web | PM2 | 3000 | saubh.tech |
| CRM Backend | Docker | 4000 | saubh.tech/crmwhats/api/v1/ |
| CRM Frontend | Docker | 3100 | saubh.tech/crmwhats/ |
| CRM Worker | Docker | — | Internal |
| CRM Media | Docker (nginx) | 4001 | saubh.tech/crmwhats/media/ |
| PostgreSQL (main) | Host | 5432 | DB: saubhtech |
| PostgreSQL (CRM) | Docker | 5432 (internal) | DB: whatsapp_platform |
| Redis (CRM) | Docker | 6379 (internal) | — |
| MinIO | Docker | 9000/9001 | — |
| n8n | Docker | 5678 (internal) | — |
| Caddy | Host | 443 | Reverse proxy for all |
