'use client';

import Image from 'next/image';
import { LOGO_SRC } from '@/lib/constants';
import { useTranslation } from '@/lib/i18n';

const socials = [
  { href: '#', label: 'Facebook', icon: 'fab fa-facebook-f' },
  { href: '#', label: 'Instagram', icon: 'fab fa-instagram' },
  { href: '#', label: 'X', icon: 'fab fa-x-twitter' },
  { href: '#', label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
  { href: '#', label: 'YouTube', icon: 'fab fa-youtube' },
  { href: '#', label: 'Pinterest', icon: 'fab fa-pinterest-p' },
];

export default function Footer() {
  const { t } = useTranslation();

  const communityLinks = [
    t('footer.community.about'),
    t('footer.community.founders'),
    t('footer.community.advisor'),
    t('footer.community.team'),
    t('footer.community.earnings'),
  ];

  const businessLinks = [
    t('footer.business.comm'),
    t('footer.business.marketing'),
    t('footer.business.hr'),
    t('footer.business.counselling'),
  ];

  const legalLinks = [
    t('footer.legal.privacy'),
    t('footer.legal.terms'),
    t('footer.legal.escrow'),
    t('footer.legal.refund'),
    t('footer.legal.payment'),
  ];

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
                <i className="fas fa-id-card"></i> {t('footer.gstn')}
              </div>
              <div className="footer-info-item">
                <i className="fas fa-building"></i> {t('footer.udyam')}
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
            <h4>{t('footer.community')}</h4>
            {communityLinks.map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
          </div>

          {/* Business */}
          <div className="footer-col">
            <h4>{t('footer.business')}</h4>
            {businessLinks.map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4>{t('footer.legal')}</h4>
            {legalLinks.map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-addresses">
            <div className="footer-addr">
              <i className="fas fa-location-dot"></i>
              <span>{t('footer.addr1')}</span>
            </div>
            <div className="footer-addr">
              <i className="fas fa-location-dot"></i>
              <span>{t('footer.addr2')}</span>
            </div>
          </div>
          <p className="tagline">
            <span className="gradient-text">{t('footer.tagline')}</span>
          </p>
          <p>
            {t('footer.credit')} &nbsp;|&nbsp; {t('footer.copyright')} &nbsp;|&nbsp; {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
