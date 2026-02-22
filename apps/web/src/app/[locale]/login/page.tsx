'use client';

import { useState, useRef, FormEvent } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech/api';

export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  // Register state
  const [regName, setRegName] = useState('');

  // Sign-in state
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState<'otp' | 'login' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const passcodeRef = useRef<HTMLInputElement>(null);

  // WhatsApp registration link
  const waLink = `https://wa.me/918800607598?text=Register%20${encodeURIComponent(regName || 'Your Name')}`;

  // Request OTP via WhatsApp
  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmed = phone.trim();
    if (!trimmed) {
      setError('Please enter your WhatsApp number.');
      return;
    }

    setLoading('otp');
    try {
      const res = await fetch(`${API_BASE}/auth/whatsapp/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: trimmed }),
      });

      const data = await res.json();

      if (res.status === 404) {
        setError('This number is not registered. Please register first.');
        return;
      }
      if (res.status === 429) {
        setError('Too many attempts. Please try again later.');
        return;
      }
      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        return;
      }

      setOtpSent(true);
      setSuccess('Passcode sent to your WhatsApp!');
      setTimeout(() => passcodeRef.current?.focus(), 100);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(null);
    }
  };

  // Verify passcode + login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedPasscode = passcode.trim();
    if (!trimmedPasscode || trimmedPasscode.length !== 4) {
      setError('Passcode must be a 4-digit number.');
      return;
    }

    setLoading('login');
    try {
      const res = await fetch(`${API_BASE}/auth/whatsapp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: phone.trim(), passcode: trimmedPasscode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid or expired passcode. Please try again.');
        return;
      }

      // Save JWT to cookie (24hr)
      document.cookie = `saubh_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `saubh_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=86400; SameSite=Lax`;

      // Redirect
      if (redirect) {
        window.location.href = redirect;
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --bg: #f6f8ff;
          --card: rgba(255,255,255,0.82);
          --line: rgba(24, 33, 72, 0.10);
          --text: #15192d;
          --muted: #65708d;
          --accent1: #8b5cf6;
          --accent2: #22c55e;
          --accent3: #06b6d4;
          --accent4: #f59e0b;
          --shadow: 0 20px 60px rgba(32, 44, 96, 0.10);
          --radius: 24px;
        }
        .lg-page { min-height: 100vh; padding: 22px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: var(--text); background: radial-gradient(circle at 8% 10%, rgba(139,92,246,.18), transparent 28%), radial-gradient(circle at 92% 12%, rgba(34,197,94,.14), transparent 28%), radial-gradient(circle at 20% 90%, rgba(6,182,212,.12), transparent 30%), radial-gradient(circle at 85% 88%, rgba(245,158,11,.12), transparent 30%), var(--bg); }
        .lg-wrap { max-width: 1120px; margin: 0 auto; }
        .lg-logo-bar { display: flex; justify-content: center; margin-bottom: 18px; }
        .lg-logo { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 999px; background: rgba(255,255,255,0.75); border: 1px solid var(--line); box-shadow: 0 8px 24px rgba(35,42,86,0.06); backdrop-filter: blur(10px); font-weight: 900; letter-spacing: .2px; text-decoration: none; color: var(--text); }
        .lg-logo-badge { width: 28px; height: 28px; border-radius: 10px; display: grid; place-items: center; color: #fff; font-size: 14px; font-weight: 900; background: linear-gradient(135deg, var(--accent1), var(--accent3)); box-shadow: 0 8px 18px rgba(103,84,214,.25); }
        .lg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .lg-card { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); backdrop-filter: blur(14px); overflow: hidden; position: relative; }
        .lg-card::before { content: ""; position: absolute; inset: 0 auto auto 0; width: 100%; height: 4px; background: linear-gradient(90deg, var(--accent1), var(--accent3)); opacity: .9; }
        .lg-card.lg-right::before { background: linear-gradient(90deg, var(--accent4), #fb7185); }
        .lg-card-inner { padding: 20px; display: grid; gap: 16px; }
        .lg-section-title { font-size: 1.15rem; font-weight: 900; letter-spacing: .2px; margin: 0; }
        .lg-mini-title { font-size: 1rem; font-weight: 800; margin: 0 0 6px; }
        .lg-steps { display: grid; gap: 10px; border: 1px dashed rgba(29,38,77,0.14); border-radius: 16px; padding: 14px; background: rgba(255,255,255,0.55); }
        .lg-step { display: grid; grid-template-columns: 22px 1fr; gap: 8px; align-items: start; color: var(--text); font-size: .95rem; line-height: 1.35; }
        .lg-num { width: 22px; height: 22px; border-radius: 999px; border: 1px solid var(--line); display: grid; place-items: center; font-size: 12px; font-weight: 800; background: #fff; }
        .lg-hint { color: var(--muted); font-size: .85rem; line-height: 1.35; margin-top: -2px; padding-left: 30px; }
        .lg-phones { font-weight: 800; letter-spacing: .1px; }
        .lg-block { border: 1px solid var(--line); border-radius: 16px; background: rgba(255,255,255,0.75); padding: 14px; }
        .lg-form { display: grid; gap: 10px; }
        .lg-field { display: grid; gap: 6px; }
        .lg-label { font-size: .8rem; color: var(--muted); font-weight: 700; }
        .lg-input { height: 44px; border-radius: 12px; border: 1px solid var(--line); background: #fff; padding: 0 12px; font-size: .95rem; outline: none; transition: .2s ease; width: 100%; box-sizing: border-box; }
        .lg-input:focus { border-color: rgba(99,102,241,.35); box-shadow: 0 0 0 4px rgba(99,102,241,.08); }
        .lg-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .lg-btn { height: 46px; border: none; border-radius: 12px; font-weight: 800; font-size: .95rem; cursor: pointer; transition: .18s ease; letter-spacing: .1px; width: 100%; }
        .lg-btn:active { transform: translateY(1px); }
        .lg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .lg-btn-wa { color: #fff; background: linear-gradient(135deg, #25D366, #128C7E); box-shadow: 0 10px 20px rgba(37,211,102,.22); display: block; text-align: center; text-decoration: none; line-height: 46px; }
        .lg-btn-wa:hover { transform: translateY(-1px); box-shadow: 0 14px 26px rgba(37,211,102,.28); }
        .lg-btn-continue { color: #fff; background: linear-gradient(135deg, var(--accent1), var(--accent3)); box-shadow: 0 10px 20px rgba(99,102,241,.20); }
        .lg-btn-continue:hover { transform: translateY(-1px); box-shadow: 0 14px 26px rgba(99,102,241,.28); }
        .lg-alert-error { background: #fef2f2; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: .88rem; }
        .lg-alert-success { background: #f0fdf4; color: #16a34a; padding: 10px 14px; border-radius: 8px; font-size: .88rem; }
        .lg-back-btn { background: transparent; border: none; color: var(--muted); font-size: .82rem; cursor: pointer; padding: 6px 0; font-weight: 600; }
        .lg-back-btn:hover { color: var(--accent1); }
        @media (max-width: 860px) {
          .lg-page { padding: 14px; }
          .lg-grid { grid-template-columns: 1fr; }
          .lg-card-inner { padding: 16px; }
        }
      `}</style>

      <div className="lg-page">
        <div className="lg-wrap">
          {/* Logo */}
          <div className="lg-logo-bar">
            <a href={`/${locale}`} className="lg-logo">
              <div className="lg-logo-badge">S</div>
              <div>Saubh.Tech</div>
            </a>
          </div>

          <div className="lg-grid">
            {/* LEFT — Register */}
            <section className="lg-card">
              <div className="lg-card-inner">
                <h2 className="lg-section-title">👤 Register</h2>

                <div className="lg-steps">
                  <div className="lg-step">
                    <div className="lg-num">1</div>
                    <div>Open your WhatsApp</div>
                  </div>
                  <div className="lg-step">
                    <div className="lg-num">2</div>
                    <div>Type: Register Your Name*</div>
                  </div>
                  <div className="lg-step">
                    <div className="lg-num">3</div>
                    <div>Send to: <span className="lg-phones">+918800607598</span> or <span className="lg-phones">+918130960040</span></div>
                  </div>
                  <div className="lg-hint">* Replace &quot;Your Name&quot; with Your Real Name</div>
                </div>

                <div className="lg-block">
                  <h3 className="lg-mini-title">👤 Join Saubh.Tech</h3>
                  <div className="lg-form">
                    <div className="lg-field">
                      <input
                        className="lg-input"
                        type="text"
                        placeholder="Your name"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                      />
                    </div>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="lg-btn lg-btn-wa">
                      WhatsApp to Register
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT — Sign In */}
            <section className="lg-card lg-right">
              <div className="lg-card-inner">
                <h2 className="lg-section-title">🔐 Sign In</h2>

                <div className="lg-steps">
                  <div className="lg-step">
                    <div className="lg-num">1</div>
                    <div>Open your WhatsApp</div>
                  </div>
                  <div className="lg-step">
                    <div className="lg-num">2</div>
                    <div>Type: Passcode</div>
                  </div>
                  <div className="lg-step">
                    <div className="lg-num">3</div>
                    <div>Send to: <span className="lg-phones">+918800607598</span> or <span className="lg-phones">+918130960040</span></div>
                  </div>
                  <div className="lg-hint">You&apos;ll receive a 4-digit passcode</div>
                </div>

                <div className="lg-block">
                  <h3 className="lg-mini-title">🔐 Login</h3>

                  {error && <div className="lg-alert-error">{error}</div>}
                  {success && <div className="lg-alert-success">{success}</div>}

                  {!otpSent ? (
                    <form className="lg-form" onSubmit={handleRequestOtp}>
                      <div className="lg-field">
                        <input
                          className="lg-input"
                          type="tel"
                          inputMode="numeric"
                          placeholder="WhatsApp Number"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                        />
                      </div>
                      <button className="lg-btn lg-btn-continue" type="submit" disabled={loading === 'otp'}>
                        {loading === 'otp' ? 'Sending...' : '📩 Send Passcode'}
                      </button>
                    </form>
                  ) : (
                    <form className="lg-form" onSubmit={handleLogin}>
                      <div className="lg-field">
                        <input className="lg-input" type="tel" value={phone} disabled />
                      </div>
                      <div className="lg-field">
                        <input
                          ref={passcodeRef}
                          className="lg-input"
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="4-digit Passcode"
                          value={passcode}
                          onChange={e => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        />
                      </div>
                      <button className="lg-btn lg-btn-continue" type="submit" disabled={loading === 'login'}>
                        {loading === 'login' ? 'Verifying...' : 'Continue'}
                      </button>
                      <button
                        type="button"
                        className="lg-back-btn"
                        onClick={() => { setOtpSent(false); setPasscode(''); setError(''); setSuccess(''); }}
                      >
                        ← Change number / Resend
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
