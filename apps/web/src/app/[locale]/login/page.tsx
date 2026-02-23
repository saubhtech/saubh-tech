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
      if (redirect) { window.location.href = redirect; return; }
      router.push(`/${locale}/dashboard`);
    } catch { setError('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *{box-sizing:border-box;margin:0;padding:0;}

        .lp{
          --lime:#a3e635;--green:#22c55e;--teal:#14b8a6;--orange:#f97316;--pink:#f43f5e;--violet:#8b5cf6;
          min-height:100vh;padding:20px;
          font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#f1f5f9;
          background:#080b12;position:relative;overflow:hidden;
          display:flex;align-items:center;justify-content:center;
        }

        /* animated gradient mesh */
        .lp-mesh{position:fixed;inset:0;z-index:0;pointer-events:none;}
        .lp-mesh div{position:absolute;border-radius:50%;filter:blur(100px);opacity:.4;animation:drift 14s ease-in-out infinite alternate;}
        .lp-m1{width:500px;height:500px;top:-10%;left:-8%;background:var(--green);}
        .lp-m2{width:400px;height:400px;top:10%;right:-5%;background:var(--orange);animation-delay:-3s!important;animation-duration:16s!important;}
        .lp-m3{width:350px;height:350px;bottom:-5%;left:30%;background:var(--violet);animation-delay:-7s!important;animation-duration:18s!important;opacity:.25;}
        .lp-m4{width:280px;height:280px;bottom:15%;right:15%;background:var(--teal);animation-delay:-5s!important;opacity:.2;}
        @keyframes drift{0%{transform:translate(0,0) scale(1);}50%{transform:translate(30px,-20px) scale(1.1);}100%{transform:translate(-15px,25px) scale(.95);}}

        /* grid noise overlay */
        .lp::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px);
          background-size:24px 24px;opacity:.6;}

        .lp-inner{position:relative;z-index:1;width:100%;max-width:1000px;}

        /* logo */
        .lp-head{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px;}
        .lp-logo-img{width:40px;height:40px;border-radius:12px;object-fit:cover;
          box-shadow:0 0 20px rgba(34,197,94,.35),0 0 40px rgba(34,197,94,.15);}
        .lp-brand{font-family:'Outfit',sans-serif;font-weight:900;font-size:1.6rem;letter-spacing:-.5px;color:#fff;}
        .lp-brand-dot{background:linear-gradient(135deg,var(--lime),var(--orange));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}

        /* grid */
        .lp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

        /* glass card */
        .lp-card{
          position:relative;border-radius:22px;overflow:hidden;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          transition:border-color .3s,box-shadow .3s;
        }
        .lp-card:hover{border-color:rgba(255,255,255,.14);}

        /* top glow line */
        .lp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
        .lp-card-left::before{background:linear-gradient(90deg,var(--green),var(--teal),var(--violet));}
        .lp-card-left:hover{box-shadow:0 0 50px rgba(34,197,94,.08),0 20px 60px rgba(0,0,0,.3);}
        .lp-card-right::before{background:linear-gradient(90deg,var(--orange),var(--pink));}
        .lp-card-right:hover{box-shadow:0 0 50px rgba(249,115,22,.08),0 20px 60px rgba(0,0,0,.3);}

        /* inner glow on left card */
        .lp-card-left::after{content:'';position:absolute;top:0;left:0;width:60%;height:40%;
          background:radial-gradient(ellipse at top left,rgba(34,197,94,.06),transparent);pointer-events:none;}
        .lp-card-right::after{content:'';position:absolute;top:0;right:0;width:60%;height:40%;
          background:radial-gradient(ellipse at top right,rgba(249,115,22,.06),transparent);pointer-events:none;}

        .lp-card-inner{padding:22px;display:grid;gap:16px;position:relative;z-index:1;}

        .lp-title{font-family:'Outfit',sans-serif;font-size:1.12rem;font-weight:800;letter-spacing:.1px;}
        .lp-mini{font-family:'Outfit',sans-serif;font-size:.95rem;font-weight:700;margin-bottom:4px;}

        /* steps */
        .lp-steps{
          display:grid;gap:9px;padding:14px;border-radius:14px;
          background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.08);
        }
        .lp-step{display:grid;grid-template-columns:22px 1fr;gap:8px;align-items:center;font-size:.88rem;line-height:1.4;color:rgba(255,255,255,.65);}
        .lp-num{
          width:22px;height:22px;border-radius:50%;display:grid;place-items:center;
          font-size:11px;font-weight:800;color:#fff;
          background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
        }
        .lp-hint{color:rgba(255,255,255,.35);font-size:.78rem;padding-left:30px;margin-top:-2px;}
        .lp-phones{font-weight:800;color:rgba(255,255,255,.85);}

        /* form block */
        .lp-block{padding:14px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);}
        .lp-form{display:grid;gap:10px;}

        .lp-input{
          height:44px;border-radius:12px;padding:0 14px;font-size:.9rem;width:100%;
          font-family:'Plus Jakarta Sans',sans-serif;color:#f1f5f9;outline:none;
          background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
          transition:.25s;
        }
        .lp-input::placeholder{color:rgba(255,255,255,.28);}
        .lp-input:focus{border-color:rgba(163,230,53,.35);box-shadow:0 0 0 3px rgba(163,230,53,.08);background:rgba(255,255,255,.07);}

        /* buttons */
        .lp-btn{
          height:46px;border:none;border-radius:12px;font-weight:700;font-size:.92rem;
          cursor:pointer;width:100%;font-family:'Outfit',sans-serif;letter-spacing:.2px;
          transition:.2s;position:relative;overflow:hidden;
        }
        .lp-btn:active{transform:scale(.98);}
        .lp-btn:disabled{opacity:.5;cursor:not-allowed;}

        .lp-btn-wa{
          color:#fff;
          background:linear-gradient(135deg,#25D366 0%,#128C7E 100%);
          box-shadow:0 8px 24px rgba(37,211,102,.25);
          display:block;text-align:center;text-decoration:none;line-height:46px;
        }
        .lp-btn-wa:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(37,211,102,.35);}

        .lp-btn-continue{
          color:#fff;
          background:linear-gradient(135deg,var(--violet) 0%,var(--teal) 100%);
          box-shadow:0 8px 24px rgba(139,92,246,.2);
        }
        .lp-btn-continue:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(139,92,246,.3);}

        /* shimmer on buttons */
        .lp-btn::after{
          content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
          transition:.5s;
        }
        .lp-btn:hover::after{left:120%;}

        .lp-err{background:rgba(244,63,94,.12);color:#fda4af;padding:10px 14px;border-radius:10px;font-size:.84rem;border:1px solid rgba(244,63,94,.15);}

        @media(max-width:720px){
          .lp{padding:14px;}
          .lp-grid{grid-template-columns:1fr;gap:14px;}
          .lp-card-inner{padding:18px;}
          .lp-brand{font-size:1.3rem;}
          .lp-m1,.lp-m2{width:300px;height:300px;}
          .lp-m3,.lp-m4{display:none;}
        }
      `}</style>

      <div className="lp">
        {/* Animated mesh background */}
        <div className="lp-mesh">
          <div className="lp-m1" />
          <div className="lp-m2" />
          <div className="lp-m3" />
          <div className="lp-m4" />
        </div>

        <div className="lp-inner">
          {/* Logo */}
          <div className="lp-head">
            <Image src="/logo.jpg" alt="Saubh.Tech" width={40} height={40} className="lp-logo-img" />
            <div className="lp-brand">Saubh<span className="lp-brand-dot">.</span>Tech</div>
          </div>

          <div className="lp-grid">
            {/* LEFT — Register */}
            <section className="lp-card lp-card-left">
              <div className="lp-card-inner">
                <h2 className="lp-title">👤 Register</h2>

                <div className="lp-steps">
                  <div className="lp-step"><div className="lp-num">1</div><div>Open your WhatsApp</div></div>
                  <div className="lp-step"><div className="lp-num">2</div><div>Type: Register Your Name*</div></div>
                  <div className="lp-step"><div className="lp-num">3</div><div>Send to: <span className="lp-phones">+918800607598</span> or <span className="lp-phones">+918130960040</span></div></div>
                  <div className="lp-hint">* Replace &quot;Your Name&quot; with Your Real Name</div>
                </div>

                <div className="lp-block">
                  <h3 className="lp-mini">👤 Join Saubh.Tech</h3>
                  <div className="lp-form">
                    <input className="lp-input" type="text" placeholder="Your name" value={regName} onChange={e => setRegName(e.target.value)} />
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-wa">WhatsApp to Register</a>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT — Sign In */}
            <section className="lp-card lp-card-right">
              <div className="lp-card-inner">
                <h2 className="lp-title">🔐 Sign In</h2>

                <div className="lp-steps">
                  <div className="lp-step"><div className="lp-num">1</div><div>Open your WhatsApp</div></div>
                  <div className="lp-step"><div className="lp-num">2</div><div>Type: Passcode</div></div>
                  <div className="lp-step"><div className="lp-num">3</div><div>Send to: <span className="lp-phones">+918800607598</span> or <span className="lp-phones">+918130960040</span></div></div>
                  <div className="lp-hint">You&apos;ll receive a 4-digit passcode</div>
                </div>

                <div className="lp-block">
                  <h3 className="lp-mini">🔐 Login</h3>
                  {error && <div className="lp-err">{error}</div>}
                  <form className="lp-form" onSubmit={handleLogin}>
                    <input className="lp-input" type="tel" inputMode="numeric" placeholder="WhatsApp Number" value={phone} onChange={e => setPhone(e.target.value)} />
                    <input className="lp-input" type="password" inputMode="numeric" maxLength={4} placeholder="Passcode" value={passcode} onChange={e => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))} />
                    <button className="lp-btn lp-btn-continue" type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Continue'}</button>
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
