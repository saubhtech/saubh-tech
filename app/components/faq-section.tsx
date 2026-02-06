'use client';

import { useEffect, useRef, useState } from 'react';

const faqs = [
  {
    q: 'Is Saubh.Tech safe?',
    a: 'At Saubh, our top priority is safety and security. We use the latest encryption technology to protect your personal information. We also have a team of experts who monitor our platform 24/7 to prevent fraud and other malicious activity.',
  },
  {
    q: 'Why use Saubh.Tech?',
    a: 'Saubh is the perfect place to connect with trusted service providers, find the perfect gig-work, or get advice from other professionals. We have a wide variety of features and resources to help you succeed, and our team is always here to support you.',
  },
  {
    q: 'How does Saubh.Tech work?',
    a: 'Saubh connects you with the right people for your needs. Whether you\'re looking for a job, a service provider, or just some advice, we can help you find what you\'re looking for. Our platform is easy to use and our team is always here to support you.',
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.anim-up').forEach((el) =>
              el.classList.add('visible')
            );
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section ref={sectionRef} className="faq section-pad" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <div className="faq-header anim-up">
          {/* <span className="section-tag"><i className="fas fa-circle-question"></i> FAQ</span> */}
          <h2 id="faq-title" className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Find answers to common questions about Saubh.Tech</p>
        </div>
        <div className="faq-row">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item anim-up${openIndex === i ? ' open' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <button 
                className="faq-q" 
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="faq-question-text">{faq.q}</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              <div 
                id={`faq-answer-${i}`}
                className="faq-a"
                role="region"
                aria-labelledby={`faq-question-${i}`}
              >
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="faq-more anim-up" style={{ marginTop: 24 }}>
          <a href="#knowledge-base">Go to FAQs &amp; Knowledge Base <i className="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </section>
  );
}