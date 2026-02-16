'use client';

import { useTranslation } from '@/lib/i18n';

export default function ProvenResults() {
  const { t } = useTranslation();

  const stats = [
    { num: '6.9x', text: t('proven.stat1.text'), delay: '0s' },
    { num: '65%', text: t('proven.stat2.text'), delay: '.1s' },
    { num: '82%', text: t('proven.stat3.text'), delay: '.2s' },
    { num: '40%', text: t('proven.stat4.text'), delay: '.3s' },
  ];

  return (
    <section className="proven section-pad" aria-labelledby="proven-title">
      <div className="container">
        <div className="proven-header anim-up">
          <span className="section-tag">
            <i className="fas fa-chart-line"></i> {t('proven.tag')}
          </span>
        </div>
        <div className="proven-grid">
          {stats.map((stat) => (
            <div
              key={stat.num}
              className="proven-card anim-up"
              style={{ transitionDelay: stat.delay }}
            >
              <div className="proven-num">{stat.num}</div>
              <p>
                <span className="check">✓</span> {stat.text}
              </p>
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center', marginTop: '48px' }}>
          <a href="#register" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> {t('proven.btn.register')}
          </a>
          <a href="#post" className="btn btn-outline">
            <i className="fas fa-plus-circle"></i> {t('proven.btn.post')}
          </a>
          <a href="#demo" className="btn btn-ghost">
            <i className="fas fa-calendar-check"></i> {t('proven.btn.demo')}
          </a>
        </div>
      </div>
    </section>
  );
}
