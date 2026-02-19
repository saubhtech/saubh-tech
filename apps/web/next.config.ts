import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ─── Self-hosted Node.js server (no Vercel, no static export) ─────
  // Next.js defaults to server mode — no `output` override needed.

  // ─── Security ─────────────────────────────────────────────────────
  poweredByHeader: false,
  compress: true,

  // ─── Images ───────────────────────────────────────────────────────
  images: {
    remotePatterns: [],
  },

  // ─── Public env vars (accessible in client-side code) ─────────────
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    NEXT_PUBLIC_LANG_API_URL:
      process.env.NEXT_PUBLIC_LANG_API_URL || '/api/lang',
  },

  // ─── Cloudflare proxy trust ───────────────────────────────────────
  // When behind Cloudflare + Caddy, trust forwarded headers so
  // req.ip / x-forwarded-for resolve to the real client IP.
  // Next.js trusts x-forwarded-* headers by default in server mode.
  // Caddy should set trusted_proxies to Cloudflare IP ranges.
  //
  // No @vercel/* imports or edge runtime required.

  // ─── Headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
