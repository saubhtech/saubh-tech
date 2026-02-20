'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const TABLE_CONFIG: Record<string, {
  label: string; singular: string; idField: string;
  columns: { key: string; label: string; editable?: boolean; type?: string }[];
  endpoint: string;
  parentFilter?: { key: string; parentEndpoint: string; parentIdField: string; parentLabelField: string; parentFlagField?: string };
}> = {
  countries: {
    label: 'Countries', singular: 'Country', idField: 'countryCode', endpoint: '/api/master/countries',
    columns: [
      { key: 'countryCode', label: 'Code', type: 'char2' },
      { key: 'flag', label: 'Flag', editable: true },
      { key: 'country', label: 'Country', editable: true },
      { key: 'iso3', label: 'ISO3', editable: true, type: 'char3' },
      { key: 'isd', label: 'ISD', editable: true },
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
    parentFilter: {
      key: 'countryCode',
      parentEndpoint: '/api/master/countries',
      parentIdField: 'countryCode',
      parentLabelField: 'country',
      parentFlagField: 'flag',
    },
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

/* ─── Flag image helper (CDN-based, works on all platforms) ─────────── */
function FlagImg({ code, size = 24 }: { code: string; size?: number }) {
  const lc = code?.toLowerCase();
  if (!lc || lc.length !== 2) return <span style={{ opacity: 0.3 }}>—</span>;
  const w = size;
  const h = Math.round(size * 0.75);
  return (
    <img
      src={`https://flagcdn.com/${w}x${h}/${lc}.png`}
      srcSet={`https://flagcdn.com/${w * 2}x${h * 2}/${lc}.png 2x`}
      width={w}
      height={h}
      alt={code}
      style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '2px', objectFit: 'cover' }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

/* ─── Custom searchable dropdown with flags ─────────────────────────── */
function CountrySelect({ countries, value, onChange }: {
  countries: { code: string; name: string; flag: string }[];
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = countries.find(c => c.code === value);
  const filtered = q.trim()
    ? countries.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.code.toLowerCase().includes(q.toLowerCase()))
    : countries;

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: '280px' }}>
      {/* Trigger */}
      <button
        onClick={() => { setOpen(!open); setQ(''); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
          padding: '8px 14px', borderRadius: '10px',
          background: value ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)',
          border: value ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.12)',
          color: '#fff', fontSize: '13px', cursor: 'pointer', textAlign: 'left',
          transition: 'all 0.15s',
        }}
      >
        {selected ? (
          <>
            <FlagImg code={selected.code} size={24} />
            <span style={{ fontWeight: 500 }}>{selected.name}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginLeft: '2px' }}>({selected.code})</span>
          </>
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>All Countries</span>
        )}
        <svg style={{ marginLeft: 'auto', opacity: 0.4, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
          borderRadius: '12px', overflow: 'hidden',
          background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          maxHeight: '320px', display: 'flex', flexDirection: 'column',
        }}>
          {/* Search input */}
          <div style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search country..."
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {/* Options */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {/* All Countries option */}
            <button
              onClick={() => { onChange(''); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '9px 14px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: !value ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: '#fff', fontSize: '13px', transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (value) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (value) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '16px', lineHeight: '1' }}>🌐</span>
              <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>All Countries</span>
            </button>
            {filtered.map(c => (
              <button
                key={c.code}
                onClick={() => { onChange(c.code); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '9px 14px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: c.code === value ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: '#fff', fontSize: '13px', transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (c.code !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (c.code !== value) e.currentTarget.style.background = 'transparent'; }}
              >
                <FlagImg code={c.code} size={20} />
                <span style={{ fontWeight: 500 }}>{c.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>{c.code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Cell renderer (handles flag column specially) ──────────────────── */
function CellValue({ row, col, tableName }: { row: Record<string, unknown>; col: { key: string; label: string }; tableName: string }) {
  const val = row[col.key];
  // Flag column in countries table → render as image using countryCode
  if (col.key === 'flag' && col.label === 'Flag' && tableName === 'countries') {
    const code = String(row['countryCode'] ?? '');
    return <FlagImg code={code} size={28} />;
  }
  // Country code column in states/districts → show flag + code
  if (col.key === 'countryCode' && tableName !== 'countries') {
    const code = String(val ?? '');
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <FlagImg code={code} size={18} />
        <span>{code}</span>
      </span>
    );
  }
  if (Array.isArray(val)) return <>{(val as number[]).join(', ')}</>;
  return <>{String(val ?? '')}</>;
}

/* ─── Main Component ────────────────────────────────────────────────── */
export default function MasterTablePage({ params }: { params: Promise<{ locale: string; table: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ locale: string; table: string } | null>(null);
  const [allRows, setAllRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Parent filter state (country selector for states page)
  const [parentItems, setParentItems] = useState<Record<string, unknown>[]>([]);
  const [parentFilter, setParentFilter] = useState('');

  useEffect(() => { params.then(setResolvedParams); }, [params]);

  const config = resolvedParams ? TABLE_CONFIG[resolvedParams.table] : null;
  const tableName = resolvedParams?.table ?? '';

  // Fetch parent items (countries) when parentFilter config exists
  useEffect(() => {
    if (!config?.parentFilter) { setParentItems([]); return; }
    const pf = config.parentFilter;
    fetch(pf.parentEndpoint)
      .then(r => r.json())
      .then(data => setParentItems(Array.isArray(data) ? data : []))
      .catch(() => setParentItems([]));
  }, [config]);

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

  // Build parent lookup for display
  const parentCountries = useMemo(() => {
    if (!config?.parentFilter) return [];
    const pf = config.parentFilter;
    return parentItems
      .map(item => ({
        code: String(item[pf.parentIdField] ?? ''),
        name: String(item[pf.parentLabelField] ?? ''),
        flag: pf.parentFlagField ? String(item[pf.parentFlagField] ?? '') : '',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [parentItems, config]);

  // Filtered rows: parent filter → then search
  const filteredRows = useMemo(() => {
    let rows = allRows;
    // Apply parent filter (country)
    if (parentFilter && config?.parentFilter) {
      rows = rows.filter(row => String(row[config.parentFilter!.key]) === parentFilter);
    }
    // Apply text search
    if (search.trim() && config) {
      const q = search.toLowerCase();
      rows = rows.filter(row =>
        config.columns.some(col => {
          const val = row[col.key];
          return val != null && String(val).toLowerCase().includes(q);
        })
      );
    }
    return rows;
  }, [allRows, parentFilter, search, config]);

  const totalFiltered = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage, pageSize]);

  useEffect(() => { setCurrentPage(1); }, [search, pageSize, parentFilter]);

  if (!resolvedParams) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '40px' }}>Loading...</div>;
  if (!config) return <div style={{ color: '#ef4444', padding: '40px' }}>Unknown table: {resolvedParams.table}</div>;

  const handleNew = () => {
    const empty: Record<string, string> = {};
    config.columns.forEach(c => { if (c.editable || c.key === config.idField) empty[c.key] = ''; });
    if (parentFilter && config.parentFilter) empty[config.parentFilter.key] = parentFilter;
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

  const startRecord = (safePage - 1) * pageSize + 1;
  const endRecord = Math.min(safePage * pageSize, totalFiltered);

  // Find selected country info for subtitle
  const selectedCountryInfo = parentFilter ? parentCountries.find(c => c.code === parentFilter) : null;

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
            {selectedCountryInfo && (
              <span style={{ fontSize: '16px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginLeft: '12px', verticalAlign: 'middle' }}>
                <FlagImg code={selectedCountryInfo.code} size={20} /> {selectedCountryInfo.name}
              </span>
            )}
          </h1>
        </div>
        <button onClick={handleNew} style={btnPrimary}>+ Add New</button>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      {/* Country Filter Bar (only for tables with parentFilter) */}
      {config.parentFilter && parentCountries.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '16px', padding: '12px 16px',
          borderRadius: '12px', background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            Filter by Country
          </span>
          <CountrySelect
            countries={parentCountries}
            value={parentFilter}
            onChange={setParentFilter}
          />
          {parentFilter && (
            <span style={{ fontSize: '12px', color: 'rgba(99,102,241,0.7)', whiteSpace: 'nowrap' }}>
              {filteredRows.length} state{filteredRows.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

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

      {/* Toolbar: Page Size dropdown + Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Show</span>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            style={selectStyle}
          >
            {PAGE_SIZES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>records</span>
        </div>
        <div style={{ position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            style={{ ...inputStyle, width: '240px', paddingLeft: '34px' }} />
          <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
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
                <th style={{ ...thStyle, width: '56px', textAlign: 'center' }}>#</th>
                {config.columns.map((col, ci) => (
                  <th key={`${col.key}-${ci}`} style={{ ...thStyle, ...(col.key === 'flag' && col.label === 'Flag' ? { width: '60px', textAlign: 'center' } : {}) }}>{col.label}</th>
                ))}
                <th style={{ ...thStyle, width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.columns.length + 2} style={{ ...tdStyle, textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px 16px' }}>Loading...</td></tr>
              ) : paginatedRows.length === 0 ? (
                <tr><td colSpan={config.columns.length + 2} style={{ ...tdStyle, textAlign: 'center', color: 'rgba(255,255,255,0.25)', padding: '40px 16px' }}>
                  {search || parentFilter ? 'No matching records.' : 'No records yet. Click "+ Add New" to create one.'}
                </td></tr>
              ) : (
                paginatedRows.map((row, i) => (
                  <tr key={String(row[config.idField] ?? i)} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={snStyle}>{globalIndex(i)}</td>
                    {config.columns.map((col, ci) => (
                      <td key={`${col.key}-${ci}`} style={{
                        ...tdStyle,
                        ...(col.key === 'flag' && col.label === 'Flag' ? { textAlign: 'center', padding: '6px 16px' } : {}),
                      }}>
                        <CellValue row={row} col={col} tableName={tableName} />
                      </td>
                    ))}
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', textAlign: 'center' }}>
                      <button onClick={() => handleEdit(row)} style={btnSmall}>Edit</button>
                      <button onClick={() => handleDelete(row)} style={{ ...btnSmall, color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}>Del</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer: Record info + Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          {totalFiltered > 0
            ? `Showing ${startRecord}\u2013${endRecord} of ${totalFiltered}${totalFiltered !== allRows.length ? ` (filtered from ${allRows.length})` : ''}`
            : `${allRows.length} total records`}
        </div>
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
              style={{ ...pageBtn, ...(safePage <= 1 ? pageBtnDisabled : {}) }}>&#8249; Prev</button>
            {getPageRange().map((p, i) =>
              typeof p === 'string'
                ? <span key={`e${i}`} style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', padding: '0 2px' }}>&#8230;</span>
                : <button key={p} onClick={() => setCurrentPage(p)} style={{ ...pageBtn, ...(p === safePage ? pageActive : {}) }}>{p}</button>
            )}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
              style={{ ...pageBtn, ...(safePage >= totalPages ? pageBtnDisabled : {}) }}>Next &#8250;</button>
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
  border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', marginRight: '4px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
};
const selectStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '13px', outline: 'none',
  cursor: 'pointer',
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
const snStyle: React.CSSProperties = {
  padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)',
  borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
};
const errorBox: React.CSSProperties = {
  padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', marginBottom: '16px',
};
const formContainer: React.CSSProperties = {
  padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px',
};
const pageBtn: React.CSSProperties = {
  padding: '5px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
  fontSize: '12px', cursor: 'pointer', minWidth: '32px', textAlign: 'center', fontWeight: 500,
};
const pageActive: React.CSSProperties = {
  background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc', fontWeight: 600,
};
const pageBtnDisabled: React.CSSProperties = {
  opacity: 0.3, cursor: 'default',
};
