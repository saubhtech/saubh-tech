'use client';

import { useTranslation } from '@/lib/i18n';

export default function RealPeople() {
  const { t } = useTranslation();

  const cards = [
    {
      icon: 'fas fa-briefcase',
      title: t('rp.providers.title'),
      items: [t('rp.providers.1'), t('rp.providers.2'), t('rp.providers.3')],
      delay: '0s',
    },
    {
      icon: 'fas fa-user-tie',
      title: t('rp.clients.title'),
      items: [t('rp.clients.1'), t('rp.clients.2'), t('rp.clients.3')],
      delay: '.1s',
    },
  ];

  return (
    <section className="real-people section-pad" aria-labelledby="rp-title">
      <div className="container">
        <div className="rp-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-bolt"></i> {t('rp.tag')}
          </span>
        </div>
        <div className="rp-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rp-card anim-up"
              style={{ transitionDelay: card.delay }}
            >
              <div className="rp-card-head">
                <div className="rp-card-icon">
                  <i className={card.icon}></i>
                </div>
                <h3>{card.title}</h3>
              </div>
              <ul>
                {card.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <a href="#offer" className="btn btn-outline dark">
            <i className="fas fa-hand-holding-heart"></i> {t('rp.btn.offer')}
          </a>
          <a href="#post" className="btn btn-outline dark">
            <i className="fas fa-plus-circle"></i> {t('rp.btn.post')}
          </a>
          <a href="#demo" className="btn btn-outline dark">
            <i className="fas fa-calendar-check"></i> {t('rp.btn.demo')}
          </a>
        </div>
      </div>
    </section>
  );
}
