'use client';

import { useEffect, useState, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech';

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════ */

interface BackupStatus {
  id: string;
  createdAt: string;
  type: 'manual' | 'scheduled';
  status: 'running' | 'complete' | 'failed';
  codeFile: string;
  dbFile: string;
  codeSize: string;
  dbSize: string;
  totalSize: string;
  notes: string;
  error?: string;
}

interface ScheduleConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek: number;
  dayOfMonth: number;
  keepLast: number;
}

interface RestoreJob {
  jobId: string;
  step: string;
  pct: number;
  error?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   API helpers
   ═══════════════════════════════════════════════════════════════════════════ */

function apiFetch(path: string, password: string, opts: RequestInit = {}) {
  return fetch(`${API}/api/backup${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'X-Backup-Password': password,
      ...(opts.headers || {}),
    },
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════════════════════════ */

export default function BackupPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [pwInput, setPwInput] = useState('');
  const [activeTab, setActiveTab] = useState<'backups' | 'schedule' | 'drive'>('backups');

  // Check sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('backup_auth');
    const savedPw = sessionStorage.getItem('backup_pw');
    if (saved === 'true' && savedPw) {
      setPassword(savedPw);
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    setAuthError('');
    try {
      const res = await apiFetch('/list', pwInput);
      if (res.ok) {
        setPassword(pwInput);
        setAuthenticated(true);
        sessionStorage.setItem('backup_auth', 'true');
        sessionStorage.setItem('backup_pw', pwInput);
      } else {
        setAuthError('Invalid password.');
      }
    } catch {
      setAuthError('Connection failed.');
    }
  };

  /* ── Password Overlay ─────────────────────────────────────────────────── */
  if (!authenticated) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...cardStyle, maxWidth: '400px', textAlign: 'center' as const }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
          <h2 style={{ ...titleStyle, fontSize: '22px', marginBottom: '8px' }}>Backup Manager</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '24px' }}>Enter the backup password to continue.</p>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Backup password"
            style={{ ...inputStyle, width: '100%', marginBottom: '12px', boxSizing: 'border-box' as const }}
          />
          {authError && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{authError}</p>}
          <button onClick={handleLogin} style={{ ...primaryBtnStyle, width: '100%' }}>Unlock</button>
        </div>
      </div>
    );
  }

  /* ── Main Layout ──────────────────────────────────────────────────────── */
  const tabs = [
    { key: 'backups' as const, label: '💾 Backups' },
    { key: 'schedule' as const, label: '⏰ Schedule' },
    { key: 'drive' as const, label: '☁️ Google Drive' },
  ];

  return (
    <div>
      <h1 style={titleStyle}>Backup Manager</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>Create, manage, and restore server backups.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              background: activeTab === t.key ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              color: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'backups' && <BackupsTab password={password} />}
      {activeTab === 'schedule' && <ScheduleTab password={password} />}
      {activeTab === 'drive' && <DriveTab password={password} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 1 — BACKUPS
   ═══════════════════════════════════════════════════════════════════════════ */

function BackupsTab({ password }: { password: string }) {
  const [backups, setBackups] = useState<BackupStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creatingId, setCreatingId] = useState('');
  const [notes, setNotes] = useState('');
  const [restoreModal, setRestoreModal] = useState<string | null>(null);
  const [restoreInput, setRestoreInput] = useState('');
  const [restoreJob, setRestoreJob] = useState<RestoreJob | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [driveUploading, setDriveUploading] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const loadBackups = useCallback(async () => {
    try {
      const res = await apiFetch('/list', password);
      if (res.ok) setBackups(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, [password]);

  useEffect(() => { loadBackups(); }, [loadBackups]);

  // Poll creating backup status
  useEffect(() => {
    if (!creatingId) return;
    const iv = setInterval(async () => {
      try {
        const res = await apiFetch(`/status/${creatingId}`, password);
        if (res.ok) {
          const s = await res.json();
          if (s.status !== 'running') {
            setCreating(false);
            setCreatingId('');
            clearInterval(iv);
            loadBackups();
          }
        }
      } catch { /* ignore */ }
    }, 2000);
    return () => clearInterval(iv);
  }, [creatingId, password, loadBackups]);

  // Poll restore progress
  useEffect(() => {
    if (!restoreJob || restoreJob.step === 'complete' || restoreJob.step === 'failed') return;
    const iv = setInterval(async () => {
      try {
        const res = await apiFetch(`/restore/progress/${restoreJob.jobId}`, password);
        if (res.ok) {
          const j = await res.json();
          setRestoreJob(j);
          if (j.step === 'complete' || j.step === 'failed') clearInterval(iv);
        }
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(iv);
  }, [restoreJob, password]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await apiFetch('/create', password, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreatingId(data.id);
        setNotes('');
      } else {
        setCreating(false);
        showToast('Failed to create backup.');
      }
    } catch {
      setCreating(false);
      showToast('Connection error.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiFetch(`/${id}`, password, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Deleted: ${id}`);
        loadBackups();
      }
    } catch { /* ignore */ }
    setDeleteConfirm(null);
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await apiFetch(`/restore/${id}`, password, {
        method: 'POST',
        body: JSON.stringify({ confirm: 'RESTORE', confirmId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setRestoreModal(null);
        setRestoreInput('');
        setRestoreJob({ jobId: data.jobId, step: 'queued', pct: 0 });
      } else {
        showToast('Restore failed to start.');
      }
    } catch {
      showToast('Connection error.');
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const statusIcon = (s: string) => s === 'complete' ? '🟢' : s === 'running' ? '🟡' : '🔴';
  const typeLabel = (t: string) => t === 'manual' ? 'Manual' : 'Scheduled';

  const restoreSteps = [
    { key: 'stopping', label: 'Stopping PM2 apps' },
    { key: 'extracting', label: 'Extracting code archive' },
    { key: 'restoring-db', label: 'Restoring database' },
    { key: 'installing', label: 'Installing dependencies' },
    { key: 'building', label: 'Rebuilding apps' },
    { key: 'restarting', label: 'Restarting services' },
    { key: 'complete', label: 'Restoration complete!' },
  ];

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  /* ── Restore Progress Overlay ─────────────────────────────────────────── */
  if (restoreJob && restoreJob.step !== 'complete' && restoreJob.step !== 'failed') {
    return (
      <div style={cardStyle}>
        <h3 style={{ ...titleStyle, fontSize: '18px', marginBottom: '20px' }}>🔄 Restoring Backup...</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {restoreSteps.map((s) => {
            const currentIdx = restoreSteps.findIndex((r) => r.key === restoreJob.step);
            const stepIdx = restoreSteps.findIndex((r) => r.key === s.key);
            const done = currentIdx > stepIdx;
            const active = s.key === restoreJob.step;
            const pending = !done && !active;
            return (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: pending ? 0.35 : 1 }}>
                <span style={{ fontSize: '16px' }}>{done ? '✅' : active ? '⟳' : '○'}</span>
                <span style={{ fontSize: '14px', fontWeight: active ? 600 : 400, color: active ? '#a78bfa' : '#e2e8f0' }}>
                  {s.label}{active ? ` (${restoreJob.pct}%)` : ''}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '20px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', width: `${restoreJob.pct}%`, transition: 'width 0.5s' }} />
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (restoreJob && restoreJob.step === 'complete') {
    return (
      <div style={{ ...cardStyle, textAlign: 'center' as const }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
        <h3 style={{ ...titleStyle, fontSize: '20px', marginBottom: '8px' }}>Restoration Complete!</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>All services have been restored and restarted.</p>
        <button onClick={() => { setRestoreJob(null); loadBackups(); }} style={primaryBtnStyle}>Reload Page</button>
      </div>
    );
  }

  if (restoreJob && restoreJob.step === 'failed') {
    return (
      <div style={{ ...cardStyle, textAlign: 'center' as const }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>❌</div>
        <h3 style={{ ...titleStyle, fontSize: '20px', marginBottom: '8px' }}>Restore Failed</h3>
        <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '20px' }}>{restoreJob.error || 'Unknown error'}</p>
        <button onClick={() => { setRestoreJob(null); loadBackups(); }} style={primaryBtnStyle}>Back to Backups</button>
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', padding: '12px 20px', borderRadius: '10px', background: 'rgba(99,102,241,0.9)', color: '#fff', fontSize: '13px', fontWeight: 600, zIndex: 999, backdropFilter: 'blur(8px)' }}>
          {toast}
        </div>
      )}

      {/* Action bar */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '20px' }}>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Backup notes (optional)"
          style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
          disabled={creating}
        />
        <button onClick={handleCreate} disabled={creating} style={{ ...primaryBtnStyle, opacity: creating ? 0.6 : 1 }}>
          {creating ? '⟳ Creating...' : '+ Create Backup Now'}
        </button>
        <span style={badgeStyle}>{backups.length} backup{backups.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Creating progress */}
      {creating && creatingId && (
        <div style={{ ...cardStyle, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px', display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#a78bfa' }}>Creating backup {creatingId}...</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Archiving code and dumping database. This may take a few minutes.</div>
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Loading */}
      {loading && <div style={{ color: 'rgba(255,255,255,0.4)', padding: '40px', textAlign: 'center' as const }}>Loading backups...</div>}

      {/* Empty state */}
      {!loading && backups.length === 0 && (
        <div style={{ ...cardStyle, textAlign: 'center' as const, padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>No backups yet. Create your first backup above.</p>
        </div>
      )}

      {/* Backup list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {backups.map((b) => (
          <div key={b.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: '12px' }}>
              {/* Left: info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>📦</span>
                  <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '15px', color: '#fff' }}>{fmtDate(b.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '6px' }}>
                  <span style={badgeStyle}>{statusIcon(b.status)} {b.status}</span>
                  <span style={badgeStyle}>{typeLabel(b.type)}</span>
                  <span style={badgeStyle}>{b.totalSize}</span>
                  {b.codeSize !== '0B' && <span style={{ ...badgeStyle, opacity: 0.6 }}>Code: {b.codeSize}</span>}
                  {b.dbSize !== '0B' && <span style={{ ...badgeStyle, opacity: 0.6 }}>DB: {b.dbSize}</span>}
                </div>
                {b.notes && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>&ldquo;{b.notes}&rdquo;</div>}
                {b.error && <div style={{ fontSize: '12px', color: '#f87171', marginTop: '4px' }}>Error: {b.error}</div>}
              </div>

              {/* Right: actions */}
              {b.status === 'complete' && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                  <button onClick={() => triggerDownload(b.id, 'code', password)} style={actionBtnStyle}>⬇ Code</button>
                  <button onClick={() => triggerDownload(b.id, 'db', password)} style={actionBtnStyle}>⬇ DB</button>
                  <button
                    onClick={async () => {
                      setDriveUploading(b.id);
                      try {
                        const res = await apiFetch(`/drive/upload/${b.id}`, password, { method: 'POST' });
                        if (res.ok) {
                          const data = await res.json();
                          // Poll progress
                          const iv = setInterval(async () => {
                            try {
                              const pr = await apiFetch(`/drive/progress/${data.jobKey}`, password);
                              if (pr.ok) {
                                const p = await pr.json();
                                if (p.status === 'complete') { clearInterval(iv); setDriveUploading(null); showToast('☁️ Uploaded to Google Drive!'); }
                                if (p.status === 'failed') { clearInterval(iv); setDriveUploading(null); showToast('❌ Drive upload failed: ' + (p.error || '')); }
                              }
                            } catch { /* ignore */ }
                          }, 3000);
                        } else { setDriveUploading(null); showToast('Drive upload failed.'); }
                      } catch { setDriveUploading(null); showToast('Connection error.'); }
                    }}
                    disabled={driveUploading === b.id}
                    style={{ ...actionBtnStyle, color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', opacity: driveUploading === b.id ? 0.5 : 1 }}
                  >{driveUploading === b.id ? '⟳ Uploading...' : '☁️ Drive'}</button>
                  <button onClick={() => { setRestoreModal(b.id); setRestoreInput(''); }} style={{ ...actionBtnStyle, color: '#fbbf24', borderColor: 'rgba(251,191,36,0.3)' }}>🔄 Restore</button>
                  {deleteConfirm === b.id ? (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => handleDelete(b.id)} style={{ ...actionBtnStyle, color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} style={actionBtnStyle}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(b.id)} style={{ ...actionBtnStyle, color: '#f87171', borderColor: 'rgba(248,113,113,0.2)' }}>🗑</button>
                  )}
                </div>
              )}
              {b.status === 'running' && (
                <span style={{ ...badgeStyle, background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                  ⟳ Running...
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Restore Confirmation Modal ──────────────────────────────────── */}
      {restoreModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ ...cardStyle, maxWidth: '480px', width: '90%', borderTop: '3px solid #f59e0b' }}>
            <h3 style={{ ...titleStyle, fontSize: '18px', color: '#fbbf24', marginBottom: '12px' }}>⚠️ Confirm Restore</h3>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '16px' }}>
              <p style={{ marginBottom: '8px', marginTop: 0 }}>This will:</p>
              <div style={{ paddingLeft: '12px' }}>
                • Stop all PM2 apps temporarily<br />
                • Replace code files from backup<br />
                • Restore database from backup<br />
                • Reinstall dependencies and rebuild<br />
                • Restart all services (5–10 min downtime)
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
              Restoring: <strong style={{ color: '#a78bfa' }}>{restoreModal}</strong>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', marginTop: 0 }}>Type <strong style={{ color: '#f87171' }}>RESTORE</strong> to confirm:</p>
            <input
              value={restoreInput}
              onChange={(e) => setRestoreInput(e.target.value)}
              placeholder="Type RESTORE"
              style={{ ...inputStyle, width: '100%', marginBottom: '16px', boxSizing: 'border-box' as const }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setRestoreModal(null); setRestoreInput(''); }} style={actionBtnStyle}>Cancel</button>
              <button
                onClick={() => handleRestore(restoreModal)}
                disabled={restoreInput !== 'RESTORE'}
                style={{ ...primaryBtnStyle, background: restoreInput === 'RESTORE' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'rgba(255,255,255,0.06)', opacity: restoreInput === 'RESTORE' ? 1 : 0.4 }}
              >
                Restore Now — I understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Download helper: fetches with password header, then triggers browser download */
async function triggerDownload(id: string, type: string, password: string) {
  try {
    const res = await fetch(`${API}/api/backup/download/${id}/${type}`, {
      headers: { 'X-Backup-Password': password },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const cd = res.headers.get('content-disposition') || '';
    const match = cd.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : `backup-${id}-${type}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch { /* ignore */ }
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 2 — SCHEDULE
   ═══════════════════════════════════════════════════════════════════════════ */

function ScheduleTab({ password }: { password: string }) {
  const [config, setConfig] = useState<ScheduleConfig>({
    enabled: false,
    frequency: 'weekly',
    time: '02:00',
    dayOfWeek: 0,
    dayOfMonth: 1,
    keepLast: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/schedule', password);
        if (res.ok) setConfig(await res.json());
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [password]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/schedule', password, {
        method: 'POST',
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setToast('✅ Schedule saved!');
      } else {
        const err = await res.json().catch(() => null);
        setToast(`❌ ${err?.message || 'Failed to save.'}`);
      }
    } catch {
      setToast('❌ Connection error.');
    }
    setSaving(false);
    setTimeout(() => setToast(''), 4000);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

  const nextRun = (): string => {
    if (!config.enabled) return 'Schedule is disabled.';
    const [h] = config.time.split(':');
    const timeStr = `${h}:00`;
    if (config.frequency === 'daily') return `Every day at ${timeStr}`;
    if (config.frequency === 'weekly') return `Every ${dayNames[config.dayOfWeek]} at ${timeStr}`;
    return `Every month on day ${config.dayOfMonth} at ${timeStr}`;
  };

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: '40px', textAlign: 'center' as const }}>Loading schedule...</div>;

  return (
    <div style={{ ...cardStyle, maxWidth: '560px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', padding: '12px 20px', borderRadius: '10px', background: 'rgba(99,102,241,0.9)', color: '#fff', fontSize: '13px', fontWeight: 600, zIndex: 999 }}>
          {toast}
        </div>
      )}

      {/* Enable toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Automatic Backups</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{config.enabled ? 'Enabled' : 'Disabled'}</div>
        </div>
        <button
          onClick={() => setConfig({ ...config, enabled: !config.enabled })}
          style={{
            width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', position: 'relative' as const,
            background: config.enabled ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.1)',
            transition: 'background 0.2s',
          }}
        >
          <div style={{
            width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute' as const, top: '3px',
            left: config.enabled ? '25px' : '3px', transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {/* Frequency */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Frequency</label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['daily', 'weekly', 'monthly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setConfig({ ...config, frequency: f })}
              style={{
                padding: '8px 18px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' as const,
                background: config.frequency === f ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.04)',
                color: config.frequency === f ? '#fff' : 'rgba(255,255,255,0.5)',
                borderColor: config.frequency === f ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Time of Day</label>
        <select
          value={config.time.split(':')[0]}
          onChange={(e) => setConfig({ ...config, time: `${e.target.value}:00` })}
          style={{ ...inputStyle, width: '120px' }}
        >
          {hours.map((h) => <option key={h} value={h}>{h}:00</option>)}
        </select>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginLeft: '10px' }}>Always runs at :00 minutes</span>
      </div>

      {/* Day of week (weekly only) */}
      {config.frequency === 'weekly' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Day of Week</label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {dayNames.map((d, i) => (
              <button
                key={d}
                onClick={() => setConfig({ ...config, dayOfWeek: i })}
                style={{
                  padding: '8px 12px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  background: config.dayOfWeek === i ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.04)',
                  color: config.dayOfWeek === i ? '#fff' : 'rgba(255,255,255,0.5)',
                  borderColor: config.dayOfWeek === i ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Day of month (monthly only) */}
      {config.frequency === 'monthly' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Day of Month</label>
          <input
            type="number"
            min={1}
            max={28}
            value={config.dayOfMonth}
            onChange={(e) => setConfig({ ...config, dayOfMonth: Number(e.target.value) })}
            style={{ ...inputStyle, width: '80px' }}
          />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginLeft: '10px' }}>1–28</span>
        </div>
      )}

      {/* Keep last N */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Keep Last N Backups</label>
        <input
          type="number"
          min={3}
          max={30}
          value={config.keepLast}
          onChange={(e) => setConfig({ ...config, keepLast: Number(e.target.value) })}
          style={{ ...inputStyle, width: '80px' }}
        />
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginLeft: '10px' }}>Older backups deleted automatically</span>
      </div>

      {/* Next run preview */}
      <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', marginBottom: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
        📅 <strong>{nextRun()}</strong>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving} style={{ ...primaryBtnStyle, opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Saving...' : 'Save Schedule'}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 3 — GOOGLE DRIVE (Placeholder)
   ═══════════════════════════════════════════════════════════════════════════ */

function DriveTab({ password }: { password: string }) {
  const [status, setStatus] = useState<{ connected: boolean; email: string; folderId: string } | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [sRes, fRes] = await Promise.all([
        apiFetch('/drive/status', password),
        apiFetch('/drive/files', password),
      ]);
      if (sRes.ok) setStatus(await sRes.json());
      if (fRes.ok) setFiles(await fRes.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, [password]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (fileId: string) => {
    try {
      const res = await apiFetch(`/drive/file/${fileId}`, password, { method: 'DELETE' });
      if (res.ok) { setToast('Deleted from Drive.'); loadData(); }
    } catch { /* ignore */ }
    setDeleteConfirm(null);
  };

  const fmtDate = (iso: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: '40px', textAlign: 'center' as const }}>Loading Drive status...</div>;

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', padding: '12px 20px', borderRadius: '10px', background: 'rgba(99,102,241,0.9)', color: '#fff', fontSize: '13px', fontWeight: 600, zIndex: 999 }}>
          {toast}
        </div>
      )}

      {/* Connection status */}
      <div style={{ ...cardStyle, marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>☁️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>Google Drive</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              Status: {status?.connected
                ? <span style={{ color: '#34d399' }}>Connected ✓</span>
                : <span style={{ color: '#f87171' }}>Not configured</span>
              }
            </div>
          </div>
          {status?.connected && <span style={{ ...badgeStyle, background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>🟢 Active</span>}
        </div>
        {status?.connected && (
          <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            <div>Service Account: <strong style={{ color: '#a78bfa' }}>{status.email}</strong></div>
            <div style={{ marginTop: '4px' }}>Folder ID: <code style={{ color: '#a78bfa' }}>{status.folderId}</code></div>
          </div>
        )}
        {!status?.connected && (
          <div style={{ marginTop: '16px', padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#a78bfa', marginBottom: '12px', marginTop: 0 }}>Setup Instructions</h4>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              <div style={{ marginBottom: '4px' }}>1. Create a <strong>Service Account</strong> in Google Cloud Console</div>
              <div style={{ marginBottom: '4px' }}>2. Enable <strong>Google Drive API</strong></div>
              <div style={{ marginBottom: '4px' }}>3. Download the JSON key file</div>
              <div style={{ marginBottom: '4px' }}>4. Place it at:</div>
              <code style={{ display: 'block', padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', fontSize: '12px', color: '#a78bfa', marginBottom: '8px', marginLeft: '16px' }}>
                /data/backups/google-service-account.json
              </code>
              <div style={{ marginBottom: '4px' }}>5. Add to server <strong>.env</strong>:</div>
              <code style={{ display: 'block', padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', fontSize: '12px', color: '#a78bfa', marginLeft: '16px' }}>
                GDRIVE_FOLDER_ID=your_folder_id
              </code>
              <div style={{ marginTop: '8px' }}>6. Share Drive folder with service account email</div>
            </div>
          </div>
        )}
      </div>

      {/* Drive files list */}
      {status?.connected && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>Files in Drive ({files.length})</h3>
            <button onClick={() => loadData()} style={actionBtnStyle}>↻ Refresh</button>
          </div>

          {files.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center' as const, padding: '40px 20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📂</div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>No files uploaded to Drive yet. Use the ☁️ Drive button on a backup to upload.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {files.map((f: any) => (
              <div key={f.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const, padding: '14px 20px' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>{f.name}</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' as const }}>
                    <span style={badgeStyle}>{f.size}</span>
                    <span style={badgeStyle}>{fmtDate(f.createdTime)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {f.webViewLink && <a href={f.webViewLink} target="_blank" rel="noopener noreferrer" style={{ ...actionBtnStyle, color: '#60a5fa' }}>🔗 Open</a>}
                  {deleteConfirm === f.id ? (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => handleDelete(f.id)} style={{ ...actionBtnStyle, color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} style={actionBtnStyle}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(f.id)} style={{ ...actionBtnStyle, color: '#f87171', borderColor: 'rgba(248,113,113,0.2)' }}>🗑</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Shared Styles
   ═══════════════════════════════════════════════════════════════════════════ */

const titleStyle: React.CSSProperties = {
  fontFamily: '"Syne", sans-serif',
  fontWeight: 800,
  fontSize: '28px',
  letterSpacing: '-0.03em',
  color: '#fff',
  marginBottom: '16px',
  marginTop: 0,
};

const cardStyle: React.CSSProperties = {
  padding: '20px',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#e2e8f0',
  fontSize: '14px',
  outline: 'none',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

const primaryBtnStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  border: 'none',
  color: '#fff',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

const actionBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
};

const badgeStyle: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  fontSize: '11px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.6)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.03em',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};
