#!/usr/bin/env node

/**
 * OpenClaw Ops Agent — 24/7 Service Health Monitor
 * Monitors all Saubh.Tech services and sends alerts via WhatsApp + Telegram
 * Runs under PM2: pm2 start openclaw.mjs --name openclaw
 */

const TELEGRAM_BOT_TOKEN = '8586872055:AAEqWJL04Os_A75ZRCBAphhGspIkI5BEH08';
const TELEGRAM_CHAT_ID = '8609688493';
const WA_API_URL = 'http://localhost:8081/message/sendText/saubh-sim';
const WA_API_KEY = 'eec4e150ae057851d1f1d690d371d3844373fa963191e01a09064dc105c35540';
const WA_ALERT_NUMBER = '918800607598';

const CHECK_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes
const TIMEOUT_MS = 5000; // 5 second timeout per check
const DAILY_SUMMARY_HOUR = 8; // 8 AM IST daily summary
const COOLDOWN_MS = 15 * 60 * 1000; // 15 min cooldown per service alert

// ── Services to monitor ──────────────────────────────────────────
const SERVICES = [
  { name: 'web',              url: 'http://localhost:3000',         type: 'http' },
  { name: 'api',              url: 'http://localhost:3001/api/gig/sectors', type: 'http' },
  { name: 'realtime',         url: 'http://localhost:3002',         type: 'http' },
  { name: 'admin',            url: 'http://localhost:3003',         type: 'http' },
  { name: 'crmwhats',         url: 'http://localhost:3004',         type: 'http' },
  { name: 'whatsapp-service', url: 'http://localhost:3010/health',  type: 'http' },
  { name: 'n8n',              url: 'http://localhost:5678/healthz', type: 'http' },
  { name: 'postgres',         cmd: 'docker exec saubh-postgres pg_isready -U saubh_admin -d postgres', type: 'cmd' },
  { name: 'redis',            cmd: 'docker exec saubh-redis redis-cli -a Red1sSecure2026 ping', type: 'cmd' },
  { name: 'synapse',          url: 'http://localhost:8008/health',  type: 'http' },
  { name: 'minio',            url: 'http://localhost:9000/minio/health/live', type: 'http' },
  { name: 'evolution',        url: 'http://localhost:8081/instance/connectionState/saubh-sim', type: 'http',
    headers: { 'apikey': 'eec4e150ae057851d1f1d690d371d3844373fa963191e01a09064dc105c35540' } },
  { name: 'keycloak',         url: 'http://localhost:8080/health/ready', type: 'http' },
  { name: 'livekit',          cmd: 'docker ps --filter name=saubh-livekit --filter status=running -q', type: 'cmd' },
];

// ── State tracking ───────────────────────────────────────────────
const serviceState = {};   // { serviceName: { status, since, lastAlertAt } }
let lastDailySummary = null;
let totalChecks = 0;
let totalFailures = 0;

// ── Helpers ──────────────────────────────────────────────────────
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

function timestamp() {
  return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function log(msg) {
  console.log(`[${timestamp()}] ${msg}`);
}

async function httpCheck(service) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const opts = { signal: controller.signal };
    if (service.headers) {
      opts.headers = service.headers;
    }
    const res = await fetch(service.url, opts);
    clearTimeout(timeout);
    return { ok: res.status < 500, status: res.status, ms: 0 };
  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, status: 0, error: err.message };
  }
}

async function cmdCheck(service) {
  try {
    const start = Date.now();
    const { stdout } = await execAsync(service.cmd, { timeout: TIMEOUT_MS });
    return { ok: stdout.trim().length > 0, ms: Date.now() - start };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ── Alerting ─────────────────────────────────────────────────────
async function sendTelegram(text) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
    });
  } catch (err) {
    log(`⚠️ Telegram send failed: ${err.message}`);
  }
}

async function sendWhatsApp(text) {
  try {
    await fetch(WA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': WA_API_KEY,
      },
      body: JSON.stringify({ number: WA_ALERT_NUMBER, text }),
    });
  } catch (err) {
    log(`⚠️ WhatsApp send failed: ${err.message}`);
  }
}

async function alert(text) {
  log(`🚨 ALERT: ${text}`);
  await Promise.allSettled([sendTelegram(text), sendWhatsApp(text)]);
}

async function notify(text) {
  log(`📢 ${text}`);
  await Promise.allSettled([sendTelegram(text), sendWhatsApp(text)]);
}

// ── Core check loop ──────────────────────────────────────────────
async function checkAll() {
  totalChecks++;
  const results = [];
  const failures = [];
  const recoveries = [];

  for (const svc of SERVICES) {
    const result = svc.type === 'http' ? await httpCheck(svc) : await cmdCheck(svc);
    results.push({ ...svc, ...result });

    const prev = serviceState[svc.name];
    const now = Date.now();

    if (!result.ok) {
      totalFailures++;
      if (!prev || prev.status === 'up') {
        // Just went down
        serviceState[svc.name] = { status: 'down', since: now, lastAlertAt: now };
        failures.push(svc.name);
      } else if (prev.status === 'down' && (now - prev.lastAlertAt) > COOLDOWN_MS) {
        // Still down, cooldown expired — re-alert
        serviceState[svc.name].lastAlertAt = now;
        failures.push(`${svc.name} (still down ${Math.round((now - prev.since) / 60000)}m)`);
      }
    } else {
      if (prev && prev.status === 'down') {
        // Recovered
        const downtime = Math.round((now - prev.since) / 60000);
        recoveries.push(`${svc.name} (was down ${downtime}m)`);
      }
      serviceState[svc.name] = { status: 'up', since: now, lastAlertAt: 0 };
    }
  }

  // Send alerts
  if (failures.length > 0) {
    await alert(`🔴 SERVICE DOWN:\n${failures.map(f => `• ${f}`).join('\n')}\n\nTime: ${timestamp()}`);
  }
  if (recoveries.length > 0) {
    await notify(`🟢 RECOVERED:\n${recoveries.map(r => `• ${r}`).join('\n')}\n\nTime: ${timestamp()}`);
  }

  // Log summary
  const upCount = results.filter(r => r.ok).length;
  log(`Check #${totalChecks}: ${upCount}/${results.length} services up`);
}

// ── Daily summary ────────────────────────────────────────────────
async function dailySummary() {
  const now = new Date();
  const hour = parseInt(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }));

  if (hour === DAILY_SUMMARY_HOUR && lastDailySummary !== now.toDateString()) {
    lastDailySummary = now.toDateString();

    const up = Object.entries(serviceState).filter(([, s]) => s.status === 'up').map(([n]) => n);
    const down = Object.entries(serviceState).filter(([, s]) => s.status === 'down').map(([n]) => n);

    const summary = [
      `📊 <b>Daily Ops Summary — ${now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</b>`,
      ``,
      `✅ Up: ${up.length}/${SERVICES.length} (${up.join(', ')})`,
      down.length > 0 ? `🔴 Down: ${down.join(', ')}` : `🟢 All services healthy`,
      ``,
      `📈 Total checks: ${totalChecks} | Failures: ${totalFailures}`,
      `⏰ Next summary: tomorrow ${DAILY_SUMMARY_HOUR}:00 IST`,
    ].join('\n');

    await notify(summary);
  }
}

// ── Backup verification (runs at 3 AM IST) ──────────────────────
async function verifyBackups() {
  const now = new Date();
  const hour = parseInt(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }));

  if (hour === 3) {
    try {
      // Check if nightly backup ran (look for today's backup)
      const today = now.toISOString().slice(0, 10).replace(/-/g, '');
      const { stdout } = await execAsync(`ls -lh /data/backups/nightly/ 2>/dev/null | grep ${today} | head -5`);
      if (stdout.trim()) {
        log(`✅ Backup verified: nightly backup found for ${today}`);
      } else {
        await alert(`⚠️ BACKUP WARNING:\nNo nightly backup found for ${today}!\nCheck /data/scripts/nightly-backup.sh`);
      }
    } catch (err) {
      log(`Backup check error: ${err.message}`);
    }
  }
}

// ── PM2 commands interface ───────────────────────────────────────
// Usage: echo "status" | nc -q0 localhost 9999
import { createServer } from 'net';

const cmdServer = createServer((socket) => {
  socket.on('data', async (data) => {
    const cmd = data.toString().trim();
    let response = '';

    switch (cmd) {
      case 'status':
        response = Object.entries(serviceState)
          .map(([name, s]) => `${s.status === 'up' ? '✅' : '🔴'} ${name}: ${s.status}`)
          .join('\n');
        break;
      case 'check':
        await checkAll();
        response = 'Check completed';
        break;
      case 'summary':
        lastDailySummary = null; // Force next summary
        response = 'Summary will be sent on next cycle';
        break;
      default:
        response = 'Commands: status, check, summary';
    }
    socket.write(response + '\n');
    socket.end();
  });
});

cmdServer.listen(9999, '127.0.0.1', () => {
  log('Command interface listening on localhost:9999');
});

// ── Main loop ────────────────────────────────────────────────────
async function main() {
  log('═══════════════════════════════════════');
  log('🦅 OpenClaw Ops Agent v1.0 — Starting');
  log(`Monitoring ${SERVICES.length} services`);
  log(`Alert channels: Telegram + WhatsApp`);
  log(`Check interval: ${CHECK_INTERVAL_MS / 1000}s`);
  log('═══════════════════════════════════════');

  // Startup notification
  await notify(`🦅 OpenClaw Ops Agent started\n\nMonitoring ${SERVICES.length} services\nChecking every 2 minutes\nAlerts: Telegram + WhatsApp\n\nTime: ${timestamp()}`);

  // Initial check
  await checkAll();

  // Run checks on interval
  setInterval(async () => {
    await checkAll();
    await dailySummary();
    await verifyBackups();
  }, CHECK_INTERVAL_MS);
}

main().catch(err => {
  console.error('OpenClaw fatal error:', err);
  process.exit(1);
});
