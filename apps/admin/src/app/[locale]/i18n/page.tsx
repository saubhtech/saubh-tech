'use client';
import { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech/api';

interface LangInfo {
  total: number;
  translated: number;
  sameWord: number;
  pending: number;
  missing: number;
  coverage: string;
  sections: Record<string, { total: number; translated: number; sameWord: number; pending: number }>;
}

interface StatusData {
  generatedAt: string;
  totalKeys: number;
  sameWordKeys: number;
  translatableKeys: number;
  languages: Record<string, LangInfo>;
  sections: Record<string, { keys: number; pendingAcrossLangs: number }>;
  untranslated: Record<string, { pending: string[]; missing: string[] }>;
}

const FLAGS: Record<string, string> = {
  hi:'🇮🇳',bn:'🇮🇳',te:'🇮🇳',mr:'🇮🇳',ta:'🇮🇳',gu:'🇮🇳',kn:'🇮🇳',ml:'🇮🇳',pa:'🇮🇳',or:'🇮🇳',as:'🇮🇳',ur:'🇵🇰',
  ks:'🇮🇳',sd:'🇮🇳',sa:'🇮🇳',ne:'🇳🇵',mai:'🇮🇳',kok:'🇮🇳',mni:'🇮🇳',doi:'🇮🇳',sat:'🇮🇳',brx:'🇮🇳',
  ar:'🇸🇦',zh:'🇨🇳',fr:'🇫🇷',de:'🇩🇪',ja:'🇯🇵',ko:'🇰🇷',pt:'🇧🇷',ru:'🇷🇺',es:'🇪🇸',th:'🇹🇭',vi:'🇻🇳',id:'🇮🇩',ms:'🇲🇾',tr:'🇹🇷',en:'🌐',
};

const LANG_NAMES: Record<string, string> = {
  hi:'Hindi',bn:'Bengali',te:'Telugu',mr:'Marathi',ta:'Tamil',gu:'Gujarati',kn:'Kannada',ml:'Malayalam',
  pa:'Punjabi',or:'Odia',as:'Assamese',ur:'Urdu',ks:'Kashmiri',sd:'Sindhi',sa:'Sanskrit',ne:'Nepali',
  mai:'Maithili',kok:'Konkani',mni:'Manipuri',doi:'Dogri',sat:'Santali',brx:'Bodo',
  ar:'Arabic',zh:'Chinese',fr:'French',de:'German',ja:'Japanese',ko:'Korean',pt:'Portuguese',
  ru:'Russian',es:'Spanish',th:'Thai',vi:'Vietnamese',id:'Indonesian',ms:'Malay',tr:'Turkish',en:'English',
};

export default function I18nMonitor() {
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPending, setShowPending] = useState(false);
  const [filter, setFilter] = useState<'all' | 'complete' | 'pending'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Try API first, then static file
      let res = await fetch(`${API_BASE}/i18n/status`).catch(() => null);
      if (!res || !res.ok) {
        res = await fetch('/i18n-status.json').catch(() => null);
      }
      if (!res || !res.ok) throw new Error('Status not available');
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      setData(d);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load status');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) return <div style={pageStyles}><div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading translation status...</div></div>;

  if (error && !data) return (
    <div style={pageStyles}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '12px' }}>⚠️ {error}</div>
        <div style={{ color: '#64748b', fontSize: '.85rem' }}>Run on server: <code style={codeStyle}>node /data/scripts/i18n/i18n-status.mjs</code></div>
      </div>
    </div>
  );

  if (!data) return null;

  const langs = Object.entries(data.languages).sort((a, b) => parseFloat(b[1].coverage) - parseFloat(a[1].coverage));
  const complete = langs.filter(([, l]) => parseFloat(l.coverage) >= 100).length;
  const near = langs.filter(([, l]) => parseFloat(l.coverage) >= 95 && parseFloat(l.coverage) < 100).length;
  const needsWork = langs.filter(([, l]) => parseFloat(l.coverage) < 95).length;
  const totalPending = langs.reduce((a, [, l]) => a + l.pending, 0);
  const ago = Math.round((Date.now() - new Date(data.generatedAt).getTime()) / 60000);

  const filtered = filter === 'all' ? langs
    : filter === 'complete' ? langs.filter(([, l]) => parseFloat(l.coverage) >= 100)
    : langs.filter(([, l]) => parseFloat(l.coverage) < 100);

  return (
    <div style={pageStyles}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🌍 i18n Translation Monitor
          </h1>
          <div style={{ color: '#64748b', fontSize: '.8rem', marginTop: '4px' }}>
            Updated {ago < 60 ? ago + ' min ago' : Math.round(ago / 60) + 'h ago'} · {new Date(data.generatedAt).toLocaleString()}
          </div>
        </div>
        <button onClick={load} style={btnStyle} disabled={loading}>
          {loading ? '⟳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <StatCard num={data.totalKeys} label="Total Keys" color="#3b82f6" />
        <StatCard num={langs.length} label="Languages" color="#3b82f6" />
        <StatCard num={complete} label="Complete (100%)" color="#22c55e" />
        <StatCard num={near} label="Near (95-99%)" color="#eab308" />
        <StatCard num={needsWork} label="Needs Work" color={needsWork > 0 ? '#ef4444' : '#22c55e'} />
        <StatCard num={totalPending} label="Pending Keys" color={totalPending > 0 ? '#eab308' : '#22c55e'} />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['all', 'complete', 'pending'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            ...tabStyle,
            background: filter === f ? 'rgba(124,58,237,0.15)' : 'transparent',
            borderColor: filter === f ? '#7c3aed' : '#334155',
            color: filter === f ? '#a78bfa' : '#94a3b8',
          }}>
            {f === 'all' ? `All (${langs.length})` : f === 'complete' ? `✅ Complete (${complete})` : `⏳ Pending (${near + needsWork})`}
          </button>
        ))}
        <button onClick={() => setShowPending(!showPending)} style={{ ...tabStyle, marginLeft: 'auto', borderColor: '#334155', color: '#94a3b8' }}>
          {showPending ? '📋 Hide Details' : '📋 Show Pending Keys'}
        </button>
      </div>

      {/* Language Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '30px' }}>
        {filtered.map(([lang, info]) => {
          const pct = parseFloat(info.coverage);
          const barColor = pct >= 100 ? '#22c55e' : pct >= 99 ? '#86efac' : pct >= 95 ? '#eab308' : '#ef4444';
          return (
            <div key={lang} style={langCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '.95rem' }}>
                  {FLAGS[lang] || '🌐'} {lang.toUpperCase()} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '.8rem' }}>{LANG_NAMES[lang] || ''}</span>
                </span>
                <span style={{ fontWeight: 800, color: barColor }}>{info.coverage}</span>
              </div>
              <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}, ${pct >= 100 ? '#06b6d4' : barColor})`, borderRadius: '3px', transition: 'width .5s' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '.72rem', color: '#64748b' }}>
                <span>✅ {info.translated}</span>
                <span>🔤 {info.sameWord} same</span>
                <span>⏳ {info.pending}</span>
                {info.missing > 0 && <span style={{ color: '#ef4444' }}>❌ {info.missing} missing</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections */}
      {data.sections && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '12px' }}>📂 Sections</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
            {Object.entries(data.sections).map(([name, info]) => (
              <div key={name} style={{
                ...sectionChipStyle,
                borderColor: info.pendingAcrossLangs === 0 ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)',
              }}>
                <span>{name}</span>
                <span style={{ color: '#64748b' }}>
                  {info.keys} keys {info.pendingAcrossLangs > 0 ? `· ${info.pendingAcrossLangs} ⏳` : '· ✅'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Keys Detail */}
      {showPending && data.untranslated && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '12px' }}>⏳ Pending Keys by Language</h2>
          {Object.entries(data.untranslated).map(([lang, info]) => {
            if (info.pending.length === 0 && info.missing.length === 0) return null;
            return (
              <details key={lang} style={pendingStyle}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '.85rem' }}>
                  {FLAGS[lang] || '🌐'} {lang.toUpperCase()} — {info.pending.length} pending, {info.missing.length} missing
                </summary>
                <div style={{ marginTop: '8px', fontSize: '.75rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  {[...info.pending, ...info.missing].join(', ')}
                </div>
              </details>
            );
          })}
        </div>
      )}

      {/* Commands */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid #334155', padding: '16px 20px', marginTop: '20px' }}>
        <h3 style={{ fontSize: '.85rem', color: '#94a3b8', marginBottom: '10px' }}>🛠 Server Commands</h3>
        <div style={{ display: 'grid', gap: '6px', fontSize: '.8rem' }}>
          <div><code style={codeStyle}>translation-engine status</code> <span style={{ color: '#64748b' }}>— check system</span></div>
          <div><code style={codeStyle}>translation-engine scan</code> <span style={{ color: '#64748b' }}>— find hardcoded strings</span></div>
          <div><code style={codeStyle}>translation-engine translate</code> <span style={{ color: '#64748b' }}>— translate pending keys</span></div>
          <div><code style={codeStyle}>translation-engine full</code> <span style={{ color: '#64748b' }}>— full pipeline (scan → translate → build)</span></div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ num, label, color }: { num: number; label: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px 18px', textAlign: 'center', border: '1px solid #334155' }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color }}>{num}</div>
      <div style={{ fontSize: '.72rem', color: '#94a3b8', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

const pageStyles: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto' };
const btnStyle: React.CSSProperties = { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '.85rem' };
const tabStyle: React.CSSProperties = { padding: '6px 14px', borderRadius: '8px', border: '1px solid', fontSize: '.8rem', fontWeight: 500, cursor: 'pointer', background: 'transparent' };
const langCardStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px 16px', border: '1px solid #334155', transition: '.2s' };
const sectionChipStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', fontSize: '.8rem', display: 'flex', justifyContent: 'space-between' };
const pendingStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px 16px', marginBottom: '8px', border: '1px solid #334155' };
const codeStyle: React.CSSProperties = { background: 'rgba(124,58,237,0.15)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '.8rem', color: '#a78bfa' };
