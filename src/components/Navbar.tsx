'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LOGO_SRC } from '@/lib/constants';
import { useTranslation } from '@/lib/i18n';

export default function Navbar() {
  const { t, lang, setLang, languages, loading } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '#gig-work', icon: 'fas fa-briefcase', label: t('nav.gigWork') },
    { href: '#branding', icon: 'fas fa-bullhorn', label: t('nav.branding') },
    { href: '#saubhos', icon: 'fas fa-microchip', label: t('nav.saubhos') },
    { href: '#learning', icon: 'fas fa-graduation-cap', label: t('nav.academy') },
    { href: '#faq', icon: 'fas fa-headset', label: t('nav.support') },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const closeMenu = () => {
    setMobileOpen(false);
    setMobileLangOpen(false);
  };

  // Find current language display name
  const currentLang = languages.find((l) => l.code === lang);
  const displayCode = currentLang ? currentLang.code.toUpperCase() : 'EN';
  const displayName = currentLang ? currentLang.name : 'English';

  const handleLangChange = (code: string) => {
    setLang(code);
    setLangOpen(false);
    setMobileLangOpen(false);
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="mainNav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="/" className="nav-logo" aria-label="Saubh.Tech Home">
            <Image src={LOGO_SRC} alt="Saubh.Tech Logo" width={40} height={40} />
            <span>Saubh<span className="dot">.</span>Tech</span>
          </a>

          <div className="nav-links" id="navLinks">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                <i className={link.icon}></i> {link.label}
              </a>
            ))}

            <div className="lang-switcher" ref={langRef}>
              <button
                className="lang-btn"
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Select language"
              >
                <i className="fas fa-globe"></i>{' '}
                {loading ? '...' : displayCode}{' '}
                <i className="fas fa-chevron-down" style={{ fontSize: '.6rem' }}></i>
              </button>
              <div className={`lang-dropdown${langOpen ? ' open' : ''}`} id="langDrop">
                {languages.map((l) => (
                  <a
                    key={l.code}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLangChange(l.code);
                    }}
                    className={l.code === lang ? 'active' : ''}
                    style={l.code === lang ? { fontWeight: 700, background: 'rgba(0,200,83,.1)' } : undefined}
                  >
                    {l.name}
                  </a>
                ))}
              </div>
            </div>

            <Link href="/login" className="nav-cta">
              <i className="fas fa-arrow-right-to-bracket"></i> {t('nav.login')}
            </Link>
          </div>

          <button
            className="menu-toggle"
            id="menuToggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <i className={mobileOpen ? 'fas fa-xmark' : 'fas fa-bars'}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} id="mobileMenu">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            <i className={link.icon}></i> {link.label}
          </a>
        ))}

        {/* Mobile Language Switcher */}
        <div className="mobile-lang-section">
          <button
            className="mobile-lang-toggle"
            onClick={() => setMobileLangOpen(!mobileLangOpen)}
          >
            <span className="mobile-lang-toggle-left">
              <i className="fas fa-globe"></i>
              <span>{loading ? '...' : displayName}</span>
            </span>
            <i className={`fas fa-chevron-down mobile-lang-chevron${mobileLangOpen ? ' rotated' : ''}`}></i>
          </button>
          <div className={`mobile-lang-grid${mobileLangOpen ? ' open' : ''}`}>
            {languages.map((l) => (
              <button
                key={l.code}
                className={`mobile-lang-item${l.code === lang ? ' active' : ''}`}
                onClick={() => {
                  handleLangChange(l.code);
                  closeMenu();
                }}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/login"
          onClick={closeMenu}
          style={{
            background: 'var(--gradient-btn)',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '100px',
            marginTop: '12px',
            fontWeight: 700,
          }}
        >
          <i className="fas fa-arrow-right-to-bracket"></i> {t('nav.login')}
        </Link>
      </div>
    </>
  );
}
