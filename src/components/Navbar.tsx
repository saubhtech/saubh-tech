'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { LOGO_SRC } from '@/lib/constants';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'ur', name: 'اردو' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'mai', name: 'मैथिली' },
  { code: 'sa', name: 'संस्कृतम्' },
  { code: 'sd', name: 'سنڌي' },
  { code: 'ne', name: 'नेपाली' },
  { code: 'ks', name: 'कॉशुर' },
  { code: 'kok', name: 'कोंकणी' },
  { code: 'doi', name: 'डोगरी' },
  { code: 'mni', name: 'মৈতৈলোন্' },
  { code: 'brx', name: 'बड़ो' },
  { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ' },
];

const navLinks = [
  { href: '#gig-work', icon: 'fas fa-briefcase', label: 'Gig-work' },
  { href: '#branding', icon: 'fas fa-bullhorn', label: 'Branding' },
  { href: '#saubhos', icon: 'fas fa-microchip', label: 'SaubhOS' },
  { href: '#learning', icon: 'fas fa-graduation-cap', label: 'Academy' },
  { href: '#faq', icon: 'fas fa-headset', label: 'Support' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

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

  const closeMenu = () => setMobileOpen(false);

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
                <i className="fas fa-globe"></i> EN{' '}
                <i className="fas fa-chevron-down" style={{ fontSize: '.6rem' }}></i>
              </button>
              <div className={`lang-dropdown${langOpen ? ' open' : ''}`} id="langDrop">
                {languages.map((lang) => (
                  <a key={lang.code} href={`?lang=${lang.code}`}>
                    {lang.name}
                  </a>
                ))}
              </div>
            </div>

            <a href="/login" className="nav-cta">
              <i className="fas fa-arrow-right-to-bracket"></i> Login
            </a>
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
        <a
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
          <i className="fas fa-arrow-right-to-bracket"></i> Login
        </a>
      </div>
    </>
  );
}
