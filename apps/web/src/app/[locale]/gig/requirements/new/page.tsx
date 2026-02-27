'use client';

import { useRouter, useParams } from 'next/navigation';

export default function NewRequirementPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  return (
    <>
      <style>{css}</style>
      <div className="gr-root">
        {/* ── Top Bar ── */}
        <div className="gr-topbar">
          <div className="gr-topbar-inner">
            {/* Logo */}
            <div className="gr-logo-box">
              <div className="gr-logo-icon">S</div>
              <div>
                <div className="gr-logo-title">Saubh.Tech</div>
                <div className="gr-logo-sub">Gig Marketplace</div>
              </div>
            </div>

            {/* Center Title */}
            <div className="gr-hero-center">
              <h1 className="gr-hero-title">🚀 Gig Marketplace</h1>
              <p className="gr-hero-subtitle">|| Real Clients || Verified Providers || Secured Payments ||</p>
            </div>

            {/* Nav Pills */}
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="gr-tabbar">
          <div className="gr-tabbar-inner">
            <button className="gr-tab gr-tab-active">📋 Requirements</button>
            <button className="gr-tab" onClick={() => router.push(`/${locale}/gig`)}>🎯 Offerings</button>
            <button className="gr-tab" onClick={() => router.push(`/${locale}/gig`)}>💰 Bids</button>
            <button className="gr-tab" onClick={() => router.push(`/${locale}/gig`)}>🤝 Agreements</button>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="gr-content">
          <p style={{ color: '#64748b' }}>Form sections coming next...</p>
        </div>
      </div>
    </>
  );
}

const css = `
.gr-root {
  min-height: 100vh;
  background: #060a13;
  color: #e2e8f0;
  font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
}

/* ── Top Bar ── */
.gr-topbar {
  background: linear-gradient(180deg, #0b1a30 0%, #0a1628 100%);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  padding: 0 20px;
}
.gr-topbar-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 18px 0;
  display: flex;
  align-items: center;
  gap: 24px;
}

/* Logo */
.gr-logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 10px 16px;
  flex-shrink: 0;
}
.gr-logo-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, #10b981, #f59e0b, #ef4444);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 18px; color: #fff;
}
.gr-logo-title { font-weight: 700; font-size: 16px; color: #f8fafc; }
.gr-logo-sub { font-size: 11px; color: #64748b; margin-top: 1px; }

/* Hero Center */
.gr-hero-center { flex: 1; padding-left: 12px; }
.gr-hero-title {
  font-size: 24px;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 4px 0;
}
.gr-hero-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* Nav Pills */
.gr-nav-pills {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.gr-pill {
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: all 0.2s;
  white-space: nowrap;
}
.gr-pill-active {
  background: #2563eb;
  color: #fff;
}
.gr-pill-active:hover { background: #1d4ed8; }
.gr-pill-green {
  background: rgba(16,185,129,0.15);
  color: #34d399;
}
.gr-pill-green:hover { background: rgba(16,185,129,0.25); }
.gr-pill-blue {
  background: rgba(59,130,246,0.15);
  color: #60a5fa;
}
.gr-pill-blue:hover { background: rgba(59,130,246,0.25); }
.gr-pill-purple {
  background: rgba(168,85,247,0.15);
  color: #c084fc;
}
.gr-pill-purple:hover { background: rgba(168,85,247,0.25); }

/* ── Tab Bar ── */
.gr-tabbar {
  background: linear-gradient(180deg, #0a1628 0%, #080e1a 100%);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 0 20px;
}
.gr-tabbar-inner {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  gap: 4px;
  padding: 12px 0;
}
.gr-tab {
  padding: 10px 22px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-family: inherit;
  transition: all 0.2s;
  white-space: nowrap;
}
.gr-tab:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
.gr-tab-active {
  background: #00d4ff;
  color: #0a1628;
}
.gr-tab-active:hover { background: #00bce0; color: #0a1628; }

/* ── Content ── */
.gr-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .gr-topbar-inner { flex-wrap: wrap; }
  .gr-nav-pills { width: 100%; overflow-x: auto; padding-bottom: 4px; }
  .gr-tabbar-inner { overflow-x: auto; }
}
`;
