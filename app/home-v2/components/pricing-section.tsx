'use client';

import { useEffect, useRef, useState } from 'react';

const plans = [
  { tier: 'STARTER', name: 'Visibility', icon: 'fa-eye', desc: 'Solo entrepreneurs, very small, local businesses for maintaining minimal presence.', prices: { quarterly: '\u20b915,999', half: '\u20b929,999', annual: '\u20b955,999' }, features: ['8 image posts per month', '4 reels/carousels/shorts per month', '2 LinkedIn posts/blogs per month'], popular: false, color: '#8FD45E', colorRgb: '143,212,94' },
  { tier: 'GROWTH', name: 'Accelerator', icon: 'fa-rocket', desc: 'Small & Medium Businesses, service providers for driving engagement and organic leads.', prices: { quarterly: '\u20b935,999', half: '\u20b967,999', annual: '\u20b91,25,999' }, features: ['20 image posts per month', '10 reels/carousels/shorts per month', '4 LinkedIn posts/blogs per month'], popular: true, color: '#F0960E', colorRgb: '240,150,14' },
  { tier: 'PRO', name: 'Branding', icon: 'fa-gem', desc: 'SMEs and e-commerce businesses for high-impact social presence, rapid scaling and strong branding.', prices: { quarterly: '\u20b974,999', half: '\u20b91,39,999', annual: '\u20b92,59,999' }, features: ['50 image posts per month', '20 reels/carousels/shorts/testimonials per month', '10 LinkedIn posts/blogs per month', '20 X posts per month'], popular: false, color: '#E8553A', colorRgb: '232,85,58' },
];

type Period = 'quarterly' | 'half' | 'annual';
const tabs: { key: Period; label: string }[] = [
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'half', label: 'Half-Yearly' },
  { key: 'annual', label: 'Annual' },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [period, setPeriod] = useState<Period>('quarterly');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.querySelectorAll('.pr-card, .anim-up').forEach((el) => el.classList.add('visible')); } }); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pr-sec section-pad" id="pricing" aria-labelledby="pricing-title">
      <div className="pr-orb pr-o1" />
      <div className="pr-orb pr-o2" />
      <div className="container pr-wrap">
        <div className="pr-header anim-up">
          <span className="pr-tag"><i className="fas fa-tags"></i> Branding Subscription</span>
          <h2 className="pr-title" id="pricing-title">Integrate the Power of <span className="pr-grad">People</span> with the Intelligence of <span className="pr-grad">Technology</span></h2>
        </div>
        <div className="pr-tabs">
          {tabs.map((t) => (<button key={t.key} className={`pr-tab ${period === t.key ? 'pr-tab-on' : ''}`} onClick={() => setPeriod(t.key)}>{t.label}</button>))}
        </div>
        <div className="pr-grid">
          {plans.map((plan, i) => (
            <div key={plan.tier} className={`pr-card ${plan.popular ? 'pr-popular' : ''}`} style={{ animationDelay: `${i * 0.12}s`, ['--pc' as string]: plan.color, ['--pcr' as string]: plan.colorRgb }}>
              {plan.popular && <div className="pr-badge">Most Popular</div>}
              <div className="pr-bar" />
              <div className="pr-glow" />
              <div className="pr-icon"><i className={`fas ${plan.icon}`}></i></div>
              <div className="pr-tier">{plan.tier}</div>
              <div className="pr-name">{plan.name}</div>
              <p className="pr-desc">{plan.desc}</p>
              <div className="pr-amounts"><div className="pr-row"><span>Price</span><span className="pr-val">{plan.prices[period]}</span></div></div>
              <div className="pr-feats">{plan.features.map((f, fi) => (<div key={fi} className="pr-feat"><i className="fas fa-check-circle"></i><span>{f}</span></div>))}</div>
              <a href="#start" className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>Get Started</a>
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center', marginTop: 48 }}>
          <a href="#post" className="btn btn-outline"><i className="fas fa-plus-circle"></i> Post Requirement</a>
          <a href="#demo" className="btn btn-ghost"><i className="fas fa-calendar-check"></i> Schedule a Demo</a>
        </div>
      </div>
      <style jsx>{`
        .pr-sec { background: var(--bg-dark, #0C0F0A); color: var(--text-light, #F0EDE8); position: relative; overflow: hidden; }
        .pr-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; animation: prDrift 12s ease-in-out infinite; z-index: 0; }
        .pr-o1 { width: 400px; height: 400px; background: rgba(109,179,63,0.05); top: -5%; right: -4%; }
        .pr-o2 { width: 300px; height: 300px; background: rgba(232,85,58,0.04); bottom: -6%; left: -3%; animation-delay: 5s; }
        .pr-wrap { position: relative; z-index: 1; }
        .pr-header { text-align: center; margin-bottom: 20px; }
        .pr-tag { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; border-radius: 100px; font-family: var(--font-display); font-size: .8rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #8FD45E; margin-bottom: 16px; }
        .pr-title { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.7rem, 3.8vw, 2.6rem); line-height: 1.2; color: #fff; margin-top: 12px; max-width: 900px; margin-left: auto; margin-right: auto; }
        .pr-grad { background: linear-gradient(135deg, #8FD45E 0%, #F0960E 50%, #E8553A 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: prShim 3s linear infinite; }
        .pr-tabs { display: flex; justify-content: center; gap: 4px; margin: 0 auto 48px; background: var(--glass, rgba(255,255,255,0.04)); border-radius: 100px; padding: 4px; width: fit-content; border: 1px solid var(--glass-border, rgba(255,255,255,0.08)); }
        .pr-tab { padding: 10px 28px; border-radius: 100px; font-family: var(--font-display); font-size: .85rem; font-weight: 600; color: var(--text-muted, #9CA39C); background: transparent; cursor: pointer; transition: all .35s ease; border: none; }
        .pr-tab:hover { color: #fff; }
        .pr-tab-on { background: var(--gradient-btn, linear-gradient(135deg, #6DB33F, #4A8C1F)); color: #fff; box-shadow: 0 0 18px rgba(109,179,63,0.25); }
        .pr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .pr-card { padding: 36px 28px; border-radius: 24px; background: rgba(10,13,8,0.9); border: 1px solid rgba(255,255,255,0.08); position: relative; overflow: visible; transition: all .5s cubic-bezier(.4,0,.2,1); opacity: 0; transform: translateY(28px) scale(0.97); }
        .pr-card.visible { animation: prCardUp .7s ease forwards; }
        .pr-card:hover { transform: translateY(-10px) scale(1.02); border-color: rgba(var(--pcr), 0.4); box-shadow: 0 0 50px rgba(var(--pcr), 0.1), 0 24px 48px rgba(0,0,0,0.35); }
        .pr-popular { padding-top: 44px; border-color: rgba(var(--pcr), 0.35); box-shadow: 0 0 40px rgba(var(--pcr), 0.08); }
        .pr-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 4px 16px; border-radius: 100px; font-family: var(--font-display); font-size: .72rem; font-weight: 700; background: var(--gradient-btn, linear-gradient(135deg, #6DB33F, #4A8C1F)); color: #fff; text-transform: uppercase; letter-spacing: 1px; z-index: 3; white-space: nowrap; box-shadow: 0 0 14px rgba(109,179,63,0.3); }
        .pr-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--pc); border-radius: 24px 24px 0 0; transition: height .35s ease; z-index: 2; }
        .pr-card:hover .pr-bar { height: 5px; box-shadow: 0 0 18px var(--pc); }
        .pr-glow { position: absolute; inset: 0; border-radius: 24px; background: radial-gradient(circle at 50% 0%, rgba(var(--pcr), 0.08), transparent 65%); opacity: 0; transition: opacity .5s ease; pointer-events: none; z-index: 0; overflow: hidden; }
        .pr-card:hover .pr-glow { opacity: 1; }
        .pr-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; background: rgba(var(--pcr), 0.12); color: var(--pc); margin-bottom: 16px; position: relative; z-index: 1; transition: all .4s cubic-bezier(.4,0,.2,1); }
        .pr-card:hover .pr-icon { transform: scale(1.15) rotate(-8deg); box-shadow: 0 0 28px rgba(var(--pcr), 0.25); }
        .pr-tier { font-family: var(--font-display); font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; color: var(--pc); position: relative; z-index: 1; }
        .pr-name { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 6px; position: relative; z-index: 1; }
        .pr-desc { font-size: .82rem; color: var(--text-muted, #9CA39C); line-height: 1.55; margin-bottom: 20px; position: relative; z-index: 1; }
        .pr-amounts { margin-bottom: 20px; position: relative; z-index: 1; }
        .pr-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: .88rem; }
        .pr-row span:first-child { color: var(--text-muted, #9CA39C); }
        .pr-val { font-family: var(--font-display); font-weight: 700; color: #fff; transition: all .4s ease; }
        .pr-card:hover .pr-val { color: var(--pc); text-shadow: 0 0 12px rgba(var(--pcr), 0.3); }
        .pr-feats { margin-bottom: 24px; position: relative; z-index: 1; }
        .pr-feat { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; font-size: .85rem; color: var(--text-muted, #9CA39C); }
        .pr-feat i { color: var(--green-light, #8FD45E); font-size: .7rem; margin-top: 4px; flex-shrink: 0; }
        @keyframes prCardUp { 0% { opacity: 0; transform: translateY(28px) scale(0.97); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes prShim { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        @keyframes prDrift { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(20px, -16px); } 66% { transform: translate(-14px, 10px); } }
        @media (max-width: 1024px) { .pr-grid { grid-template-columns: repeat(2, 1fr); } .pr-grid .pr-card:last-child { grid-column: 1 / -1; max-width: 400px; margin: 0 auto; width: 100%; } }
        @media (max-width: 640px) { .pr-grid { grid-template-columns: 1fr; } .pr-grid .pr-card:last-child { max-width: 100%; } .pr-tabs { flex-wrap: wrap; } .pr-tab { padding: 8px 20px; font-size: .8rem; } }
      `}</style>
    </section>
  );
}
