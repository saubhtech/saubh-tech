'use client';

import { useEffect, useRef } from 'react';

const socials = [
  { icon: 'fab fa-facebook-f', label: 'Facebook', href: '#' },
  { icon: 'fab fa-instagram', label: 'Instagram', href: '#' },
  { icon: 'fab fa-x-twitter', label: 'X', href: '#' },
  { icon: 'fab fa-linkedin-in', label: 'LinkedIn', href: '#' },
  { icon: 'fab fa-youtube', label: 'YouTube', href: '#' },
  { icon: 'fab fa-pinterest-p', label: 'Pinterest', href: '#' },
];

const communityLinks = ['About Saubh Global', 'Founding Co-owners', 'Be a Certified Advisor', 'Team Saubh', 'Calculate Earnings'];
const businessLinks = ['Unified Communication', 'Marketing & Sales', 'HR & Recruitment', 'Counselling & Admission'];
const legalLinks = ['Data Privacy, DPDPA & GDPR', 'Terms of Service', 'Escrow System', 'Refund Policy', 'Online Payment'];

export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.querySelectorAll('.ft-anim').forEach((el, i) => { (el as HTMLElement).style.animationDelay = `${i * 0.06}s`; el.classList.add('ft-visible'); }); } }); },
      { threshold: 0.05 }
    );
    if (footerRef.current) obs.observe(footerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="ft-sec" role="contentinfo">
      <div className="ft-orb ft-orb1" />
      <div className="ft-orb ft-orb2" />
      <div className="ft-topline" />
      <div className="container ft-wrap">
        <div className="ft-grid">
          <div className="ft-brand ft-anim">
            <div className="ft-logo">
              <img src="/images/Saubh-logo.png" alt="Saubh.Tech" className="ft-logo-img" />
              <span className="ft-logo-text">Saubh<span className="ft-dot">.</span>Tech</span>
            </div>
            <div className="ft-info">
              <div className="ft-info-item"><i className="fas fa-id-card"></i> GSTN: 10AAUPS8603H1ZH</div>
              <div className="ft-info-item"><i className="fas fa-building"></i> UDYAM-BR-31-0056281</div>
              <div className="ft-info-item"><i className="fas fa-envelope"></i> <a href="mailto:hello@saubh.tech">hello@saubh.tech</a></div>
              <div className="ft-info-item"><i className="fas fa-phone"></i> <a href="tel:918800607598">918800607598</a></div>
              <div className="ft-info-item"><i className="fab fa-whatsapp"></i> <a href="https://wa.me/918800607598">918800607598</a></div>
            </div>
            <div className="ft-social">
              {socials.map((s) => (<a key={s.label} href={s.href} aria-label={s.label} className="ft-soc-link"><i className={s.icon}></i></a>))}
            </div>
          </div>
          <div className="ft-col ft-anim"><h4 className="ft-col-title">Community</h4>{communityLinks.map((l) => (<a key={l} href="#" className="ft-link">{l}</a>))}</div>
          <div className="ft-col ft-anim"><h4 className="ft-col-title">Business</h4>{businessLinks.map((l) => (<a key={l} href="#" className="ft-link">{l}</a>))}</div>
          <div className="ft-col ft-anim"><h4 className="ft-col-title">Legal</h4>{legalLinks.map((l) => (<a key={l} href="#" className="ft-link">{l}</a>))}</div>
        </div>
        <div className="ft-bottom ft-anim">
          <div className="ft-addresses">
            <div className="ft-addr"><i className="fas fa-location-dot"></i><span>01 Tola-Tari, Sarha, Dahiawan, Chapra, Saran, Bihar \u2013 841301</span></div>
            <div className="ft-addr"><i className="fas fa-location-dot"></i><span>Fellow Ship of India, 811/92 Nehru Place, South East Delhi, New Delhi \u2013 110019</span></div>
          </div>
          <p className="ft-tagline"><span className="ft-grad">Gig Work. Verified People. Secured Income</span></p>
          <p className="ft-copy">Envisioned by Mani, a jewel of the earth. &nbsp;|&nbsp; \u00a92026 Saubh.Tech &nbsp;|&nbsp; All Rights Reserved.</p>
        </div>
      </div>
      <style jsx>{`
        .ft-sec { background: var(--bg-dark, #0C0F0A); padding: 80px 0 32px; position: relative; overflow: hidden; }
        .ft-wrap { position: relative; z-index: 1; }
        .ft-topline { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 5%, rgba(109,179,63,0.4) 30%, rgba(240,150,14,0.3) 50%, rgba(232,85,58,0.3) 70%, transparent 95%); }
        .ft-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; animation: ftDrift 14s ease-in-out infinite; z-index: 0; }
        .ft-orb1 { width: 350px; height: 350px; background: rgba(109,179,63,0.04); top: -8%; left: -3%; }
        .ft-orb2 { width: 280px; height: 280px; background: rgba(240,150,14,0.03); bottom: -6%; right: -4%; animation-delay: 6s; }
        .ft-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 48px; }
        .ft-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .ft-logo-img { width: 40px; height: 40px; border-radius: 10px; object-fit: contain; transition: all .4s ease; }
        .ft-logo:hover .ft-logo-img { transform: rotate(-6deg) scale(1.08); }
        .ft-logo-text { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--text-light, #F0EDE8); }
        .ft-dot { color: #8FD45E; }
        .ft-info { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .ft-info-item { display: flex; align-items: flex-start; gap: 10px; font-size: .85rem; color: var(--text-muted, #9CA39C); transition: color .3s ease; }
        .ft-info-item:hover { color: #b8bfb8; }
        .ft-info-item i { color: rgba(143,212,94,0.6); margin-top: 3px; font-size: .8rem; }
        .ft-info-item:hover i { color: #8FD45E; }
        .ft-info-item a { color: inherit; text-decoration: none; }
        .ft-info-item a:hover { color: #8FD45E; }
        .ft-social { display: flex; gap: 10px; }
        .ft-soc-link { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: var(--text-muted, #9CA39C); font-size: .9rem; text-decoration: none; transition: all .4s cubic-bezier(.4,0,.2,1); }
        .ft-soc-link:hover { color: #fff; border-color: rgba(109,179,63,0.5); transform: translateY(-4px) scale(1.05); box-shadow: 0 0 20px rgba(109,179,63,0.15); }
        .ft-col-title { font-family: var(--font-display); font-size: .85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-light, #F0EDE8); margin-bottom: 20px; }
        .ft-link { display: block; padding: 5px 0; font-size: .88rem; color: var(--text-muted, #9CA39C); text-decoration: none; transition: all .35s ease; }
        .ft-link:hover { color: #8FD45E; transform: translateX(6px); }
        .ft-bottom { padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
        .ft-addresses { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; margin-bottom: 20px; }
        .ft-addr { display: flex; align-items: flex-start; gap: 8px; font-size: .8rem; color: var(--text-muted, #9CA39C); max-width: 550px; text-align: left; }
        .ft-addr i { color: rgba(143,212,94,0.5); margin-top: 3px; font-size: .7rem; flex-shrink: 0; }
        .ft-tagline { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; margin-bottom: 8px; }
        .ft-grad { background: linear-gradient(135deg, #8FD45E 0%, #F0960E 35%, #E8553A 65%, #8FD45E 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: ftShim 3s linear infinite; }
        .ft-copy { font-size: .85rem; color: var(--text-muted, #9CA39C); line-height: 1.8; }
        .ft-anim { opacity: 0; transform: translateY(20px); }
        .ft-visible { animation: ftUp .6s ease forwards; }
        @keyframes ftUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes ftShim { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        @keyframes ftDrift { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(18px, -12px); } 66% { transform: translate(-10px, 8px); } }
        @media (max-width: 1024px) { .ft-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .ft-sec { padding: 60px 0 28px; } .ft-grid { grid-template-columns: 1fr; gap: 32px; } .ft-addresses { flex-direction: column; align-items: center; } .ft-addr { text-align: center; justify-content: center; } }
      `}</style>
    </footer>
  );
}
