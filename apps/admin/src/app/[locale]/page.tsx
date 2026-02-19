import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const user = session.user;
  const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
  const greeting = getGreeting();

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: '"Syne", sans-serif', letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
            {greeting}, {user.username || 'Admin'}
          </h1>
          <div style={badgeStyles}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSuperAdmin ? '#8b5cf6' : '#06b6d4' }} />
            <span>{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          Here&apos;s what&apos;s happening on your platform today.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Total Users" value="\u2014" change="+0%" icon="users" color="#8b5cf6" />
        <StatCard label="Businesses" value="\u2014" change="+0%" icon="building" color="#06b6d4" />
        <StatCard label="Active Today" value="\u2014" change="" icon="activity" color="#22c55e" />
        <StatCard label="Revenue" value="\u2014" change="" icon="currency" color="#f59e0b" />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={sectionTitleStyles}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <ActionCard href={`/${locale}/users`} title="Manage Users" description="View, edit, and manage platform users" icon="users" />
          <ActionCard href={`/${locale}/businesses`} title="Manage Businesses" description="Review and approve business registrations" icon="building" />
          {isSuperAdmin && (
            <ActionCard href={`/${locale}/settings`} title="Platform Settings" description="Configure system-wide settings" icon="settings" />
          )}
        </div>
      </div>

      <div>
        <h2 style={sectionTitleStyles}>Recent Activity</h2>
        <div style={activityContainerStyles}>
          <div style={{ padding: '40px', textAlign: 'center' as const }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>
              Activity feed will appear here once the platform is live.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon, color }: { label: string; value: string; change: string; icon: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
    building: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></svg>,
    activity: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    currency: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  };

  return (
    <div style={statCardStyles}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ ...iconContainerStyles, background: `${color}15`, border: `1px solid ${color}25` }}>
          {icons[icon]}
        </div>
        {change && (
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.08)', padding: '3px 8px', borderRadius: '20px' }}>
            {change}
          </span>
        )}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: '"Syne", sans-serif', color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

function ActionCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
    building: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /></svg>,
    settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
  };

  return (
    <a href={href} style={actionCardStyles}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ opacity: 0.5 }}>{icons[icon]}</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{title}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{description}</div>
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
        <path d="M6 4l4 4-4 4" />
      </svg>
    </a>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const badgeStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  borderRadius: '20px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)',
  fontSize: '12px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
};

const sectionTitleStyles: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.25)',
  marginBottom: '12px',
};

const statCardStyles: React.CSSProperties = {
  padding: '20px',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const iconContainerStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const actionCardStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderRadius: '14px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  textDecoration: 'none',
  color: 'inherit',
};

const activityContainerStyles: React.CSSProperties = {
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
};
