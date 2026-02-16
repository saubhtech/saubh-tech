'use client';

import { useTranslation } from '@/lib/i18n';

export default function Learning() {
  const { t } = useTranslation();

  const features = [
    { icon: 'fas fa-book-open', text: t('learning.feat1'), delay: '0s' },
    { icon: 'fas fa-chalkboard-user', text: t('learning.feat2'), delay: '.1s' },
    { icon: 'fas fa-certificate', text: t('learning.feat3'), delay: '.2s' },
  ];

  const programs = [
    { icon: 'fas fa-heart-pulse', name: t('learning.prog1') },
    { icon: 'fas fa-chart-column', name: t('learning.prog2') },
  ];

  return (
    <section className="learning section-pad" id="learning" aria-labelledby="learning-title">
      <div className="container">
        <div className="learning-header anim-up">
          <span className="section-tag">
            <i className="fas fa-graduation-cap"></i> {t('learning.tag')}
          </span>
          <h2 className="section-title">{t('learning.title')}</h2>
        </div>
        <div className="learning-features">
          {features.map((feat) => (
            <div key={feat.text} className="learning-feat anim-up" style={{ transitionDelay: feat.delay }}>
              <i className={feat.icon}></i>
              <p>{feat.text}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-light)',
              marginBottom: '20px',
            }}
          >
            {t('learning.programs')}
          </p>
        </div>
        <div className="training-row">
          {programs.map((prog) => (
            <div key={prog.name} className="training-badge">
              <i className={prog.icon}></i> {prog.name}
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <a href="#training" className="btn btn-primary">
            <i className="fas fa-play-circle"></i> {t('learning.btn.join')}
          </a>
          <a href="#meeting" className="btn btn-outline">
            <i className="fas fa-calendar-check"></i> {t('learning.btn.meeting')}
          </a>
        </div>
      </div>
    </section>
  );
}
