'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
  ];

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="faq section-pad" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <div className="faq-header anim-up">
          <span className="section-tag">
            <i className="fas fa-circle-question"></i> {t('faq.tag')}
          </span>
          <h2 className="section-title">{t('faq.title')}</h2>
          <p className="section-subtitle">{t('faq.subtitle')}</p>
        </div>
        <div className="faq-row">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item anim-up${openIndex === i ? ' open' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="faq-q" onClick={() => toggle(i)}>
                <span>{faq.q}</span>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="faq-a">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="faq-more anim-up" style={{ marginTop: '24px' }}>
          <a href="#knowledge-base">
            {t('faq.viewAll')} <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
