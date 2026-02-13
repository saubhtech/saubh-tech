'use client';

import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Gig-work', icon: 'fa-briefcase' },
    { label: 'Branding', icon: 'fa-bullhorn' },
    { label: 'SaubhOS', icon: 'fa-gear' },
    { label: 'Academy', icon: 'fa-graduation-cap' },
    { label: 'Support', icon: 'fa-headset' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-8 bg-[rgba(12,15,10,0.85)] backdrop-blur-xl border-b border-saubh-border">
      <a href="#" className="flex items-center gap-2.5 no-underline">
        <div className="w-9 h-9 rounded-lg btn-gradient-primary flex items-center justify-center font-heading font-extrabold text-white text-lg">S</div>
        <span className="font-heading font-bold text-lg text-saubh-text">Saubh.Tech</span>
      </a>

      {/* Desktop Nav */}
      <ul className="hidden lg:flex items-center gap-8 list-none">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a href="#" className="text-saubh-muted hover:text-saubh-text text-sm flex items-center gap-1.5 no-underline transition-colors">
              <i className={`fas ${link.icon} text-xs`} /> {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-saubh-card border border-saubh-border text-saubh-muted text-xs cursor-pointer">
          <i className="fas fa-globe" /> EN <i className="fas fa-chevron-down text-[0.6rem]" />
        </div>
        <a href="#" className="flex items-center gap-1.5 px-6 py-2 rounded-btn btn-gradient-primary text-white font-heading font-semibold text-sm no-underline">
          <i className="fas fa-arrow-right-to-bracket" /> Login
        </a>
        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-saubh-muted text-xl bg-transparent border-none cursor-pointer">
          <i className={`fas ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-saubh-dark border-b border-saubh-border p-6 lg:hidden">
          <ul className="list-none flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href="#" className="text-saubh-muted hover:text-saubh-text text-base flex items-center gap-2 no-underline">
                  <i className={`fas ${link.icon}`} /> {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
