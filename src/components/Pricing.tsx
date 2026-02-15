'use client';

import { useState } from 'react';

type Period = 'quarterly' | 'half' | 'annual';

const plans = [
  {
    tier: 'STARTER',
    name: 'Visibility',
    desc: 'Solo entrepreneurs, very small, local businesses for maintaining minimal presence.',
    prices: { quarterly: '₹15,999', half: '₹29,999', annual: '₹55,999' },
    features: [
      '8 image posts per month',
      '4 reels/carousels/shorts per month',
      '2 LinkedIn posts/blogs per month',
    ],
    popular: false,
    delay: '0s',
  },
  {
    tier: 'GROWTH',
    name: 'Accelerator',
    desc: 'Small & Medium Businesses, service providers for driving engagement and organic leads.',
    prices: { quarterly: '₹35,999', half: '₹67,999', annual: '₹1,25,999' },
    features: [
      '20 image posts per month',
      '10 reels/carousels/shorts per month',
      '4 LinkedIn posts/blogs per month',
    ],
    popular: true,
    delay: '.1s',
  },
  {
    tier: 'PRO',
    name: 'Branding',
    desc: 'SMEs and e-commerce businesses for high-impact social presence, rapid scaling and strong branding.',
    prices: { quarterly: '₹74,999', half: '₹1,39,999', annual: '₹2,59,999' },
    features: [
      '50 image posts per month',
      '20 reels/carousels/shorts/testimonials per month',
      '10 LinkedIn posts/blogs per month',
      '20 X posts per month',
    ],
    popular: false,
    delay: '.2s',
  },
];

const tabs: { label: string; value: Period }[] = [
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Half-Yearly', value: 'half' },
  { label: 'Annual', value: 'annual' },
];

export default function Pricing() {
  const [period, setPeriod] = useState<Period>('quarterly');

  return (
    <section className="pricing section-pad" id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <div className="pricing-header anim-up">
          <span className="section-tag">
            <i className="fas fa-tags"></i> Branding Subscription
          </span>
          <h2 className="section-title">
            Integrate the Power of People with the Intelligence of Technology
          </h2>
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
                  <span>Price</span>
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
                Get Started
              </a>
            </div>
          ))}
        </div>

        <div className="btn-group" style={{ justifyContent: 'center', marginTop: '48px' }}>
          <a href="#post" className="btn btn-outline">
            <i className="fas fa-plus-circle"></i> Post Requirement
          </a>
          <a href="#demo" className="btn btn-ghost">
            <i className="fas fa-calendar-check"></i> Schedule a Demo
          </a>
        </div>
      </div>
    </section>
  );
}
