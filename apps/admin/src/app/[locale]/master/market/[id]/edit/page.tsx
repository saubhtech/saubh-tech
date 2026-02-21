'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Sector { sectorid: number; sector: string; }
interface Field { fieldid: number; field: string; sectorid: number; }
interface I18nEntry { id: number; locale: string; name: string; description: string | null; isFallback: boolean; }
interface Market { marketid: string; item: string; code: string; sectorid: number; fieldid: number; p_s_ps: string; deliveryMode: string; sortOrder: number; isActive: boolean; i18n: I18nEntry[]; }

export default function EditMarketPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>();
  const router = useRouter();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [allFields, setAllFields] = useState<Field[]>([]);
  const [form, setForm] = useState({ item: '', code: '', sectorid: '', fieldid: '', p_s_ps: 'P', deliveryMode: 'PHYSICAL', sortOrder: '0', isActive: true, i18nName: '', i18nDesc: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API}/master/sectors?active=true`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API}/master/fields?active=true`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API}/master/markets/${id}`, { credentials: 'include' }).then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); }),
    ]).then(([secs, flds, m]: [Sector[], Field[], Market]) => {
      setSectors(secs); setAllFields(flds);
      const fb = m.i18n?.find(e => e.isFallback) || m.i18n?.[0];
      setForm({ item: m.item, code: m.code, sectorid: String(m.sectorid), fieldid: String(m.fieldid), p_s_ps: m.p_s_ps, deliveryMode: m.deliveryMode || 'PHYSICAL', sortOrder: String(m.sortOrder), isActive: m.isActive, i18nName: fb?.name || '', i18nDesc: fb?.description || '' });
      setLoading(false);
    }).catch(() => setError('Failed to load'));
  }, [id]);

  const filteredFields = form.sectorid ? allFields.filter(f => f.sectorid === +form.sectorid) : allFields;

  const handle = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const body: Record<string, unknown> = { item: form.item, code: form.code, sectorid: +form.sectorid, fieldid: +form.fieldid, p_s_ps: form.p_s_ps, deliveryMode: form.deliveryMode, sortOrder: +form.sortOrder, isActive: form.isActive };
      if (form.i18nName) body.i18n = [{ locale: 'en-in', name: form.i18nName, description: form.i18nDesc || null, isFallback: true }];
      const res = await fetch(`${API}/master/markets/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json().catch(() => null); throw new Error(d?.message || res.statusText); }
      router.push(`/${locale}/master/market`);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed'); } finally { setSaving(false); }
  }

  async function softDelete() {
    if (!confirm('Deactivate this market item?')) return;
    await fetch(`${API}/master/markets/${id}`, { method: 'DELETE', credentials: 'include' });
    router.push(`/${locale}/master/market`);
  }

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</p>;

  return (
    <div>
      <h1 style={pageTitle}>Edit Market #{id}</h1>
      <form onSubmit={submit} style={formCard}>
        {error && <div style={errBox}>{error}</div>}
        <label style={label}>Item Name *<input style={input} value={form.item} onChange={handle('item')} required /></label>
        <label style={label}>Code *<input style={input} value={form.code} onChange={handle('code')} required /></label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <label style={label}>Sector *
            <select style={input} value={form.sectorid} onChange={handle('sectorid')} required>
              <option value="">Select…</option>
              {sectors.map(s => <option key={s.sectorid} value={s.sectorid}>{s.sector}</option>)}
            </select>
          </label>
          <label style={label}>Field *
            <select style={input} value={form.fieldid} onChange={handle('fieldid')} required>
              <option value="">Select…</option>
              {filteredFields.map(f => <option key={f.fieldid} value={f.fieldid}>{f.field}</option>)}
            </select>
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <label style={label}>P/S/PS *
            <select style={input} value={form.p_s_ps} onChange={handle('p_s_ps')}>
              <option value="P">P (Product)</option>
              <option value="S">S (Service)</option>
              <option value="PS">PS (Both)</option>
            </select>
          </label>
          <label style={label}>Delivery Mode
            <select style={input} value={form.deliveryMode} onChange={handle('deliveryMode')}>
              <option value="PHYSICAL">Physical</option>
              <option value="DIGITAL">Digital</option>
              <option value="PHYGITAL">Phygital</option>
            </select>
          </label>
          <label style={label}>Sort Order<input style={input} type="number" value={form.sortOrder} onChange={handle('sortOrder')} /></label>
        </div>
        <label style={{ ...label, flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" checked={form.isActive} onChange={handle('isActive')} /> Active
        </label>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '16px 0' }} />
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '0 0 12px' }}>i18n — English (India) fallback</p>
        <label style={label}>Display Name<input style={input} value={form.i18nName} onChange={handle('i18nName')} /></label>
        <label style={label}>Description<textarea style={{ ...input, minHeight: '60px' }} value={form.i18nDesc} onChange={handle('i18nDesc')} /></label>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button type="submit" disabled={saving} style={submitBtn}>{saving ? 'Saving…' : 'Update Market'}</button>
          <button type="button" onClick={softDelete} style={deleteBtn}>Deactivate</button>
          <a href={`/${locale}/master/market`} style={cancelBtn}>Cancel</a>
        </div>
      </form>
    </div>
  );
}

const pageTitle: React.CSSProperties = { fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.03em', color: '#fff', margin: '0 0 24px' };
const formCard: React.CSSProperties = { maxWidth: '620px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '28px' };
const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '16px' };
const input: React.CSSProperties = { padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#f1f5f9', fontSize: '14px', outline: 'none' };
const submitBtn: React.CSSProperties = { padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer' };
const deleteBtn: React.CSSProperties = { padding: '10px 24px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' };
const cancelBtn: React.CSSProperties = { padding: '10px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center' };
const errBox: React.CSSProperties = { padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', marginBottom: '16px' };
