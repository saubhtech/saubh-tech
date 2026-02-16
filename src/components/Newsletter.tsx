'use client';

import { FormEvent } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function Newsletter() {
  const { t } = useTranslation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire up newsletter subscription
  };

  return (
    <section className="newsletter" id="newsletter">
      <div className="container">
        <div className="newsletter-inner anim-up">
          <div className="newsletter-left">
            <h3>
              <i className="fas fa-envelope" style={{ color: 'var(--green)' }}></i> {t('newsletter.title')}
            </h3>
            <p>{t('newsletter.subtitle')}</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input type="text" placeholder={t('newsletter.name')} aria-label={t('newsletter.name')} required />
            <input type="tel" placeholder={t('newsletter.whatsapp')} aria-label={t('newsletter.whatsapp')} required />
            <input type="email" placeholder={t('newsletter.email')} aria-label={t('newsletter.email')} required />
            <button type="submit" className="btn btn-primary">
              {t('newsletter.subscribe')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
