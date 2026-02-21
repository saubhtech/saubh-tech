'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import ChannelBadge from '@/components/ui/ChannelBadge';
import GradientButton from '@/components/ui/GradientButton';
import Avatar from '@/components/ui/Avatar';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech';
const BASE = '/crmwhats';

interface Channel { id: string; name: string; type: string; phone: string; }
interface Contact { id: string; whatsapp: string; name: string | null; optedOut: boolean; isBlocked: boolean; }

export default function CreateBroadcastPage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.replace(BASE, '').split('/').filter(Boolean)[0] || 'en-in';

  const [step, setStep] = useState(1);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [searchContacts, setSearchContacts] = useState('');
  const [sendNow, setSendNow] = useState(true);
  const [scheduledAt, setScheduledAt] = useState('');
  const [sending, setSending] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);

  const selectedChannel = channels.find(c => c.id === selectedChannelId);
  const isWaba = selectedChannel?.type === 'WABA';
  const charLimit = isWaba ? 1024 : null;

  useEffect(() => {
    fetch(`${API}/api/crm/channels`).then(r => r.json()).then(setChannels).catch(console.error);
  }, []);

  const fetchContacts = useCallback(async () => {
    if (!selectedChannelId) return;
    setContactsLoading(true);
    try {
      const params = new URLSearchParams({ channelId: selectedChannelId });
      if (searchContacts) params.set('search', searchContacts);
      const res = await fetch(`${API}/api/crm/contacts?${params}&limit=200`);
      const json = await res.json();
      setContacts(json.data || []);
    } catch (e) { console.error(e); }
    finally { setContactsLoading(false); }
  }, [selectedChannelId, searchContacts]);

  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(fetchContacts, searchContacts ? 300 : 0);
      return () => clearTimeout(t);
    }
  }, [step, fetchContacts]);

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const available = contacts.filter(c => !c.optedOut && !c.isBlocked);
    if (selectedContacts.size === available.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(available.map(c => c.id)));
    }
  };

  const submit = async () => {
    setSending(true);
    try {
      const recipientWhatsapps = contacts
        .filter(c => selectedContacts.has(c.id))
        .map(c => c.whatsapp);

      await fetch(`${API}/api/crm/broadcasts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          channelId: selectedChannelId,
          body,
          recipients: recipientWhatsapps,
          scheduledAt: sendNow ? null : scheduledAt || null,
        }),
      });
      router.push(`${BASE}/${locale}/broadcast`);
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const canNext = () => {
    if (step === 1) return !!selectedChannelId;
    if (step === 2) return !!name.trim() && !!body.trim() && (charLimit ? body.length <= charLimit : true);
    if (step === 3) return selectedContacts.size > 0;
    return true;
  };

  const steps = ['Channel', 'Message', 'Recipients', 'Confirm'];

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#F8F8FF', marginBottom: '20px', letterSpacing: '-0.02em' }}>
        \uD83D\uDCE2 New Broadcast
      </h1>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              height: '4px', width: '100%', borderRadius: '2px',
              background: i + 1 <= step ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'rgba(255,255,255,0.06)',
              transition: 'background 0.3s ease',
            }} />
            <span style={{ fontSize: '10px', color: i + 1 <= step ? '#7C3AED' : '#6B7280', fontWeight: 600 }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 1 — Select Channel */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          {channels.map(ch => (
            <GlassCard key={ch.id} hover onClick={() => setSelectedChannelId(ch.id)} active={selectedChannelId === ch.id}
              style={{
                textAlign: 'center', padding: '24px',
                borderColor: selectedChannelId === ch.id
                  ? ch.type === 'WABA' ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'
                  : undefined,
                boxShadow: selectedChannelId === ch.id ? `0 0 20px ${ch.type === 'WABA' ? 'rgba(16,185,129,0.1)' : 'rgba(124,58,237,0.1)'}` : undefined,
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{ch.type === 'WABA' ? '\uD83D\uDCBC' : '\uD83D\uDCF1'}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8F8FF' }}>{ch.name}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', fontFamily: 'monospace' }}>{ch.phone}</div>
              <div style={{ marginTop: '8px' }}><ChannelBadge type={ch.type} /></div>
              {selectedChannelId === ch.id && (
                <div style={{ marginTop: '10px', color: '#10B981', fontSize: '18px' }}>\u2713</div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Step 2 — Write Message */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Broadcast Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. February Promo" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <label style={labelStyle}>Message Body</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Type your broadcast message..."
                rows={8}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit' }}
              />
              {charLimit && (
                <div style={{ fontSize: '11px', marginTop: '4px', color: body.length > charLimit ? '#EF4444' : '#6B7280', textAlign: 'right' }}>
                  {body.length}/{charLimit}
                </div>
              )}
            </div>
            <div style={{ width: '240px', flexShrink: 0 }}>
              <label style={labelStyle}>Preview</label>
              <div style={{
                padding: '12px 16px', borderRadius: '14px 14px 14px 4px',
                background: 'rgba(28,28,39,0.8)', border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '14px', color: '#e2e8f0', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                minHeight: '100px',
              }}>
                {body || <span style={{ color: '#6B7280' }}>Your message will appear here...</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Select Recipients */}
      {step === 3 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <input
              value={searchContacts}
              onChange={e => setSearchContacts(e.target.value)}
              placeholder="Search contacts..."
              style={{ ...inputStyle, width: '250px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {selectedContacts.size} selected
              </span>
              <button onClick={toggleAll} style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6B7280', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {selectedContacts.size === contacts.filter(c => !c.optedOut && !c.isBlocked).length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {contactsLoading ? (
              <div style={{ padding: '20px', color: '#6B7280', textAlign: 'center', fontSize: '13px' }}>Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div style={{ padding: '20px', color: '#6B7280', textAlign: 'center', fontSize: '13px' }}>No contacts on this channel</div>
            ) : (
              contacts.map(c => {
                const disabled = c.optedOut || c.isBlocked;
                const checked = selectedContacts.has(c.id);
                return (
                  <div key={c.id} onClick={() => !disabled && toggleContact(c.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px',
                    borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.4 : 1,
                    background: checked ? 'rgba(124,58,237,0.06)' : 'transparent',
                    transition: 'background 0.15s ease',
                  }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                      border: checked ? 'none' : '2px solid rgba(255,255,255,0.15)',
                      background: checked ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: '#fff',
                    }}>{checked ? '\u2713' : ''}</div>
                    <Avatar name={c.name || c.whatsapp} size="sm" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#F8F8FF' }}>{c.name || c.whatsapp}</span>
                      {c.name && <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '8px', fontFamily: 'monospace' }}>{c.whatsapp}</span>}
                    </div>
                    {disabled && <span style={{ fontSize: '10px', color: '#EF4444' }}>{c.isBlocked ? 'Blocked' : 'Opted Out'}</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Step 4 — Confirm */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
            <GlassCard hover onClick={() => setSendNow(true)} active={sendNow} style={{ flex: 1, textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>\u26A1</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: sendNow ? '#F8F8FF' : '#6B7280' }}>Send Now</div>
            </GlassCard>
            <GlassCard hover onClick={() => setSendNow(false)} active={!sendNow} style={{ flex: 1, textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>\uD83D\uDD50</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: !sendNow ? '#F8F8FF' : '#6B7280' }}>Schedule</div>
            </GlassCard>
          </div>

          {!sendNow && (
            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }} />
          )}

          <GlassCard style={{ padding: '16px' }}>
            <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '12px' }}>Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div><span style={{ color: '#6B7280' }}>Channel:</span> <span style={{ color: '#F8F8FF' }}>{selectedChannel?.name}</span></div>
              <div><span style={{ color: '#6B7280' }}>Type:</span> {selectedChannel && <ChannelBadge type={selectedChannel.type} />}</div>
              <div><span style={{ color: '#6B7280' }}>Recipients:</span> <span style={{ color: '#F8F8FF' }}>{selectedContacts.size}</span></div>
              <div><span style={{ color: '#6B7280' }}>Est. time:</span> <span style={{ color: '#F8F8FF' }}>{Math.ceil(selectedContacts.size / 60)} min</span></div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Message:</span>
              <div style={{
                marginTop: '6px', padding: '10px 14px', borderRadius: '10px',
                background: 'rgba(28,28,39,0.6)', border: '1px solid rgba(255,255,255,0.04)',
                fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                maxHeight: '80px', overflow: 'hidden',
              }}>{body}</div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', gap: '12px' }}>
        {step > 1 ? (
          <button onClick={() => setStep(s => s - 1)} style={{
            padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)', color: '#6B7280', fontSize: '14px',
            fontWeight: 600, cursor: 'pointer',
          }}>Back</button>
        ) : <div />}

        {step < 4 ? (
          <GradientButton onClick={() => setStep(s => s + 1)} disabled={!canNext()}>Next</GradientButton>
        ) : (
          <GradientButton onClick={submit} loading={sending} disabled={!canNext()}>Confirm & Send</GradientButton>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '6px' };
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  color: '#F8F8FF', fontSize: '14px', outline: 'none',
};
