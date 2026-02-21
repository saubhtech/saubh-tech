'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function CreateSectorPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const [form, setForm] = useState({ sector: '', code: '', sortOrder: '0', isActive: true, i18nName: '', i18nDesc: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const body: Record<string, unknown> = {
        sector: form.sector, code: form.code, sortOrder: +form.sortOrder, isActive: form.isActive,
      };
      if (form.i18nName) {
        body.i18n = [{ locale: 'en-in', name: form.i18nName, description: form.i18nDesc || null, isFallback: true }];
      }
      const res = await fetch(`${API}/master/sectors`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json().catch(() => null); throw new Error(d?.message || res.statusText); }
      router.push(`/${locale}/master/sector`);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed'); } finally { setSaving(false); }
  }

  return (
    <div>
      <h1 style={pageTitle}>Create Sector</h1>
      <form onSubmit={submit} style={formCard}>
        {error && <div style={errBox}>{error}</div>}
        <label style={label}>Sector Name *<input style={input} value={form.sector} onChange={handle('sector')} required /></label>
        <label style={label}>Code (UPPERCASE) *<input style={input} value={form.code} onChange={handle('code')} required placeholder="e.g. AGRICULTURE" /></label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label style={label}>Sort Order<input style={input} type="number" value={form.sortOrder} onChange={handle('sortOrder')} /></label>
          <label style={{ ...label, flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '28px' }}>
            <input type="checkbox" checked={form.isActive} onChange={handle('isActive')} /> Active
          </label>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '16px 0' }} />
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '0 0 12px' }}>i18n — English (India) fallback</p>
        <label style={label}>Display Name<input style={input} value={form.i18nName} onChange={handle('i18nName')} placeholder="Localized name" /></label>
        <label style={label}>Description<textarea style={{ ...input, minHeight: '60px' }} value={form.i18nDesc} onChange={handle('i18nDesc')} /></label>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button type="submit" disabled={saving} style={submitBtn}>{saving ? 'Saving…' : 'Create Sector'}</button>
          <a href={`/${locale}/master/sector`} style={cancelBtn}>Cancel</a>
        </div>
      </form>
    </div>
  );
}

const pageTitle: React.CSSProperties = { fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.03em', color: '#fff', margin: '0 0 24px' };
const formCard: React.CSSProperties = { maxWidth: '560px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px' };
const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '16px' };
const input: React.CSSProperties = { padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#f1f5f9', fontSize: '14px', outline: 'none' };
const submitBtn: React.CSSProperties = { padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer' };
const cancelBtn: React.CSSProperties = { padding: '10px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center' };
const errBox: React.CSSProperties = { padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', marginBottom: '16px' };
