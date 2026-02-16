'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

type Period = 'quarterly' | 'half' | 'annual';

export default function Pricing() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('quarterly');

  const plans = [
    {
      tier: t('pricing.starter.tier'),
      name: t('pricing.starter.name'),
      desc: t('pricing.starter.desc'),
      prices: { quarterly: '₹15,999', half: '₹29,999', annual: '₹55,999' },
      features: [t('pricing.starter.f1'), t('pricing.starter.f2'), t('pricing.starter.f3')],
      popular: false,
      delay: '0s',
    },
    {
      tier: t('pricing.growth.tier'),
      name: t('pricing.growth.name'),
      desc: t('pricing.growth.desc'),
      prices: { quarterly: '₹35,999', half: '₹67,999', annual: '₹1,25,999' },
      features: [t('pricing.growth.f1'), t('pricing.growth.f2'), t('pricing.growth.f3')],
      popular: true,
      delay: '.1s',
    },
    {
      tier: t('pricing.pro.tier'),
      name: t('pricing.pro.name'),
      desc: t('pricing.pro.desc'),
      prices: { quarterly: '₹74,999', half: '₹1,39,999', annual: '₹2,59,999' },
      features: [t('pricing.pro.f1'), t('pricing.pro.f2'), t('pricing.pro.f3'), t('pricing.pro.f4')],
      popular: false,
      delay: '.2s',
    },
  ];

  const tabs: { label: string; value: Period }[] = [
    { label: t('pricing.tab.quarterly'), value: 'quarterly' },
    { label: t('pricing.tab.half'), value: 'half' },
    { label: t('pricing.tab.annual'), value: 'annual' },
  ];

  return (
    <section className="pricing section-pad" id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <div className="pricing-header anim-up">
          <span className="section-tag">
            <i className="fas fa-tags"></i> {t('pricing.tag')}
          </span>
          <h2 className="section-title">{t('pricing.title')}</h2>
        </div>

        <div className="pricing-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`pricing-tab${period === tab.value ? ' active' : ''}`}
              onClick={() => setPeriod(tab.value)}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`price-card anim-up${plan.popular ? ' popular' : ''}`}
              style={{ transitionDelay: plan.delay }}
            >
              <div className="price-tier">{plan.tier}</div>
              <div className="price-name">{plan.name}</div>
              <p className="price-desc">{plan.desc}</p>
              <div className="price-amounts">
                <div className="price-row">
                  <span>{t('pricing.price')}</span>
                  <span className="price-val">{plan.prices[period]}</span>
                </div>
              </div>
              <div className="price-features">
                {plan.features.map((feat) => (
                  <div key={feat} className="price-feat">
                    <i className="fas fa-check-circle"></i> {feat}
                  </div>
                ))}
              </div>
              <a
                href="#start"
                className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {t('pricing.getStarted')}
              </a>
            </div>
          ))}
        </div>

        <div className="btn-group" style={{ justifyContent: 'center', marginTop: '48px' }}>
          <a href="#post" className="btn btn-outline">
            <i className="fas fa-plus-circle"></i> {t('pricing.btn.post')}
          </a>
          <a href="#demo" className="btn btn-ghost">
            <i className="fas fa-calendar-check"></i> {t('pricing.btn.demo')}
          </a>
        </div>
      </div>
    </section>
  );
}
