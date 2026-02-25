import { notFound } from 'next/navigation';
import {
  SUPPORTED_LOCALES_SET,
  RTL_LOCALES,
} from '@saubhtech/shared';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES_SET.has(locale)) {
    notFound();
  }

  const dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
  const lang = locale.split('-')[0];

  return (
    <html lang={lang} dir={dir}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#070710', color: '#e2e8f0', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside style={sidebarStyles}>
            <div style={brandStyles}>
              <div style={logoStyles}>S</div>
              <div>
                <div style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: '#fff' }}>
                  Saubh<span style={{ color: '#8b5cf6' }}>.</span>Tech
                </div>
                <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, marginTop: '2px' }}>
                  Admin Console
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', margin: '0 0 20px' }} />

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              <NavLink href={`/${locale}`} icon="grid" label="Dashboard" />
              <NavLink href={`/${locale}/users`} icon="users" label="Users" />
              <NavLink href={`/${locale}/businesses`} icon="building" label="Businesses" />
              <NavLink href={`/${locale}/master`} icon="database" label="Master Data" />

              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', margin: '12px 0' }} />
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, padding: '0 12px', marginBottom: '4px' }}>CRM</div>
              <NavLink href={`/${locale}/crm/inbox`} icon="messageCircle" label="Inbox" />
              <NavLink href={`/${locale}/crm/contacts`} icon="contact" label="Contacts" />
              <NavLink href={`/${locale}/crm/broadcasts`} icon="megaphone" label="Broadcasts" />
            </nav>

            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', margin: '16px 0' }} />
            <a href={`/api/auth/logout?locale=${locale}`} style={logoutStyles}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </a>
          </aside>

          <main style={mainStyles}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  const iconSvg: Record<string, React.ReactNode> = {
    grid: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    building: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>,
    database: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
    messageCircle: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>,
    contact: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    megaphone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>,
  };

  return (
    <a href={href} style={navLinkStyles}>
      <span style={{ opacity: 0.5 }}>{iconSvg[icon]}</span>
      <span>{label}</span>
    </a>
  );
}

const sidebarStyles: React.CSSProperties = {
  width: '260px',
  flexShrink: 0,
  background: 'rgba(255,255,255,0.02)',
  borderRight: '1px solid rgba(255,255,255,0.06)',
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  backdropFilter: 'blur(20px)',
};

const brandStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '0 8px',
  marginBottom: '24px',
};

const logoStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  fontFamily: '"Syne", sans-serif',
  fontWeight: 800,
  color: '#fff',
  flexShrink: 0,
  border: '1px solid rgba(255,255,255,0.1)',
};

const navLinkStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '12px',
  color: 'rgba(255,255,255,0.6)',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
};

const logoutStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 12px',
  borderRadius: '12px',
  color: 'rgba(255,255,255,0.35)',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 500,
};

const mainStyles: React.CSSProperties = {
  flex: 1,
  padding: '32px 40px',
  overflowY: 'auto',
  background: '#0a0a14',
};
