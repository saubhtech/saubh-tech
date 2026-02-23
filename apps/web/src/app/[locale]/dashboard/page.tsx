'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface SaubhUser {
  userid: string;
  whatsapp: string;
  fname: string;
  lname?: string;
  email?: string;
  usertype: string;
  status: string;
}

const USER_TYPE_LABELS: Record<string, string> = {
  BO: 'Business Owner',
  CL: 'Client',
  GW: 'Gig Worker',
  SA: 'Super Admin',
  AD: 'Admin',
};

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export default function DashboardPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const [user, setUser] = useState<SaubhUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getCookie('saubh_token');
    const userRaw = getCookie('saubh_user');

    if (!token || !userRaw) {
      router.replace(`/${locale}/login`);
      return;
    }

    try {
      const parsed = JSON.parse(userRaw);
      setUser(parsed);
    } catch {
      router.replace(`/${locale}/login`);
      return;
    }

    // Profile completion gate: redirect to /profile if incomplete
    const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech/api';
    fetch(`${API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d && d.isComplete === false) { router.replace(`/${locale}/profile`); return; }
        setChecking(false);
      })
      .catch(() => setChecking(false));
    return; // setChecking handled in .then above
  }, [locale, router]);

  const handleLogout = () => {
    deleteCookie('saubh_token');
    deleteCookie('saubh_user');
    router.replace(`/${locale}/login`);
  };

  if (checking || !user) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0a0f', color: '#fff',
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
        padding: '40px', maxWidth: '420px', width: '90%',
        border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
      }}>
        {/* Avatar placeholder */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: 700, margin: '0 auto 20px',
        }}>
          {user.fname.charAt(0).toUpperCase()}
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px' }}>
          Welcome, {user.fname}!
        </h1>

        {/* Usertype badge */}
        <span style={{
          display: 'inline-block', padding: '4px 14px', borderRadius: '20px',
          fontSize: '13px', fontWeight: 500, marginBottom: '24px',
          background: user.usertype === 'BO' ? 'rgba(59,130,246,0.2)' :
                     user.usertype === 'CL' ? 'rgba(168,85,247,0.2)' :
                     'rgba(34,197,94,0.2)',
          color: user.usertype === 'BO' ? '#60a5fa' :
                 user.usertype === 'CL' ? '#c084fc' :
                 '#4ade80',
          border: `1px solid ${
            user.usertype === 'BO' ? 'rgba(59,130,246,0.3)' :
            user.usertype === 'CL' ? 'rgba(168,85,247,0.3)' :
            'rgba(34,197,94,0.3)'
          }`,
        }}>
          {USER_TYPE_LABELS[user.usertype] || user.usertype}
        </span>

        <div style={{
          fontSize: '14px', color: 'rgba(255,255,255,0.5)',
          marginBottom: '28px',
        }}>
          {user.whatsapp}
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
            color: '#f87171', fontSize: '15px', fontWeight: 500,
            cursor: 'pointer', transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
