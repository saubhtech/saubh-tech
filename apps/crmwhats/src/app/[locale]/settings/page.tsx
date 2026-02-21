'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useChannel } from '@/context/ChannelContext';
import GlassCard from '@/components/ui/GlassCard';
import Avatar from '@/components/ui/Avatar';
import ChannelBadge from '@/components/ui/ChannelBadge';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech';

interface Channel {
  id: string;
  name: string;
  type: string;
  phone: string;
  isActive: boolean;
}

export default function SettingsPage() {
  const { user, logout } = useUser();
  const { selectedChannel, setSelectedChannel } = useChannel();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [notifications, setNotifications] = useState({ sound: true, desktop: false });

  useEffect(() => {
    fetch(`${API}/api/crm/channels`).then(r => r.json()).then(setChannels).catch(console.error);
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotifications(prev => ({ ...prev, desktop: true }));
      }
    }
  };

  const usertypeBadge: Record<string, { label: string; color: string }> = {
    BO: { label: 'Business Owner', color: '#7C3AED' },
    GW: { label: 'Gig Worker', color: '#EC4899' },
    SA: { label: 'Super Admin', color: '#F97316' },
    AD: { label: 'Admin', color: '#3B82F6' },
  };

  const ut = usertypeBadge[user?.usertype || 'BO'] || usertypeBadge.BO;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#F8F8FF', marginBottom: '24px', letterSpacing: '-0.02em' }}>
        \u2699\uFE0F Settings
      </h1>

      {/* SECTION 1 — Profile */}
      <SectionLabel>Profile</SectionLabel>
      <GlassCard style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '3px', borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            <div style={{ padding: '2px', borderRadius: '50%', background: '#0A0A0F' }}>
              <Avatar name={user?.fname || null} size="lg" />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#F8F8FF' }}>{user?.fname || 'User'}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'monospace', marginTop: '2px' }}>{user?.whatsapp || ''}</div>
            <span style={{
              display: 'inline-block', marginTop: '6px', padding: '3px 10px', borderRadius: '20px',
              fontSize: '10px', fontWeight: 700, background: `${ut.color}15`, color: ut.color,
              border: `1px solid ${ut.color}30`,
            }}>{ut.label}</span>
          </div>
        </div>
      </GlassCard>

      {/* SECTION 2 — Channel Status */}
      <SectionLabel>Channel Status</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {channels.map(ch => (
          <GlassCard key={ch.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{ch.type === 'WABA' ? '\uD83D\uDCBC' : '\uD83D\uDCF1'}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8F8FF' }}>{ch.name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>{ch.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChannelBadge type={ch.type} />
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                  background: ch.isActive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                  color: ch.isActive ? '#10B981' : '#EF4444',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ch.isActive ? '#10B981' : '#EF4444' }} />
                  {ch.isActive ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* SECTION 3 — Notifications */}
      <SectionLabel>Notifications</SectionLabel>
      <GlassCard style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ToggleRow
            label="New message sound"
            checked={notifications.sound}
            onChange={() => setNotifications(p => ({ ...p, sound: !p.sound }))}
          />
          <ToggleRow
            label="Desktop notifications"
            checked={notifications.desktop}
            onChange={requestNotificationPermission}
          />
        </div>
      </GlassCard>

      {/* SECTION 4 — Default Channel */}
      <SectionLabel>Default Channel Filter</SectionLabel>
      <GlassCard style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['ALL', 'EVOLUTION', 'WABA'] as const).map(ch => (
            <button key={ch} onClick={() => setSelectedChannel(ch)} style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '12px',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease',
              background: selectedChannel === ch ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'rgba(255,255,255,0.05)',
              color: selectedChannel === ch ? '#fff' : '#6B7280',
            }}>
              {ch === 'ALL' ? 'All' : ch === 'EVOLUTION' ? '\uD83D\uDCF1 SIM' : '\uD83D\uDCBC WABA'}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Logout */}
      <button onClick={logout} style={{
        width: '100%', padding: '12px', borderRadius: '12px',
        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
        color: '#EF4444', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}>
        Sign Out
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '14px', color: '#F8F8FF' }}>{label}</span>
      <button onClick={onChange} style={{
        width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
        background: checked ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background 0.2s ease',
      }}>
        <span style={{
          position: 'absolute', top: '3px',
          left: checked ? '23px' : '3px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}
