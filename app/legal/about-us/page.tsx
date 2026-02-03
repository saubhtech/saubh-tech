"use client";
import React, { useState, useEffect, useRef } from "react";

/* ─── CSS INJECTION ──────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

:root {
  --bg-primary: #0a0a0f;
  --bg-card: #12121a;
  --bg-card-hover: #1a1a26;
  --accent: #22c55e;
  --accent-dim: rgba(34,197,94,0.12);
  --accent-glow: rgba(34,197,94,0.35);
  --text-primary: #f0f0f4;
  --text-secondary: #8a8a9a;
  --text-muted: #545468;
  --border: rgba(255,255,255,0.06);
  --border-accent: rgba(34,197,94,0.25);
}

* {
  margin:0;
  padding:0;
  box-sizing:border-box;
}

.about-root {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

.about-root::before {
  content:'';
  position:fixed;
  inset:0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  pointer-events:none;
  z-index:999;
  opacity:0.5;
}

/* ─── HERO SECTION ─── */
.hero {
  position: relative;
  padding: 140px 24px 100px;
  text-align: center;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%);
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  filter: blur(60px);
}

.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 24px;
  position: relative;
}

.breadcrumb a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #16a34a;
}

.hero h1 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(48px, 7vw, 86px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -2.5px;
  color: var(--text-primary);
  margin-bottom: 28px;
  position: relative;
}

.hero-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 300;
  position: relative;
}

/* ─── STORY SECTION ─── */
.story-section {
  padding: 100px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: start;
}

.story-left {
  position: sticky;
  top: 120px;
}

.section-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 16px;
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 700;
  letter-spacing: -1.5px;
  color: var(--text-primary);
  line-height: 1.15;
  margin-bottom: 24px;
}

.story-highlight {
  font-size: 18px;
  color: var(--accent);
  font-weight: 500;
  line-height: 1.6;
}

.story-content p {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 24px;
}

.story-content p:last-child {
  margin-bottom: 0;
}

/* ─── MISSION & VISION ─── */
.mission-vision {
  padding: 100px 24px;
  background: linear-gradient(180deg, var(--bg-primary) 0%, #0f0f16 50%, var(--bg-primary) 100%);
}

.mv-container {
  max-width: 1100px;
  margin: 0 auto;
}

.mv-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 60px;
}

.mv-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 48px 40px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
}

.mv-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-4px);
}

.mv-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s;
}

.mv-card:hover::before {
  transform: scaleX(1);
}

.mv-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: var(--accent-dim);
  border: 1px solid var(--border-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 28px;
}

.mv-card h3 {
  font-family: 'Syne', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.mv-card p {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ─── VALUES SECTION ─── */
.values-section {
  padding: 100px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 60px;
}

.value-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 28px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.value-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  background: var(--accent-dim);
  transition: height 0.3s;
}

.value-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-3px);
}

.value-card:hover::after {
  height: 100%;
}

.value-card > * {
  position: relative;
  z-index: 1;
}

.value-icon {
  font-size: 32px;
  margin-bottom: 20px;
  display: block;
}

.value-card h4 {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  letter-spacing: -0.3px;
}

.value-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ─── TIMELINE ─── */
.timeline-section {
  padding: 100px 24px;
  background: linear-gradient(180deg, var(--bg-primary) 0%, #0f0f16 100%);
}

.timeline-container {
  max-width: 900px;
  margin: 60px auto 0;
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 40px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

.timeline-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: var(--accent);
  animation: timeline-grow 2s ease-out forwards;
  animation-delay: 0.5s;
}

@keyframes timeline-grow {
  to { height: 100%; }
}

.timeline-item {
  position: relative;
  padding-left: 100px;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateX(-20px);
  animation: timeline-item-in 0.6s ease-out forwards;
}

.timeline-item:nth-child(1) { animation-delay: 0.8s; }
.timeline-item:nth-child(2) { animation-delay: 1s; }
.timeline-item:nth-child(3) { animation-delay: 1.2s; }
.timeline-item:nth-child(4) { animation-delay: 1.4s; }
.timeline-item:nth-child(5) { animation-delay: 1.6s; }

@keyframes timeline-item-in {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timeline-dot {
  position: absolute;
  left: 31px;
  top: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent);
  border: 4px solid var(--bg-primary);
  box-shadow: 0 0 0 2px var(--accent);
  z-index: 2;
}

.timeline-year {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 8px;
}

.timeline-content h4 {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

.timeline-content p {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ─── TEAM SECTION ─── */
.team-section {
  padding: 100px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 60px;
}

.team-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.team-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-6px);
}

.team-avatar {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--accent-dim) 0%, rgba(34,197,94,0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  border-bottom: 1px solid var(--border);
}

.team-info {
  padding: 24px 20px;
  text-align: center;
}

.team-info h4 {
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.team-info p {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.team-social {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.social-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--accent-dim);
  border: 1px solid var(--border-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
  text-decoration: none;
}

.social-icon:hover {
  background: var(--accent);
  transform: translateY(-2px);
}

/* ─── STATS ─── */
.stats-section {
  padding: 80px 24px;
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stats-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 60px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-family: 'Syne', sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

/* ─── CTA SECTION ─── */
.cta-section {
  padding: 120px 24px;
  text-align: center;
}

.cta-box {
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
  border: 1px solid var(--border);
  border-radius: 32px;
  padding: 80px 60px;
  position: relative;
  overflow: hidden;
}

.cta-box::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.cta-box h2 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  letter-spacing: -1.5px;
  color: var(--text-primary);
  margin-bottom: 20px;
  position: relative;
}

.cta-box p {
  font-size: 17px;
  color: var(--text-secondary);
  margin-bottom: 36px;
  position: relative;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  position: relative;
}

.btn-primary {
  background: var(--accent);
  color: #0a0a0f;
  font-weight: 600;
  font-size: 15px;
  padding: 16px 36px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
}

.btn-primary:hover {
  background: #16a34a;
  box-shadow: 0 0 32px var(--accent-glow);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 15px;
  padding: 16px 36px;
  border-radius: 12px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
}

.btn-secondary:hover {
  border-color: var(--border-accent);
  background: var(--accent-dim);
  color: var(--accent);
}

/* ─── REVEAL ANIMATION ─── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ─── RESPONSIVE ─── */
@media (max-width: 968px) {
  .story-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .story-left {
    position: static;
  }
  
  .mv-grid {
    grid-template-columns: 1fr;
  }
  
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .team-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 100px 20px 80px;
  }
  
  .values-grid {
    grid-template-columns: 1fr;
  }
  
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .timeline-item {
    padding-left: 80px;
  }
  
  .cta-box {
    padding: 60px 32px;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
`;

/* ─── HOOK: intersection-observer reveal ──────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── HOOK: counter animation ─────────────────────────────────────────── */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ─── STAT COMPONENT ──────────────────────────────────────────────────── */
function AnimatedStat({ value, suffix, label }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ─── DATA ────────────────────────────────────────────────────────────── */
const VALUES = [
  {
    icon: "🎯",
    title: "Trust First",
    desc: "We build authentic relationships based on transparency, verified identities, and community accountability."
  },
  {
    icon: "🤝",
    title: "Empowerment",
    desc: "We create opportunities for professionals to grow their businesses and reach clients they deserve."
  },
  {
    icon: "🌱",
    title: "Sustainability",
    desc: "Long-term relationships over quick transactions. We're building a marketplace that lasts."
  },
  {
    icon: "🔒",
    title: "Security",
    desc: "Your data, payments, and interactions are protected with enterprise-grade security measures."
  },
  {
    icon: "💡",
    title: "Innovation",
    desc: "We blend traditional trust with modern technology to create something truly unique."
  },
  {
    icon: "🌍",
    title: "Inclusivity",
    desc: "Open to all professionals and clients, regardless of background, location, or business size."
  }
];

const TIMELINE = [
  {
    year: "2020",
    title: "The Idea Takes Shape",
    desc: "Recognizing the trust gap in online marketplaces, we set out to create a platform where authenticity matters more than algorithms."
  },
  {
    year: "2021",
    title: "Building the Foundation",
    desc: "Developed our phygital verification system and launched the beta with select professionals in key sectors."
  },
  {
    year: "2022",
    title: "Community Growth",
    desc: "Reached 10,000+ verified professionals and introduced escrow payments for complete transaction security."
  },
  {
    year: "2023",
    title: "Expanding Horizons",
    desc: "Launched in 50+ cities across India, partnered with industry leaders, and achieved 100,000+ successful transactions."
  },
  {
    year: "2024",
    title: "The Future is Now",
    desc: "Introducing AI-powered matching, mobile apps, and expanding to new service categories while staying true to our core values."
  }
];

const TEAM = [
  { name: "Rajesh Kumar", role: "CEO & Founder", icon: "👨‍💼", social: "#" },
  { name: "Priya Sharma", role: "CTO", icon: "👩‍💻", social: "#" },
  { name: "Amit Patel", role: "Head of Product", icon: "👨‍🎨", social: "#" },
  { name: "Sneha Gupta", role: "Head of Operations", icon: "👩‍💼", social: "#" }
];

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────── */
export default function AboutUsPage() {
  useReveal();

  return (
    <>
      <style>{CSS}</style>
      <div className="about-root">
        
        {/* Hero */}
        <section className="hero">
          <div className="hero-glow" />
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>About Us</span>
          </div>
          <h1>Building Trust in the<br />Digital Marketplace</h1>
          <p className="hero-subtitle">
            We're creating a platform where real people, verified credentials, and authentic 
            relationships power every connection. This is more than a marketplace—it's a 
            community built on trust.
          </p>
        </section>

        {/* Our Story */}
        <section className="story-section reveal">
          <div className="story-grid">
            <div className="story-left">
              <div className="section-label">Our Story</div>
              <h2 className="section-title">Where We Started & Where We're Going</h2>
              <p className="story-highlight">
                "We believed there had to be a better way to connect professionals with clients—one 
                built on real trust, not just ratings."
              </p>
            </div>
            <div className="story-content">
              <p>
                It started with a simple frustration: finding reliable professionals online felt like 
                a gamble. Fake reviews, unverified profiles, and zero accountability made every 
                transaction a risk. We knew there had to be a better way.
              </p>
              <p>
                In 2020, we set out to build that better way. Not another anonymous platform, but a 
                marketplace where every professional is verified, every transaction is secure, and 
                every relationship is built to last. We called it the "phygital" approach—blending the 
                trust of local, in-person interactions with the scale and convenience of digital technology.
              </p>
              <p>
                Today, we're proud to serve thousands of professionals and clients across India, 
                facilitating connections that matter. From plumbers to lawyers, fitness trainers to 
                graphic designers, we've created a space where skilled professionals can showcase their 
                work authentically, and clients can hire with confidence.
              </p>
              <p>
                But we're just getting started. Our mission is to become the most trusted marketplace 
                in India—and eventually, the world—where dignity, security, and opportunity come standard.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision">
          <div className="mv-container">
            <div className="reveal" style={{textAlign: 'center', marginBottom: '20px'}}>
              <div className="section-label">Mission & Vision</div>
              <h2 className="section-title">What Drives Us Forward</h2>
            </div>
            <div className="mv-grid">
              <div className="mv-card reveal">
                <div className="mv-icon">🎯</div>
                <h3>Our Mission</h3>
                <p>
                  To empower professionals and clients by creating the most trustworthy, secure, 
                  and transparent marketplace in India. We're building a platform where verified 
                  credentials meet real relationships, escrow-protected payments ensure safety, 
                  and every interaction adds value to both parties.
                </p>
              </div>
              <div className="mv-card reveal">
                <div className="mv-icon">🚀</div>
                <h3>Our Vision</h3>
                <p>
                  A future where finding the right professional is effortless and trustworthy. 
                  Where skilled individuals earn what they deserve, clients get exceptional service, 
                  and both sides grow together. We envision a marketplace that sets the global 
                  standard for authenticity and accountability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="values-section">
          <div className="reveal" style={{textAlign: 'center', marginBottom: '20px'}}>
            <div className="section-label">Our Values</div>
            <h2 className="section-title">What We Stand For</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((value, i) => (
              <div className="value-card reveal" key={i}>
                <span className="value-icon">{value.icon}</span>
                <h4>{value.title}</h4>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="timeline-section">
          <div style={{textAlign: 'center', maxWidth: '700px', margin: '0 auto 20px'}}>
            <div className="section-label">Our Journey</div>
            <h2 className="section-title">Milestones That Shaped Us</h2>
          </div>
          <div className="timeline-container">
            <div className="timeline-line" />
            {TIMELINE.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-year">{item.year}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <div className="reveal" style={{textAlign: 'center', marginBottom: '20px'}}>
            <div className="section-label">Meet The Team</div>
            <h2 className="section-title">The People Behind the Platform</h2>
          </div>
          <div className="team-grid">
            {TEAM.map((member, i) => (
              <div className="team-card reveal" key={i}>
                <div className="team-avatar">{member.icon}</div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                  <div className="team-social">
                    <a href={member.social} className="social-icon">in</a>
                    <a href={member.social} className="social-icon">𝕏</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="stats-grid">
            <AnimatedStat value={150} suffix="K+" label="Verified Professionals" />
            <AnimatedStat value={500} suffix="K+" label="Successful Projects" />
            <AnimatedStat value={50} suffix="+" label="Cities Covered" />
            <AnimatedStat value={98} suffix="%" label="Client Satisfaction" />
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section reveal">
          <div className="cta-box">
            <h2>Ready to Join Our Community?</h2>
            <p>
              Whether you're a professional looking to grow your business or a client seeking 
              trusted services, we'd love to have you with us.
            </p>
            <div className="cta-buttons">
              <a href="/signup" className="btn-primary">Get Started Today</a>
              <a href="/contact" className="btn-secondary">Contact Us</a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}