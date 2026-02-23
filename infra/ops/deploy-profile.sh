#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# DEPLOY SCRIPT — Profile Completion Feature
# Run from LOCAL machine (Windows PowerShell / Git Bash / WSL)
# ═══════════════════════════════════════════════════════════════════════════
#
# WHAT THIS DEPLOYS:
#   - JWT auth guard
#   - Profile CRUD + photo upload + OTP endpoints
#   - Public geo controller (cascade dropdowns)
#   - Profile page (Next.js)
#   - Login + Dashboard profile gates
#
# FILES CHANGED (11 total):
#   NEW (5):
#     apps/api/src/auth/jwt-auth.guard.ts
#     apps/api/src/auth/profile.controller.ts
#     apps/api/src/auth/profile.module.ts
#     apps/api/src/master/master-geo.controller.ts
#     apps/web/src/app/[locale]/profile/page.tsx
#   MODIFIED (6):
#     apps/api/src/main.ts                                (+2 lines: static serving)
#     apps/api/src/app.module.ts                          (+2 lines: ProfileModule import)
#     apps/api/src/master/master.module.ts                (+2 lines: MasterGeoController)
#     apps/api/package.json                               (+1 line: ioredis dependency)
#     apps/web/src/app/[locale]/login/page.tsx            (+6 lines: profile check)
#     apps/web/src/app/[locale]/dashboard/page.tsx        (+8 lines: profile guard)
#
# ═══════════════════════════════════════════════════════════════════════════

set -e

# ─── Config ────────────────────────────────────────────────────────────────
SERVER="admin1@103.67.236.186"
PORT=5104
REMOTE_DIR="/data/projects/platform"
SSH="ssh -p $PORT $SERVER"
SCP="scp -P $PORT"

echo "═══════════════════════════════════════════════════════════"
echo "  DEPLOYING: Profile Completion Feature"
echo "═══════════════════════════════════════════════════════════"

# ─── Step 1: Pre-flight checks ────────────────────────────────────────────
echo ""
echo "▶ Step 1: Pre-flight health checks..."
$SSH "curl -sf http://localhost:3001/api/healthz > /dev/null && echo '✅ API OK' || echo '❌ API DOWN'"
$SSH "curl -sf http://localhost:3000 > /dev/null && echo '✅ Web OK' || echo '❌ Web DOWN'"

# ─── Step 2: Create upload directory ──────────────────────────────────────
echo ""
echo "▶ Step 2: Ensure /data/uploads/profiles exists..."
$SSH "sudo mkdir -p /data/uploads/profiles && sudo chown -R admin1:admin1 /data/uploads && echo '✅ Upload dir ready'"

# ─── Step 3: Transfer NEW API files ──────────────────────────────────────
echo ""
echo "▶ Step 3: Transferring new API files..."

$SCP apps/api/src/auth/jwt-auth.guard.ts      $SERVER:$REMOTE_DIR/apps/api/src/auth/jwt-auth.guard.ts
$SCP apps/api/src/auth/profile.controller.ts  $SERVER:$REMOTE_DIR/apps/api/src/auth/profile.controller.ts
$SCP apps/api/src/auth/profile.module.ts      $SERVER:$REMOTE_DIR/apps/api/src/auth/profile.module.ts
$SCP apps/api/src/master/master-geo.controller.ts $SERVER:$REMOTE_DIR/apps/api/src/master/master-geo.controller.ts
echo "✅ New API files transferred"

# ─── Step 4: Transfer MODIFIED API files ─────────────────────────────────
echo ""
echo "▶ Step 4: Transferring modified API files..."

$SCP apps/api/src/main.ts                     $SERVER:$REMOTE_DIR/apps/api/src/main.ts
$SCP apps/api/src/app.module.ts               $SERVER:$REMOTE_DIR/apps/api/src/app.module.ts
$SCP apps/api/src/master/master.module.ts     $SERVER:$REMOTE_DIR/apps/api/src/master/master.module.ts
$SCP apps/api/package.json                    $SERVER:$REMOTE_DIR/apps/api/package.json
echo "✅ Modified API files transferred"

# ─── Step 5: Transfer Web files ──────────────────────────────────────────
echo ""
echo "▶ Step 5: Transferring web files..."

# Create profile directory on server
$SSH "mkdir -p $REMOTE_DIR/apps/web/src/app/\\[locale\\]/profile"

$SCP "apps/web/src/app/[locale]/profile/page.tsx" "$SERVER:$REMOTE_DIR/apps/web/src/app/\\[locale\\]/profile/page.tsx"
$SCP "apps/web/src/app/[locale]/login/page.tsx"   "$SERVER:$REMOTE_DIR/apps/web/src/app/\\[locale\\]/login/page.tsx"
$SCP "apps/web/src/app/[locale]/dashboard/page.tsx" "$SERVER:$REMOTE_DIR/apps/web/src/app/\\[locale\\]/dashboard/page.tsx"
echo "✅ Web files transferred"

# ─── Step 6: Install ioredis dependency ──────────────────────────────────
echo ""
echo "▶ Step 6: Installing ioredis dependency..."
$SSH "cd $REMOTE_DIR && pnpm install --frozen-lockfile 2>/dev/null || pnpm install"
echo "✅ Dependencies installed"

# ─── Step 7: Build API ──────────────────────────────────────────────────
echo ""
echo "▶ Step 7: Building API..."
$SSH "cd $REMOTE_DIR && pnpm --filter @saubhtech/api build"
echo "✅ API built"

# ─── Step 8: Build Web ──────────────────────────────────────────────────
echo ""
echo "▶ Step 8: Building Web..."
$SSH "cd $REMOTE_DIR && pnpm --filter @saubhtech/web build"
echo "✅ Web built"

# ─── Step 9: Restart services ───────────────────────────────────────────
echo ""
echo "▶ Step 9: Restarting PM2 services..."
$SSH "cd $REMOTE_DIR && pm2 restart api && pm2 restart web"
echo "✅ Services restarted"

# ─── Step 10: Post-deploy verification ──────────────────────────────────
echo ""
echo "▶ Step 10: Post-deploy verification..."
sleep 5

$SSH "curl -sf http://localhost:3001/api/healthz && echo '✅ API healthz OK' || echo '❌ API healthz FAILED'"
$SSH "curl -sf http://localhost:3000 > /dev/null && echo '✅ Web OK' || echo '❌ Web FAILED'"

# Test new endpoints
$SSH "curl -sf http://localhost:3001/api/master/geo/states > /dev/null && echo '✅ Geo states OK' || echo '❌ Geo states FAILED'"
$SSH "curl -sf http://localhost:3001/api/master/geo/languages > /dev/null && echo '✅ Geo languages OK' || echo '❌ Geo languages FAILED'"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  DEPLOY COMPLETE"
echo ""
echo "  Test manually:"
echo "    1. https://api.saubh.tech/api/healthz"
echo "    2. https://api.saubh.tech/api/master/geo/states"
echo "    3. https://api.saubh.tech/api/master/geo/languages"
echo "    4. https://saubh.tech/hi-in/login (login → should redirect to /profile)"
echo "    5. https://saubh.tech/hi-in/profile (complete form → dashboard)"
echo "    6. https://saubh.tech/hi-in/dashboard (if incomplete → redirects to /profile)"
echo "═══════════════════════════════════════════════════════════"
