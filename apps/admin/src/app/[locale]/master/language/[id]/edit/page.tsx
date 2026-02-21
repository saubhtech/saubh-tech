'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Language {
  langid: number;
  language: string;
  locale: string;
  isActive: boolean;
  isRtl: boolean;
  sortOrder: number;
}

export default function EditLanguagePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;

  const [form, setForm] = useState({
    language: '',
    locale: '',
    isRtl: false,
    sortOrder: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/master/languages/${id}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Not found (${res.status})`);
        const data: Language = await res.json();
        setForm({
          language: data.language,
          locale: data.locale,
          isRtl: data.isRtl,
          sortOrder: data.sortOrder,
          isActive: data.isActive,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.language.trim() || !form.locale.trim()) {
      setError('Language name and locale code are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API}/master/languages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          language: form.language.trim(),
          locale: form.locale.trim().toLowerCase(),
          isRtl: form.isRtl,
          sortOrder: form.sortOrder,
          isActive: form.isActive,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Failed (${res.status})`);
      }

      router.push(`/${locale}/master/language`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Deactivate this language? It will be marked inactive.')) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/master/languages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      router.push(`/${locale}/master/language`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ color: 'rgba(255,255,255,0.4)', padding: '40px 0' }}>Loading...</p>;
  }

  return (
    <div>
      <h1 style={pageTitle}>Edit Language</h1>
      <p style={pageSubtitle}>
        Editing: <strong style={{ color: '#f1f5f9' }}>{form.language}</strong> ({form.locale})
      </p>

      <form onSubmit={handleSubmit} style={formCard}>
        {error && <div style={errorBox}>{error}</div>}

        <div style={fieldGroup}>
          <label style={labelStyle}>Language Name *</label>
          <input
            style={inputStyle}
            type="text"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            required
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Locale Code *</label>
          <input
            style={inputStyle}
            type="text"
            value={form.locale}
            onChange={(e) => setForm({ ...form, locale: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Sort Order</label>
            <input
              style={inputStyle}
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Options</label>
            <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
              <label style={toggleLabel}>
                <input
                  type="checkbox"
                  checked={form.isRtl}
                  onChange={(e) => setForm({ ...form, isRtl: e.target.checked })}
                  style={checkboxStyle}
                />
                RTL
              </label>
              <label style={toggleLabel}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  style={checkboxStyle}
                />
                Active
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={saving} style={submitBtn}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <a href={`/${locale}/master/language`} style={cancelBtn}>
              Cancel
            </a>
          </div>
          <button type="button" onClick={handleDeactivate} disabled={saving} style={deactivateBtn}>
            Deactivate
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────

const pageTitle: React.CSSProperties = {
  fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '28px',
  letterSpacing: '-0.03em', color: '#fff', margin: '0 0 4px',
};

const pageSubtitle: React.CSSProperties = {
  fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px',
};

const formCard: React.CSSProperties = {
  maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px',
  background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.06)', padding: '32px',
};

const errorBox: React.CSSProperties = {
  padding: '12px 16px', borderRadius: '10px',
  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
  color: '#ef4444', fontSize: '14px',
};

const fieldGroup: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '6px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)',
  letterSpacing: '0.02em',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: '10px', fontSize: '15px',
  background: 'rgba(255,255,255,0.04)', color: '#f1f5f9',
  border: '1px solid rgba(255,255,255,0.1)', outline: 'none',
  fontFamily: 'inherit',
};

const toggleLabel: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px',
  color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer',
};

const checkboxStyle: React.CSSProperties = {
  width: '18px', height: '18px', accentColor: '#8b5cf6', cursor: 'pointer',
};

const submitBtn: React.CSSProperties = {
  padding: '10px 24px', borderRadius: '12px',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#fff', fontSize: '14px', fontWeight: 600,
  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
};

const cancelBtn: React.CSSProperties = {
  padding: '10px 24px', borderRadius: '12px',
  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
  textDecoration: 'none', fontSize: '14px', fontWeight: 500,
  border: '1px solid rgba(255,255,255,0.08)',
  display: 'inline-flex', alignItems: 'center',
};

const deactivateBtn: React.CSSProperties = {
  padding: '10px 20px', borderRadius: '12px',
  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
  border: '1px solid rgba(239,68,68,0.2)',
};
