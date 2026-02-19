'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './language.css';

// ─── Types ───
interface LangInfo {
  code: string;
  name: string;
  native: string;
  engine: string;
  status: 'live' | 'pending' | 'translating' | 'done' | 'error';
  keys: number;
  total: number;
}

interface TranslateJob {
  langs: string[];
  status: 'idle' | 'running' | 'done' | 'error';
  log: string[];
  startedAt?: number;
}

// ─── All 36 non-English languages ───
const ALL_LANGS: { code: string; name: string; native: string; engine: string }[] = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', engine: 'indictrans2' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', engine: 'indictrans2' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', engine: 'indictrans2' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', engine: 'indictrans2' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', engine: 'indictrans2' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', engine: 'indictrans2' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', engine: 'indictrans2' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', engine: 'indictrans2' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', engine: 'indictrans2' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', engine: 'indictrans2' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', engine: 'indictrans2' },
  { code: 'ur', name: 'Urdu', native: 'اردو', engine: 'indictrans2' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', engine: 'indictrans2' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', engine: 'indictrans2' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', engine: 'indictrans2' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', engine: 'indictrans2' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', engine: 'indictrans2' },
  { code: 'sd', name: 'Sindhi', native: 'سنۅي', engine: 'indictrans2' },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर', engine: 'indictrans2' },
  { code: 'brx', name: 'Bodo', native: 'बड़ो', engine: 'indictrans2' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', engine: 'indictrans2' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্', engine: 'indictrans2' },
  { code: 'ar', name: 'Arabic', native: 'العربية', engine: 'nllb' },
  { code: 'zh', name: 'Chinese', native: '中文', engine: 'nllb' },
  { code: 'fr', name: 'French', native: 'Français', engine: 'nllb' },
  { code: 'de', name: 'German', native: 'Deutsch', engine: 'nllb' },
  { code: 'ja', name: 'Japanese', native: '日本語', engine: 'nllb' },
  { code: 'ko', name: 'Korean', native: '한국어', engine: 'nllb' },
  { code: 'pt', name: 'Portuguese', native: 'Português', engine: 'nllb' },
  { code: 'ru', name: 'Russian', native: 'Русский', engine: 'nllb' },
  { code: 'es', name: 'Spanish', native: 'Español', engine: 'nllb' },
  { code: 'th', name: 'Thai', native: 'ไทย', engine: 'nllb' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', engine: 'nllb' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', engine: 'nllb' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', engine: 'nllb' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', engine: 'nllb' },
];

export default function LanguagePage() {
  const [languages, setLanguages] = useState<LangInfo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [job, setJob] = useState<TranslateJob>({ langs: [], status: 'idle', log: [] });
  const [filter, setFilter] = useState<'all' | 'live' | 'pending'>('all');
  const [loading, setLoading] = useState(true);

  // Fetch status on load
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/translate?action=status');
      const data = await res.json();
      if (data.languages) {
        // Merge API data with native names from ALL_LANGS
        const merged = data.languages.map((l: LangInfo) => {
          const def = ALL_LANGS.find(a => a.code === l.code);
          return { ...l, native: def?.native || l.name };
        });
        setLanguages(merged);
      }
    } catch {
      // Fallback: mark all as pending
      setLanguages(ALL_LANGS.map(l => ({ ...l, status: 'pending' as const, keys: 0, total: 212 })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const toggleLang = (code: string) => {
    if (job.status === 'running') return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const selectAllPending = () => {
    if (job.status === 'running') return;
    const pending = languages.filter(l => l.status === 'pending').map(l => l.code);
    setSelected(new Set(pending));
  };

  const clearSelection = () => {
    if (job.status === 'running') return;
    setSelected(new Set());
  };

  const startTranslation = async () => {
    if (selected.size === 0 || job.status === 'running') return;
    const langs = Array.from(selected);

    setJob({ langs, status: 'running', log: [`Starting translation for ${langs.length} languages...`], startedAt: Date.now() });

    setLanguages(prev => prev.map(l =>
      langs.includes(l.code) ? { ...l, status: 'translating' as const } : l
    ));

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ langs }),
      });

      const data = await res.json();

      if (data.success) {
        setJob(prev => ({
          ...prev,
          status: 'done',
          log: [...prev.log, ...data.log, `Completed ${data.translated?.length || 0} languages`],
        }));
        setLanguages(prev => prev.map(l =>
          data.translated?.includes(l.code)
            ? { ...l, status: 'live' as const, keys: l.total }
            : data.failed?.includes(l.code)
            ? { ...l, status: 'error' as const }
            : l
        ));
        setSelected(new Set());
      } else {
        setJob(prev => ({
          ...prev,
          status: 'error',
          log: [...prev.log, `Error: ${data.error}`],
        }));
        setLanguages(prev => prev.map(l =>
          langs.includes(l.code) ? { ...l, status: 'pending' as const } : l
        ));
      }
    } catch (err) {
      setJob(prev => ({
        ...prev,
        status: 'error',
        log: [...prev.log, `Network error: ${err}`],
      }));
    }
  };

  const filtered = languages.filter(l => {
    if (filter === 'live') return l.status === 'live';
    if (filter === 'pending') return l.status === 'pending';
    return true;
  });

  const liveCount = languages.filter(l => l.status === 'live').length;
  const pendingCount = languages.filter(l => l.status === 'pending').length;
  const totalKeys = languages[0]?.total || 212;

  return (
    <div className="lang-page">
      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <Image src="/logo.jpg" alt="Saubh" width={40} height={40} style={{ borderRadius: 10 }} />
            <span>Saubh<span className="dot">.</span>Tech</span>
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/language" style={{ color: 'var(--green-light)' }}>
              <i className="fas fa-language"></i> Languages
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="lang-hero">
        <div className="container">
          <div className="lang-hero-content">
            <span className="section-tag">
              <i className="fas fa-globe"></i> Translation Engine
            </span>
            <h1 className="section-title">
              Translate Saubh<span className="gradient-text">.Tech</span> into 37 Languages
            </h1>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Select languages and trigger translations powered by IndicTrans2 &amp; NLLB.
              Auto-generates TypeScript files, builds, and deploys to production.
            </p>
          </div>

          {/* Stats */}
          <div className="lang-stats">
            <div className="lang-stat">
              <span className="lang-stat-num" style={{ color: 'var(--green-light)' }}>{liveCount + 1}</span>
              <span className="lang-stat-label">Live</span>
            </div>
            <div className="lang-stat">
              <span className="lang-stat-num" style={{ color: 'var(--amber)' }}>{pendingCount}</span>
              <span className="lang-stat-label">Pending</span>
            </div>
            <div className="lang-stat">
              <span className="lang-stat-num" style={{ color: 'var(--coral)' }}>{totalKeys}</span>
              <span className="lang-stat-label">Keys</span>
            </div>
            <div className="lang-stat">
              <span className="lang-stat-num" style={{ color: 'var(--text-light)' }}>{selected.size}</span>
              <span className="lang-stat-label">Selected</span>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="lang-controls section-pad" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="lang-filter-bar">
            <div className="lang-filters">
              {(['all', 'live', 'pending'] as const).map(f => (
                <button
                  key={f}
                  className={`lang-filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? `All (${languages.length})` :
                   f === 'live' ? `Live (${liveCount})` :
                   `Pending (${pendingCount})`}
                </button>
              ))}
            </div>
            <div className="lang-actions">
              <button className="btn btn-ghost" onClick={selectAllPending} disabled={job.status === 'running'}>
                <i className="fas fa-check-double"></i> Select Pending
              </button>
              <button className="btn btn-ghost" onClick={clearSelection} disabled={job.status === 'running'}>
                <i className="fas fa-times"></i> Clear
              </button>
              <button
                className={`btn btn-primary ${selected.size === 0 || job.status === 'running' ? 'disabled' : ''}`}
                onClick={startTranslation}
                disabled={selected.size === 0 || job.status === 'running'}
              >
                {job.status === 'running' ? (
                  <><i className="fas fa-spinner fa-spin"></i> Translating...</>
                ) : (
                  <><i className="fas fa-rocket"></i> Translate {selected.size > 0 ? `(${selected.size})` : ''}</>
                )}
              </button>
            </div>
          </div>

          {/* Language Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--green-light)' }}></i>
              <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>Loading translation status...</p>
            </div>
          ) : (
            <div className="lang-grid">
              {/* English (always first) */}
              <div className="lang-card lang-card-live" style={{ opacity: 0.6, cursor: 'default' }}>
                <div className="lang-card-top">
                  <span className="lang-card-native">English</span>
                  <span className="lang-card-badge live">Source</span>
                </div>
                <div className="lang-card-code">en</div>
                <div className="lang-card-name">English</div>
                <div className="lang-card-bar"><div className="lang-card-bar-fill" style={{ width: '100%' }}></div></div>
                <div className="lang-card-meta">{totalKeys}/{totalKeys} keys • Direct</div>
              </div>

              {filtered.map(lang => {
                const isSelected = selected.has(lang.code);
                const pct = lang.total > 0 ? Math.round((lang.keys / lang.total) * 100) : 0;
                return (
                  <div
                    key={lang.code}
                    className={`lang-card lang-card-${lang.status} ${isSelected ? 'selected' : ''}`}
                    onClick={() => lang.status !== 'live' && toggleLang(lang.code)}
                    style={{ cursor: lang.status === 'live' ? 'default' : 'pointer' }}
                  >
                    {isSelected && (
                      <div className="lang-card-check"><i className="fas fa-check"></i></div>
                    )}
                    <div className="lang-card-top">
                      <span className="lang-card-native">{lang.native}</span>
                      <span className={`lang-card-badge ${lang.status}`}>
                        {lang.status === 'live' ? 'Live' :
                         lang.status === 'translating' ? 'Working...' :
                         lang.status === 'done' ? 'Done' :
                         lang.status === 'error' ? 'Error' : 'Pending'}
                      </span>
                    </div>
                    <div className="lang-card-code">{lang.code}</div>
                    <div className="lang-card-name">{lang.name}</div>
                    <div className="lang-card-bar">
                      <div
                        className={`lang-card-bar-fill ${lang.status === 'translating' ? 'animating' : ''}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="lang-card-meta">
                      {lang.keys}/{lang.total} keys • {lang.engine === 'indictrans2' ? 'IndicTrans2' : 'NLLB'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Log Panel */}
          {job.log.length > 0 && (
            <div className="lang-log">
              <div className="lang-log-head">
                <span>
                  <i className={`fas ${job.status === 'running' ? 'fa-spinner fa-spin' : job.status === 'done' ? 'fa-check-circle' : job.status === 'error' ? 'fa-exclamation-circle' : 'fa-terminal'}`}
                     style={{ color: job.status === 'done' ? 'var(--green-light)' : job.status === 'error' ? 'var(--coral)' : 'var(--amber)' }}></i>
                  {' '}Translation Log
                </span>
                {job.startedAt && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>
                    Started {new Date(job.startedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="lang-log-body">
                {job.log.map((line, i) => (
                  <div key={i} className="lang-log-line">{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
