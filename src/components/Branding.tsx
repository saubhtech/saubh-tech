'use client';

import { useTranslation } from '@/lib/i18n';

export default function Branding() {
  const { t } = useTranslation();

  const cards = [
    {
      icon: 'fas fa-layer-group',
      title: t('branding.card1.title'),
      subtitle: t('branding.card1.subtitle'),
      desc: t('branding.card1.desc'),
      delay: '0s',
    },
    {
      icon: 'fas fa-tower-broadcast',
      title: t('branding.card2.title'),
      subtitle: t('branding.card2.subtitle'),
      desc: t('branding.card2.desc'),
      delay: '.1s',
    },
    {
      icon: 'fas fa-gears',
      title: t('branding.card3.title'),
      subtitle: t('branding.card3.subtitle'),
      desc: t('branding.card3.desc'),
      delay: '.2s',
    },
  ];

  return (
    <section className="branding section-pad" id="branding" aria-labelledby="branding-title">
      <div className="container">
        <div className="branding-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-bullhorn"></i> {t('branding.tag')}
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-dark)' }}>
            {t('branding.title')}
          </h2>
        </div>
        <div className="branding-sub anim-up">
          <p>{t('branding.subtitle')}</p>
        </div>
        <div className="branding-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="branding-card anim-up"
              style={{ transitionDelay: card.delay }}
            >
              <div className="branding-card-icon">
                <i className={card.icon}></i>
              </div>
              <h3>{card.title}</h3>
              <h4>{card.subtitle}</h4>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
