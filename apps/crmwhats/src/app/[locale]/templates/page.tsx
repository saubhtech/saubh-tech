'use client';

import { useEffect, useState, useCallback } from 'react';
import { useChannel } from '@/context/ChannelContext';
import GlassCard from '@/components/ui/GlassCard';
import ChannelBadge from '@/components/ui/ChannelBadge';
import GradientButton from '@/components/ui/GradientButton';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech';

interface Channel {
  id: string;
  name: string;
  type: string;
  phone: string;
  isActive: boolean;
}

interface Template {
  id: string;
  channelId: string;
  name: string;
  category: string;
  language: string;
  status: string;
  body: string;
  header: string | null;
  footer: string | null;
  variables: string[];
  metaId: string | null;
  createdAt: string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  APPROVED: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  REJECTED: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
};

const categoryInfo: Record<string, { emoji: string; color: string }> = {
  MARKETING: { emoji: '📣', color: '#EC4899' },
  UTILITY: { emoji: '🔧', color: '#3B82F6' },
  AUTHENTICATION: { emoji: '🔐', color: '#F97316' },
};

export default function TemplatesPage() {
  const { selectedChannel } = useChannel();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTpl, setSelectedTpl] = useState<Template | null>(null);

  // Create form state
  const [form, setForm] = useState({
    channelId: '',
    name: '',
    category: 'MARKETING',
    language: 'en',
    body: '',
    header: '',
    footer: '',
  });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/crm/templates`);
      setTemplates(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetch(`${API}/api/crm/channels`).then(r => r.json()).then(ch => {
      setChannels(ch);
      const waba = ch.find((c: Channel) => c.type === 'WABA');
      if (waba) setForm(prev => ({ ...prev, channelId: waba.id }));
    });
    fetchTemplates();
  }, [fetchTemplates]);

  // Detect variables in body
  const detectedVars = (form.body.match(/\{\{\d+\}\}/g) || []).filter(
    (v, i, arr) => arr.indexOf(v) === i,
  );

  // Filter by channel type
  const filtered = templates.filter(t => {
    if (selectedChannel === 'ALL') return true;
    const ch = channels.find(c => c.id === t.channelId);
    return ch?.type === selectedChannel;
  });

  const handleCreate = async () => {
    if (!form.channelId || !form.name || !form.body) return;
    setCreating(true);
    try {
      await fetch(`${API}/api/crm/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: form.channelId,
          name: form.name,
          category: form.category,
          language: form.language,
          body: form.body,
          header: form.header || undefined,
          footer: form.footer || undefined,
          variables: detectedVars,
        }),
      });
      setShowCreate(false);
      setForm(prev => ({ ...prev, name: '', body: '', header: '', footer: '' }));
      fetchTemplates();
    } catch (e) { console.error(e); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`${API}/api/crm/templates/${id}`, { method: 'DELETE' });
      setTemplates(prev => prev.filter(t => t.id !== id));
      if (selectedTpl?.id === id) setSelectedTpl(null);
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  const getChannelName = (channelId: string) => channels.find(c => c.id === channelId)?.name || '';
  const getChannelType = (channelId: string) => channels.find(c => c.id === channelId)?.type || '';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* LEFT — Template List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '20px 20px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#F8F8FF', margin: 0, letterSpacing: '-0.02em' }}>
              📝 Template Studio
            </h1>
            <GradientButton size="sm" onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? '✕ Cancel' : '+ New Template'}
            </GradientButton>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Create Form */}
          {showCreate && (
            <GlassCard style={{ borderLeft: '3px solid #7C3AED' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8F8FF', marginBottom: '14px' }}>Create Template</div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <Label>Channel</Label>
                  <select
                    value={form.channelId}
                    onChange={e => setForm(prev => ({ ...prev, channelId: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="">Select channel</option>
                    {channels.filter(c => c.type === 'WABA' && c.isActive).map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.name} ({ch.phone})</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <Label>Category</Label>
                  <select
                    value={form.category}
                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="MARKETING">📣 Marketing</option>
                    <option value="UTILITY">🔧 Utility</option>
                    <option value="AUTHENTICATION">🔐 Authentication</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <div style={{ flex: 2 }}>
                  <Label>Template Name</Label>
                  <input
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') }))}
                    placeholder="order_confirmation"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Label>Language</Label>
                  <select value={form.language} onChange={e => setForm(prev => ({ ...prev, language: e.target.value }))} style={inputStyle}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="en_US">English (US)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <Label>Header (optional)</Label>
                <input
                  value={form.header}
                  onChange={e => setForm(prev => ({ ...prev, header: e.target.value }))}
                  placeholder="Order Update"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <Label>Body *</Label>
                <textarea
                  value={form.body}
                  onChange={e => setForm(prev => ({ ...prev, body: e.target.value }))}
                  placeholder={'Hello {{1}},\nYour order {{2}} has been confirmed.\nThank you for choosing Saubh!'}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
                />
                {detectedVars.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {detectedVars.map(v => (
                      <span key={v} style={{
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px',
                        background: 'rgba(124,58,237,0.12)', color: '#A78BFA',
                        border: '1px solid rgba(124,58,237,0.2)',
                      }}>{v}</span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <Label>Footer (optional)</Label>
                <input
                  value={form.footer}
                  onChange={e => setForm(prev => ({ ...prev, footer: e.target.value }))}
                  placeholder="Saubh.Tech — Services at your doorstep"
                  style={inputStyle}
                />
              </div>

              <GradientButton onClick={handleCreate} disabled={creating || !form.name || !form.body || !form.channelId}>
                {creating ? 'Submitting...' : 'Submit to Meta for Approval'}
              </GradientButton>
            </GlassCard>
          )}

          {/* Template List */}
          {loading ? (
            <SkeletonLoader variant="card" count={4} />
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
              {showCreate ? '' : 'No templates yet. Create your first one!'}
            </div>
          ) : (
            filtered.map(tpl => {
              const sc = statusColors[tpl.status] || statusColors.PENDING;
              const cat = categoryInfo[tpl.category] || categoryInfo.MARKETING;
              return (
                <GlassCard key={tpl.id} hover onClick={() => setSelectedTpl(tpl)} active={selectedTpl?.id === tpl.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px' }}>{cat.emoji}</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#F8F8FF', fontFamily: 'monospace' }}>{tpl.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                        <ChannelBadge type={getChannelType(tpl.channelId)} />
                        <span style={{ fontSize: '10px', color: '#6B7280' }}>{tpl.language.toUpperCase()}</span>
                        <span style={{
                          padding: '2px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: 700,
                          background: `${cat.color}15`, color: cat.color,
                        }}>{tpl.category}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tpl.body}
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                      background: sc.bg, color: sc.color, flexShrink: 0, marginLeft: '12px',
                    }}>{tpl.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: '#6B7280' }}>
                    <span>{tpl.variables.length} variables</span>
                    <span>{new Date(tpl.createdAt).toLocaleDateString()}</span>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT — Template Detail / Preview */}
      {selectedTpl && (
        <div style={{ width: '400px', flexShrink: 0, overflowY: 'auto', borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,15,0.5)' }} className="tpl-detail-panel">
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#F8F8FF', margin: 0, fontFamily: 'monospace' }}>{selectedTpl.name}</h2>
              <button onClick={() => setSelectedTpl(null)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <ChannelBadge type={getChannelType(selectedTpl.channelId)} />
              {(() => { const sc = statusColors[selectedTpl.status] || statusColors.PENDING; return (
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: sc.bg, color: sc.color }}>{selectedTpl.status}</span>
              ); })()}
              {(() => { const cat = categoryInfo[selectedTpl.category] || categoryInfo.MARKETING; return (
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: `${cat.color}15`, color: cat.color }}>{cat.emoji} {selectedTpl.category}</span>
              ); })()}
            </div>
          </div>

          {/* WhatsApp Preview */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '10px' }}>Preview</div>
            <div style={{
              background: 'linear-gradient(to bottom, #0B141A, #0B141A)',
              borderRadius: '16px', padding: '20px 14px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                maxWidth: '85%', background: '#1F2C34',
                borderRadius: '12px 12px 12px 4px', padding: '10px 12px',
              }}>
                {selectedTpl.header && (
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#E4E6EB', marginBottom: '6px' }}>
                    {selectedTpl.header}
                  </div>
                )}
                <div style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {selectedTpl.body}
                </div>
                {selectedTpl.footer && (
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px', fontStyle: 'italic' }}>
                    {selectedTpl.footer}
                  </div>
                )}
                <div style={{ fontSize: '10px', color: '#6B7280', textAlign: 'right', marginTop: '6px' }}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>

          {/* Variables */}
          {selectedTpl.variables.length > 0 && (
            <div style={{ padding: '0 20px 16px' }}>
              <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>Variables</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {selectedTpl.variables.map(v => (
                  <span key={v} style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                    background: 'rgba(124,58,237,0.12)', color: '#A78BFA',
                    border: '1px solid rgba(124,58,237,0.2)',
                  }}>{v}</span>
                ))}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>Details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <DetailRow label="Language" value={selectedTpl.language.toUpperCase()} />
              <DetailRow label="Channel" value={getChannelName(selectedTpl.channelId)} />
              <DetailRow label="Meta ID" value={selectedTpl.metaId || '—'} />
              <DetailRow label="Created" value={new Date(selectedTpl.createdAt).toLocaleString()} />
            </div>
          </div>

          {/* Delete */}
          <div style={{ padding: '0 20px 20px' }}>
            <button
              onClick={() => handleDelete(selectedTpl.id)}
              disabled={deleting === selectedTpl.id}
              style={{
                width: '100%', padding: '10px', borderRadius: '10px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                color: '#EF4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                opacity: deleting === selectedTpl.id ? 0.5 : 1,
              }}
            >
              {deleting === selectedTpl.id ? 'Deleting...' : 'Delete Template'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .tpl-detail-panel {
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: '10px', color: '#9CA3AF', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {children}
    </label>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: '#6B7280' }}>{label}</span>
      <span style={{ color: '#F8F8FF', fontFamily: 'monospace', fontSize: '11px' }}>{value}</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#F8F8FF',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};
