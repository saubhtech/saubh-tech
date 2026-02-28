'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface SaubhUser {
  userid: string;
  whatsapp: string;
  fname: string;
  lname?: string;
  email?: string;
  usertype: string;
  status: string;
  pic?: string;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

type Tab = 'requirements' | 'offerings';

export default function DashboardPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const [user, setUser] = useState<SaubhUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>('requirements');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Chat & Video from dashboard ──
  const handleChat = async (targetUserId: string, label?: string) => {
    if (chatting) return;
    setChatting(label || targetUserId);
    try {
      const tk = getCookie('saubh_token');
      if (!tk) { router.push('/' + locale + '/login'); return; }
      const res = await fetch('/api/chat/dm', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + tk, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_b: targetUserId }),
      });
      const data = await res.json();
      if (data.conversation_id) {
        router.push('/' + locale + '/chat?dm=' + data.conversation_id);
      } else {
        router.push('/' + locale + '/chat');
      }
    } catch (err) {
      console.error('Chat init failed', err);
      router.push('/' + locale + '/chat');
    } finally { setChatting(null); }
  };

  const handleVideo = async (targetUserId: string, label?: string) => {
    if (chatting) return;
    setChatting(label || targetUserId);
    try {
      const tk = getCookie('saubh_token');
      if (!tk) { router.push('/' + locale + '/login'); return; }
      const res = await fetch('/api/chat/dm', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + tk, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_b: targetUserId }),
      });
      const data = await res.json();
      if (data.conversation_id) {
        router.push('/' + locale + '/chat?dm=' + data.conversation_id + '&call=video');
      } else {
        router.push('/' + locale + '/chat');
      }
    } catch (err) {
      console.error('Video call init failed', err);
      router.push('/' + locale + '/chat');
    } finally { setChatting(null); }
  };

  // ── Dashboard data ──
  const [requirements, setRequirements] = useState<any[]>([]);
  const [offerings, setOfferings] = useState<any[]>([]);

  // ── Helpers ──
  const parseDecimal = (v: any): number | null => {
    if (!v) return null;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') { const n = Number(v); return isNaN(n) ? null : n; }
    if (typeof v === 'object' && v.d) {
      const digits = v.d.join('');
      const e = v.e ?? 0;
      const sign = v.s === -1 ? -1 : 1;
      if (e + 1 >= digits.length) return sign * Number(digits + '0'.repeat(e + 1 - digits.length));
      return sign * Number(digits.slice(0, e + 1) + '.' + digits.slice(e + 1));
    }
    return null;
  };
  const fmtBudget = (b: any) => {
    const n = parseDecimal(b);
    return n === null ? "—" : "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  };

  const [calling, setCalling] = useState<string | null>(null);
  const [chatting, setChatting] = useState<string | null>(null);
  const handleCall = async (receiverUserId: string, requirid?: string, offerid?: string) => {
    if (!user) { alert('Please log in first'); return; }
    if (String(user.userid) === String(receiverUserId)) { alert('You cannot call yourself'); return; }
    if (calling) return;
    setCalling(requirid || offerid || 'call');
    try {
      const res = await fetch('/api/gig/call/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerId: user.userid,
          receiverId: receiverUserId,
          requirid: requirid || undefined,
          offerid: offerid || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('📞 Call initiated! You will receive a call shortly on your phone.');
      } else {
        alert('Call failed: ' + (data.message || JSON.stringify(data.provider_response)));
      }
    } catch (e: any) {
      alert('Call error: ' + e.message);
    } finally {
      setCalling(null);
    }
  };
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
  const delivLabel = (m: string | null) => ({ PH: "🏢 Physical", DG: "💻 Digital", PD: "🔀 Phygital" }[m || ""] || m || "—");
  const psLabel = (p: string | null) => ({ P: "📦 Product", S: "🧰 Service", B: "📦🧰 Both" }[p || ""] || "—");
  const initials = (f: string | null, l: string | null) => ((f?.[0] || "") + (l?.[0] || "") || "?").toUpperCase();
  const [loading, setLoading] = useState(true);
  // ── Filter states ──
  const [sectors, setSectors] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [postals, setPostals] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);

  const [fSector, setFSector] = useState('');
  const [fField, setFField] = useState('');
  const [fPS, setFPS] = useState('');
  const [fCountry, setFCountry] = useState('');
  const [fState, setFState] = useState('');
  const [fDistrict, setFDistrict] = useState('');
  const [fPincode, setFPincode] = useState('');
  const [fPlace, setFPlace] = useState('');
  const [fSearch, setFSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  // ── Fetch filter dropdowns ──
  useEffect(() => {
    fetch("/api/gig/sectors").then(r => r.json()).then(setSectors).catch(() => {});
    fetch("/api/gig/locations/countries").then(r => r.json()).then(setCountries).catch(() => {});
  }, []);

  useEffect(() => {
    if (fSector) {
      fetch(`/api/gig/fields/${fSector}`).then(r => r.json()).then(setFields).catch(() => {});
    } else { setFields([]); setFField(''); }
  }, [fSector]);

  useEffect(() => {
    if (fCountry) {
      fetch(`/api/gig/locations/states/${fCountry}`).then(r => r.json()).then(setStates).catch(() => {});
    } else { setStates([]); setFState(''); }
  }, [fCountry]);

  useEffect(() => {
    if (fState) {
      fetch(`/api/gig/locations/districts/${fState}`).then(r => r.json()).then(setDistricts).catch(() => {});
    } else { setDistricts([]); setFDistrict(''); }
  }, [fState]);

  useEffect(() => {
    if (fDistrict) {
      fetch(`/api/gig/locations/postals/${fDistrict}`).then(r => r.json()).then(setPostals).catch(() => {});
    } else { setPostals([]); setFPincode(''); }
  }, [fDistrict]);

  useEffect(() => {
    if (fPincode) {
      fetch(`/api/gig/locations/places/${fPincode}`).then(r => r.json()).then(setPlaces).catch(() => {});
    } else { setPlaces([]); setFPlace(''); }
  }, [fPincode]);

  // ── Apply filters ──
  const filtered = (tab === 'requirements' ? requirements : offerings).filter((item: any) => {
    if (fSector && String(item.sector_name) !== sectors.find((s: any) => String(s.sectorid) === fSector)?.sector) return false;
    if (fField && String(item.field_name) !== fields.find((f: any) => String(f.fieldid) === fField)?.field) return false;
    if (fPS && item.p_s_ps !== fPS) return false;
    if (fCountry && item.country_name !== countries.find((c: any) => c.country_code === fCountry)?.country) return false;
    if (fState && item.state_name !== states.find((s: any) => String(s.stateid) === fState)?.state) return false;
    if (fDistrict && item.district_name !== districts.find((d: any) => String(d.districtid) === fDistrict)?.district) return false;
    if (fPincode && item.pincode !== fPincode) return false;
    if (fPlace && item.place_name !== places.find((p: any) => String(p.placeid) === fPlace)?.place) return false;
    if (fSearch) {
      const q = fSearch.toLowerCase();
      const searchable = [item.requirements, item.offerings, item.market_item, item.sector_name, item.field_name, item.eligibility, item.fname, item.lname].filter(Boolean).join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);


  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const [reqRes, offRes] = await Promise.all([
          fetch("/api/gig/dashboard/requirements"),
          fetch("/api/gig/dashboard/offerings"),
        ]);
        if (reqRes.ok) setRequirements(await reqRes.json());
        if (offRes.ok) setOfferings(await offRes.json());
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  useEffect(() => {
    const token = getCookie('saubh_token');
    const userRaw = getCookie('saubh_user');
    if (!token || !userRaw) { router.replace(`/${locale}/login`); return; }
    try { setUser(JSON.parse(userRaw)); } catch { router.replace(`/${locale}/login`); return; }
    setChecking(false);
  }, [locale, router]);

  const handleLogout = () => {
    deleteCookie('saubh_token');
    deleteCookie('saubh_user');
    router.replace(`/${locale}/login`);
  };

  if (checking || !user) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#05070d',color:'#fff' }}>
        <div className="db-spinner" />
      </div>
    );
  }

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --line:rgba(255,255,255,.10);
  --text:#e5e7eb;
  --muted:#94a3b8;
  --pri:#7c3aed;
  --pri2:#06b6d4;
  --danger:#ef4444;
  --live:#22c55e;
  --shadow:0 20px 60px rgba(0,0,0,.35);
  --glass:rgba(255,255,255,.03);
  --glass2:rgba(255,255,255,.05);
}

.db{
  display:grid;grid-template-columns:260px 1fr;height:100vh;
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--text);
  background:
    radial-gradient(900px 500px at -10% -10%, rgba(124,58,237,.2), transparent 60%),
    radial-gradient(800px 500px at 110% 0%, rgba(6,182,212,.14), transparent 60%),
    linear-gradient(180deg, #05070d, #0a1020 50%, #080d17);
}

/* ═══ SIDEBAR ═══ */
.db-side{
  border-right:1px solid var(--line);
  background:linear-gradient(180deg, rgba(255,255,255,.025), rgba(255,255,255,.008));
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  padding:14px;overflow-y:auto;overflow-x:hidden;
  display:flex;flex-direction:column;gap:12px;
}
.db-side::-webkit-scrollbar{width:4px}
.db-side::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:99px}

.db-brand{
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  border:1px solid var(--line);border-radius:16px;background:var(--glass);
  box-shadow:var(--shadow);
}
.db-brand-icon{width:36px;height:36px;border-radius:11px;object-fit:cover;
  box-shadow:0 0 16px rgba(124,58,237,.3)}
.db-brand h1{font-family:'Outfit',sans-serif;font-size:15px;font-weight:900;line-height:1.1}
.db-brand small{color:var(--muted);font-size:11px}

.db-user-card{
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  border:1px solid var(--line);border-radius:14px;background:var(--glass);
}
.db-user-av{
  width:34px;height:34px;border-radius:10px;
  background:linear-gradient(135deg,#f59e0b,#ef4444);
  display:grid;place-items:center;font-weight:800;color:#fff;font-size:14px;flex-shrink:0;
}
.db-user-name{font-size:13px;font-weight:700;line-height:1.2}
.db-user-type{font-size:11px;color:var(--muted)}
.db-user-logout{
  margin-left:auto;background:none;border:none;color:var(--muted);cursor:pointer;
  font-size:16px;padding:4px;border-radius:8px;transition:.2s;
}
.db-user-logout:hover{color:#f87171;background:rgba(248,113,113,.1)}

.db-seg{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.db-seg button{
  border:1px solid var(--line);background:var(--glass);color:var(--text);
  border-radius:12px;padding:10px 8px;cursor:pointer;font-weight:700;font-size:12px;
  font-family:'Outfit',sans-serif;
  display:flex;align-items:center;justify-content:center;gap:6px;transition:.2s;
}
.db-seg button:hover{background:var(--glass2);border-color:rgba(255,255,255,.18)}
.db-seg button.active{
  background:linear-gradient(135deg, rgba(124,58,237,.2), rgba(6,182,212,.15));
  border-color:rgba(124,58,237,.4);
  box-shadow:0 0 20px rgba(124,58,237,.08);
}

.db-block{
  border:1px solid var(--line);background:var(--glass);
  border-radius:14px;padding:10px;
}
.db-block-title{
  font-family:'Outfit',sans-serif;
  font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);
  margin-bottom:8px;display:flex;align-items:center;gap:6px;
}
.db-filters{display:grid;gap:8px}
.db-fchip{background:var(--glass);border:1px solid var(--line);border-radius:10px;padding:7px}
.db-fchip label{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted);margin-bottom:4px}
.db-fchip select{
  width:100%;background:#0b1220;color:var(--text);border:1px solid var(--line);
  border-radius:8px;padding:7px 8px;font-size:12px;outline:none;font-family:inherit;
}
.db-checks{display:grid;gap:6px;margin-top:4px}
.db-check{
  display:flex;align-items:center;gap:7px;border:1px solid var(--line);border-radius:8px;
  padding:7px 8px;background:rgba(255,255,255,.015);font-size:12px;cursor:pointer;
}
.db-check input{accent-color:var(--pri)}
.db-range{margin-top:6px;padding:7px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.015)}
.db-range-bar{
  height:6px;border-radius:99px;
  background:linear-gradient(90deg,rgba(124,58,237,.7),rgba(6,182,212,.7));
  border:1px solid rgba(255,255,255,.06);margin:6px 0 3px;
}
.db-minilinks{display:grid;gap:6px}
.db-minilink{
  display:flex;align-items:center;gap:8px;border:1px solid transparent;background:rgba(255,255,255,.015);
  color:var(--text);border-radius:10px;padding:9px 10px;cursor:pointer;font-weight:600;font-size:12px;
  font-family:inherit;transition:.2s;
}
.db-minilink:hover{border-color:var(--line);background:var(--glass2)}

/* ═══ MAIN ═══ */
.db-main{display:flex;flex-direction:column;overflow:hidden}

.db-topbar{
  padding:12px 16px;border-bottom:1px solid var(--line);
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  background:rgba(255,255,255,.015);backdrop-filter:blur(14px);
}
.db-top-h2{font-family:'Outfit',sans-serif;font-size:17px;font-weight:900;display:flex;align-items:center;gap:8px}
.db-top-sub{color:var(--muted);font-size:11px;margin-top:3px}
.db-top-pills{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.db-pill{
  border:1px solid var(--line);border-radius:99px;padding:7px 11px;font-size:11px;
  background:var(--glass);display:flex;align-items:center;gap:6px;font-weight:600;cursor:pointer;
  transition:.2s;
}
.db-pill:hover{border-color:rgba(255,255,255,.2);background:var(--glass2)}

/* ═══ HERO / SEARCH ═══ */
.db-hero{
  margin:12px 16px 0;border:1px solid var(--line);border-radius:18px;
  background:
    radial-gradient(400px 140px at 0% 0%, rgba(124,58,237,.2), transparent 60%),
    radial-gradient(300px 120px at 100% 0%, rgba(6,182,212,.15), transparent 60%),
    var(--glass);
  padding:12px;box-shadow:var(--shadow);
}
.db-hero-tabs{display:flex;gap:6px;margin-bottom:10px}
.db-htab{
  border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-weight:700;font-size:12px;
  background:var(--glass);cursor:pointer;color:var(--text);font-family:'Outfit',sans-serif;
  display:flex;align-items:center;gap:6px;transition:.2s;
}
.db-htab:hover{background:var(--glass2)}
.db-htab.active{
  background:linear-gradient(135deg, rgba(124,58,237,.25), rgba(6,182,212,.18));
  border-color:rgba(124,58,237,.4);box-shadow:0 0 16px rgba(124,58,237,.1);
}
.db-search{
  display:grid;
  grid-template-columns:repeat(10,minmax(100px,1fr));
  gap:6px;align-items:end;
}
.db-search .ctrl{display:flex;flex-direction:column;gap:3px}
.db-search .ctrl label{font-size:10px;color:var(--muted);display:flex;align-items:center;gap:4px}
.db-search select,.db-search input{
  width:100%;background:#0b1220;color:var(--text);border:1px solid var(--line);
  border-radius:8px;padding:8px;font-size:12px;outline:none;font-family:inherit;
}
.db-search-btn{
  border:none;border-radius:10px;padding:9px 12px;font-weight:800;cursor:pointer;color:#fff;
  font-family:'Outfit',sans-serif;font-size:12px;
  background:linear-gradient(135deg,var(--pri),var(--pri2));
  display:flex;align-items:center;justify-content:center;gap:5px;transition:.2s;
  box-shadow:0 4px 16px rgba(124,58,237,.25);
}
.db-search-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(124,58,237,.35)}
.db-hero-label{
  font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;
  display:flex;align-items:center;gap:8px;margin-top:8px;
}

/* ═══ CONTENT ═══ */
.db-content{padding:12px 16px 18px;overflow:auto;flex:1}
.db-content::-webkit-scrollbar{width:5px}
.db-content::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:99px}

/* ═══ REQUIREMENT CARD ═══ */
.req-card{
  border:1px solid var(--line);
  background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015));
  border-radius:18px;padding:12px;box-shadow:var(--shadow);display:grid;gap:10px;
}
.req-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap}
.req-rating{
  display:inline-flex;align-items:center;gap:5px;border:1px solid rgba(245,158,11,.25);
  background:rgba(245,158,11,.08);color:#fbbf24;border-radius:99px;padding:4px 8px;font-size:11px;font-weight:700;
}
.req-provider{display:flex;align-items:center;gap:10px;margin-top:6px;flex-wrap:wrap}
.req-av{
  width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#f472b6,#60a5fa);
  display:grid;place-items:center;font-weight:800;color:#fff;font-size:14px;flex-shrink:0;
  border:1px solid rgba(255,255,255,.15);
}
.req-cname{font-size:13px;font-weight:800;display:flex;align-items:center;gap:5px}
.req-badges{display:flex;gap:5px;flex-wrap:wrap}
.badge{
  border-radius:99px;border:1px solid var(--line);padding:4px 7px;font-size:10px;font-weight:700;
  background:var(--glass);display:inline-flex;align-items:center;gap:3px;
}
.badge-dv{color:#93c5fd;border-color:rgba(59,130,246,.3);background:rgba(59,130,246,.08)}
.badge-pv{color:#86efac;border-color:rgba(16,185,129,.3);background:rgba(16,185,129,.08)}
.req-title{font-family:'Outfit',sans-serif;font-size:14px;font-weight:800;line-height:1.25}
.req-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.meta-pill{
  border:1px solid var(--line);border-radius:99px;padding:5px 9px;font-size:11px;
  background:rgba(255,255,255,.02);font-weight:700;display:flex;align-items:center;gap:5px;
  white-space:nowrap;
}
.req-subtitle{font-family:'Outfit',sans-serif;font-size:14px;font-weight:800;line-height:1.25}
.req-desc{color:var(--muted);font-size:11px;line-height:1.45}
.view-more{color:#a78bfa;text-decoration:none;font-weight:700}
.view-more:hover{text-decoration:underline}

.req-grid{
  display:grid;grid-template-columns:1.1fr 1.5fr 1.2fr 1.2fr .8fr;gap:6px;
}
.req-col{
  border:1px solid var(--line);border-radius:12px;padding:8px;
  background:rgba(255,255,255,.015);min-height:110px;
}
.req-col h5{
  font-family:'Outfit',sans-serif;
  margin:0 0 6px;font-size:10px;color:var(--muted);
  text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:5px;
}
.req-col-stack{display:grid;gap:3px;font-size:11px;font-weight:700;line-height:1.4}
.req-col-stack .muted{color:var(--muted);font-weight:600}

.bid-btn{
  border:none;border-radius:8px;padding:7px 8px;cursor:pointer;font-weight:800;color:#fff;
  font-family:'Outfit',sans-serif;font-size:11px;width:100%;
  background:linear-gradient(135deg,var(--pri),var(--pri2));transition:.2s;
}
.bid-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(124,58,237,.3)}

.actions-row{
  display:flex;gap:6px;flex-wrap:wrap;align-items:center;
  border-top:1px solid var(--line);padding-top:8px;
}
.icon-btn{
  border:1px solid var(--line);background:rgba(255,255,255,.02);color:var(--text);
  border-radius:8px;padding:7px 9px;cursor:pointer;font-weight:700;font-size:11px;
  font-family:inherit;display:flex;align-items:center;justify-content:center;gap:5px;transition:.2s;
}
.icon-btn-pri{
  background:linear-gradient(135deg, rgba(124,58,237,.22), rgba(6,182,212,.16));
  border-color:rgba(124,58,237,.3);
}
.icon-btn-pri:hover{border-color:rgba(124,58,237,.5);transform:translateY(-1px)}
.live-badge{
  margin-left:auto;border-radius:99px;padding:5px 9px;font-size:11px;font-weight:800;
  border:1px solid;display:inline-flex;align-items:center;gap:5px;
}
.live-on{color:#86efac;border-color:rgba(34,197,94,.3);background:rgba(34,197,94,.08)}
.live-off{color:#fca5a5;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.06)}
.blink{
  width:7px;height:7px;border-radius:50%;background:var(--live);display:inline-block;
  animation:pulse 1.4s infinite;
}
@keyframes pulse{
  0%{box-shadow:0 0 0 0 rgba(34,197,94,.6)}
  70%{box-shadow:0 0 0 7px rgba(34,197,94,0)}
  100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}
}

/* ═══ OFFERINGS GRID ═══ */
.off-grid{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:10px;align-items:start;
}
.off-card{
  border:1px solid var(--line);
  background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015));
  border-radius:18px;padding:12px;box-shadow:var(--shadow);display:grid;gap:10px;
}
.off-provider{display:flex;gap:10px;align-items:flex-start}
.off-av{
  width:48px;height:48px;border-radius:14px;
  display:grid;place-items:center;font-weight:800;color:#fff;font-size:15px;flex-shrink:0;
  border:1px solid rgba(255,255,255,.15);
}
.off-meta{display:grid;gap:4px;min-width:0}
.off-name{font-size:14px;font-weight:800;display:flex;align-items:center;gap:5px}
.off-sub{color:var(--muted);font-size:11px;font-weight:600}
.off-title{font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;line-height:1.25}
.off-desc{color:var(--muted);font-size:11px;line-height:1.45}
.mode-row{display:flex;gap:6px;flex-wrap:wrap}

/* ═══ PAGINATION & LEGEND ═══ */
.db-pagination{margin-top:10px;display:flex;justify-content:center;gap:4px;flex-wrap:wrap}
.db-page-chip{
  border:1px solid var(--line);background:var(--glass);color:var(--text);
  border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;
  cursor:pointer;transition:.2s;font-family:inherit;
}
.db-page-chip:hover:not(:disabled){background:var(--glass2);border-color:rgba(255,255,255,.2)}
.db-page-chip.active{background:linear-gradient(135deg,rgba(124,58,237,.3),rgba(6,182,212,.2));border-color:rgba(124,58,237,.5)}
.db-page-chip:disabled{opacity:.3;cursor:default}
.db-page-chip{
  border:1px dashed var(--line);border-radius:10px;padding:7px 12px;
  color:var(--muted);font-size:11px;background:rgba(255,255,255,.015);
}
.db-legend{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.db-tag{
  border:1px solid var(--line);background:var(--glass);border-radius:99px;
  padding:6px 9px;font-size:11px;color:var(--muted);display:flex;align-items:center;gap:5px;
}
.dot{width:7px;height:7px;border-radius:99px;display:inline-block}
.dot-live{background:var(--live);box-shadow:0 0 8px rgba(34,197,94,.7)}
.dot-away{background:var(--danger)}
.db-messages{margin-top:8px;color:var(--muted);font-size:11px;display:flex;align-items:center;gap:5px}

/* ═══ SPINNER ═══ */
.db-spinner{
  width:28px;height:28px;border:3px solid rgba(255,255,255,.1);
  border-top-color:var(--pri);border-radius:50%;animation:spin .6s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}

/* ═══ MOBILE TOGGLE ═══ */
.db-menu-toggle{
  display:none;background:none;border:none;color:var(--text);font-size:22px;
  cursor:pointer;padding:4px;
}

/* ═══ RESPONSIVE ═══ */
@media(max-width:1500px){
  .db-search{grid-template-columns:repeat(5,minmax(120px,1fr))}
  .req-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:1400px){
  .off-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:980px){
  .db{grid-template-columns:1fr;height:auto;min-height:100vh}
  .db-side{
    position:fixed;left:0;top:0;bottom:0;width:260px;z-index:100;
    transform:translateX(-100%);transition:transform .3s;
  }
  .db-side.open{transform:translateX(0)}
  .db-side-overlay{
    position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99;
    opacity:0;pointer-events:none;transition:opacity .3s;
  }
  .db-side-overlay.open{opacity:1;pointer-events:auto}
  .db-main{overflow:auto}
  .db-menu-toggle{display:block}
}
@media(max-width:700px){
  .db-search{grid-template-columns:1fr 1fr}
  .db-search-btn{grid-column:span 2}
  .db-topbar{align-items:flex-start;flex-direction:column}
  .req-grid{grid-template-columns:1fr}
  .off-grid{grid-template-columns:1fr}
  .live-badge{margin-left:0}
}
      `}</style>

      <div className="db">
        {/* Mobile overlay */}
        <div
          className={`db-side-overlay${sidebarOpen ? '' : ''}`}
          style={{ display: 'none' }}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ═══ SIDEBAR ═══ */}
        <aside className={`db-side${sidebarOpen ? ' open' : ''}`}>
          <div className="db-brand">
            <Image src="/logo.jpg" alt="Saubh.Tech" width={36} height={36} className="db-brand-icon" />
            <div>
              <h1>Saubh.Tech</h1>
              <small>Gig Marketplace</small>
            </div>
          </div>

          {/* User card */}
          <div className="db-user-card">
            {user.pic ? <img src={user.pic} alt="" className="db-user-av" style={{objectFit:"cover"}} /> : <div className="db-user-av">{user.fname.charAt(0).toUpperCase()}</div>}
            <div>
              <div className="db-user-name">{user.fname}</div>
              <div className="db-user-type">{user.usertype === 'BO' ? 'Business Owner' : user.usertype === 'CL' ? 'Client' : 'Gig Worker'}</div>
            </div>
            <button className="db-user-logout" onClick={handleLogout} title="Logout">⏻</button>
          </div>

          {/* Tabs */}
          <div className="db-seg">
            <button className={tab === 'requirements' ? 'active' : ''} onClick={() => setTab('requirements')}>
              📋 Requirements
            </button>
            <button className={tab === 'offerings' ? 'active' : ''} onClick={() => setTab('offerings')}>
              🧰 Offerings
            </button>
          </div>

          {/* Filters */}
          <div className="db-block">
            <p className="db-block-title">🔎 Filter</p>
            <div className="db-filters">
              <div className="db-fchip"><label><span>🏷️</span><span>Sector</span></label><select value={fSector} onChange={e => { setFSector(e.target.value); setFField(''); }}><option value="">All Sectors</option>{sectors.map((s: any) => <option key={s.sectorid} value={s.sectorid}>{s.sector}</option>)}</select></div>
              <div className="db-fchip"><label><span>🧩</span><span>Field</span></label><select value={fField} onChange={e => setFField(e.target.value)} disabled={!fSector}><option value="">All Fields</option>{fields.map((f: any) => <option key={f.fieldid} value={f.fieldid}>{f.field}</option>)}</select></div>
              <div className="db-fchip"><label><span>📦🧰</span><span>Type</span></label><select value={fPS} onChange={e => setFPS(e.target.value)}><option value="">All Types</option><option value="P">📦 Product</option><option value="S">🧰 Service</option><option value="B">📦🧰 Both</option></select></div>
              <div className="db-fchip"><label><span>🌍</span><span>Country</span></label><select value={fCountry} onChange={e => { setFCountry(e.target.value); setFState(''); setFDistrict(''); setFPincode(''); setFPlace(''); }}><option value="">All Countries</option>{countries.map((c: any) => <option key={c.country_code} value={c.country_code}>{c.flag} {c.country}</option>)}</select></div>
              <div className="db-fchip"><label><span>🗺️</span><span>State</span></label><select value={fState} onChange={e => { setFState(e.target.value); setFDistrict(''); setFPincode(''); setFPlace(''); }} disabled={!fCountry}><option value="">All States</option>{states.map((s: any) => <option key={s.stateid} value={s.stateid}>{s.state}</option>)}</select></div>
              <div className="db-fchip"><label><span>📍</span><span>District</span></label><select value={fDistrict} onChange={e => { setFDistrict(e.target.value); setFPincode(''); setFPlace(''); }} disabled={!fState}><option value="">All Districts</option>{districts.map((d: any) => <option key={d.districtid} value={d.districtid}>{d.district}</option>)}</select></div>
              <div className="db-fchip"><label><span>🏤</span><span>Post Code</span></label><select value={fPincode} onChange={e => { setFPincode(e.target.value); setFPlace(''); }} disabled={!fDistrict}><option value="">All Pincodes</option>{postals.map((p: any) => <option key={p.postid} value={p.pincode}>{p.pincode} - {p.postoffice}</option>)}</select></div>
              <div className="db-fchip"><label><span>📌</span><span>Place</span></label><select value={fPlace} onChange={e => setFPlace(e.target.value)} disabled={!fPincode}><option value="">All Places</option>{places.map((p: any) => <option key={p.placeid} value={p.placeid}>{p.place}</option>)}</select></div>

              <div className="db-checks">
                <label className="db-check"><input type="checkbox" defaultChecked /> ✅ Verified</label>
                <label className="db-check"><input type="checkbox" /> ⭐ Top Rated</label>
              </div>

              <div className="db-range">
                <label style={{fontSize:'10px',color:'var(--muted)',display:'block',marginBottom:'4px'}}>💰 Budget Range</label>
                <div style={{fontSize:'11px',color:'#e5e7eb'}}>₹1.00 to ₹999K</div>
                <div className="db-range-bar" aria-label="Bar Slide" />
                <div style={{fontSize:'10px',color:'var(--muted)'}}>Bar Slide.</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="db-block">
            <div className="db-minilinks">
              <button className="db-minilink" onClick={() => router.push(`/${locale}/gig`)}>🚀 Gig</button>
              <button className="db-minilink">💸 Income</button>
              <button className="db-minilink">🧾 My Bids</button>
              <button className="db-minilink">🛡️ Escrow Money</button>
            </div>
          </div>
        </aside>

        {/* ═══ MAIN ═══ */}
        <main className="db-main">
          {/* Top bar */}
          <div className="db-topbar">
            <div>
              <button className="db-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
              <h2 className="db-top-h2">🚀 Gig Marketplace</h2>
              <p className="db-top-sub">|| Real Clients || Verified Providers || Secured Payments ||</p>
            </div>
            <div className="db-top-pills">
              <div className="db-pill" style={{cursor:"pointer"}} onClick={() => router.push(`/${locale}/gig`)}>🚀 Gig</div>
              <div className="db-pill">💸 Income</div>
              <div className="db-pill">🧾 My Bids</div>
              <div className="db-pill">🛡️ Escrow Money</div>
            </div>
          </div>

          {/* Hero / Search */}
          <section className="db-hero">
            <div className="db-hero-tabs">
              <button className={`db-htab${tab === 'requirements' ? ' active' : ''}`} onClick={() => setTab('requirements')}>
                📋 Requirements
              </button>
              <button className={`db-htab${tab === 'offerings' ? ' active' : ''}`} onClick={() => setTab('offerings')}>
                🧰 Offerings
              </button>
            </div>

            <div className="db-search">
              <div className="ctrl"><label>🏷️ Sector</label><select value={fSector} onChange={e => { setFSector(e.target.value); setFField(''); }}><option value="">All Sectors</option>{sectors.map((s: any) => <option key={s.sectorid} value={s.sectorid}>{s.sector}</option>)}</select></div>
              <div className="ctrl"><label>🧩 Field</label><select value={fField} onChange={e => setFField(e.target.value)} disabled={!fSector}><option value="">All Fields</option>{fields.map((f: any) => <option key={f.fieldid} value={f.fieldid}>{f.field}</option>)}</select></div>
              <div className="ctrl"><label>📦🧰 Type</label><select value={fPS} onChange={e => setFPS(e.target.value)}><option value="">All Types</option><option value="P">📦 Product</option><option value="S">🧰 Service</option><option value="B">📦🧰 Both</option></select></div>
              <div className="ctrl"><label>🌍 Country</label><select value={fCountry} onChange={e => { setFCountry(e.target.value); setFState(''); setFDistrict(''); setFPincode(''); setFPlace(''); }}><option value="">All Countries</option>{countries.map((c: any) => <option key={c.country_code} value={c.country_code}>{c.flag} {c.country}</option>)}</select></div>
              <div className="ctrl"><label>🗺️ State</label><select value={fState} onChange={e => { setFState(e.target.value); setFDistrict(''); setFPincode(''); setFPlace(''); }} disabled={!fCountry}><option value="">All States</option>{states.map((s: any) => <option key={s.stateid} value={s.stateid}>{s.state}</option>)}</select></div>
              <div className="ctrl"><label>📍 District</label><select value={fDistrict} onChange={e => { setFDistrict(e.target.value); setFPincode(''); setFPlace(''); }} disabled={!fState}><option value="">All Districts</option>{districts.map((d: any) => <option key={d.districtid} value={d.districtid}>{d.district}</option>)}</select></div>
              <div className="ctrl"><label>🏤 Post Code</label><select value={fPincode} onChange={e => { setFPincode(e.target.value); setFPlace(''); }} disabled={!fDistrict}><option value="">All Pincodes</option>{postals.map((p: any) => <option key={p.postid} value={p.pincode}>{p.pincode} - {p.postoffice}</option>)}</select></div>
              <div className="ctrl"><label>📌 Place</label><select value={fPlace} onChange={e => setFPlace(e.target.value)} disabled={!fPincode}><option value="">All Places</option>{places.map((p: any) => <option key={p.placeid} value={p.placeid}>{p.place}</option>)}</select></div>
              <div className="ctrl"><label>🔑 Search</label><input placeholder="Keyword..." value={fSearch} onChange={e => setFSearch(e.target.value)} /></div>
              <button className="db-search-btn" onClick={() => { setFSector(''); setFField(''); setFPS(''); setFCountry(''); setFState(''); setFDistrict(''); setFPincode(''); setFPlace(''); setFSearch(''); setPage(1); }}>✖ Clear</button>
              <div className="db-hero-label">🪄 {tab === 'requirements' ? 'Requirements' : 'Offerings'} ({filtered.length})</div>
            </div>
          </section>

          {/* Content area */}
          <section className="db-content">

            {/* ═══ REQUIREMENTS TAB ═══ */}
            {tab === 'requirements' && (
              <>
                {loading && <div style={{textAlign:'center',padding:'40px',color:'var(--muted)'}}>Loading requirements...</div>}
                {!loading && filtered.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'var(--muted)'}}>No requirements found.</div>}
                {!loading && paginated.map((r: any) => (
                  <article className="req-card" key={r.requirid}>
                    <div className="req-head">
                      <div>
                        <div className="req-provider">
                          {r.pic ? <img src={r.pic} alt="" className="req-av" style={{objectFit:"cover"}} /> : <div className="req-av">{initials(r.fname, r.lname)}</div>}
                          <div>
                            <div className="req-cname">👤 {[r.fname, r.lname].filter(Boolean).join(' ') || 'Anonymous'}</div>
                            <div className="req-badges">
                              {r.verified === 'DV' && <span className="badge badge-dv">🛡️ DV</span>}
                              {r.verified === 'PV' && <span className="badge badge-pv">✅ PV</span>}
                              {r.verified === 'BOTH' && <><span className="badge badge-dv">🛡️ DV</span><span className="badge badge-pv">✅ PV</span></>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="req-title">Required: {r.market_item || '—'}</div>

                    <div className="req-meta">
                      <span className="meta-pill">{psLabel(r.p_s_ps)}</span>
                      {r.doc_url && <a href={r.doc_url} target="_blank" rel="noreferrer" className="meta-pill">📄 read</a>}
                      {r.audio_url && <span className="meta-pill" onClick={() => { const a = new Audio(r.audio_url); a.play(); }} style={{cursor:'pointer'}}>🎧 listen</span>}
                      {r.video_url && <a href={r.video_url} target="_blank" rel="noreferrer" className="meta-pill">🎬 view</a>}
                    </div>

                    <div className="req-subtitle">{r.sector_name || '—'} → {r.field_name || '—'}</div>
                    {r.requirements && (
                      <p className="req-desc">{r.requirements}</p>
                    )}

                    <div className="req-grid">
                      <div className="req-col">
                        <h5>🚚 Delivery</h5>
                        <div className="req-col-stack">
                          <div>{delivLabel(r.delivery_mode)}</div>
                        </div>
                      </div>

                      <div className="req-col">
                        <h5>📍 Location</h5>
                        <div className="req-col-stack">
                          {r.country_name && <div>{r.country_name}</div>}
                          {r.state_name && <div>{r.state_name}</div>}
                          {r.district_name && <div>{r.district_name}</div>}
                          {r.pincode && <div>{r.pincode}</div>}
                          {r.place_name && <div>{r.place_name}</div>}
                          {!r.country_name && !r.state_name && <div style={{color:'var(--muted)'}}>Not specified</div>}
                        </div>
                      </div>

                      <div className="req-col">
                        <h5>✅ Eligibility</h5>
                        <div className="req-col-stack">
                          <div>{r.eligibility || '—'}</div>
                        </div>
                      </div>

                      <div className="req-col">
                        <h5>💰 Budget</h5>
                        <div className="req-col-stack">
                          <div>{fmtBudget(r.budget)}</div>
                          <div>Escrow: {fmtBudget(r.escrow)}</div>
                          <div>Bid by: {fmtDate(r.bidate)}</div>
                          <div>Deliver: {fmtDate(r.delivdate)}</div>
                        </div>
                      </div>

                      <div className="req-col">
                        <h5>🧾 Bids</h5>
                        <div className="req-col-stack">
                          <div>Total</div>
                          <div style={{fontSize:'18px',lineHeight:1}}>{r.bid_count || 0}</div>
                          <button className="bid-btn">Bid now</button>
                        </div>
                      </div>
                    </div>

                    <div className="actions-row">
                      <button className="icon-btn icon-btn-pri" disabled={calling === r.requirid} onClick={() => handleCall(r.userid, r.requirid)}>{calling === r.requirid ? '📞 Calling...' : '📞 Call'}</button>
                      <button className="icon-btn icon-btn-pri" disabled={!!chatting} onClick={() => handleChat(r.userid, r.requirid)}>{chatting === r.requirid ? '💬 Opening...' : '💬 Chat'}</button>
                      <button className="icon-btn icon-btn-pri" disabled={!!chatting} onClick={() => handleVideo(r.userid, r.requirid)}>🎥 Video</button>
                    </div>
                  </article>
                ))}
              </>
            )}

            {/* ═══ OFFERINGS TAB ═══ */}
            {tab === 'offerings' && (
              <div className="off-grid">
                {loading && <div style={{textAlign:'center',padding:'40px',color:'var(--muted)'}}>Loading offerings...</div>}
                {!loading && filtered.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'var(--muted)'}}>No offerings found.</div>}
                {!loading && paginated.map((o: any) => (
                  <article className="off-card" key={o.offerid}>
                    <div className="off-provider">
                      {o.pic ? <img src={o.pic} alt="" className="off-av" style={{objectFit:'cover'}} /> : <div className="off-av" style={{background:'linear-gradient(135deg,#f472b6,#60a5fa)'}}>{initials(o.fname, o.lname)}</div>}
                      <div className="off-meta">
                        <div className="off-name">👤 {[o.fname, o.lname].filter(Boolean).join(' ') || 'Anonymous'}</div>
                        <div className="req-badges">
                          {o.verified === 'DV' && <span className="badge badge-dv">🛡️ DV</span>}
                          {o.verified === 'PV' && <span className="badge badge-pv">✅ PV</span>}
                          {o.verified === 'BOTH' && <><span className="badge badge-dv">🛡️ DV</span><span className="badge badge-pv">✅ PV</span></>}
                        </div>
                        <div className="off-sub">{o.sector_name || '—'} → {o.field_name || '—'}</div>
                      </div>
                    </div>
                    <div className="req-meta">
                      <span className="meta-pill">{psLabel(o.p_s_ps)}</span>
                      {o.doc_url && <a href={o.doc_url} target="_blank" rel="noreferrer" className="meta-pill">📄 read</a>}
                      {o.audio_url && <span className="meta-pill" onClick={() => { const a = new Audio(o.audio_url); a.play(); }} style={{cursor:'pointer'}}>🎧 listen</span>}
                      {o.video_url && <a href={o.video_url} target="_blank" rel="noreferrer" className="meta-pill">🎬 view</a>}
                    </div>
                    <div>
                      <h4 className="off-title">Offered: {o.market_item || '—'}</h4>
                      {o.offerings && <p className="off-desc">{o.offerings}</p>}
                    </div>
                    <div className="mode-row">
                      <span className="meta-pill">🚚 Delivery:</span>
                      <span className="meta-pill">{delivLabel(o.delivery_mode)}</span>
                    </div>
                    <div className="actions-row">
                      <button className="icon-btn icon-btn-pri" disabled={calling === o.offerid} onClick={() => handleCall(o.userid, undefined, o.offerid)}>{calling === o.offerid ? '📞 Calling...' : '📞 Call'}</button>
                      <button className="icon-btn icon-btn-pri" disabled={chatting === o.offerid} onClick={() => handleChat(o.userid, o.offerid)}>{chatting === o.offerid ? '💬 Opening...' : '💬 Chat'}</button>
                      <button className="icon-btn icon-btn-pri" onClick={() => handleVideo(o.userid, o.offerid)}>🎥 Video</button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="db-pagination">
                <button className="db-page-chip" onClick={() => setPage(1)} disabled={page === 1}>«</button>
                <button className="db-page-chip" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce((acc: (number | string)[], p, i, arr) => {
                    if (i > 0 && typeof arr[i-1] === 'number' && (p as number) - (arr[i-1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    typeof p === 'string'
                      ? <span key={`dot-${i}`} className="db-page-chip" style={{cursor:'default',opacity:.5}}>…</span>
                      : <button key={p} className={`db-page-chip${p === page ? ' active' : ''}`} onClick={() => setPage(p as number)}>{p}</button>
                  )
                }
                <button className="db-page-chip" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                <button className="db-page-chip" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
              </div>
            )}

            {/* Legend */}
            <div className="db-legend">
              <div className="db-tag">📦 Product</div>
              <div className="db-tag">🧰 Service</div>
              <div className="db-tag">🏢 Physical</div>
              <div className="db-tag">💻 Digital</div>
              <div className="db-tag">🔀 Phygital</div>
              <div className="db-tag">✅ Digital Verified</div>
              <div className="db-tag">✅ Physical Verified</div>
              <div className="db-tag"><span className="dot dot-live" />Live</div>
              <div className="db-tag"><span className="dot dot-away" />Off/Away</div>
            </div>

            <div className="db-messages">💬 Messages</div>
          </section>
        </main>
      </div>
    </>
  );
}
