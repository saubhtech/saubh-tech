import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const TABLES = [
  {
    category: 'Geographic Hierarchy',
    color: '#06b6d4',
    items: [
      { key: 'countries', label: 'Countries', description: 'Country codes, ISD, flags', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
      { key: 'states', label: 'States', description: 'State codes and regions', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
      { key: 'districts', label: 'Districts', description: 'Districts within states', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
      { key: 'postals', label: 'Postals', description: 'Pin codes and post offices', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { key: 'places', label: 'Places', description: 'Places within pin codes', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    ],
  },
  {
    category: 'Organizational Hierarchy',
    color: '#8b5cf6',
    items: [
      { key: 'localities', label: 'Localities', description: 'Groups of places', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { key: 'areas', label: 'Areas', description: 'Groups of localities', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z' },
      { key: 'divisions', label: 'Divisions', description: 'Groups of areas', icon: 'M4 6h16M4 12h16M4 18h7' },
      { key: 'regions', label: 'Regions', description: 'Groups of divisions', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
      { key: 'zones', label: 'Zones', description: 'Groups of regions', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9' },
    ],
  },
  {
    category: 'Industry Classification',
    color: '#22c55e',
    items: [
      { key: 'sectors', label: 'Sectors', description: 'Industry sectors', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { key: 'fields', label: 'Fields', description: 'Fields within sectors', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
      { key: 'markets', label: 'Markets', description: 'Products & services by field', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
    ],
  },
];

export default async function MasterDataPage({
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
  const hasMasterAccess = user.roles.includes('SUPER_ADMIN') || user.roles.includes('MASTER_DATA_MANAGER');

  if (!hasMasterAccess) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h1 style={{ fontSize: '24px', fontFamily: '"Syne", sans-serif', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Access Denied</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>You need MASTER_DATA_MANAGER or SUPER_ADMIN role to access this page.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: '"Syne", sans-serif', letterSpacing: '-0.02em', color: '#fff', margin: '0 0 8px' }}>
          Master Data
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
          Manage geographic, organizational, and industry classification data.
        </p>
      </div>

      {TABLES.map((group) => (
        <div key={group.category} style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: group.color,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: group.color }} />
            {group.category}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {group.items.map((item) => (
              <a
                key={item.key}
                href={`/${locale}/master/${item.key}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `${group.color}12`,
                    border: `1px solid ${group.color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={group.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{item.description}</div>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
