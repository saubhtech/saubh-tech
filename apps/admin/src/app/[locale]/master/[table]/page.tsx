'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   TABLE CONFIGURATION
   ═══════════════════════════════════════════════════════════════════════ */

type FieldDef = {
  name: string; label: string; editable?: boolean;
  type?: 'char2' | 'char3' | 'varchar' | 'int' | 'bigint' | 'intarray' | 'fk' | 'fk_multi';
  required?: boolean; hideInForm?: boolean;
  ref?: string; refPk?: string; refLabel?: string;
  dependsOn?: string; horizontalGroup?: string;
  pincodeValidation?: boolean;
};

type FilterDef = {
  key: string; label: string; ref: string; refPk: string; refLabel: string;
  dependsOn?: string; isCountry?: boolean; isText?: boolean;
};

type TableDef = {
  key: string; label: string; singular: string; idField: string;
  autoPk: boolean; endpoint: string; icon: string;
  fields: FieldDef[];
  filters?: FilterDef[];
};

const TABLES: Record<string, TableDef> = {
  countries: {
    key: 'countries', label: 'Countries', singular: 'Country', idField: 'countryCode',
    autoPk: false, endpoint: '/api/master/countries', icon: '🌍',
    fields: [
      { name: 'countryCode', label: 'Country Code', type: 'char2', required: true },
      { name: 'flag', label: 'Flag', editable: true, type: 'varchar' },
      { name: 'country', label: 'Country', editable: true, type: 'varchar', required: true },
      { name: 'iso3', label: 'ISO3', editable: true, type: 'char3' },
      { name: 'isd', label: 'ISD', editable: true, type: 'varchar' },
    ],
  },
  states: {
    key: 'states', label: 'States', singular: 'State', idField: 'stateid',
    autoPk: true, endpoint: '/api/master/states', icon: '🗺️',
    fields: [
      { name: 'stateid', label: 'ID', hideInForm: true },
      { name: 'countryCode', label: 'Country', type: 'fk', ref: 'countries', refPk: 'countryCode', refLabel: 'country', required: true, editable: true },
      { name: 'state', label: 'State', type: 'varchar', required: true, editable: true },
      { name: 'stateCode', label: 'State Code', type: 'char2', editable: true },
      { name: 'region', label: 'Region', type: 'varchar', editable: true },
    ],
    filters: [
      { key: 'countryCode', label: 'Country', ref: 'countries', refPk: 'countryCode', refLabel: 'country', isCountry: true },
    ],
  },
  districts: {
    key: 'districts', label: 'Districts', singular: 'District', idField: 'districtid',
    autoPk: true, endpoint: '/api/master/districts', icon: '📍',
    fields: [
      { name: 'districtid', label: 'ID', hideInForm: true },
      { name: 'countryCode', label: 'Country', type: 'fk', ref: 'countries', refPk: 'countryCode', refLabel: 'country', required: true, editable: true, horizontalGroup: 'geo' },
      { name: 'stateid', label: 'State', type: 'fk', ref: 'states', refPk: 'stateid', refLabel: 'state', required: true, editable: true, dependsOn: 'countryCode', horizontalGroup: 'geo' },
      { name: 'district', label: 'District', type: 'varchar', required: true, editable: true },
    ],
    filters: [
      { key: 'countryCode', label: 'Country', ref: 'countries', refPk: 'countryCode', refLabel: 'country', isCountry: true },
      { key: 'stateid', label: 'State', ref: 'states', refPk: 'stateid', refLabel: 'state', dependsOn: 'countryCode' },
    ],
  },
  postals: {
    key: 'postals', label: 'Postals', singular: 'Postal', idField: 'postid',
    autoPk: true, endpoint: '/api/master/postals', icon: '📮',
    fields: [
      { name: 'postid', label: 'ID', hideInForm: true },
      { name: 'countryCode', label: 'Country', type: 'fk', ref: 'countries', refPk: 'countryCode', refLabel: 'country', required: true, editable: true, horizontalGroup: 'geo3' },
      { name: 'stateid', label: 'State', type: 'fk', ref: 'states', refPk: 'stateid', refLabel: 'state', required: true, editable: true, dependsOn: 'countryCode', horizontalGroup: 'geo3' },
      { name: 'districtid', label: 'District', type: 'fk', ref: 'districts', refPk: 'districtid', refLabel: 'district', required: true, editable: true, dependsOn: 'stateid', horizontalGroup: 'geo3' },
      { name: 'pincode', label: 'Pincode', type: 'varchar', required: true, editable: true },
      { name: 'postoffice', label: 'Post Office', type: 'varchar', required: true, editable: true },
    ],
    filters: [
      { key: 'countryCode', label: 'Country', ref: 'countries', refPk: 'countryCode', refLabel: 'country', isCountry: true },
      { key: 'stateid', label: 'State', ref: 'states', refPk: 'stateid', refLabel: 'state', dependsOn: 'countryCode' },
      { key: 'districtid', label: 'District', ref: 'districts', refPk: 'districtid', refLabel: 'district', dependsOn: 'stateid' },
    ],
  },
  places: {
    key: 'places', label: 'Places', singular: 'Place', idField: 'placeid',
    autoPk: true, endpoint: '/api/master/places', icon: '🏘️',
    fields: [
      { name: 'placeid', label: 'ID', hideInForm: true },
      { name: 'countryCode', label: 'Country', type: 'fk', ref: 'countries', refPk: 'countryCode', refLabel: 'country', required: true, editable: true, horizontalGroup: 'geo3' },
      { name: 'stateid', label: 'State', type: 'fk', ref: 'states', refPk: 'stateid', refLabel: 'state', required: true, editable: true, dependsOn: 'countryCode', horizontalGroup: 'geo3' },
      { name: 'districtid', label: 'District', type: 'fk', ref: 'districts', refPk: 'districtid', refLabel: 'district', required: true, editable: true, dependsOn: 'stateid', horizontalGroup: 'geo3' },
      { name: 'pincode', label: 'Pincode', type: 'varchar', editable: true, pincodeValidation: true },
      { name: 'place', label: 'Place', type: 'varchar', required: true, editable: true },
    ],
    filters: [
      { key: 'countryCode', label: 'Country', ref: 'countries', refPk: 'countryCode', refLabel: 'country', isCountry: true },
      { key: 'stateid', label: 'State', ref: 'states', refPk: 'stateid', refLabel: 'state', dependsOn: 'countryCode' },
      { key: 'districtid', label: 'District', ref: 'districts', refPk: 'districtid', refLabel: 'district', dependsOn: 'stateid' },
      { key: 'pincode', label: 'Pincode', ref: '', refPk: '', refLabel: '', isText: true },
    ],
  },
  localities: {
    key: 'localities', label: 'Localities', singular: 'Locality', idField: 'localityid',
    autoPk: true, endpoint: '/api/master/localities', icon: '📌',
    fields: [
      { name: 'localityid', label: 'ID', hideInForm: true },
      { name: 'locality', label: 'Locality', type: 'varchar', required: true, editable: true },
      { name: 'placeid', label: 'Places', type: 'intarray', editable: true },
      { name: 'localAgency', label: 'Local Agency', type: 'bigint', editable: true },
    ],
  },
  areas: {
    key: 'areas', label: 'Areas', singular: 'Area', idField: 'areaid',
    autoPk: true, endpoint: '/api/master/areas', icon: '🧭',
    fields: [
      { name: 'areaid', label: 'ID', hideInForm: true },
      { name: 'area', label: 'Area', type: 'varchar', required: true, editable: true },
      { name: 'localityid', label: 'Localities', type: 'intarray', editable: true },
      { name: 'areaAgency', label: 'Area Agency', type: 'bigint', editable: true },
    ],
  },
  divisions: {
    key: 'divisions', label: 'Divisions', singular: 'Division', idField: 'divisionid',
    autoPk: true, endpoint: '/api/master/divisions', icon: '🏢',
    fields: [
      { name: 'divisionid', label: 'ID', hideInForm: true },
      { name: 'division', label: 'Division', type: 'varchar', required: true, editable: true },
      { name: 'areaid', label: 'Areas', type: 'intarray', editable: true },
      { name: 'divisionAgency', label: 'Division Agency', type: 'bigint', editable: true },
    ],
  },
  regions: {
    key: 'regions', label: 'Regions', singular: 'Region', idField: 'regionid',
    autoPk: true, endpoint: '/api/master/regions', icon: '🌐',
    fields: [
      { name: 'regionid', label: 'ID', hideInForm: true },
      { name: 'region', label: 'Region', type: 'varchar', required: true, editable: true },
      { name: 'divisionid', label: 'Divisions', type: 'intarray', editable: true },
      { name: 'regionAgency', label: 'Region Agency', type: 'bigint', editable: true },
    ],
  },
  zones: {
    key: 'zones', label: 'Zones', singular: 'Zone', idField: 'zoneid',
    autoPk: true, endpoint: '/api/master/zones', icon: '🧩',
    fields: [
      { name: 'zoneid', label: 'ID', hideInForm: true },
      { name: 'zoneCode', label: 'Zone Code', type: 'char2', editable: true },
      { name: 'zone', label: 'Zone', type: 'varchar', required: true, editable: true },
      { name: 'regionid', label: 'Regions', type: 'intarray', editable: true },
      { name: 'zoneAgency', label: 'Zone Agency', type: 'bigint', editable: true },
    ],
  },
  sectors: {
    key: 'sectors', label: 'Sectors', singular: 'Sector', idField: 'sectorid',
    autoPk: true, endpoint: '/api/master/sectors', icon: '🏷️',
    fields: [
      { name: 'sectorid', label: 'ID', hideInForm: true },
      { name: 'sector', label: 'Sector', type: 'varchar', required: true, editable: true },
    ],
  },
  fields: {
    key: 'fields', label: 'Fields', singular: 'Field', idField: 'fieldid',
    autoPk: true, endpoint: '/api/master/fields', icon: '🛠️',
    fields: [
      { name: 'fieldid', label: 'ID', hideInForm: true },
      { name: 'sectorid', label: 'Sector', type: 'fk', ref: 'sectors', refPk: 'sectorid', refLabel: 'sector', editable: true, horizontalGroup: 'sf' },
      { name: 'field', label: 'Field', type: 'varchar', required: true, editable: true, horizontalGroup: 'sf' },
    ],
    filters: [
      { key: 'sectorid', label: 'Sector', ref: 'sectors', refPk: 'sectorid', refLabel: 'sector' },
    ],
  },
};

const PAGE_SIZES = [10, 20, 50, 100];

/* ═══════════════════════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

function FlagImg({ code, size = 24 }: { code: string; size?: number }) {
  const lc = code?.toLowerCase();
  if (!lc || lc.length !== 2) return <span style={{ opacity: 0.3 }}>—</span>;
  const w = size; const h = Math.round(size * 0.75);
  return (
    <img src={`https://flagcdn.com/${w}x${h}/${lc}.png`}
      srcSet={`https://flagcdn.com/${w * 2}x${h * 2}/${lc}.png 2x`}
      width={w} height={h} alt={code}
      style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '2px', objectFit: 'cover' }}
      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  );
}

/* ─── Searchable FK dropdown (used in forms) ────────────────────────── */
function FKSelect({ label, options, value, onChange, disabled, placeholder }: {
  label: string;
  options: { value: string; label: string; code?: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selected = options.find(o => String(o.value) === String(value));
  const filtered = q.trim()
    ? options.filter(o => o.label.toLowerCase().includes(q.toLowerCase()) || String(o.value).toLowerCase().includes(q.toLowerCase()))
    : options;

  return (
    <div>
      <label style={S.label}>{label}</label>
      <div ref={ref} style={{ position: 'relative' }}>
        <button type="button" disabled={disabled}
          onClick={() => { if (!disabled) { setOpen(!open); setQ(''); } }}
          style={{
            ...S.input, display: 'flex', alignItems: 'center', gap: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
            opacity: disabled ? 0.4 : 1,
            borderColor: open ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)',
          }}>
          {selected ? (
            <>
              {selected.code && <FlagImg code={selected.code} size={18} />}
              <span style={{ flex: 1 }}>{selected.label}</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{selected.value}</span>
            </>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.3)', flex: 1 }}>
              {disabled ? 'Select dependency first' : placeholder || `Select ${label}`}
            </span>
          )}
          <svg style={{ opacity: 0.3, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none' }}
            width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && !disabled && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, zIndex: 60,
            borderRadius: '10px', overflow: 'hidden',
            background: '#1e1e36', border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)', maxHeight: '260px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <input autoFocus value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search..." onClick={e => e.stopPropagation()}
                style={{ ...S.input, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', padding: '6px 10px' }} />
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <button type="button" onClick={() => { onChange(''); setOpen(false); }}
                style={{ ...S.dropOption, color: 'rgba(255,255,255,0.35)' }}>— None —</button>
              {filtered.map(o => (
                <button key={o.value} type="button"
                  onClick={() => { onChange(String(o.value)); setOpen(false); }}
                  style={{ ...S.dropOption, background: String(o.value) === String(value) ? 'rgba(99,102,241,0.15)' : 'transparent' }}
                  onMouseEnter={e => { if (String(o.value) !== String(value)) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (String(o.value) !== String(value)) e.currentTarget.style.background = 'transparent'; }}>
                  {o.code && <FlagImg code={o.code} size={16} />}
                  <span style={{ flex: 1, fontWeight: 500 }}>{o.label}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{o.value}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>No results</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Compact filter dropdown (used in filter bar) ──────────────────── */
function FilterDropdown({ label, options, value, onChange, disabled, isCountry }: {
  label: string;
  options: { value: string; text: string; code?: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  isCountry?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selected = options.find(o => String(o.value) === String(value));
  const filtered = q.trim()
    ? options.filter(o => o.text.toLowerCase().includes(q.toLowerCase()) || String(o.value).toLowerCase().includes(q.toLowerCase()))
    : options;

  const isActive = !!value;

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: '150px', maxWidth: '220px', flex: '1 1 150px' }}>
      <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px', paddingLeft: '2px' }}>
        {label}
      </div>
      <button type="button" disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(!open); setQ(''); } }}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
          padding: '6px 10px', borderRadius: '8px', fontSize: '12px', textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: isActive ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
          border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.08)',
          color: '#fff', opacity: disabled ? 0.35 : 1,
          transition: 'all 0.15s',
        }}>
        {selected ? (
          <>
            {isCountry && <FlagImg code={selected.value} size={14} />}
            <span style={{ flex: 1, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected.text}</span>
            <span onClick={e => { e.stopPropagation(); onChange(''); }} style={{ cursor: 'pointer', opacity: 0.4, fontSize: '14px', lineHeight: 1, marginLeft: '2px' }}>×</span>
          </>
        ) : (
          <>
            <span style={{ flex: 1, color: 'rgba(255,255,255,0.3)' }}>{disabled ? 'Select above first' : `All ${label}s`}</span>
            <svg style={{ opacity: 0.25, flexShrink: 0 }} width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
          </>
        )}
      </button>

      {open && !disabled && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 3px)', left: 0, zIndex: 70,
          minWidth: '240px', maxWidth: '320px', borderRadius: '10px', overflow: 'hidden',
          background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)', maxHeight: '280px',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <input autoFocus value={q} onChange={e => setQ(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`} onClick={e => e.stopPropagation()}
              style={{ width: '100%', padding: '6px 10px', borderRadius: '7px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <button type="button" onClick={() => { onChange(''); setOpen(false); }}
              style={{ ...S.dropOption, fontSize: '11px', padding: '7px 12px', color: 'rgba(255,255,255,0.35)' }}>
              All {label}s
            </button>
            {filtered.map(o => (
              <button key={o.value} type="button"
                onClick={() => { onChange(String(o.value)); setOpen(false); }}
                style={{
                  ...S.dropOption, fontSize: '11px', padding: '7px 12px',
                  background: String(o.value) === String(value) ? 'rgba(99,102,241,0.15)' : 'transparent',
                }}
                onMouseEnter={e => { if (String(o.value) !== String(value)) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (String(o.value) !== String(value)) e.currentTarget.style.background = 'transparent'; }}>
                {isCountry && <FlagImg code={o.value} size={14} />}
                <span style={{ flex: 1, fontWeight: 500 }}>{o.text}</span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>{o.value}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function MasterTablePage({ params }: { params: Promise<{ locale: string; table: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ locale: string; table: string } | null>(null);
  const [allRows, setAllRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // FK reference data cache
  const [refCache, setRefCache] = useState<Record<string, Record<string, unknown>[]>>({});

  // Filter state
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => { params.then(setResolvedParams); }, [params]);

  const config = resolvedParams ? TABLES[resolvedParams.table] : null;

  // Reset filters when table changes
  useEffect(() => { setFilters({}); }, [resolvedParams?.table]);

  // Auto-clear status
  useEffect(() => {
    if (!statusMsg) return;
    const t = setTimeout(() => setStatusMsg(null), 3500);
    return () => clearTimeout(t);
  }, [statusMsg]);

  // Fetch FK reference data (for both form dropdowns and filter bar)
  useEffect(() => {
    if (!config) return;
    const refs = new Set<string>();
    // From field FK references
    config.fields.forEach(f => { if (f.ref) refs.add(f.ref); });
    // From filter references
    config.filters?.forEach(f => { if (f.ref) refs.add(f.ref); });
    if (refs.size === 0) return;

    const fetchRefs = async () => {
      const cache: Record<string, Record<string, unknown>[]> = {};
      for (const refTable of refs) {
        const refConfig = TABLES[refTable];
        if (!refConfig) continue;
        try {
          const res = await fetch(refConfig.endpoint);
          if (res.ok) {
            const data = await res.json();
            cache[refTable] = Array.isArray(data) ? data : [];
          }
        } catch { /* ignore */ }
      }
      setRefCache(cache);
    };
    fetchRefs();
  }, [config]);

  // Fetch rows
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

  // Name lookups for FK display
  const lookupName = useCallback((refTable: string, pk: string, pkVal: unknown): string => {
    const rows = refCache[refTable] || [];
    const refCfg = TABLES[refTable];
    if (!refCfg) return String(pkVal ?? '');
    const row = rows.find(r => String(r[pk]) === String(pkVal));
    if (!row) return String(pkVal ?? '');
    const labelField = refCfg.fields.find(f => f.name !== refCfg.idField && f.type === 'varchar' && !f.hideInForm);
    return String(row[labelField?.name || refCfg.idField] ?? pkVal);
  }, [refCache]);

  // FK options resolver with cascading dependency (for forms)
  const getOptions = useCallback((field: FieldDef): { value: string; label: string; code?: string }[] => {
    if (!field.ref || !field.refPk || !field.refLabel) return [];
    let source = refCache[field.ref] || [];
    if (field.dependsOn) {
      const depVal = formData[field.dependsOn];
      if (!depVal && depVal !== 0) return [];
      source = source.filter(r => String(r[field.dependsOn!]) === String(depVal));
    }
    return source.map(r => ({
      value: String(r[field.refPk!] ?? ''),
      label: String(r[field.refLabel!] ?? ''),
      code: field.ref === 'countries' ? String(r['countryCode'] ?? '') : undefined,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [refCache, formData]);

  // Filter options resolver with cascading (for filter bar)
  const getFilterOptions = useCallback((filterDef: FilterDef): { value: string; text: string; code?: string }[] => {
    if (filterDef.isText || !filterDef.ref) return [];
    let source = refCache[filterDef.ref] || [];
    // Cascade: filter options by parent filter value
    if (filterDef.dependsOn) {
      const parentVal = filters[filterDef.dependsOn];
      if (!parentVal) return [];
      source = source.filter(r => String(r[filterDef.dependsOn!]) === String(parentVal));
    }
    return source.map(r => ({
      value: String(r[filterDef.refPk] ?? ''),
      text: String(r[filterDef.refLabel] ?? ''),
      code: filterDef.isCountry ? String(r['countryCode'] ?? '') : undefined,
    })).sort((a, b) => a.text.localeCompare(b.text));
  }, [refCache, filters]);

  // Update filter with cascade clear
  const updateFilter = useCallback((key: string, value: string) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      // Clear all dependent filters
      if (config?.filters) {
        const clearDependents = (parentKey: string) => {
          config.filters?.forEach(f => {
            if (f.dependsOn === parentKey) {
              next[f.key] = '';
              clearDependents(f.key);
            }
          });
        };
        clearDependents(key);
      }
      return next;
    });
  }, [config]);

  // Filtered + paginated rows (filters → then search)
  const filteredRows = useMemo(() => {
    if (!config) return [];
    let rows = allRows;

    // Apply filter bar filters
    if (config.filters) {
      config.filters.forEach(f => {
        const val = filters[f.key];
        if (!val) return;
        if (f.isText) {
          rows = rows.filter(row => String(row[f.key] ?? '').toLowerCase().includes(val.toLowerCase()));
        } else {
          rows = rows.filter(row => String(row[f.key]) === val);
        }
      });
    }

    // Apply text search
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(row =>
        config.fields.some(f => {
          const val = row[f.name];
          if (val == null) return false;
          if (f.ref && f.refPk && f.refLabel) {
            const name = lookupName(f.ref, f.refPk, val);
            if (name.toLowerCase().includes(q)) return true;
          }
          return String(val).toLowerCase().includes(q);
        })
      );
    }
    return rows;
  }, [allRows, filters, search, config, lookupName]);

  const totalFiltered = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage, pageSize]);

  useEffect(() => { setCurrentPage(1); }, [search, pageSize, filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    if (!config?.filters) return 0;
    return config.filters.filter(f => filters[f.key]).length;
  }, [config, filters]);

  if (!resolvedParams) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '40px' }}>Loading...</div>;
  if (!config) return <div style={{ color: '#ef4444', padding: '40px' }}>Unknown table: {resolvedParams.table}</div>;

  /* ─── Form handlers ─────────────────────────────────────────────── */
  const handleNew = () => {
    const empty: Record<string, unknown> = {};
    config.fields.forEach(f => {
      if (f.type === 'intarray') empty[f.name] = [];
      else empty[f.name] = '';
    });
    // Pre-fill from active filters
    if (config.filters) {
      config.filters.forEach(f => {
        if (filters[f.key] && !f.isText) empty[f.key] = filters[f.key];
      });
    }
    setFormData(empty); setEditingId(null); setShowForm(true);
  };

  const handleEdit = (row: Record<string, unknown>) => {
    const data: Record<string, unknown> = {};
    config.fields.forEach(f => {
      const val = row[f.name];
      if (f.type === 'intarray') data[f.name] = Array.isArray(val) ? val : [];
      else data[f.name] = val ?? '';
    });
    setFormData(data); setEditingId(String(row[config.idField])); setShowForm(true);
  };

  const handleDelete = async (row: Record<string, unknown>) => {
    if (!confirm(`Delete ${config.singular} "${row[config.idField]}"?`)) return;
    try {
      const res = await fetch(`${config.endpoint}/${row[config.idField]}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatusMsg({ text: `${config.singular} deleted`, error: false });
      fetchRows();
    } catch (e: unknown) {
      setStatusMsg({ text: e instanceof Error ? e.message : 'Delete failed', error: true });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      config.fields.forEach(f => {
        if (f.hideInForm) return;
        if (editingId && !f.editable && f.name !== config.idField) return;
        const val = formData[f.name];
        if (f.type === 'int' || f.type === 'bigint') body[f.name] = val ? parseInt(String(val)) : undefined;
        else if (f.type === 'intarray') {
          if (typeof val === 'string') body[f.name] = val ? val.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)) : [];
          else body[f.name] = Array.isArray(val) ? val : [];
        }
        else if (f.type === 'fk') {
          if (f.ref === 'countries') body[f.name] = val ? String(val).toUpperCase() : undefined;
          else body[f.name] = val ? (isNaN(Number(val)) ? val : Number(val)) : undefined;
        }
        else body[f.name] = val || undefined;
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
      setStatusMsg({ text: editingId ? `${config.singular} updated` : `${config.singular} created`, error: false });
      setShowForm(false); fetchRows();
    } catch (e: unknown) {
      setStatusMsg({ text: e instanceof Error ? e.message : 'Save failed', error: true });
    } finally { setSaving(false); }
  };

  const updateField = (name: string, value: unknown) => {
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      config.fields.forEach(f => {
        if (f.dependsOn === name) {
          next[f.name] = f.type === 'intarray' ? [] : '';
        }
      });
      return next;
    });
  };

  const globalIndex = (i: number) => (safePage - 1) * pageSize + i + 1;

  const getPageRange = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  /* ─── Render form fields with horizontal grouping ───────────────── */
  const renderFormFields = () => {
    const rendered = new Set<string>();
    const elements: React.ReactNode[] = [];

    config.fields.forEach(f => {
      if (rendered.has(f.name) || f.hideInForm) return;
      if (!f.editable && f.name !== config.idField) return;
      if (editingId && !f.editable) return;

      if (f.horizontalGroup) {
        const groupKey = `__grp__${f.horizontalGroup}`;
        if (rendered.has(groupKey)) return;
        rendered.add(groupKey);
        const groupFields = config.fields.filter(gf => gf.horizontalGroup === f.horizontalGroup && !gf.hideInForm);
        groupFields.forEach(gf => rendered.add(gf.name));
        elements.push(
          <div key={groupKey} style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: `repeat(${groupFields.length}, 1fr)`, gap: '10px' }}>
            {groupFields.map(gf => renderSingleField(gf))}
          </div>
        );
        return;
      }

      rendered.add(f.name);
      elements.push(renderSingleField(f));
    });

    return elements;
  };

  const renderSingleField = (f: FieldDef) => {
    if (f.type === 'fk') {
      const opts = getOptions(f);
      const disabled = !!f.dependsOn && !formData[f.dependsOn];
      return <FKSelect key={f.name} label={f.label} options={opts} value={String(formData[f.name] ?? '')} onChange={v => updateField(f.name, v)} disabled={disabled} />;
    }
    if (f.type === 'intarray') {
      const val = formData[f.name];
      const display = Array.isArray(val) ? val.join(', ') : String(val ?? '');
      return (
        <div key={f.name}>
          <label style={S.label}>{f.label}</label>
          <input value={display} onChange={e => updateField(f.name, e.target.value)} placeholder="1, 2, 3" style={S.input} />
        </div>
      );
    }
    return (
      <div key={f.name}>
        <label style={S.label}>{f.label}{f.required && <span style={{ color: '#f43f5e' }}> *</span>}</label>
        <input value={String(formData[f.name] ?? '')} onChange={e => updateField(f.name, e.target.value)}
          placeholder={f.label} maxLength={f.type === 'char2' ? 2 : f.type === 'char3' ? 3 : undefined}
          style={{ ...S.input, ...(f.type === 'char2' || f.type === 'char3' ? { textTransform: 'uppercase' as const, fontFamily: 'monospace', letterSpacing: '0.1em' } : {}) }} />
      </div>
    );
  };

  /* ─── Render cell value ─────────────────────────────────────────── */
  const renderCell = (row: Record<string, unknown>, f: FieldDef) => {
    const val = row[f.name];
    if (f.name === 'flag' && f.label === 'Flag' && config.key === 'countries') {
      return <FlagImg code={String(row['countryCode'] ?? '')} size={28} />;
    }
    if (f.type === 'fk' && f.ref && f.refPk && f.refLabel) {
      const name = lookupName(f.ref, f.refPk, val);
      const isCountry = f.ref === 'countries';
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {isCountry && <FlagImg code={String(val ?? '')} size={16} />}
          <span>{name}</span>
          {isCountry && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{String(val ?? '')}</span>}
        </span>
      );
    }
    if (f.type === 'intarray' && Array.isArray(val)) return <span>{(val as number[]).join(', ')}</span>;
    return <span>{String(val ?? '')}</span>;
  };

  /* ─── Render filter bar ─────────────────────────────────────────── */
  const renderFilterBar = () => {
    if (!config.filters || config.filters.length === 0) return null;
    return (
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: '10px', flexWrap: 'wrap',
        padding: '10px 14px', marginBottom: '12px',
        borderRadius: '12px', background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'center', paddingBottom: '2px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            Filters
          </span>
        </div>

        {config.filters.map(f => {
          if (f.isText) {
            return (
              <div key={f.key} style={{ minWidth: '130px', maxWidth: '180px', flex: '1 1 130px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px', paddingLeft: '2px' }}>
                  {f.label}
                </div>
                <input
                  value={filters[f.key] || ''}
                  onChange={e => updateFilter(f.key, e.target.value)}
                  placeholder={`All ${f.label}s`}
                  style={{
                    width: '100%', padding: '6px 10px', borderRadius: '8px', fontSize: '12px',
                    background: filters[f.key] ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                    border: filters[f.key] ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    color: '#fff', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            );
          }
          const disabled = !!f.dependsOn && !filters[f.dependsOn];
          return (
            <FilterDropdown
              key={f.key}
              label={f.label}
              options={getFilterOptions(f)}
              value={filters[f.key] || ''}
              onChange={v => updateFilter(f.key, v)}
              disabled={disabled}
              isCountry={f.isCountry}
            />
          );
        })}

        {activeFilterCount > 0 && (
          <button onClick={() => setFilters({})}
            style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 500,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5', cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: 'flex-end',
            }}>
            Clear all
          </button>
        )}

        {activeFilterCount > 0 && (
          <div style={{ fontSize: '11px', color: 'rgba(99,102,241,0.6)', alignSelf: 'center', whiteSpace: 'nowrap', marginLeft: 'auto' }}>
            {totalFiltered} result{totalFiltered !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <a href={`/${resolvedParams.locale}/master`} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}>&#8592; Master Data</a>
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Syne", sans-serif', color: '#fff', margin: '4px 0 0' }}>
            <span style={{ marginRight: '10px' }}>{config.icon}</span>
            {config.label}
            <span style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.25)', marginLeft: '12px' }}>
              ({totalFiltered}{totalFiltered !== allRows.length ? ` / ${allRows.length}` : ''})
            </span>
          </h1>
        </div>
        <button onClick={handleNew} style={S.btnPrimary}>+ Add {config.singular}</button>
      </div>

      {/* Status */}
      {statusMsg && (
        <div style={{
          ...S.statusBar,
          background: statusMsg.error ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
          borderColor: statusMsg.error ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
          color: statusMsg.error ? '#ef4444' : '#22c55e',
        }}>
          {statusMsg.error ? '✕' : '✓'} {statusMsg.text}
        </div>
      )}
      {error && <div style={S.statusBar}>{error}</div>}

      {/* Form Card */}
      {showForm && (
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', margin: 0, fontFamily: '"Syne", sans-serif' }}>
              {editingId ? `Edit ${config.singular}` : `New ${config.singular}`}
            </h3>
            <button onClick={() => setShowForm(false)} style={{ ...S.btnGhost, padding: '4px 12px', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px' }}>
            Primary key: <code style={{ color: 'rgba(99,102,241,0.7)' }}>{config.idField}</code>
            {config.autoPk ? ' (auto-generated)' : ' (manual entry)'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {renderFormFields()}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={handleSave} disabled={saving} style={S.btnPrimary}>
              {saving ? 'Saving...' : editingId ? `Update ${config.singular}` : `Add ${config.singular}`}
            </button>
            <button onClick={() => setShowForm(false)} style={S.btnGhost}>Cancel</button>
          </div>
        </div>
      )}

      {/* Toolbar: Show + Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Show</span>
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} style={S.select}>
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..."
            style={{ ...S.input, width: '260px', paddingLeft: '34px' }} />
          <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* ── Filter Bar (between toolbar and table) ─────────────────── */}
      {renderFilterBar()}

      {/* Records Table */}
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: '50px', textAlign: 'center' }}>#</th>
                {config.fields.map((f, i) => (
                  <th key={`${f.name}-${i}`} style={{ ...S.th, ...(f.name === 'flag' ? { width: '56px', textAlign: 'center' } : {}) }}>{f.label}</th>
                ))}
                <th style={{ ...S.th, width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.fields.length + 2} style={{ ...S.td, textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px' }}>Loading...</td></tr>
              ) : paginatedRows.length === 0 ? (
                <tr><td colSpan={config.fields.length + 2} style={{ ...S.td, textAlign: 'center', color: 'rgba(255,255,255,0.25)', padding: '40px' }}>
                  {search || activeFilterCount > 0 ? 'No matching records.' : `No ${config.label.toLowerCase()} yet. Click "+ Add ${config.singular}" to create one.`}
                </td></tr>
              ) : paginatedRows.map((row, i) => (
                <tr key={String(row[config.idField] ?? i)}
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={S.sn}>{globalIndex(i)}</td>
                  {config.fields.map((f, ci) => (
                    <td key={`${f.name}-${ci}`} style={{ ...S.td, ...(f.name === 'flag' ? { textAlign: 'center', padding: '6px 12px' } : {}) }}>
                      {renderCell(row, f)}
                    </td>
                  ))}
                  <td style={{ ...S.td, whiteSpace: 'nowrap', textAlign: 'center' }}>
                    <button onClick={() => handleEdit(row)} style={{ ...S.btnMini, color: '#93c5fd', borderColor: 'rgba(96,165,250,0.2)', background: 'rgba(59,130,246,0.08)' }}>Edit</button>
                    <button onClick={() => handleDelete(row)} style={{ ...S.btnMini, color: '#fca5a5', borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)' }}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          {totalFiltered > 0
            ? `Showing ${(safePage - 1) * pageSize + 1}\u2013${Math.min(safePage * pageSize, totalFiltered)} of ${totalFiltered}${totalFiltered !== allRows.length ? ` (filtered from ${allRows.length})` : ''}`
            : `${allRows.length} total records`}
        </div>
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
              style={{ ...S.pageBtn, ...(safePage <= 1 ? S.pageDis : {}) }}>&#8249; Prev</button>
            {getPageRange().map((p, i) =>
              typeof p === 'string'
                ? <span key={`e${i}`} style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', padding: '0 2px' }}>&#8230;</span>
                : <button key={p} onClick={() => setCurrentPage(p)} style={{ ...S.pageBtn, ...(p === safePage ? S.pageActive : {}) }}>{p}</button>
            )}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
              style={{ ...S.pageBtn, ...(safePage >= totalPages ? S.pageDis : {}) }}>Next &#8250;</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════════════ */

const S: Record<string, React.CSSProperties> = {
  card: {
    padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px',
  },
  statusBar: {
    padding: '10px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px',
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444',
  },
  label: {
    fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase',
    letterSpacing: '0.05em', display: 'block', marginBottom: '5px',
  },
  input: {
    width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
  },
  select: {
    padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '13px', outline: 'none', cursor: 'pointer',
  },
  dropOption: {
    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
    padding: '8px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
    background: 'transparent', color: '#fff', fontSize: '12px', transition: 'background 0.1s',
  },
  btnPrimary: {
    padding: '8px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
  },
  btnGhost: {
    padding: '8px 20px', borderRadius: '10px', background: 'transparent',
    color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500,
    border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
  },
  btnMini: {
    padding: '4px 10px', borderRadius: '7px', background: 'transparent',
    fontSize: '11px', fontWeight: 500, border: '1px solid', cursor: 'pointer', marginRight: '4px',
  },
  th: {
    padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600,
    color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  td: {
    padding: '9px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.7)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  sn: {
    padding: '9px 14px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)',
    borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', fontVariantNumeric: 'tabular-nums',
  },
  pageBtn: {
    padding: '5px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
    fontSize: '12px', cursor: 'pointer', minWidth: '32px', textAlign: 'center', fontWeight: 500,
  },
  pageActive: {
    background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc', fontWeight: 600,
  },
  pageDis: { opacity: 0.3, cursor: 'default' },
};
