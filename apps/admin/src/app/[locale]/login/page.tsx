'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || 'en';
  const error = searchParams.get('error');
  const [hovering, setHovering] = useState(false);

  const handleLogin = () => {
    window.location.href = `/api/auth/login?locale=${locale}`;
  };

  return (
    &lt;>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      &lt;link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&amp;family=Plus+Jakarta+Sans:wght@400;500;600&amp;display=swap"
        rel="stylesheet"
      />

      &lt;div style={styles.wrapper}>
        {/* Animated background orbs */}
        &lt;div style={styles.orbContainer}>
          &lt;div style={{ ...styles.orb, ...styles.orb1 }} />
          &lt;div style={{ ...styles.orb, ...styles.orb2 }} />
          &lt;div style={{ ...styles.orb, ...styles.orb3 }} />
        &lt;/div>

        {/* Noise texture overlay */}
        &lt;div style={styles.noiseOverlay} />

        {/* Grid pattern */}
        &lt;div style={styles.gridPattern} />

        {/* Content */}
        &lt;div style={styles.content}>
          {/* Brand mark */}
          &lt;div style={styles.brandMark}>
            &lt;div style={styles.logoGlow} />
            &lt;div style={styles.logo}>S&lt;/div>
          &lt;/div>

          {/* Title */}
          &lt;h1 style={styles.title}>
            &lt;span style={styles.titleGradient}>Saubh&lt;/span>
            &lt;span style={styles.titleDot}>.&lt;/span>
            &lt;span style={styles.titleTech}>Tech&lt;/span>
          &lt;/h1>
          &lt;p style={styles.subtitle}>ADMIN CONSOLE&lt;/p>

          {/* Glass card */}
          &lt;div style={styles.card}>
            {/* Error banner */}
            {error &amp;&amp; (
              &lt;div style={styles.errorBanner}>
                &lt;svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  &lt;circle cx="8" cy="8" r="7" stroke="#ff4d6a" strokeWidth="1.5" />
                  &lt;path d="M8 4.5V9" stroke="#ff4d6a" strokeWidth="1.5" strokeLinecap="round" />
                  &lt;circle cx="8" cy="11.5" r="0.75" fill="#ff4d6a" />
                &lt;/svg>
                &lt;span style={styles.errorText}>{decodeURIComponent(error)}&lt;/span>
              &lt;/div>
            )}

            {/* Login button */}
            &lt;button
              onClick={handleLogin}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              style={{
                ...styles.loginButton,
                ...(hovering ? styles.loginButtonHover : {}),
              }}
            >
              &lt;div style={styles.buttonInner}>
                &lt;svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  &lt;path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  &lt;polyline points="10 17 15 12 10 7" />
                  &lt;line x1="15" y1="12" x2="3" y2="12" />
                &lt;/svg>
                &lt;span>Sign in with SSO&lt;/span>
                &lt;svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    transform: hovering ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  &lt;path d="M3 8h10M9 4l4 4-4 4" />
                &lt;/svg>
              &lt;/div>
            &lt;/button>

            &lt;div style={styles.divider}>
              &lt;div style={styles.dividerLine} />
              &lt;span style={styles.dividerText}>SECURED BY KEYCLOAK&lt;/span>
              &lt;div style={styles.dividerLine} />
            &lt;/div>

            &lt;p style={styles.accessNote}>
              Only authorized admins can access this panel.
              &lt;br />
              Contact your Super Admin for access.
            &lt;/p>
          &lt;/div>

          {/* Footer */}
          &lt;p style={styles.footer}>
            &amp;copy; {new Date().getFullYear()} Saubh.Tech &amp;middot; All rights reserved
          &lt;/p>
        &lt;/div>

        {/* CSS Animations */}
        &lt;style>{`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(80px, -60px) scale(1.1); }
            50% { transform: translate(-40px, -120px) scale(0.95); }
            75% { transform: translate(60px, -30px) scale(1.05); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(-100px, 50px) scale(1.15); }
            50% { transform: translate(60px, 80px) scale(0.9); }
            75% { transform: translate(-30px, -50px) scale(1.08); }
          }
          @keyframes float3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(70px, 70px) scale(1.1); }
            66% { transform: translate(-80px, 30px) scale(0.95); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.15); }
          }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}&lt;/style>
      &lt;/div>
    &lt;/>
  );
}

const styles: Record&lt;string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#070710',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  },
  orbContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(100px)',
    opacity: 0.35,
  },
  orb1: {
    width: '500px',
    height: '500px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    top: '-10%',
    right: '-5%',
    animation: 'float1 15s ease-in-out infinite',
  },
  orb2: {
    width: '400px',
    height: '400px',
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    bottom: '-15%',
    left: '-10%',
    animation: 'float2 18s ease-in-out infinite',
  },
  orb3: {
    width: '300px',
    height: '300px',
    background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
    top: '40%',
    left: '50%',
    animation: 'float3 20s ease-in-out infinite',
  },
  noiseOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
  },
  gridPattern: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 24px',
    animation: 'fade-up 0.8s ease-out',
  },
  brandMark: {
    position: 'relative',
    marginBottom: '28px',
  },
  logoGlow: {
    position: 'absolute',
    inset: '-12px',
    borderRadius: '28px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
    filter: 'blur(20px)',
    opacity: 0.5,
    animation: 'pulse-glow 3s ease-in-out infinite',
  },
  logo: {
    position: 'relative',
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontFamily: '"Syne", sans-serif',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  title: {
    fontSize: 'clamp(32px, 6vw, 42px)',
    fontFamily: '"Syne", sans-serif',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
  },
  titleGradient: {
    background: 'linear-gradient(135deg, #e0e7ff, #fff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  titleDot: {
    color: '#8b5cf6',
    fontSize: 'clamp(36px, 7vw, 48px)',
    lineHeight: 1,
  },
  titleTech: {
    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.3em',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: '40px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    borderRadius: '24px',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '14px 16px',
    borderRadius: '14px',
    background: 'rgba(244,63,95,0.08)',
    border: '1px solid rgba(244,63,95,0.15)',
    marginBottom: '24px',
  },
  errorText: {
    fontSize: '13px',
    color: '#ff8fa3',
    lineHeight: 1.5,
  },
  loginButton: {
    width: '100%',
    padding: '16px 24px',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    fontSize: '15px',
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 8px 32px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  loginButtonHover: {
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: '0 12px 40px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
    background: 'linear-gradient(135deg, #7c7ff7, #9d78ff)',
  },
  buttonInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0 20px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
  },
  dividerText: {
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.2)',
  },
  accessNote: {
    textAlign: 'center' as const,
    fontSize: '12px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.25)',
  },
  footer: {
    marginTop: '40px',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.15)',
    letterSpacing: '0.02em',
  },
};
