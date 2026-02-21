'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useChannel } from '@/context/ChannelContext';
import { useUser } from '@/context/UserContext';
import Avatar from '@/components/ui/Avatar';

const BASE = '/crmwhats';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: '\uD83D\uDCAC', label: 'Inbox', path: 'inbox' },
  { icon: '\uD83D\uDC65', label: 'Contacts', path: 'contacts' },
  { icon: '\uD83D\uDCE2', label: 'Broadcast', path: 'broadcast' },
  { icon: '\u2699\uFE0F', label: 'Settings', path: 'settings' },
];

const channelOptions = [
  { value: 'ALL' as const, label: 'All' },
  { value: 'EVOLUTION' as const, label: '\uD83D\uDCF1 SIM' },
  { value: 'WABA' as const, label: '\uD83D\uDCBC WABA' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { selectedChannel, setSelectedChannel } = useChannel();
  const { user, logout } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  // Extract locale from pathname: /crmwhats/en-in/inbox → en-in
  const segments = pathname.replace(BASE, '').split('/').filter(Boolean);
  const locale = segments[0] || 'en-in';
  const activePath = segments[1] || 'inbox';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside style={{
        width: collapsed ? '68px' : '240px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(19, 19, 26, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        flexShrink: 0,
        zIndex: 50,
      }}
        className="sidebar-desktop"
      >
        {/* Logo + Collapse */}
        <div style={{
          padding: collapsed ? '16px 12px' : '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          minHeight: '60px',
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Saubh
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px' }}>CRM</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: '#6B7280',
              cursor: 'pointer',
              padding: '6px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              transition: 'all 0.2s ease',
            }}
          >
            {collapsed ? '\u25B6' : '\u25C0'}
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => {
            const isActive = activePath === item.path;
            return (
              <a
                key={item.path}
                href={`${BASE}/${locale}/${item.path}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '10px 0' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#F8F8FF' : '#6B7280',
                  background: isActive ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* Channel Switcher */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Channel</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {channelOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedChannel(opt.value)}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: selectedChannel === opt.value
                      ? 'linear-gradient(135deg, #7C3AED, #EC4899)'
                      : 'rgba(255,255,255,0.05)',
                    color: selectedChannel === opt.value ? '#fff' : '#6B7280',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User Footer */}
        <div style={{
          padding: collapsed ? '12px 8px' : '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <Avatar name={user?.fname || null} size="sm" />
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#F8F8FF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fname || 'User'}
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>{user?.usertype || 'BO'}</div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '6px',
                color: '#EF4444',
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Exit
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
        className="mobile-nav"
      >
        {navItems.map(item => {
          const isActive = activePath === item.path;
          return (
            <a
              key={item.path}
              href={`${BASE}/${locale}/${item.path}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                textDecoration: 'none',
                color: isActive ? '#7C3AED' : '#6B7280',
                fontSize: '10px',
                fontWeight: isActive ? 700 : 400,
                transition: 'color 0.15s ease',
                padding: '8px 12px',
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
