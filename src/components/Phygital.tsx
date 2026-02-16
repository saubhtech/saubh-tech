'use client';

import { useTranslation } from '@/lib/i18n';

export default function Phygital() {
  const { t } = useTranslation();

  const cards = [
    { icon: 'fas fa-handshake', title: t('phygital.card1'), delay: '0s' },
    { icon: 'fas fa-rocket', title: t('phygital.card2'), delay: '.1s' },
    { icon: 'fas fa-arrows-turn-to-dots', title: t('phygital.card3'), delay: '.2s' },
  ];

  return (
    <section className="phygital section-pad" aria-labelledby="phygital-title">
      <div className="container">
        <div className="phygital-header anim-up">
          <span className="section-tag">
            <i className="fas fa-sparkles"></i> {t('phygital.tag')}
          </span>
        </div>
        <div className="phygital-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="phygital-card anim-up"
              style={{ transitionDelay: card.delay }}
            >
              <div className="phygital-icon">
                <i className={card.icon}></i>
              </div>
              <h3>{card.title}</h3>
            </div>
          ))}
        </div>
        <div className="phygital-tagline anim-up">
          <h3>{t('phygital.tagline')}</h3>
          <p>{t('phygital.desc')}</p>
        </div>
      </div>
    </section>
  );
}
