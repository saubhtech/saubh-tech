'use client';

import { useEffect, useState, useCallback } from 'react';
import { useChannel } from '@/context/ChannelContext';
import Avatar from '@/components/ui/Avatar';
import ChannelBadge from '@/components/ui/ChannelBadge';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import api from '@/lib/api';

interface WaContact {
  id: string;
  whatsapp: string;
  name: string | null;
  userId: number | null;
  isBlocked: boolean;
  optedOut: boolean;
  createdAt: string;
  conversations: any[];
}

function timeAgo(date: string): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ContactsPage() {
  const { selectedChannel } = useChannel();
  const [channels, setChannels] = useState<any[]>([]);
  const [contacts, setContacts] = useState<WaContact[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showAdd, setShowAdd] = useState(false);
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newName, setNewName] = useState('');
  const [selectedContact, setSelectedContact] = useState<WaContact | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchChannels = useCallback(async () => {
    try {
      const data = await api.get<any[]>('/api/crm/channels');
      setChannels(data || []);
    } catch (e) { console.error(e); }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedChannel !== 'ALL' && channels.length > 0) {
        const ch = channels.find((c: any) => c.type === selectedChannel);
        if (ch) params.set('channelId', ch.id);
      }
      const json = await api.get<any>(`/api/crm/contacts?${params}`);
      setContacts(json.data || []);
      setTotal(json.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, selectedChannel, channels]);

  const fetchContactDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const data = await api.get<any>(`/api/crm/contacts/${id}`);
      setSelectedContact(data);
    } catch (e) { console.error(e); }
    finally { setDetailLoading(false); }
  };

  const addContact = async () => {
    if (!newWhatsapp.trim()) return;
    try {
      await api.post('/api/crm/contacts', { whatsapp: newWhatsapp.trim(), name: newName.trim() || undefined });
      setNewWhatsapp(''); setNewName(''); setShowAdd(false);
      await fetchContacts();
    } catch (e) { console.error(e); }
  };

  const toggleBlock = async (id: string, current: boolean) => {
    await api.patch(`/api/crm/contacts/${id}`, { isBlocked: !current });
    await fetchContacts();
    if (selectedContact?.id === id) fetchContactDetail(id);
  };

  useEffect(() => { fetchChannels(); }, [fetchChannels]);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => fetchContacts(), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchContacts]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* LEFT — Contact List */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRight: selectedContact ? '1px solid rgba(255,255,255,0.06)' : 'none',
        minWidth: 0,
      }}
        className="contact-list-panel"
      >
        {/* Header */}
        <div style={{ padding: '20px 20px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#F8F8FF', margin: 0, letterSpacing: '-0.02em' }}>
              \uD83D\uDC65 Contacts
              <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 400, marginLeft: '8px' }}>({total})</span>
            </h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* View toggle */}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', overflow: 'hidden' }}>
                {(['grid', 'list'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} style={{
                    padding: '6px 10px', border: 'none', fontSize: '12px', cursor: 'pointer',
                    background: view === v ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: view === v ? '#7C3AED' : '#6B7280', fontWeight: 600,
                  }}>{v === 'grid' ? '\u25A6' : '\u2630'}</button>
                ))}
              </div>
              <GradientButton size="sm" onClick={() => setShowAdd(!showAdd)}>+ Add</GradientButton>
            </div>
          </div>

          {/* Add Form */}
          {showAdd && (
            <div className="glass" style={{ padding: '12px', marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input value={newWhatsapp} onChange={e => setNewWhatsapp(e.target.value)} placeholder="WhatsApp (e.g. 919876543210)" style={inputStyle} />
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name (optional)" style={inputStyle} />
              <button onClick={addContact} style={{ ...inputStyle, background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', cursor: 'pointer', fontWeight: 600 }}>Save</button>
            </div>
          )}

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or number..."
            style={{ ...inputStyle, width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Contact Grid/List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
          {loading ? (
            <SkeletonLoader variant={view === 'grid' ? 'card' : 'avatar'} count={6} />
          ) : contacts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>No contacts found</div>
          ) : view === 'grid' ? (
            /* Grid View */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {contacts.map(c => (
                <GlassCard key={c.id} hover onClick={() => fetchContactDetail(c.id)} active={selectedContact?.id === c.id}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
                    <Avatar name={c.name || c.whatsapp} size="lg" />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#F8F8FF' }}>{c.name || '\u2014'}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace', marginTop: '2px' }}>{c.whatsapp}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {c.isBlocked && <span style={badgeStyle('#EF4444')}>Blocked</span>}
                      {c.optedOut && <span style={badgeStyle('#F59E0B')}>Opted Out</span>}
                      {!c.isBlocked && !c.optedOut && <span style={badgeStyle('#10B981')}>Active</span>}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6B7280' }}>{timeAgo(c.createdAt)}</div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            /* List View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {contacts.map(c => (
                <div
                  key={c.id}
                  onClick={() => fetchContactDetail(c.id)}
                  className="glass-hover"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                    borderRadius: '10px', cursor: 'pointer',
                    background: selectedContact?.id === c.id ? 'rgba(124,58,237,0.08)' : 'transparent',
                    border: selectedContact?.id === c.id ? '1px solid rgba(124,58,237,0.15)' : '1px solid transparent',
                  }}
                >
                  <Avatar name={c.name || c.whatsapp} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#F8F8FF' }}>{c.name || '\u2014'}</span>
                    <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '8px', fontFamily: 'monospace' }}>{c.whatsapp}</span>
                  </div>
                  {c.isBlocked ? <span style={badgeStyle('#EF4444')}>Blocked</span>
                   : c.optedOut ? <span style={badgeStyle('#F59E0B')}>Opted Out</span>
                   : <span style={badgeStyle('#10B981')}>Active</span>}
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>{timeAgo(c.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — Contact Detail */}
      {selectedContact && (
        <div style={{ width: '380px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'rgba(10,10,15,0.5)' }} className="contact-detail-panel">
          {detailLoading ? (
            <div style={{ padding: '20px' }}><SkeletonLoader variant="card" count={3} /></div>
          ) : (
            <>
              {/* Hero */}
              <div style={{ padding: '24px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setSelectedContact(null)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '18px' }}>\u2715</button>
                <div style={{ display: 'inline-block', padding: '3px', borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
                  <div style={{ padding: '2px', borderRadius: '50%', background: '#0A0A0F' }}>
                    <Avatar name={selectedContact.name || selectedContact.whatsapp} size="lg" />
                  </div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#F8F8FF', marginTop: '12px' }}>
                  {selectedContact.name || '\u2014'}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'monospace', marginTop: '4px' }}>
                  {selectedContact.whatsapp}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                  <button onClick={() => toggleBlock(selectedContact.id, selectedContact.isBlocked)} style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: selectedContact.isBlocked ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: selectedContact.isBlocked ? '#10B981' : '#EF4444',
                  }}>
                    {selectedContact.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </div>

              {/* Info Cards */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <GlassCard style={{ padding: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>Info</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>First Seen</div>
                      <div style={{ fontSize: '13px', color: '#F8F8FF' }}>{new Date(selectedContact.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>Status</div>
                      <div style={{ fontSize: '13px' }}>
                        {selectedContact.isBlocked ? <span style={{ color: '#EF4444' }}>Blocked</span>
                         : selectedContact.optedOut ? <span style={{ color: '#F59E0B' }}>Opted Out</span>
                         : <span style={{ color: '#10B981' }}>Active</span>}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>Conversations</div>
                      <div style={{ fontSize: '13px', color: '#F8F8FF' }}>{selectedContact.conversations?.length || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#6B7280' }}>Linked User</div>
                      <div style={{ fontSize: '13px', color: '#F8F8FF' }}>{selectedContact.userId ? `#${selectedContact.userId}` : '\u2014'}</div>
                    </div>
                  </div>
                </GlassCard>

                {/* Recent Conversations */}
                {selectedContact.conversations && selectedContact.conversations.length > 0 && (
                  <GlassCard style={{ padding: '12px' }}>
                    <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>Recent Conversations</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedContact.conversations.slice(0, 5).map((conv: any) => (
                        <div key={conv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {conv.channel && <ChannelBadge type={conv.channel.type} />}
                            <span style={{ fontSize: '12px', color: '#F8F8FF', textTransform: 'capitalize' }}>{conv.status?.toLowerCase()}</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#6B7280' }}>{timeAgo(conv.updatedAt)}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .contact-detail-panel {
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

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#F8F8FF',
  fontSize: '13px',
  outline: 'none',
};

function badgeStyle(color: string): React.CSSProperties {
  return {
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: 700,
    background: `${color}15`,
    color: color,
    border: `1px solid ${color}30`,
  };
}
