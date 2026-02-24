'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech/api';

type Step = 'idle' | 'sending' | 'otp' | 'verifying' | 'success';
type RegStep = 'idle' | 'registering' | 'done';

export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStep, setRegStep] = useState<RegStep>('idle');
  const [regMsg, setRegMsg] = useState('');
  const [regErr, setRegErr] = useState('');

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [countdown]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegErr('');
    setRegMsg('');
    const trimName = regName.trim();
    const trimPhone = regPhone.trim().replace(/[^\d]/g, '');
    if (!trimName) { setRegErr('Please enter your name.'); return; }
    if (!trimPhone || trimPhone.length < 10) { setRegErr('Please enter a valid WhatsApp number.'); return; }
    setRegStep('registering');
    try {
      const res = await fetch(`${API_BASE}/auth/whatsapp/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: trimPhone, fname: trimName, usertype: 'GW' }),
      });
      const data = await res.json();
      if (!res.ok) { setRegErr(data.message || 'Registration failed.'); setRegStep('idle'); return; }
      setRegStep('done');
      setRegMsg(`Welcome ${data.user?.fname || trimName}! Check WhatsApp for your passcode.`);
      setPhone(trimPhone);
    } catch {
      setRegErr('Network error. Please try again.');
      setRegStep('idle');
    }
  };

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const trimPhone = phone.trim().replace(/[^\d]/g, '');
    if (!trimPhone || trimPhone.length < 10) { setError('Enter a valid WhatsApp number.'); return; }
    setStep('sending');
    try {
      const res = await fetch(`${API_BASE}/auth/whatsapp/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: trimPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to send OTP.');
        setStep('idle');
        return;
      }
      setStep('otp');
      setOtp(['', '', '', '']);
      setCountdown(data.expiresIn || 120);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError('Network error. Please try again.');
      setStep('idle');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
    if (value && index === 3 && newOtp.every((d) => d !== '')) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      otpRefs.current[3]?.focus();
      verifyOtp(pasted);
    }
  };

  const verifyOtp = async (code: string) => {
    setError('');
    const trimPhone = phone.trim().replace(/[^\d]/g, '');
    setStep('verifying');
    try {
      const res = await fetch(`${API_BASE}/auth/whatsapp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: trimPhone, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Invalid or expired passcode.');
        setStep('otp');
        setOtp(['', '', '', '']);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
        return;
      }
      setStep('success');
      document.cookie = `saubh_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `saubh_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=86400; SameSite=Lax`;
      setTimeout(() => {
        if (redirect) { window.location.href = redirect; }
        else { router.push(`/${locale}/dashboard`); }
      }, 800);
    } catch {
      setError('Network error. Please try again.');
      setStep('otp');
    }
  };

  const handleVerifySubmit = (e: FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 4) { setError('Enter the 4-digit code.'); return; }
    verifyOtp(code);
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
        .lp-mesh{position:fixed;inset:0;z-index:0;pointer-events:none;}
        .lp-mesh div{position:absolute;border-radius:50%;filter:blur(100px);opacity:.4;animation:drift 14s ease-in-out infinite alternate;}
        .lp-m1{width:500px;height:500px;top:-10%;left:-8%;background:var(--green);}
        .lp-m2{width:400px;height:400px;top:10%;right:-5%;background:var(--orange);animation-delay:-3s!important;animation-duration:16s!important;}
        .lp-m3{width:350px;height:350px;bottom:-5%;left:30%;background:var(--violet);animation-delay:-7s!important;animation-duration:18s!important;opacity:.25;}
        .lp-m4{width:280px;height:280px;bottom:15%;right:15%;background:var(--teal);animation-delay:-5s!important;opacity:.2;}
        @keyframes drift{0%{transform:translate(0,0) scale(1);}50%{transform:translate(30px,-20px) scale(1.1);}100%{transform:translate(-15px,25px) scale(.95);}}
        .lp::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px);
          background-size:24px 24px;opacity:.6;}
        .lp-inner{position:relative;z-index:1;width:100%;max-width:960px;}
        .lp-head{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px;}
        .lp-logo-img{width:40px;height:40px;border-radius:12px;object-fit:cover;
          box-shadow:0 0 20px rgba(34,197,94,.35),0 0 40px rgba(34,197,94,.15);}
        .lp-brand{font-family:'Outfit',sans-serif;font-weight:900;font-size:1.6rem;letter-spacing:-.5px;color:#fff;}
        .lp-brand-dot{background:linear-gradient(135deg,var(--lime),var(--orange));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .lp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .lp-card{
          position:relative;border-radius:22px;overflow:hidden;
          background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          transition:border-color .3s,box-shadow .3s;
        }
        .lp-card:hover{border-color:rgba(255,255,255,.14);}
        .lp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
        .lp-card-left::before{background:linear-gradient(90deg,var(--green),var(--teal),var(--violet));}
        .lp-card-left:hover{box-shadow:0 0 50px rgba(34,197,94,.08),0 20px 60px rgba(0,0,0,.3);}
        .lp-card-right::before{background:linear-gradient(90deg,var(--orange),var(--pink));}
        .lp-card-right:hover{box-shadow:0 0 50px rgba(249,115,22,.08),0 20px 60px rgba(0,0,0,.3);}
        .lp-card-left::after{content:'';position:absolute;top:0;left:0;width:60%;height:40%;
          background:radial-gradient(ellipse at top left,rgba(34,197,94,.06),transparent);pointer-events:none;}
        .lp-card-right::after{content:'';position:absolute;top:0;right:0;width:60%;height:40%;
          background:radial-gradient(ellipse at top right,rgba(249,115,22,.06),transparent);pointer-events:none;}
        .lp-card-inner{padding:22px;display:grid;gap:16px;position:relative;z-index:1;}
        .lp-title{font-family:'Outfit',sans-serif;font-size:1.12rem;font-weight:800;letter-spacing:.1px;}
        .lp-subtitle{color:rgba(255,255,255,.45);font-size:.84rem;line-height:1.5;}
        .lp-block{padding:14px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);}
        .lp-form{display:grid;gap:10px;}
        .lp-input{
          height:46px;border-radius:12px;padding:0 14px;font-size:.9rem;width:100%;
          font-family:'Plus Jakarta Sans',sans-serif;color:#f1f5f9;outline:none;
          background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);transition:.25s;
        }
        .lp-input::placeholder{color:rgba(255,255,255,.28);}
        .lp-input:focus{border-color:rgba(163,230,53,.35);box-shadow:0 0 0 3px rgba(163,230,53,.08);background:rgba(255,255,255,.07);}
        .lp-input:disabled{opacity:.5;}
        .lp-otp-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
        .lp-otp-box{
          height:56px;border-radius:14px;text-align:center;font-size:1.5rem;font-weight:800;
          font-family:'Outfit',sans-serif;color:#fff;outline:none;
          background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.1);
          transition:.25s;caret-color:var(--lime);width:100%;
        }
        .lp-otp-box:focus{border-color:var(--lime);box-shadow:0 0 0 3px rgba(163,230,53,.12);background:rgba(255,255,255,.08);}
        .lp-otp-box.filled{border-color:rgba(163,230,53,.5);background:rgba(163,230,53,.06);}
        .lp-btn{
          height:46px;border:none;border-radius:12px;font-weight:700;font-size:.92rem;
          cursor:pointer;width:100%;font-family:'Outfit',sans-serif;letter-spacing:.2px;
          transition:.2s;position:relative;overflow:hidden;
        }
        .lp-btn:active{transform:scale(.98);}
        .lp-btn:disabled{opacity:.5;cursor:not-allowed;}
        .lp-btn::after{
          content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);transition:.5s;
        }
        .lp-btn:hover:not(:disabled)::after{left:120%;}
        .lp-btn-green{color:#fff;background:linear-gradient(135deg,#25D366 0%,#128C7E 100%);box-shadow:0 8px 24px rgba(37,211,102,.25);}
        .lp-btn-green:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(37,211,102,.35);}
        .lp-btn-orange{color:#fff;background:linear-gradient(135deg,var(--orange) 0%,var(--pink) 100%);box-shadow:0 8px 24px rgba(249,115,22,.2);}
        .lp-btn-orange:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(249,115,22,.3);}
        .lp-btn-violet{color:#fff;background:linear-gradient(135deg,var(--violet) 0%,var(--teal) 100%);box-shadow:0 8px 24px rgba(139,92,246,.2);}
        .lp-btn-violet:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(139,92,246,.3);}
        .lp-btn-ghost{color:rgba(255,255,255,.55);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);box-shadow:none;}
        .lp-btn-ghost:hover:not(:disabled){color:#fff;background:rgba(255,255,255,.08);transform:none;}
        .lp-err{background:rgba(244,63,94,.12);color:#fda4af;padding:10px 14px;border-radius:10px;font-size:.84rem;border:1px solid rgba(244,63,94,.15);}
        .lp-success{background:rgba(34,197,94,.1);color:#86efac;padding:10px 14px;border-radius:10px;font-size:.84rem;border:1px solid rgba(34,197,94,.15);}
        .lp-timer{text-align:center;color:rgba(255,255,255,.4);font-size:.82rem;font-weight:600;margin-top:2px;}
        .lp-timer b{color:var(--lime);}
        .lp-link{color:var(--lime);text-decoration:none;font-weight:700;cursor:pointer;font-size:.84rem;}
        .lp-link:hover{text-decoration:underline;}
        .lp-divider{display:flex;align-items:center;gap:12px;color:rgba(255,255,255,.2);font-size:.78rem;}
        .lp-divider::before,.lp-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08);}
        .lp-check{display:flex;align-items:center;justify-content:center;gap:8px;padding:20px;color:#86efac;font-weight:700;font-size:1rem;}
        .lp-check-icon{
          width:48px;height:48px;border-radius:50%;
          background:rgba(34,197,94,.15);border:2px solid rgba(34,197,94,.4);
          display:grid;place-items:center;font-size:1.4rem;
          animation:pop .4s cubic-bezier(.68,-.55,.27,1.55);
        }
        @keyframes pop{0%{transform:scale(0);}100%{transform:scale(1);}}
        .lp-spinner{
          width:18px;height:18px;border:2px solid rgba(255,255,255,.2);
          border-top-color:#fff;border-radius:50%;
          animation:spin .6s linear infinite;display:inline-block;vertical-align:middle;margin-right:6px;
        }
        @keyframes spin{to{transform:rotate(360deg);}}
        .lp-wa-badge{
          display:inline-flex;align-items:center;gap:6px;
          padding:6px 12px;border-radius:20px;font-size:.78rem;font-weight:700;
          background:rgba(37,211,102,.1);color:#25D366;border:1px solid rgba(37,211,102,.2);
        }
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
        <div className="lp-mesh">
          <div className="lp-m1" />
          <div className="lp-m2" />
          <div className="lp-m3" />
          <div className="lp-m4" />
        </div>

        <div className="lp-inner">
          <div className="lp-head">
            <Image src="/logo.jpg" alt="Saubh.Tech" width={40} height={40} className="lp-logo-img" />
            <div className="lp-brand">Saubh<span className="lp-brand-dot">.</span>Tech</div>
          </div>

          <div className="lp-grid">
            <section className="lp-card lp-card-left">
              <div className="lp-card-inner">
                <div>
                  <h2 className="lp-title">👤 New here? Register</h2>
                  <p className="lp-subtitle">Create your account instantly. We&apos;ll send your login credentials via WhatsApp.</p>
                </div>

                {regStep === 'done' ? (
                  <div className="lp-block">
                    <div className="lp-check">
                      <div className="lp-check-icon">✓</div>
                    </div>
                    <div className="lp-success" style={{textAlign:'center'}}>{regMsg}</div>
                    <div style={{textAlign:'center',marginTop:'12px'}}>
                      <span className="lp-wa-badge">📱 Check your WhatsApp</span>
                    </div>
                    <div style={{textAlign:'center',marginTop:'12px'}}>
                      <span className="lp-link" onClick={() => { setRegStep('idle'); setRegMsg(''); }}>
                        Register another →
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="lp-block">
                    {regErr && <div className="lp-err">{regErr}</div>}
                    <form className="lp-form" onSubmit={handleRegister}>
                      <input
                        className="lp-input"
                        type="text"
                        placeholder="Your name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        disabled={regStep === 'registering'}
                      />
                      <input
                        className="lp-input"
                        type="tel"
                        inputMode="numeric"
                        placeholder="WhatsApp number (e.g. 9876543210)"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value.replace(/[^\d+\s-]/g, ''))}
                        disabled={regStep === 'registering'}
                      />
                      <button
                        className="lp-btn lp-btn-green"
                        type="submit"
                        disabled={regStep === 'registering'}
                      >
                        {regStep === 'registering'
                          ? <><span className="lp-spinner" />Creating account...</>
                          : '📱 Register via WhatsApp'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="lp-divider">already registered?</div>
                <p className="lp-subtitle" style={{textAlign:'center'}}>
                  Use the <b>Sign In</b> panel to login →
                </p>
              </div>
            </section>

            <section className="lp-card lp-card-right">
              <div className="lp-card-inner">
                <div>
                  <h2 className="lp-title">🔐 Sign In</h2>
                  <p className="lp-subtitle">Enter your WhatsApp number and we&apos;ll send a one-time passcode.</p>
                </div>

                {step === 'success' ? (
                  <div className="lp-block">
                    <div className="lp-check">
                      <div className="lp-check-icon">✓</div>
                    </div>
                    <div className="lp-success" style={{textAlign:'center'}}>
                      Verified! Redirecting to dashboard...
                    </div>
                  </div>
                ) : step === 'otp' || step === 'verifying' ? (
                  <div className="lp-block">
                    <div style={{textAlign:'center',marginBottom:'8px'}}>
                      <span className="lp-wa-badge">📱 Code sent to {phone}</span>
                    </div>
                    {error && <div className="lp-err">{error}</div>}
                    <form className="lp-form" onSubmit={handleVerifySubmit}>
                      <div className="lp-otp-row" onPaste={handleOtpPaste}>
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => { otpRefs.current[i] = el; }}
                            className={`lp-otp-box${digit ? ' filled' : ''}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            disabled={step === 'verifying'}
                            autoFocus={i === 0}
                          />
                        ))}
                      </div>
                      {step === 'verifying' ? (
                        <div style={{textAlign:'center',padding:'8px',color:'rgba(255,255,255,.5)'}}>
                          <span className="lp-spinner" /> Verifying...
                        </div>
                      ) : (
                        <button className="lp-btn lp-btn-violet" type="submit">
                          Verify &amp; Sign In
                        </button>
                      )}
                    </form>
                    <div className="lp-timer">
                      {countdown > 0
                        ? <>Code expires in <b>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</b></>
                        : <span style={{color:'var(--pink)'}}>Code expired</span>
                      }
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:'8px'}}>
                      <span className="lp-link" onClick={() => { setStep('idle'); setError(''); setOtp(['','','','']); }}>
                        ← Change number
                      </span>
                      <span
                        className="lp-link"
                        style={{opacity: countdown > 90 ? 0.3 : 1, pointerEvents: countdown > 90 ? 'none' : 'auto'}}
                        onClick={handleRequestOtp as any}
                      >
                        Resend code
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="lp-block">
                    {error && <div className="lp-err">{error}</div>}
                    <form className="lp-form" onSubmit={handleRequestOtp}>
                      <input
                        className="lp-input"
                        type="tel"
                        inputMode="numeric"
                        placeholder="WhatsApp number (e.g. 9876543210)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ''))}
                        disabled={step === 'sending'}
                      />
                      <button
                        className="lp-btn lp-btn-orange"
                        type="submit"
                        disabled={step === 'sending'}
                      >
                        {step === 'sending'
                          ? <><span className="lp-spinner" />Sending OTP...</>
                          : '📲 Send OTP via WhatsApp'}
                      </button>
                    </form>
                    <div className="lp-divider">or use permanent passcode</div>
                    <p className="lp-subtitle" style={{textAlign:'center'}}>
                      Enter your WhatsApp number and the 4-digit passcode you received during registration.
                    </p>
                    <form className="lp-form" onSubmit={(e) => {
                      e.preventDefault();
                      const code = (document.getElementById('staticPass') as HTMLInputElement)?.value || '';
                      if (code.length !== 4) { setError('Enter a 4-digit passcode.'); return; }
                      verifyOtp(code);
                    }}>
                      <input
                        id="staticPass"
                        className="lp-input"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="4-digit passcode"
                      />
                      <button className="lp-btn lp-btn-ghost" type="submit">
                        Continue with Passcode
                      </button>
                    </form>
                  </div>
                )}

                <div className="lp-divider">new user?</div>
                <p className="lp-subtitle" style={{textAlign:'center'}}>
                  Use the <b>Register</b> panel to create your account ←
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
