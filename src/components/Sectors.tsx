'use client';

import { useTranslation } from '@/lib/i18n';

const sectorEmojis = ['🌾','📢','💻','🎓','💰','🏛️','🩺','👥','🛠️','⚖️','🏭','❤️','🎬','🏠','🚚','✈️'];

export default function Sectors() {
  const { t } = useTranslation();

  const sectors = sectorEmojis.map((emoji, i) => ({
    emoji,
    name: t(`sectors.${i + 1}`),
  }));

  return (
    <section className="sectors section-pad" id="sectors" aria-labelledby="sectors-title">
      <div className="container">
        <div className="sectors-header anim-up">
          <span className="section-tag">
            <i className="fas fa-compass"></i> {t('sectors.tag')}
          </span>
          <h2 className="section-title" id="sectors-title">
            {t('sectors.title')}{' '}
            <span className="gradient-text">{t('sectors.highlight')}</span>
          </h2>
        </div>
        <div className="sectors-grid">
          {sectors.map((sector, i) => (
            <div
              key={i}
              className="sector-chip anim-up"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <span className="emoji">{sector.emoji}</span>
              {sector.name}
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <a href="#offer" className="btn btn-primary">
            <i className="fas fa-hand-holding-heart"></i> {t('sectors.btn.offer')}
          </a>
          <a href="#post" className="btn btn-outline">
            <i className="fas fa-plus-circle"></i> {t('sectors.btn.post')}
          </a>
          <a href="#demo" className="btn btn-ghost">
            <i className="fas fa-calendar-check"></i> {t('sectors.btn.demo')}
          </a>
        </div>
      </div>
    </section>
  );
}
