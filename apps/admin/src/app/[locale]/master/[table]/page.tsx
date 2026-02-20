'use client';

import { useState, useEffect, useCallback } from 'react';

const TABLE_CONFIG: Record<string, { label: string; idField: string; columns: { key: string; label: string; editable?: boolean; type?: string }[]; endpoint: string }> = {
  countries: {
    label: 'Countries',
    idField: 'countryCode',
    endpoint: '/api/master/countries',
    columns: [
      { key: 'countryCode', label: 'Code', type: 'char2' },
      { key: 'country', label: 'Country', editable: true },
      { key: 'iso3', label: 'ISO3', editable: true, type: 'char3' },
      { key: 'isd', label: 'ISD', editable: true },
      { key: 'flag', label: 'Flag', editable: true },
    ],
  },
  states: {
    label: 'States',
    idField: 'stateid',
    endpoint: '/api/master/states',
    columns: [
      { key: 'stateid', label: 'ID' },
      { key: 'state', label: 'State', editable: true },
      { key: 'stateCode', label: 'Code', editable: true, type: 'char2' },
      { key: 'countryCode', label: 'Country', editable: true, type: 'char2' },
      { key: 'region', label: 'Region', editable: true },
    ],
  },
  districts: {
    label: 'Districts',
    idField: 'districtid',
    endpoint: '/api/master/districts',
    columns: [
      { key: 'districtid', label: 'ID' },
      { key: 'district', label: 'District', editable: true },
      { key: 'stateid', label: 'State ID', editable: true, type: 'int' },
      { key: 'countryCode', label: 'Country', editable: true, type: 'char2' },
    ],
  },
  postals: {
    label: 'Postals',
    idField: 'postid',
    endpoint: '/api/master/postals',
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
    label: 'Places',
    idField: 'placeid',
    endpoint: '/api/master/places',
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
    label: 'Localities',
    idField: 'localityid',
    endpoint: '/api/master/localities',
    columns: [
      { key: 'localityid', label: 'ID' },
      { key: 'locality', label: 'Locality', editable: true },
      { key: 'placeid', label: 'Place IDs', editable: true, type: 'intarray' },
      { key: 'localAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  areas: {
    label: 'Areas',
    idField: 'areaid',
    endpoint: '/api/master/areas',
    columns: [
      { key: 'areaid', label: 'ID' },
      { key: 'area', label: 'Area', editable: true },
      { key: 'localityid', label: 'Locality IDs', editable: true, type: 'intarray' },
      { key: 'areaAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  divisions: {
    label: 'Divisions',
    idField: 'divisionid',
    endpoint: '/api/master/divisions',
    columns: [
      { key: 'divisionid', label: 'ID' },
      { key: 'division', label: 'Division', editable: true },
      { key: 'areaid', label: 'Area IDs', editable: true, type: 'intarray' },
      { key: 'divisionAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  regions: {
    label: 'Regions',
    idField: 'regionid',
    endpoint: '/api/master/regions',
    columns: [
      { key: 'regionid', label: 'ID' },
      { key: 'region', label: 'Region', editable: true },
      { key: 'divisionid', label: 'Division IDs', editable: true, type: 'intarray' },
      { key: 'regionAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  zones: {
    label: 'Zones',
    idField: 'zoneid',
    endpoint: '/api/master/zones',
    columns: [
      { key: 'zoneid', label: 'ID' },
      { key: 'zoneCode', label: 'Code', editable: true, type: 'char2' },
      { key: 'zone', label: 'Zone', editable: true },
      { key: 'regionid', label: 'Region IDs', editable: true, type: 'intarray' },
      { key: 'zoneAgency', label: 'Agency', editable: true, type: 'bigint' },
    ],
  },
  sectors: {
    label: 'Sectors',
    idField: 'sectorid',
    endpoint: '/api/master/sectors',
    columns: [
      { key: 'sectorid', label: 'ID' },
      { key: 'sector', label: 'Sector', editable: true },
    ],
  },
  fields: {
    label: 'Fields',
    idField: 'fieldid',
    endpoint: '/api/master/fields',
    columns: [
      { key: 'fieldid', label: 'ID' },
      { key: 'field', label: 'Field', editable: true },
      { key: 'sectorid', label: 'Sector ID', editable: true, type: 'int' },
    ],
  },
};

const API_BASE = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname.replace('admin.', 'api.')}`
  : 'https://api.saubh.tech';

export default function MasterTablePage({ params }: { params: Promise<{ locale: string; table: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ locale: string; table: string } | null>(null);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const config = resolvedParams ? TABLE_CONFIG[resolvedParams.table] : null;

  const fetchRows = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}${config.endpoint}`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    if (config) fetchRows();
  }, [config, fetchRows]);

  if (!resolvedParams) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '40px' }}>Loading...</div>;
  if (!config) return <div style={{ color: '#ef4444', padding: '40px' }}>Unknown table: {resolvedParams.table}</div>;

  const resetForm = () => {
    const empty: Record<string, string> = {};
    config.columns.forEach(c => { if (c.editable || c.key === config.columns[0].key) empty[c.key] = ''; });
    setFormData(empty);
    setEditingId(null);
  };

  const handleNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (row: Record<string, unknown>) => {
    const data: Record<string, string> = {};
    config.columns.forEach(c => {
      const val = row[c.key];
      data[c.key] = Array.isArray(val) ? val.join(', ') : String(val ?? '');
    });
    setFormData(data);
    setEditingId(String(row[config.idField]));
    setShowForm(true);
  };

  const handleDelete = async (row: Record<string, unknown>) => {
    if (!confirm(`Delete ${config.label.slice(0, -1)} ${row[config.idField]}?`)) return;
    try {
      const res = await fetch(`${API_BASE}${config.endpoint}/${row[config.idField]}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchRows();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      config.columns.forEach(col => {
        if (!editingId && !col.editable && col.key !== config.columns[0].key) return;
        if (editingId && !col.editable) return;
        const val = formData[col.key] ?? '';
        if (col.type === 'int') body[col.key] = val ? parseInt(val) : undefined;
        else if (col.type === 'bigint') body[col.key] = val ? parseInt(val) : undefined;
        else if (col.type === 'intarray') body[col.key] = val ? val.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)) : [];
        else body[col.key] = val || undefined;
      });

      // For create, include the PK field if it's a string type (like countryCode)
      if (!editingId && config.idField === 'countryCode') {
        body[config.idField] = formData[config.idField];
      }

      const url = editingId ? `${API_BASE}${config.endpoint}/${editingId}` : `${API_BASE}${config.endpoint}`;
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setShowForm(false);
      fetchRows();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <a href={`/${resolvedParams.locale}/master`} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}>
              ← Master Data
            </a>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: '"Syne", sans-serif', color: '#fff', margin: 0 }}>
            {config.label}
          </h1>
        </div>
        <button onClick={handleNew} style={btnPrimary}>
          + Add New
        </button>
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

      {showForm && (
        <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', margin: '0 0 16px', fontFamily: '"Syne", sans-serif' }}>
            {editingId ? 'Edit Record' : 'New Record'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {config.columns.map(col => {
              if (editingId && !col.editable) return null;
              if (!editingId && !col.editable && col.key !== config.idField && config.idField === 'countryCode') return null;
              if (!editingId && !col.editable && config.idField !== 'countryCode') return null;
              return (
                <div key={col.key}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                    {col.label}
                  </label>
                  <input
                    value={formData[col.key] || ''}
                    onChange={e => setFormData(p => ({ ...p, [col.key]: e.target.value }))}
                    placeholder={col.type === 'intarray' ? '1, 2, 3' : col.label}
                    style={inputStyles}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={handleSave} disabled={saving} style={btnPrimary}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} style={btnGhost}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {config.columns.map(col => (
                  <th key={col.key} style={thStyles}>{col.label}</th>
                ))}
                <th style={thStyles}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.columns.length + 1} style={{ ...tdStyles, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={config.columns.length + 1} style={{ ...tdStyles, textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>No records yet. Click &quot;+ Add New&quot; to create one.</td></tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={String(row[config.idField] ?? i)}>
                    {config.columns.map(col => (
                      <td key={col.key} style={tdStyles}>
                        {Array.isArray(row[col.key]) ? (row[col.key] as number[]).join(', ') : String(row[col.key] ?? '')}
                      </td>
                    ))}
                    <td style={{ ...tdStyles, whiteSpace: 'nowrap' }}>
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

      <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
        {rows.length} record{rows.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: '8px 20px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#fff',
  fontSize: '13px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
};

const btnGhost: React.CSSProperties = {
  padding: '8px 20px',
  borderRadius: '10px',
  background: 'transparent',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '13px',
  fontWeight: 500,
  border: '1px solid rgba(255,255,255,0.1)',
  cursor: 'pointer',
};

const btnSmall: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: '8px',
  background: 'transparent',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '12px',
  fontWeight: 500,
  border: '1px solid rgba(255,255,255,0.08)',
  cursor: 'pointer',
  marginRight: '6px',
};

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};

const thStyles: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.35)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  background: 'rgba(255,255,255,0.02)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const tdStyles: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: '13px',
  color: 'rgba(255,255,255,0.7)',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};
