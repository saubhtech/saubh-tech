# Saubh.Tech Platform — Deploy Runbook

## Table of Contents

1. First-time server setup
2. GitHub Secrets configuration
3. PM2 installation and setup
4. Caddy installation and configuration
5. Verifying services after deploy
6. Rollback procedure

---

## 1. First-Time Server Setup

Server: Ubuntu 24.04 | IP: 103.67.236.186 | SSH Port: 5104

### 1.1 Connect to server

```bash
ssh -p 5104 admin1@103.67.236.186
```

### 1.2 Install Node.js 24 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # should print v24.x.x
```

### 1.3 Install pnpm

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

### 1.4 Clone the repository

```bash
sudo mkdir -p /data/projects
sudo chown admin1:admin1 /data/projects
cd /data/projects
git clone https://github.com/saubhtech/platform.git
cd platform
```

### 1.5 Create environment file

```bash
cp .env.example .env
# Edit with your production values:
nano .env
```

Required environment variables:

```
DATABASE_URL=postgresql://saubh_admin:PgSecure2026Saubh@127.0.0.1:5432/saubh_gig?schema=public
REDIS_URL=redis://:YOUR_REDIS_PASSWORD@127.0.0.1:6379
JWT_SECRET=your_production_jwt_secret_min_32_chars
NEXT_PUBLIC_BASE_URL=https://saubh.tech
NEXT_PUBLIC_API_URL=https://api.saubh.tech
NODE_ENV=production
```

### 1.6 Install dependencies and build

```bash
pnpm install --frozen-lockfile
pnpm --filter @saubhtech/api prisma:migrate:prod
pnpm --filter @saubhtech/web build
pnpm --filter @saubhtech/admin build
pnpm --filter @saubhtech/api build
```

---

## 2. GitHub Secrets Configuration

Go to **GitHub → saubhtech/platform → Settings → Secrets and variables → Actions**

Add these 3 repository secrets:

| Secret Name | Value |
|---|---|
| `SERVER_IP` | `103.67.236.186` |
| `SERVER_USER` | `admin1` |
| `SERVER_SSH_KEY` | Paste your **private** SSH key (the full content of `~/.ssh/id_ed25519` or `id_rsa`) |

### Generate an SSH key (if needed)

```bash
# On your LOCAL machine:
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Copy the PUBLIC key to the server:
ssh-copy-id -i ~/.ssh/github_deploy.pub -p 5104 admin1@103.67.236.186

# Copy the PRIVATE key content — this goes into the SERVER_SSH_KEY secret:
cat ~/.ssh/github_deploy
```

---

## 3. PM2 Installation and Setup

### 3.1 Install PM2

```bash
sudo npm install -g pm2
pm2 -v
```

### 3.2 Copy ecosystem config

```bash
cp infra/ops/pm2.ecosystem.config.js /data/projects/platform/ecosystem.config.js
```

### 3.3 Start all apps

```bash
cd /data/projects/platform
pm2 start ecosystem.config.js
```

### 3.4 Enable PM2 startup on boot

```bash
pm2 startup
# Run the command PM2 prints
pm2 save
```

### 3.5 Useful PM2 commands

```bash
pm2 status              # Show all processes
pm2 logs                # Tail all logs
pm2 logs web            # Tail web app logs
pm2 monit               # Real-time dashboard
pm2 reload all          # Zero-downtime restart
pm2 restart all         # Hard restart all
```

---

## 4. Caddy Installation and Configuration

### 4.1 Install Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### 4.2 Deploy Caddyfile

```bash
sudo cp /data/projects/platform/infra/caddy/Caddyfile /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### 4.3 Verify Caddy is running

```bash
sudo systemctl status caddy
curl -I https://saubh.tech
```

### 4.4 DNS setup (Cloudflare)

Ensure these DNS records exist in Cloudflare (proxied, orange cloud):

| Type | Name | Value |
|---|---|---|
| A | `saubh.tech` | `103.67.236.186` |
| A | `api` | `103.67.236.186` |
| A | `realtime` | `103.67.236.186` |
| A | `admin` | `103.67.236.186` |

Cloudflare SSL/TLS mode: **Full (Strict)**

---

## 5. Verifying Services After Deploy

Run these checks after every deployment:

```bash
# PM2 status — all should be "online"
pm2 status

# Health endpoints
curl -sf http://localhost:3000 > /dev/null && echo "✅ Web OK" || echo "❌ Web DOWN"
curl -sf http://localhost:3001/api/healthz && echo "✅ API OK" || echo "❌ API DOWN"
curl -sf http://localhost:3002 > /dev/null && echo "✅ Realtime OK" || echo "❌ Realtime DOWN"
curl -sf http://localhost:3003 > /dev/null && echo "✅ Admin OK" || echo "❌ Admin DOWN"

# External (after Caddy + DNS are set up)
curl -sf https://saubh.tech > /dev/null && echo "✅ saubh.tech OK"
curl -sf https://api.saubh.tech/api/healthz && echo "✅ api.saubh.tech OK"
curl -sf https://admin.saubh.tech > /dev/null && echo "✅ admin.saubh.tech OK"

# Check security headers
curl -sI https://saubh.tech | grep -iE 'x-frame|x-content-type|referrer-policy|permissions-policy'

# Check recent logs for errors
pm2 logs --lines 50 --nostream | grep -i error
```

---

## 6. Rollback Procedure

### Quick rollback (revert to previous commit)

```bash
ssh -p 5104 admin1@103.67.236.186
cd /data/projects/platform

# Find the previous good commit
git log --oneline -10

# Revert to it
git checkout <commit-hash>

# Rebuild and restart
pnpm install --frozen-lockfile
pnpm --filter @saubhtech/web build
pnpm --filter @saubhtech/admin build
pnpm --filter @saubhtech/api build
pm2 reload ecosystem.config.js --update-env
```

### Database rollback (if migration caused issues)

```bash
# Check migration history
npx prisma migrate status

# Manual fix — Prisma does not auto-rollback
# Option 1: Fix forward with a new migration
# Option 2: Restore from backup
pg_restore -h 127.0.0.1 -U saubh_admin -d saubh_gig /path/to/backup.dump
```

### Emergency: restart everything

```bash
pm2 kill
pm2 start ecosystem.config.js
sudo systemctl restart caddy
```

### Return to main after rollback

```bash
# Once the fix is on main:
git checkout main
git pull origin main
pnpm install --frozen-lockfile
pnpm --filter @saubhtech/web build
pnpm --filter @saubhtech/admin build
pnpm --filter @saubhtech/api build
pm2 reload ecosystem.config.js --update-env
```
