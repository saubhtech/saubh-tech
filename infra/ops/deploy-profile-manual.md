# Profile Feature — Manual Deploy Steps
# Run these commands one-by-one from the platform root directory
# ═══════════════════════════════════════════════════════════════

# ── OPTION A: Git-based deploy (RECOMMENDED) ──────────────────
# If all changes are committed to git:

ssh -p 5104 admin1@103.67.236.186

cd /data/projects/platform
git pull origin main

# Create upload directory
sudo mkdir -p /data/uploads/profiles
sudo chown -R admin1:admin1 /data/uploads

# Install dependencies (ioredis is new)
pnpm install

# Build API
pnpm --filter @saubhtech/api build

# Build Web
pnpm --filter @saubhtech/web build

# Restart services
pm2 restart api
pm2 restart web

# Verify
sleep 3
curl -sf http://localhost:3001/api/healthz && echo "✅ API OK" || echo "❌ API FAILED"
curl -sf http://localhost:3000 > /dev/null && echo "✅ Web OK" || echo "❌ Web FAILED"
curl -sf http://localhost:3001/api/master/geo/states > /dev/null && echo "✅ Geo OK" || echo "❌ Geo FAILED"


# ── OPTION B: Manual SCP deploy ───────────────────────────────
# If not using git, SCP files individually:
# (Run from LOCAL machine, from platform/ root)

# Variables
SERVER="admin1@103.67.236.186"
P="-P 5104"
R="/data/projects/platform"

# Pre-flight
ssh -p 5104 $SERVER "sudo mkdir -p /data/uploads/profiles && sudo chown -R admin1:admin1 /data/uploads"

# NEW API files
scp $P apps/api/src/auth/jwt-auth.guard.ts       $SERVER:$R/apps/api/src/auth/
scp $P apps/api/src/auth/profile.controller.ts    $SERVER:$R/apps/api/src/auth/
scp $P apps/api/src/auth/profile.module.ts        $SERVER:$R/apps/api/src/auth/
scp $P apps/api/src/master/master-geo.controller.ts $SERVER:$R/apps/api/src/master/

# MODIFIED API files
scp $P apps/api/src/main.ts          $SERVER:$R/apps/api/src/
scp $P apps/api/src/app.module.ts    $SERVER:$R/apps/api/src/
scp $P apps/api/src/master/master.module.ts $SERVER:$R/apps/api/src/master/
scp $P apps/api/package.json         $SERVER:$R/apps/api/

# WEB files (the [locale] bracket needs escaping)
ssh -p 5104 $SERVER "mkdir -p '$R/apps/web/src/app/\[locale\]/profile'"
scp $P "apps/web/src/app/[locale]/profile/page.tsx"     "$SERVER:$R/apps/web/src/app/\[locale\]/profile/"
scp $P "apps/web/src/app/[locale]/login/page.tsx"       "$SERVER:$R/apps/web/src/app/\[locale\]/login/"
scp $P "apps/web/src/app/[locale]/dashboard/page.tsx"   "$SERVER:$R/apps/web/src/app/\[locale\]/dashboard/"

# Install, build, restart (SSH into server)
ssh -p 5104 $SERVER "cd $R && pnpm install && pnpm --filter @saubhtech/api build && pnpm --filter @saubhtech/web build && pm2 restart api && pm2 restart web"


# ── POST-DEPLOY VERIFICATION ─────────────────────────────────
# Protected URLs (must still work):
#   ✅ https://saubh.tech                           (homepage)
#   ✅ https://saubh.tech/hi-in/login               (login page)
#   ✅ https://saubh.tech/hi-in/dashboard            (dashboard)
#   ✅ https://admin.saubh.tech/en-in/crm/inbox     (CRM inbox)
#   ✅ https://api.saubh.tech/api/healthz            (health check)
#   ✅ https://api.saubh.tech/api/auth/whatsapp/verify-otp (POST)
#
# New URLs to test:
#   🆕 https://saubh.tech/hi-in/profile             (profile page)
#   🆕 https://api.saubh.tech/api/master/geo/states  (public geo)
#   🆕 https://api.saubh.tech/api/master/geo/languages
#   🆕 https://api.saubh.tech/api/auth/profile       (needs JWT)
