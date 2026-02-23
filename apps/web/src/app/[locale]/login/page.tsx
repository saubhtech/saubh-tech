'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech/api';

export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [regName, setRegName] = useState('');
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const waLink = `https://wa.me/918800607598?text=Register%20${encodeURIComponent(regName || 'Your Name')}`;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const trimPhone = phone.trim();
    const trimPass = passcode.trim();
    if (!trimPhone || !trimPass) { setError('Please enter WhatsApp Number and Passcode.'); return; }
    if (trimPass.length !== 4 || !/^[0-9]{4}$/.test(trimPass)) { setError('Passcode must be a 4-digit number.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/whatsapp/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: trimPhone, passcode: trimPass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Invalid or expired passcode.'); return; }
      document.cookie = `saubh_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `saubh_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=86400; SameSite=Lax`;
      if (redirect) { window.location.href = redirect; } else { router.push(`/${locale}/dashboard`); }
    } catch { setError('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .lp{--bg:#f6f8ff;--card:rgba(255,255,255,0.82);--line:rgba(24,33,72,0.10);--text:#15192d;--muted:#65708d;--accent1:#8b5cf6;--accent2:#22c55e;--accent3:#06b6d4;--accent4:#f59e0b;--shadow:0 20px 60px rgba(32,44,96,0.10);--radius:24px;
          min-height:100vh;padding:22px;font-family:'DM Sans',Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;color:var(--text);
          background:radial-gradient(circle at 8% 10%,rgba(139,92,246,.18),transparent 28%),radial-gradient(circle at 92% 12%,rgba(34,197,94,.14),transparent 28%),radial-gradient(circle at 20% 90%,rgba(6,182,212,.12),transparent 30%),radial-gradient(circle at 85% 88%,rgba(245,158,11,.12),transparent 30%),var(--bg);
          display:flex;flex-direction:column;align-items:center;justify-content:center;}

        .lp-wrap{max-width:1120px;width:100%;margin:0 auto;}

        /* logo bar */
        .lp-logo-bar{display:flex;justify-content:center;margin-bottom:18px;}
        .lp-logo{display:inline-flex;align-items:center;gap:10px;padding:8px 16px 8px 8px;border-radius:999px;background:rgba(255,255,255,0.75);border:1px solid var(--line);box-shadow:0 8px 24px rgba(35,42,86,0.06);backdrop-filter:blur(10px);font-weight:900;letter-spacing:.2px;text-decoration:none;color:var(--text);}
        .lp-logo-img{width:32px;height:32px;border-radius:10px;object-fit:cover;}
        .lp-logo-dot{color:var(--accent1);}

        /* grid */
        .lp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

        /* cards */
        .lp-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);backdrop-filter:blur(14px);overflow:hidden;position:relative;}
        .lp-card::before{content:"";position:absolute;inset:0 auto auto 0;width:100%;height:4px;opacity:.9;}
        .lp-card-left::before{background:linear-gradient(90deg,var(--accent1),var(--accent3));}
        .lp-card-right::before{background:linear-gradient(90deg,var(--accent4),#fb7185);}

        .lp-card-inner{padding:20px;display:grid;gap:16px;}

        .lp-title{font-size:1.15rem;font-weight:900;letter-spacing:.2px;margin:0;}
        .lp-mini{font-size:1rem;font-weight:800;margin:0 0 6px;}

        /* steps */
        .lp-steps{display:grid;gap:10px;border:1px dashed rgba(29,38,77,0.14);border-radius:16px;padding:14px;background:rgba(255,255,255,0.55);}
        .lp-step{display:grid;grid-template-columns:22px 1fr;gap:8px;align-items:start;font-size:.95rem;line-height:1.35;}
        .lp-num{width:22px;height:22px;border-radius:999px;border:1px solid var(--line);display:grid;place-items:center;font-size:12px;font-weight:800;background:#fff;}
        .lp-hint{color:var(--muted);font-size:.85rem;line-height:1.35;margin-top:-2px;padding-left:30px;}
        .lp-phones{font-weight:800;letter-spacing:.1px;}

        /* form block */
        .lp-block{border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,0.75);padding:14px;}

        .lp-form{display:grid;gap:10px;}
        .lp-input{height:44px;border-radius:12px;border:1px solid var(--line);background:#fff;padding:0 12px;font-size:.95rem;outline:none;transition:.2s ease;width:100%;box-sizing:border-box;font-family:inherit;}
        .lp-input::placeholder{color:#9ca3af;}
        .lp-input:focus{border-color:rgba(99,102,241,.35);box-shadow:0 0 0 4px rgba(99,102,241,.08);}

        .lp-btn{height:46px;border:none;border-radius:12px;font-weight:800;font-size:.95rem;cursor:pointer;transition:.18s ease;letter-spacing:.1px;width:100%;font-family:inherit;}
        .lp-btn:active{transform:translateY(1px);}
        .lp-btn:disabled{opacity:.55;cursor:not-allowed;}

        .lp-btn-wa{color:#fff;background:linear-gradient(135deg,#25D366,#128C7E);box-shadow:0 10px 20px rgba(37,211,102,.22);display:block;text-align:center;text-decoration:none;line-height:46px;}
        .lp-btn-wa:hover{transform:translateY(-1px);box-shadow:0 14px 26px rgba(37,211,102,.28);}

        .lp-btn-continue{color:#fff;background:linear-gradient(135deg,var(--accent1),var(--accent3));box-shadow:0 10px 20px rgba(99,102,241,.20);}
        .lp-btn-continue:hover{transform:translateY(-1px);box-shadow:0 14px 26px rgba(99,102,241,.28);}

        .lp-err{background:#fef2f2;color:#dc2626;padding:10px 14px;border-radius:8px;font-size:.88rem;}

        @media(max-width:860px){
          .lp{padding:14px;}
          .lp-grid{grid-template-columns:1fr;}
          .lp-card-inner{padding:16px;}
        }
      `}</style>

      <div className="lp">
        <div className="lp-wrap">
          {/* Logo */}
          <div className="lp-logo-bar">
            <a href={`/${locale}`} className="lp-logo">
              <Image src="/logo.jpg" alt="Saubh.Tech" width={32} height={32} className="lp-logo-img" />
              <span>Saubh<span className="lp-logo-dot">.</span>Tech</span>
            </a>
          </div>

          <div className="lp-grid">
            {/* LEFT — Register */}
            <section className="lp-card lp-card-left">
              <div className="lp-card-inner">
                <h2 className="lp-title">👤 Register</h2>

                <div className="lp-steps">
                  <div className="lp-step">
                    <div className="lp-num">1</div>
                    <div>Open your WhatsApp</div>
                  </div>
                  <div className="lp-step">
                    <div className="lp-num">2</div>
                    <div>Type: Register Your Name*</div>
                  </div>
                  <div className="lp-step">
                    <div className="lp-num">3</div>
                    <div>Send to: <span className="lp-phones">+918800607598</span> or <span className="lp-phones">+918130960040</span></div>
                  </div>
                  <div className="lp-hint">* Replace &quot;Your Name&quot; with Your Real Name</div>
                </div>

                <div className="lp-block">
                  <h3 className="lp-mini">👤 Join Saubh.Tech</h3>
                  <div className="lp-form">
                    <input
                      className="lp-input"
                      type="text"
                      placeholder="Your name"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                    />
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-wa">
                      WhatsApp to Register
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT — Sign In */}
            <section className="lp-card lp-card-right">
              <div className="lp-card-inner">
                <h2 className="lp-title">🔐 Sign In</h2>

                <div className="lp-steps">
                  <div className="lp-step">
                    <div className="lp-num">1</div>
                    <div>Open your WhatsApp</div>
                  </div>
                  <div className="lp-step">
                    <div className="lp-num">2</div>
                    <div>Type: Passcode</div>
                  </div>
                  <div className="lp-step">
                    <div className="lp-num">3</div>
                    <div>Send to: <span className="lp-phones">+918800607598</span> or <span className="lp-phones">+918130960040</span></div>
                  </div>
                  <div className="lp-hint">You&apos;ll receive a 4-digit passcode</div>
                </div>

                <div className="lp-block">
                  <h3 className="lp-mini">🔐 Login</h3>

                  {error && <div className="lp-err">{error}</div>}

                  <form className="lp-form" onSubmit={handleLogin}>
                    <input
                      className="lp-input"
                      type="tel"
                      inputMode="numeric"
                      placeholder="WhatsApp Number"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <input
                      className="lp-input"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Passcode"
                      value={passcode}
                      onChange={e => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    />
                    <button className="lp-btn lp-btn-continue" type="submit" disabled={loading}>
                      {loading ? 'Verifying...' : 'Continue'}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
