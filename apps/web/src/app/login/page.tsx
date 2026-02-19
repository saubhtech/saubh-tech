'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { LOGO_SRC } from '@/lib/constants';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>('register');

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire up WhatsApp registration
  };

  const handleSignin = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire up sign in
  };

  return (
    <div className="lg-page">
      {/* BG */}
      <div className="lg-bg"></div>
      <div className="lg-overlay"></div>

      {/* Particles */}
      <div className="lg-p lg-p1"></div>
      <div className="lg-p lg-p2"></div>
      <div className="lg-p lg-p3"></div>
      <div className="lg-p lg-p4"></div>

      {/* Header */}
      <header className="lg-header">
        <a href="/" className="lg-logo">
          <Image src={LOGO_SRC} alt="Saubh.Tech" width={36} height={36} className="lg-logo-img" />
          <span className="lg-logo-text">
            Saubh<span className="lg-dot">.</span>Tech
          </span>
        </a>
      </header>

      {/* Main */}
      <div className="lg-center">
        {/* Tabs (mobile only) */}
        <div className="lg-tabs" id="lgTabs">
          <button
            className={`lg-tab${activeTab === 'register' ? ' lg-tab-on' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            <i className="fas fa-user-plus"></i> Register
          </button>
          <button
            className={`lg-tab${activeTab === 'signin' ? ' lg-tab-on' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            <i className="fas fa-right-to-bracket"></i> Sign In
          </button>
        </div>

        <div className="lg-cards">
          {/* REGISTER */}
          <div
            className={`lg-card lg-card-register${activeTab !== 'register' ? ' lg-hide' : ''}`}
            id="cardRegister"
          >
            <div className="lg-card-head">
              <div className="lg-card-icon lg-icon-green">
                <i className="fas fa-user"></i>
              </div>
              <h2 className="lg-card-title">Register</h2>
            </div>

            <div className="lg-steps">
              <div className="lg-step">
                <span className="lg-bullet lg-bullet-green">1</span>
                <span>
                  Open your WhatsApp <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
                </span>
              </div>
              <div className="lg-step">
                <span className="lg-bullet lg-bullet-green">2</span>
                <span>
                  Type <code className="lg-code lg-code-green">Register Your Name</code> and send it to
                  <br />
                  <strong className="lg-nums">+918800607598</strong> or{' '}
                  <strong className="lg-nums">+918130960040</strong>
                </span>
              </div>
              <p className="lg-note">
                * <span className="lg-highlight">Replace Your Name with your real name.</span>
              </p>
              <div className="lg-step">
                <span className="lg-bullet lg-bullet-green">3</span>
                <span>You&#39;ll receive a message.</span>
              </div>
            </div>

            <form className="lg-form" onSubmit={handleRegister}>
              <div className="lg-field">
                <label>Your Name:</label>
                <div className="lg-input-wrap">
                  <i className="fas fa-user lg-input-icon"></i>
                  <input type="text" placeholder="Your name" autoComplete="off" />
                </div>
              </div>
              <div className="lg-field">
                <label>WhatsApp Number:</label>
                <div className="lg-input-wrap">
                  <i className="fab fa-whatsapp lg-input-icon" style={{ color: '#25D366' }}></i>
                  <input type="tel" placeholder="Your WhatsApp Number" autoComplete="off" />
                </div>
              </div>
              <button type="submit" className="lg-btn lg-btn-green">
                <i className="fab fa-whatsapp"></i> Open WhatsApp to Register
              </button>
            </form>
          </div>

          {/* SIGN IN */}
          <div
            className={`lg-card lg-card-signin${activeTab !== 'signin' ? ' lg-hide' : ''}`}
            id="cardSignin"
          >
            <div className="lg-card-head">
              <div className="lg-card-icon lg-icon-amber">
                <i className="fas fa-lock"></i>
              </div>
              <h2 className="lg-card-title">Sign In</h2>
            </div>

            <div className="lg-steps">
              <div className="lg-step">
                <span className="lg-bullet lg-bullet-amber">1</span>
                <span>
                  Open WhatsApp <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
                </span>
              </div>
              <div className="lg-step">
                <span className="lg-bullet lg-bullet-amber">2</span>
                <span>
                  Send <code className="lg-code lg-code-amber">Login</code> to
                  <br />
                  <strong className="lg-nums">+918800607598</strong> or{' '}
                  <strong className="lg-nums">+918130960040</strong>
                </span>
              </div>
              <div className="lg-step">
                <span className="lg-bullet lg-bullet-amber">3</span>
                <span>You&#39;ll receive a 4-digit passcode</span>
              </div>
            </div>

            <form className="lg-form" onSubmit={handleSignin}>
              <div className="lg-field">
                <label>WhatsApp Number:</label>
                <div className="lg-input-wrap">
                  <i className="fab fa-whatsapp lg-input-icon" style={{ color: '#25D366' }}></i>
                  <input type="tel" placeholder="Your WhatsApp Number" autoComplete="off" />
                </div>
              </div>
              <div className="lg-field">
                <label>Passcode:</label>
                <div className="lg-input-wrap">
                  <i className="fas fa-lock lg-input-icon lg-icon-amber-i"></i>
                  <input type="password" placeholder="••••" maxLength={4} autoComplete="off" />
                </div>
              </div>
              <button type="submit" className="lg-btn lg-btn-amber">
                <i className="fas fa-check"></i> Login to continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
