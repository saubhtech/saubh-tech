'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

/* ─── Table Configurations ──────────────────────────────────────────── */
const TABLE_CONFIG: Record<string, {
  label: string; singular: string; idField: string;
  columns: { key: string; label: string; editable?: boolean; type?: string }[];
  endpoint: string;
}> = {
  countries: {
    label: 'Countries', singular: 'Country', idField: 'countryCode', endpoint: '/api/master/countries',
    columns: [
      { key: 'countryCode', label: 'Code', type: 'char2' },
      { key: 'country', label: 'Country', editable: true },
      { key: 'iso3', label: 'ISO3', editable: true, type: 'char3' },
      { key: 'isd', label: 'ISD', editable: true },
      { key: 'flag', label: 'Flag', editable: true },
    ],
  },
  states: {
    label: 'States', singular: 'State', idField: 'stateid', endpoint: '/api/master/states',
    columns: [
      { key: 'stateid', label: 'ID' },
      { key: 'state', label: 'State', editable: true },
      { key: 'stateCode', label: 'Code', editable: true, type: 'char2' },
      { key: 'countryCode', label: 'Country', editable: true, type: 'char2' },
      { key: 'region', label: 'Region', editable: true },
    ],
  },
  districts: {
    label: 'Districts', singular: 'District', idField: 'districtid', endpoint: '/api/master/districts',
    columns: [
      { key: 'districtid', label: 'ID' },
      { key: 'district', label: 'District', editable: true },
      { key: 'stateid', label: 'State ID', editable: true, type: 'int' },
      { key: 'countryCode', label: 'Country', editable: true, type: 'char2' },
    ],
  },
  postals: {
    label: 'Postals', singular: 'Postal', idField: 'postid', endpoint: '/api/master/postals',
    columns: [
      { key: 'postid', label: 'ID' },
      { key: 'pincode', label: 'Pincode', editable: true },
      { key: 'postoffice', label: 'Post Office', editable: true },
      { key: 'districtid', label: 'District ID', editable: true, type: 'int' },
      { key: 'stateid', label: 'State ID', editable: true, type: 'int' },
      { key: 'countryCode', label: 'Country', editable: true, type: 'char2' },
    ],
  },
  places: {
    label: 'Places', singular: 'Place', idField: 'placeid', endpoint: '/api/master/places',
    columns: [
      { key: 'placeid', label: 'ID' },
      { key: 'place', label: 'Place', editable: true },
      { key: 'pincode', label: 'Pincode', editable: true },
      { key: 'districtid', label: 'District ID', editable: true, type: 'int' },
      { key: 'stateid', label: 'State ID', editable: true, type: 'int' },
      { key: 'countryCode', label: 'Country', editable: true, type: 'char2' },
    ],
  },
  localities: {
    label: 'Localities', singular: 'Locality', idField: 'localityid', endpoint: '/api/master/localities',
    columns: [
      { key: 'localityid', label: 'ID' },
      { key: 'locality', label: 'Locality', editable: true },
      { key: 'placeid', label: 'Place IDs', editable: true, type: 'intarray' },
      { key: 'localAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  areas: {
    label: 'Areas', singular: 'Area', idField: 'areaid', endpoint: '/api/master/areas',
    columns: [
      { key: 'areaid', label: 'ID' },
      { key: 'area', label: 'Area', editable: true },
      { key: 'localityid', label: 'Locality IDs', editable: true, type: 'intarray' },
      { key: 'areaAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  divisions: {
    label: 'Divisions', singular: 'Division', idField: 'divisionid', endpoint: '/api/master/divisions',
    columns: [
      { key: 'divisionid', label: 'ID' },
      { key: 'division', label: 'Division', editable: true },
      { key: 'areaid', label: 'Area IDs', editable: true, type: 'intarray' },
      { key: 'divisionAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  regions: {
    label: 'Regions', singular: 'Region', idField: 'regionid', endpoint: '/api/master/regions',
    columns: [
      { key: 'regionid', label: 'ID' },
      { key: 'region', label: 'Region', editable: true },
      { key: 'divisionid', label: 'Division IDs', editable: true, type: 'intarray' },
      { key: 'regionAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  zones: {
    label: 'Zones', singular: 'Zone', idField: 'zoneid', endpoint: '/api/master/zones',
    columns: [
      { key: 'zoneid', label: 'ID' },
      { key: 'zoneCode', label: 'Code', editable: true, type: 'char2' },
      { key: 'zone', label: 'Zone', editable: true },
      { key: 'regionid', label: 'Region IDs', editable: true, type: 'intarray' },
      { key: 'zoneAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  sectors: {
    label: 'Sectors', singular: 'Sector', idField: 'sectorid', endpoint: '/api/master/sectors',
    columns: [
      { key: 'sectorid', label: 'ID' },
      { key: 'sector', label: 'Sector', editable: true },
    ],
  },
  fields: {
    label: 'Fields', singular: 'Field', idField: 'fieldid', endpoint: '/api/master/fields',
    columns: [
      { key: 'fieldid', label: 'ID' },
      { key: 'field', label: 'Field', editable: true },
      { key: 'sectorid', label: 'Sector ID', editable: true, type: 'int' },
    ],
  },
};

const PAGE_SIZES = [10, 20, 50, 100];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function MasterTablePage({ params }: { params: Promise<{ locale: string; table: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ locale: string; table: string } | null>(null);
  const [allRows, setAllRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Pagination & search
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { params.then(setResolvedParams); }, [params]);

  const config = resolvedParams ? TABLE_CONFIG[resolvedParams.table] : null;

  const fetchRows = useCallback(async () => {
    if (!config) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(config.endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAllRows(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally { setLoading(false); }
  }, [config]);

  useEffect(() => { if (config) fetchRows(); }, [config, fetchRows]);

  // Filter rows by search
  const filteredRows = useMemo(() => {
    if (!search.trim() || !config) return allRows;
    const q = search.toLowerCase();
    return allRows.filter(row =>
      config.columns.some(col => {
        const val = row[col.key];
        if (val == null) return false;
        return String(val).toLowerCase().includes(q);
      })
    );
  }, [allRows, search, config]);

  // Paginated rows
  const totalFiltered = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage, pageSize]);

  // Reset page when search or pageSize changes
  useEffect(() => { setCurrentPage(1); }, [search, pageSize]);

  if (!resolvedParams) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '40px' }}>Loading...</div>;
  if (!config) return <div style={{ color: '#ef4444', padding: '40px' }}>Unknown table: {resolvedParams.table}</div>;

  const handleNew = () => {
    const empty: Record<string, string> = {};
    config.columns.forEach(c => { if (c.editable || c.key === config.idField) empty[c.key] = ''; });
    setFormData(empty); setEditingId(null); setShowForm(true);
  };

  const handleEdit = (row: Record<string, unknown>) => {
    const data: Record<string, string> = {};
    config.columns.forEach(c => {
      const val = row[c.key];
      data[c.key] = Array.isArray(val) ? val.join(', ') : String(val ?? '');
    });
    setFormData(data); setEditingId(String(row[config.idField])); setShowForm(true);
  };

  const handleDelete = async (row: Record<string, unknown>) => {
    if (!confirm(`Delete ${config.singular} "${row[config.idField]}"?`)) return;
    try {
      const res = await fetch(`${config.endpoint}/${row[config.idField]}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchRows();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Delete failed'); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      config.columns.forEach(col => {
        if (!editingId && !col.editable && col.key !== config.idField) return;
        if (editingId && !col.editable) return;
        const val = formData[col.key] ?? '';
        if (col.type === 'int' || col.type === 'bigint') body[col.key] = val ? parseInt(val) : undefined;
        else if (col.type === 'intarray') body[col.key] = val ? val.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)) : [];
        else body[col.key] = val || undefined;
      });

      const url = editingId ? `${config.endpoint}/${editingId}` : config.endpoint;
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setShowForm(false); fetchRows();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const globalIndex = (localIdx: number) => (safePage - 1) * pageSize + localIdx + 1;

  // Pagination range
  const getPageRange = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <a href={`/${resolvedParams.locale}/master`} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}>
            &#8592; Master Data
          </a>
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Syne", sans-serif', color: '#fff', margin: '4px 0 0' }}>
            {config.label}
          </h1>
        </div>
        <button onClick={handleNew} style={btnPrimary}>+ Add New</button>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      {/* Form */}
      {showForm && (
        <div style={formContainer}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', margin: '0 0 16px', fontFamily: '"Syne", sans-serif' }}>
            {editingId ? 'Edit Record' : 'New Record'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {config.columns.map(col => {
              if (editingId && !col.editable) return null;
              if (!editingId && !col.editable && col.key !== config.idField) return null;
              return (
                <div key={col.key}>
                  <label style={labelStyle}>{col.label}</label>
                  <input value={formData[col.key] || ''} onChange={e => setFormData(p => ({ ...p, [col.key]: e.target.value }))}
                    placeholder={col.type === 'intarray' ? '1, 2, 3' : col.label} style={inputStyle} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={handleSave} disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
            <button onClick={() => setShowForm(false)} style={btnGhost}>Cancel</button>
          </div>
        </div>
      )}

      {/* Toolbar: Search + Page Size */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>View</span>
          {PAGE_SIZES.map(s => (
            <button key={s} onClick={() => setPageSize(s)}
              style={{ ...pageSizeBtn, ...(pageSize === s ? pageSizeActive : {}) }}>
              {s}
            </button>
          ))}
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>records</span>
        </div>
        <div style={{ position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            style={{ ...inputStyle, width: '220px', paddingLeft: '32px' }} />
          <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '50px' }}>#</th>
                {config.columns.map(col => (
                  <th key={col.key} style={thStyle}>{col.label}</th>
                ))}
                <th style={{ ...thStyle, width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.columns.length + 2} style={{ ...tdStyle, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading...</td></tr>
              ) : paginatedRows.length === 0 ? (
                <tr><td colSpan={config.columns.length + 2} style={{ ...tdStyle, textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>
                  {search ? 'No matching records.' : 'No records yet. Click "+ Add New" to create one.'}
                </td></tr>
              ) : (
                paginatedRows.map((row, i) => (
                  <tr key={String(row[config.idField] ?? i)} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>{globalIndex(i)}</td>
                    {config.columns.map(col => (
                      <td key={col.key} style={{ ...tdStyle, ...(col.key === 'flag' ? { fontSize: '20px' } : {}) }}>
                        {Array.isArray(row[col.key]) ? (row[col.key] as number[]).join(', ') : String(row[col.key] ?? '')}
                      </td>
                    ))}
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <button onClick={() => handleEdit(row)} style={btnSmall}>Edit</button>
                      <button onClick={() => handleDelete(row)} style={{ ...btnSmall, color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer: Record count + Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          {totalFiltered === allRows.length
            ? `${allRows.length} record${allRows.length !== 1 ? 's' : ''}`
            : `${totalFiltered} of ${allRows.length} records (filtered)`}
        </div>
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage <= 1} style={pageBtn}>&#8249;</button>
            {getPageRange().map((p, i) =>
              typeof p === 'string'
                ? <span key={`e${i}`} style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', padding: '0 4px' }}>&#8230;</span>
                : <button key={p} onClick={() => setCurrentPage(p)} style={{ ...pageBtn, ...(p === safePage ? pageActive : {}) }}>{p}</button>
            )}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} style={pageBtn}>&#8250;</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────── */
const btnPrimary: React.CSSProperties = {
  padding: '8px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
};
const btnGhost: React.CSSProperties = {
  padding: '8px 20px', borderRadius: '10px', background: 'transparent',
  color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500,
  border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
};
const btnSmall: React.CSSProperties = {
  padding: '4px 12px', borderRadius: '8px', background: 'transparent',
  color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500,
  border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', marginRight: '6px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
  letterSpacing: '0.05em', display: 'block', marginBottom: '6px',
};
const thStyle: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600,
  color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em',
  background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)',
};
const tdStyle: React.CSSProperties = {
  padding: '10px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.7)',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};
const errorBox: React.CSSProperties = {
  padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', marginBottom: '16px',
};
const formContainer: React.CSSProperties = {
  padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px',
};
const pageSizeBtn: React.CSSProperties = {
  padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)',
  fontSize: '12px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s',
};
const pageSizeActive: React.CSSProperties = {
  background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.3)', color: '#a5b4fc',
};
const pageBtn: React.CSSProperties = {
  padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)',
  fontSize: '12px', cursor: 'pointer', minWidth: '30px', textAlign: 'center',
};
const pageActive: React.CSSProperties = {
  background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc', fontWeight: 600,
};
