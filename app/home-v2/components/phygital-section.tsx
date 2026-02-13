'use client';

import { useEffect } from 'react';

export default function PhygitalSection() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = document.querySelectorAll('.anim-up, .anim-left, .anim-scale');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      className="phygital section-pad" 
      aria-labelledby="phygital-title"
      style={{ background: '#0C0F0A', minHeight: '600px' }}
    >
      <div className="container">
        <div className="phygital-header anim-up">
          <span className="section-tag">
            <i className="fas fa-sparkles"></i> The Future is Phygital (Physical + Digital)
          </span>
        </div>
        <div className="phygital-grid">
          <div className="phygital-card anim-up">
            <div className="phygital-icon">
              <i className="fas fa-handshake"></i>
            </div>
            <h3>Physical Trust</h3>
          </div>
          <div className="phygital-card anim-up" style={{ transitionDelay: '.1s' }}>
            <div className="phygital-icon">
              <i className="fas fa-rocket"></i>
            </div>
            <h3>Digital Scalability</h3>
          </div>
          <div className="phygital-card anim-up" style={{ transitionDelay: '.2s' }}>
            <div className="phygital-icon">
              <i className="fas fa-arrows-turn-to-dots"></i>
            </div>
            <h3>Phygital Synergy</h3>
          </div>
        </div>
        <div className="phygital-tagline anim-up">
          <h3>Gig-Work empowers you to work locally. scale globally.</h3>
          <p>Work from anywhere, anytime, with guaranteed escrow payment.</p>
        </div>
      </div>
    </section>
  );
}
