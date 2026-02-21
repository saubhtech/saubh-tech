// ─── Saubh.Tech Platform — PM2 Ecosystem Config ────────────────────────────
// Copy to project root: cp infra/ops/pm2.ecosystem.config.js ecosystem.config.js
// Start all: pm2 start ecosystem.config.js
// Reload all: pm2 reload ecosystem.config.js --update-env
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  apps: [
    // ─── Web (Next.js) ─────────────────────────────────────────────────
    {
      name: 'web',
      cwd: './apps/web',
      script: 'node_modules/.bin/next',
      args: 'start --port 3000',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },

    // ─── API (NestJS) ─────────────────────────────────────────────────
    {
      name: 'api',
      cwd: './apps/api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },

    // ─── Realtime (NestJS / WebSocket) ────────────────────────────────
    {
      name: 'realtime',
      cwd: './apps/realtime',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },

    // ─── Admin (Next.js) ──────────────────────────────────────────────
    {
      name: 'admin',
      cwd: './apps/admin',
      script: 'node_modules/.bin/next',
      args: 'start --port 3003',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },

    // ─── CRM WhatsApp (Next.js) ──────────────────────────────────────
    {
      name: 'crmwhats',
      cwd: './apps/crmwhats',
      script: 'node_modules/.bin/next',
      args: 'start --port 3004',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
        NEXT_PUBLIC_API_URL: 'https://api.saubh.tech',
      },
    },
  ],
};
