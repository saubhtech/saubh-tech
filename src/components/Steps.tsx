'use client';

import { useTranslation } from '@/lib/i18n';

export default function Steps() {
  const { t } = useTranslation();

  const steps = [
    { num: 1, icon: 'fas fa-user-check', title: t('steps.1'), delay: '0s' },
    { num: 2, icon: 'fas fa-file-invoice-dollar', title: t('steps.2'), delay: '.1s' },
    { num: 3, icon: 'fas fa-gavel', title: t('steps.3'), delay: '.2s' },
    { num: 4, icon: 'fas fa-clipboard-check', title: t('steps.4'), delay: '.3s' },
    { num: 5, icon: 'fas fa-money-bill-wave', title: t('steps.5'), delay: '.4s' },
  ];

  return (
    <section className="steps" aria-label="How it works">
      <div className="container">
        <div className="steps-track">
          {steps.map((step) => (
            <div
              key={step.num}
              className="step-card anim-up"
              style={{ transitionDelay: step.delay }}
            >
              <div className="step-num">{step.num}</div>
              <div className="step-icon">
                <i className={step.icon}></i>
              </div>
              <h4>{step.title}</h4>
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center', marginTop: '48px' }}>
          <a href="#register" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> {t('steps.btn.register')}
          </a>
          <a href="#post" className="btn btn-outline">
            <i className="fas fa-plus-circle"></i> {t('steps.btn.post')}
          </a>
          <a href="#demo" className="btn btn-ghost">
            <i className="fas fa-calendar-check"></i> {t('steps.btn.demo')}
          </a>
        </div>
      </div>
    </section>
  );
}
