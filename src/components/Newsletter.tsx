'use client';

import { FormEvent } from 'react';

export default function Newsletter() {
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
              <i className="fas fa-envelope" style={{ color: 'var(--green)' }}></i> Newsletter
            </h3>
            <p>Stay updated with the latest from Saubh.Tech</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" aria-label="Name" required />
            <input type="tel" placeholder="WhatsApp" aria-label="WhatsApp number" required />
            <input type="email" placeholder="Email" aria-label="Email address" required />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
