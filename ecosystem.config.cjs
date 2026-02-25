/**
 * PM2 Ecosystem Config — Saubh.Tech Platform
 * Usage: pm2 start ecosystem.config.cjs
 * 
 * IMPORTANT: After creating, run once:
 *   pm2 delete all && pm2 start ecosystem.config.cjs && pm2 save
 */
module.exports = {
  apps: [
    {
      name: 'web',
      cwd: './apps/web',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'api',
      cwd: './apps/api',
      script: 'dist/src/main.js',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'realtime',
      cwd: './apps/realtime',
      script: 'dist/main.js',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
    {
      name: 'admin',
      cwd: './apps/admin',
      script: 'node_modules/.bin/next',
      args: 'start -p 3003',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },
    {
      name: 'crmwhats',
      cwd: './apps/crmwhats',
      script: 'node_modules/.bin/next',
      args: 'start -p 3004',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
      },
    },
    {
      name: 'whatsapp-service',
      cwd: './apps/whatsapp-service',
      script: 'dist/index.js',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 3010,
      },
    },
  ],
};
