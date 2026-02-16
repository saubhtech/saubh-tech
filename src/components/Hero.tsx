'use client';

import { useTranslation } from '@/lib/i18n';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <header className="hero" id="gig-work">
      {/* Video Background */}
      <div className="hero-video-wrap">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/saubhtech.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
      </div>
      <div className="hero-orb g"></div>
      <div className="hero-orb o"></div>
      <div className="hero-orb r"></div>
      <div className="hero-content">
        <div className="hero-badges">
          <span className="hero-badge">
            <i className="fas fa-shield-halved"></i> {t('hero.badge.verified')}
          </span>
          <span className="hero-badge">
            <i className="fas fa-lock"></i> {t('hero.badge.escrow')}
          </span>
        </div>
        <h1>
          <span className="accent">{t('hero.title')}</span>
        </h1>
        <p className="hero-sub">{t('hero.subtitle')}</p>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <a href="#register" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> {t('hero.btn.register')}
          </a>
          <a href="#post" className="btn btn-outline">
            <i className="fas fa-plus-circle"></i> {t('hero.btn.post')}
          </a>
          <a href="#demo" className="btn btn-ghost">
            <i className="fas fa-calendar-check"></i> {t('hero.btn.demo')}
          </a>
        </div>
      </div>
    </header>
  );
}
