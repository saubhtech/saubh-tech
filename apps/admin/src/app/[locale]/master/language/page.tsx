import { getSessionWithRefresh } from '@/lib/auth';
import { redirect } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Language {
  langid: number;
  language: string;
  locale: string;
  isActive: boolean;
  isRtl: boolean;
  sortOrder: number;
}

interface LanguageListResponse {
  data: Language[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchLanguages(token: string, page = 1): Promise<LanguageListResponse> {
  const res = await fetch(`${API}/master/languages?page=${page}&limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default async function LanguageListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSessionWithRefresh();
  if (!session) redirect(`/${locale}/login`);

  let result: LanguageListResponse;
  try {
    result = await fetchLanguages(session.accessToken);
  } catch {
    return <ErrorState locale={locale} />;
  }

  const { data: languages } = result;

  return (
    <div>
      {/* Header */}
      <div style={headerRow}>
        <div>
          <h1 style={pageTitle}>Languages</h1>
          <p style={pageSubtitle}>
            {result.total} languages configured &middot; Master Data
          </p>
        </div>
        <a href={`/${locale}/master/language/create`} style={createBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Language
        </a>
      </div>

      {/* Table */}
      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['ID', 'Language', 'Locale', 'RTL', 'Order', 'Active', 'Actions'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {languages.map((lang) => (
              <tr key={lang.langid} style={trStyle}>
                <td style={tdStyle}>
                  <span style={idBadge}>{lang.langid}</span>
                </td>
                <td style={{ ...tdStyle, fontWeight: 600, color: '#f1f5f9' }}>
                  {lang.language}
                </td>
                <td style={tdStyle}>
                  <span style={codeBadge}>{lang.locale}</span>
                </td>
                <td style={tdStyle}>
                  {lang.isRtl ? (
                    <span style={{ ...statusBadge, background: 'rgba(234,179,8,0.12)', color: '#facc15' }}>RTL</span>
                  ) : (
                    <span style={{ ...statusBadge, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}>LTR</span>
                  )}
                </td>
                <td style={tdStyle}>{lang.sortOrder}</td>
                <td style={tdStyle}>
                  {lang.isActive ? (
                    <span style={{ ...statusBadge, background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>Active</span>
                  ) : (
                    <span style={{ ...statusBadge, background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>Inactive</span>
                  )}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href={`/${locale}/master/language/${lang.langid}/edit`} style={actionBtn}>
                      Edit
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Back link */}
      <div style={{ marginTop: '24px' }}>
        <a href={`/${locale}/master`} style={backLink}>
          &larr; Back to Master Data
        </a>
      </div>
    </div>
  );
}

function ErrorState({ locale }: { locale: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <p style={{ color: '#ef4444', fontSize: '16px', marginBottom: '16px' }}>
        Failed to load languages. Is the API running?
      </p>
      <a href={`/${locale}/master`} style={backLink}>&larr; Back to Master Data</a>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────

const headerRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px',
};

const pageTitle: React.CSSProperties = {
  fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '28px',
  letterSpacing: '-0.03em', color: '#fff', margin: 0,
};

const pageSubtitle: React.CSSProperties = {
  fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px',
};

const createBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  padding: '10px 20px', borderRadius: '12px',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
  border: '1px solid rgba(255,255,255,0.1)',
};

const tableWrapper: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
};

const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: '14px',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  background: 'rgba(255,255,255,0.02)',
};

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px', color: 'rgba(255,255,255,0.6)',
};

const idBadge: React.CSSProperties = {
  display: 'inline-block', padding: '2px 8px', borderRadius: '6px',
  background: 'rgba(255,255,255,0.06)', fontSize: '12px', fontFamily: 'monospace',
};

const codeBadge: React.CSSProperties = {
  display: 'inline-block', padding: '3px 10px', borderRadius: '8px',
  background: 'rgba(99,102,241,0.12)', color: '#818cf8',
  fontSize: '13px', fontWeight: 600, fontFamily: 'monospace',
};

const statusBadge: React.CSSProperties = {
  display: 'inline-block', padding: '3px 10px', borderRadius: '8px',
  fontSize: '12px', fontWeight: 600,
};

const actionBtn: React.CSSProperties = {
  padding: '5px 14px', borderRadius: '8px',
  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
  textDecoration: 'none', fontSize: '13px', fontWeight: 500,
  border: '1px solid rgba(255,255,255,0.08)',
};

const backLink: React.CSSProperties = {
  color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: '14px',
};
