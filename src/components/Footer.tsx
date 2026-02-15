import Image from 'next/image';
import { LOGO_SRC } from '@/lib/constants';

const socials = [
  { href: '#', label: 'Facebook', icon: 'fab fa-facebook-f' },
  { href: '#', label: 'Instagram', icon: 'fab fa-instagram' },
  { href: '#', label: 'X', icon: 'fab fa-x-twitter' },
  { href: '#', label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
  { href: '#', label: 'YouTube', icon: 'fab fa-youtube' },
  { href: '#', label: 'Pinterest', icon: 'fab fa-pinterest-p' },
];

const communityLinks = [
  'About Saubh Global',
  'Founding Co-owners',
  'Be a Certified Advisor',
  'Team Saubh',
  'Calculate Earnings',
];

const businessLinks = [
  'Unified Communication',
  'Marketing & Sales',
  'HR & Recruitment',
  'Counselling & Admission',
];

const legalLinks = [
  'Data Privacy, DPDPA & GDPR',
  'Terms of Service',
  'Escrow System',
  'Refund Policy',
  'Online Payment',
];

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Image src={LOGO_SRC} alt="Saubh.Tech" width={36} height={36} />
              <span>
                Saubh<span className="dot" style={{ color: 'var(--green)' }}>.</span>Tech
              </span>
            </div>
            <div className="footer-info">
              <div className="footer-info-item">
                <i className="fas fa-id-card"></i> GSTN: 10AAUPS8603H1ZH
              </div>
              <div className="footer-info-item">
                <i className="fas fa-building"></i> UDYAM-BR-31-0056281
              </div>
              <div className="footer-info-item">
                <i className="fas fa-envelope"></i>{' '}
                <a href="mailto:support@saubh.tech">support@saubh.tech</a>
              </div>
              <div className="footer-info-item">
                <i className="fas fa-phone"></i>{' '}
                <a href="tel:918800607598">918800607598</a>
              </div>
              <div className="footer-info-item">
                <i className="fab fa-whatsapp"></i>{' '}
                <a href="https://wa.me/918800607598">918800607598</a>
              </div>
            </div>
            <div className="footer-social">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}>
                  <i className={s.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Community */}
          <div className="footer-col">
            <h4>Community</h4>
            {communityLinks.map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
          </div>

          {/* Business */}
          <div className="footer-col">
            <h4>Business</h4>
            {businessLinks.map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4>Legal</h4>
            {legalLinks.map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-addresses">
            <div className="footer-addr">
              <i className="fas fa-location-dot"></i>
              <span>01 Tola-Tari, Sarha, Dahiawan, Chapra, Saran, Bihar – 841301</span>
            </div>
            <div className="footer-addr">
              <i className="fas fa-location-dot"></i>
              <span>5th floor, S.B. Plaza, Opp Assam Secretariat, Dispur - 781006</span>
            </div>
          </div>
          <p className="tagline">
            <span className="gradient-text">Gig Work. Verified People. Secured Income</span>
          </p>
          <p>
            Envisioned by Mani, a jewel of the earth. &nbsp;|&nbsp; ©2026 Saubh.Tech &nbsp;|&nbsp; All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
