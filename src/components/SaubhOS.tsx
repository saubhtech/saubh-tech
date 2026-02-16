'use client';

import { useTranslation } from '@/lib/i18n';

export default function SaubhOS() {
  const { t } = useTranslation();

  const cards = [
    { icon: 'fas fa-chart-pie', title: t('saubhos.card1.title'), desc: t('saubhos.card1.desc'), delay: '0s' },
    { icon: 'fas fa-headset', title: t('saubhos.card2.title'), desc: t('saubhos.card2.desc'), delay: '.1s' },
    { icon: 'fas fa-users-gear', title: t('saubhos.card3.title'), desc: t('saubhos.card3.desc'), delay: '.2s' },
    { icon: 'fas fa-route', title: t('saubhos.card4.title'), desc: t('saubhos.card4.desc'), delay: '.3s' },
  ];

  return (
    <section className="saubhos section-pad" id="saubhos" aria-labelledby="saubhos-title">
      <div className="container">
        <div className="saubhos-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-microchip"></i> {t('saubhos.tag')}
          </span>
        </div>
        <div className="saubhos-grid">
          {cards.map((card) => (
            <div key={card.title} className="saubhos-card anim-up" style={{ transitionDelay: card.delay }}>
              <div className="saubhos-card-icon">
                <i className={card.icon}></i>
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center', marginTop: '48px' }}>
          <a href="#saubhos-free" className="btn btn-outline dark">
            <i className="fas fa-download"></i> {t('saubhos.btn.free')}
          </a>
          <a href="#demo" className="btn btn-outline dark">
            <i className="fas fa-calendar-check"></i> {t('saubhos.btn.demo')}
          </a>
        </div>
      </div>
    </section>
  );
}
