'use client';

import { useEffect, useState, useCallback } from 'react';
import { useChannel } from '@/context/ChannelContext';
import { usePathname } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import ChannelBadge from '@/components/ui/ChannelBadge';
import GradientButton from '@/components/ui/GradientButton';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech';
const BASE = '/crmwhats';

interface Broadcast {
  id: string;
  name: string;
  status: string;
  channelId: string;
  body: string;
  scheduledAt: string | null;
  createdAt: string;
  channel: { id: string; name: string; type: string };
  _count?: { recipients: number };
  recipients?: any[];
}

const statusColors: Record<string, { bg: string; color: string }> = {
  DRAFT: { bg: 'rgba(107,114,128,0.12)', color: '#6B7280' },
  SCHEDULED: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  SENDING: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  DONE: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  FAILED: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
};

export default function BroadcastPage() {
  const { selectedChannel } = useChannel();
  const pathname = usePathname();
  const locale = pathname.replace(BASE, '').split('/').filter(Boolean)[0] || 'en-in';
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBc, setSelectedBc] = useState<Broadcast | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchBroadcasts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/crm/broadcasts`);
      const json = await res.json();
      setBroadcasts(json.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const fetchDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API}/api/crm/broadcasts/${id}`);
      setSelectedBc(await res.json());
    } catch (e) { console.error(e); }
    finally { setDetailLoading(false); }
  };

  useEffect(() => { fetchBroadcasts(); }, [fetchBroadcasts]);

  // Filter by channel
  const filtered = broadcasts.filter(b => {
    if (selectedChannel === 'ALL') return true;
    return b.channel?.type === selectedChannel;
  });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* LEFT — Broadcast List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '20px 20px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#F8F8FF', margin: 0, letterSpacing: '-0.02em' }}>
              \uD83D\uDCE2 Broadcasts
            </h1>
            <a href={`${BASE}/${locale}/broadcast/create`} style={{ textDecoration: 'none' }}>
              <GradientButton size="sm">+ New Broadcast</GradientButton>
            </a>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loading ? (
            <SkeletonLoader variant="card" count={4} />
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
              No broadcasts yet. Create your first one!
            </div>
          ) : (
            filtered.map(bc => {
              const sc = statusColors[bc.status] || statusColors.DRAFT;
              return (
                <GlassCard key={bc.id} hover onClick={() => fetchDetail(bc.id)} active={selectedBc?.id === bc.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#F8F8FF' }}>{bc.name}</span>
                        {bc.channel && <ChannelBadge type={bc.channel.type} />}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {bc.body}
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                      background: sc.bg, color: sc.color, flexShrink: 0, marginLeft: '12px',
                      animation: bc.status === 'SENDING' ? 'pulse-dot 1.5s ease-in-out infinite' : 'none',
                    }}>{bc.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '11px', color: '#6B7280' }}>
                    <span>{bc._count?.recipients || 0} recipients</span>
                    <span>{bc.scheduledAt ? `Scheduled: ${new Date(bc.scheduledAt).toLocaleString()}` : new Date(bc.createdAt).toLocaleDateString()}</span>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT — Broadcast Detail */}
      {selectedBc && (
        <div style={{ width: '400px', flexShrink: 0, overflowY: 'auto', borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,15,0.5)' }} className="bc-detail-panel">
          {detailLoading ? (
            <div style={{ padding: '20px' }}><SkeletonLoader variant="card" count={3} /></div>
          ) : (
            <>
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#F8F8FF', margin: 0 }}>{selectedBc.name}</h2>
                  <button onClick={() => setSelectedBc(null)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '18px' }}>\u2715</button>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                  {selectedBc.channel && <ChannelBadge type={selectedBc.channel.type} />}
                  {(() => { const sc = statusColors[selectedBc.status] || statusColors.DRAFT; return (
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: sc.bg, color: sc.color }}>{selectedBc.status}</span>
                  ); })()}
                </div>
              </div>

              {/* Message Preview */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>Message</div>
                <div style={{
                  padding: '12px 16px', borderRadius: '14px 14px 14px 4px',
                  background: 'rgba(28,28,39,0.8)', border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '14px', color: '#e2e8f0', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                }}>{selectedBc.body}</div>
              </div>

              {/* Recipients */}
              {selectedBc.recipients && selectedBc.recipients.length > 0 && (
                <div style={{ padding: '0 20px 20px' }}>
                  <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Recipients ({selectedBc.recipients.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {selectedBc.recipients.slice(0, 20).map((r: any) => (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', fontSize: '12px' }}>
                        <span style={{ color: '#F8F8FF', fontFamily: 'monospace' }}>{r.whatsapp}</span>
                        <span style={{ color: r.status === 'SENT' ? '#10B981' : r.status === 'FAILED' ? '#EF4444' : '#6B7280' }}>{r.status}</span>
                      </div>
                    ))}
                    {selectedBc.recipients.length > 20 && (
                      <div style={{ fontSize: '11px', color: '#6B7280', padding: '6px', textAlign: 'center' }}>+{selectedBc.recipients.length - 20} more</div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .bc-detail-panel {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100% !important;
            z-index: 200;
            background: #0A0A0F !important;
          }
        }
      `}</style>
    </div>
  );
}
