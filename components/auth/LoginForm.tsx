'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>('register');

  return (
    <div className="lg-page">

      {/* BG image */}
      <div className="lg-bg" />
      <div className="lg-overlay" />

      {/* Floating particles */}
      <div className="lg-p lg-p1" />
      <div className="lg-p lg-p2" />
      <div className="lg-p lg-p3" />
      <div className="lg-p lg-p4" />

      {/* Header */}
      <header className="lg-header">
        <a href="/" className="lg-logo">
          <img src="/Saubh-Good.png" alt="Saubh.Tech" className="lg-logo-img" />
          <span className="lg-logo-text">Saubh<span className="lg-dot">.</span>Tech</span>
        </a>
      </header>

      {/* Main card */}
      <div className="lg-center">

        {/* Tab switcher (mobile friendly) */}
        <div className="lg-tabs">
          <button
            className={`lg-tab ${activeTab === 'register' ? 'lg-tab-on' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            <i className="fas fa-user-plus"></i> Register
          </button>
          <button
            className={`lg-tab ${activeTab === 'signin' ? 'lg-tab-on' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            <i className="fas fa-right-to-bracket"></i> Sign In
          </button>
        </div>

        <div className="lg-cards">

          {/* ━━ REGISTER ━━ */}
          <div className={`lg-card ${activeTab === 'register' ? 'lg-active' : 'lg-hide'}`}>
            <div className="lg-card-icon">
              <i className="fas fa-user"></i>
            </div>
            <h2 className="lg-card-title">Register</h2>

            <div className="lg-steps">
              <div className="lg-step">
                <span className="lg-bullet">1</span>
                <span>Open your WhatsApp <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i></span>
              </div>
              <div className="lg-step">
                <span className="lg-bullet">2</span>
                <span>
                  Type <code className="lg-code lg-code-green">Register Your Name</code> and send it to
                  <br />
                  <strong className="lg-nums">+918800607598</strong> or <strong className="lg-nums">+918130960040</strong>
                </span>
              </div>
              <p className="lg-note">* Replace Your Name with your real name.</p>
              <div className="lg-step">
                <span className="lg-bullet">3</span>
                <span>You'll receive a message.</span>
              </div>
            </div>

            <form className="lg-form" onSubmit={(e) => e.preventDefault()}>
              <div className="lg-field">
                <label>Your Name:</label>
                <div className="lg-input-wrap">
                  <i className="fas fa-user lg-input-icon"></i>
                  <input type="text" placeholder="Your name" />
                </div>
              </div>
              <div className="lg-field">
                <label>WhatsApp Number:</label>
                <div className="lg-input-wrap">
                  <i className="fab fa-whatsapp lg-input-icon" style={{ color: '#25D366' }}></i>
                  <input type="tel" placeholder="Your WhatsApp number" />
                </div>
              </div>
              <button type="submit" className="lg-btn lg-btn-green">
                <i className="fab fa-whatsapp"></i> Open WhatsApp to Register
              </button>
            </form>
          </div>

          {/* ━━ SIGN IN ━━ */}
          <div className={`lg-card ${activeTab === 'signin' ? 'lg-active' : 'lg-hide'}`}>
            <div className="lg-card-icon lg-icon-amber">
              <i className="fas fa-lock"></i>
            </div>
            <h2 className="lg-card-title">Sign In</h2>

            <div className="lg-steps">
              <div className="lg-step">
                <span className="lg-bullet lg-bullet-amber">1</span>
                <span>Open WhatsApp <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i></span>
              </div>
              <div className="lg-step">
                <span className="lg-bullet lg-bullet-amber">2</span>
                <span>
                  Send <code className="lg-code lg-code-amber">Login</code> to
                  <br />
                  <strong className="lg-nums">+918800607598</strong> or <strong className="lg-nums">+918130960040</strong>
                </span>
              </div>
              <div className="lg-step">
                <span className="lg-bullet lg-bullet-amber">3</span>
                <span>You'll receive a 4-digit passcode</span>
              </div>
            </div>

            <form className="lg-form" onSubmit={(e) => e.preventDefault()}>
              <div className="lg-field">
                <label>WhatsApp Number:</label>
                <div className="lg-input-wrap">
                  <i className="fab fa-whatsapp lg-input-icon" style={{ color: '#25D366' }}></i>
                  <input type="tel" placeholder="Your WhatsApp number" />
                </div>
              </div>
              <div className="lg-field">
                <label>Passcode:</label>
                <div className="lg-input-wrap">
                  <i className="fas fa-lock lg-input-icon lg-icon-amber-i"></i>
                  <input type="password" placeholder="••••" maxLength={4} />
                </div>
              </div>
              <button type="submit" className="lg-btn lg-btn-amber">
                <i className="fas fa-check"></i> Login to continue
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ━━ PAGE ━━ */
        .lg-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #0C0F0A;
          padding: 20px;
        }

        /* ━━ BG IMAGE ━━ */
        .lg-bg {
          position: absolute;
          inset: 0;
          background: url('/loginBG.png') center/cover no-repeat;
          opacity: 0.2;
          z-index: 0;
        }

        .lg-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(12,15,10,0.4) 0%, rgba(12,15,10,0.92) 70%),
            linear-gradient(180deg, rgba(12,15,10,0.3) 0%, rgba(12,15,10,0.95) 100%);
          z-index: 1;
        }

        /* ━━ PARTICLES ━━ */
        .lg-p {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
        .lg-p1 { width: 6px; height: 6px; background: rgba(143,212,94,0.4); top: 15%; left: 10%; animation: lgFloat 7s ease-in-out infinite; box-shadow: 0 0 12px rgba(143,212,94,0.3); }
        .lg-p2 { width: 4px; height: 4px; background: rgba(240,150,14,0.4); top: 25%; right: 15%; animation: lgFloat 9s ease-in-out infinite 1.5s; box-shadow: 0 0 8px rgba(240,150,14,0.3); }
        .lg-p3 { width: 5px; height: 5px; background: rgba(143,212,94,0.3); bottom: 20%; left: 20%; animation: lgFloat 8s ease-in-out infinite 3s; }
        .lg-p4 { width: 3px; height: 3px; background: rgba(232,85,58,0.3); bottom: 30%; right: 25%; animation: lgFloat 10s ease-in-out infinite 2s; }

        /* ━━ HEADER ━━ */
        .lg-header {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 24px 32px;
          z-index: 10;
          text-align: center;
        }

        .lg-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .lg-logo-img {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          object-fit: contain;
        }

        .lg-logo-text {
          font-family: var(--font-display, 'Poppins', sans-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: #F0EDE8;
        }

        .lg-dot { color: #8FD45E; }

        /* ━━ CENTER WRAPPER ━━ */
        .lg-center {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 920px;
          animation: lgFadeUp .7s ease forwards;
        }

        /* ━━ TABS ━━ */
        .lg-tabs {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin-bottom: 24px;
          background: rgba(255,255,255,0.04);
          border-radius: 100px;
          padding: 4px;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .lg-tab {
          padding: 10px 28px;
          border-radius: 100px;
          border: none;
          font-family: var(--font-display, 'Poppins', sans-serif);
          font-size: .88rem;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          background: transparent;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all .35s ease;
        }

        .lg-tab:hover { color: #fff; }

        .lg-tab-on {
          background: linear-gradient(135deg, #6DB33F, #4A8C1F);
          color: #fff;
          box-shadow: 0 0 18px rgba(109,179,63,0.25);
        }

        /* ━━ CARDS CONTAINER ━━ */
        .lg-cards {
          display: flex;
          gap: 24px;
          justify-content: center;
        }

        /* ━━ CARD ━━ */
        .lg-card {
          flex: 1;
          max-width: 440px;
          padding: 36px 32px;
          border-radius: 24px;
          background: rgba(10,13,8,0.92);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          transition: all .5s cubic-bezier(.4,0,.2,1);
        }

        .lg-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #8FD45E, #F0960E);
          border-radius: 24px 24px 0 0;
          transition: height .3s ease;
        }

        .lg-card:hover {
          border-color: rgba(109,179,63,0.25);
          box-shadow: 0 0 50px rgba(109,179,63,0.06), 0 20px 40px rgba(0,0,0,0.3);
          transform: translateY(-4px);
        }

        .lg-card:hover::before {
          height: 4px;
          box-shadow: 0 0 14px rgba(109,179,63,0.3);
        }

        .lg-active {
          opacity: 1;
          transform: translateY(0);
        }

        .lg-hide {
          display: none;
        }

        /* ━━ CARD ICON ━━ */
        .lg-card-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          background: rgba(143,212,94,0.12);
          color: #8FD45E;
          margin-bottom: 12px;
          transition: all .4s ease;
        }

        .lg-icon-amber {
          background: rgba(240,150,14,0.12);
          color: #F0960E;
        }

        .lg-card:hover .lg-card-icon {
          transform: scale(1.1) rotate(-6deg);
          box-shadow: 0 0 24px rgba(143,212,94,0.2);
        }

        .lg-card:hover .lg-icon-amber {
          box-shadow: 0 0 24px rgba(240,150,14,0.2);
        }

        /* ━━ CARD TITLE ━━ */
        .lg-card-title {
          font-family: var(--font-display, 'Poppins', sans-serif);
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 20px;
        }

        /* ━━ STEPS ━━ */
        .lg-steps {
          margin-bottom: 24px;
        }

        .lg-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
          font-size: .9rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
        }

        .lg-bullet {
          width: 24px;
          height: 24px;
          min-width: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .7rem;
          font-weight: 700;
          background: rgba(143,212,94,0.15);
          color: #8FD45E;
          margin-top: 2px;
        }

        .lg-bullet-amber {
          background: rgba(240,150,14,0.15);
          color: #F0960E;
        }

        .lg-note {
          font-size: .78rem;
          color: rgba(255,255,255,0.35);
          font-style: italic;
          margin: -4px 0 12px 36px;
        }

        /* Code badges */
        .lg-code {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 6px;
          font-family: var(--font-display, 'Poppins', sans-serif);
          font-size: .82rem;
          font-weight: 700;
        }

        .lg-code-green {
          background: rgba(143,212,94,0.15);
          color: #8FD45E;
          border: 1px solid rgba(143,212,94,0.25);
        }

        .lg-code-amber {
          background: rgba(240,150,14,0.15);
          color: #F0960E;
          border: 1px solid rgba(240,150,14,0.25);
        }

        .lg-nums {
          color: #8FD45E;
          font-weight: 700;
        }

        /* ━━ FORM ━━ */
        .lg-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lg-field label {
          display: block;
          font-family: var(--font-display, 'Poppins', sans-serif);
          font-size: .82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          margin-bottom: 6px;
        }

        .lg-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all .35s ease;
        }

        .lg-input-wrap:focus-within {
          border-color: rgba(109,179,63,0.5);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 16px rgba(109,179,63,0.1);
        }

        .lg-input-icon {
          font-size: .85rem;
          color: rgba(255,255,255,0.3);
          transition: color .3s;
        }

        .lg-input-wrap:focus-within .lg-input-icon {
          color: #8FD45E;
        }

        .lg-icon-amber-i {
          color: rgba(240,150,14,0.5) !important;
        }

        .lg-input-wrap:focus-within .lg-icon-amber-i {
          color: #F0960E !important;
        }

        .lg-input-wrap input {
          flex: 1;
          padding: 14px 0;
          border: none;
          background: transparent;
          font-family: var(--font-body, 'DM Sans', sans-serif);
          font-size: .9rem;
          color: #fff;
          outline: none;
        }

        .lg-input-wrap input::placeholder {
          color: rgba(255,255,255,0.3);
        }

        /* ━━ BUTTONS ━━ */
        .lg-btn {
          width: 100%;
          padding: 15px 24px;
          border-radius: 14px;
          border: none;
          font-family: var(--font-display, 'Poppins', sans-serif);
          font-size: .95rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all .4s cubic-bezier(.4,0,.2,1);
          position: relative;
          overflow: hidden;
          margin-top: 4px;
        }

        .lg-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0;
          transition: opacity .4s ease;
        }

        .lg-btn-green {
          background: linear-gradient(135deg, #25D366, #128C7E);
          box-shadow: 0 4px 20px rgba(37,211,102,0.2);
        }

        .lg-btn-green:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(37,211,102,0.3);
        }

        .lg-btn-amber {
          background: linear-gradient(135deg, #6DB33F, #4A8C1F);
          box-shadow: 0 4px 20px rgba(109,179,63,0.2);
        }

        .lg-btn-amber:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(109,179,63,0.3);
        }

        .lg-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .lg-btn i {
          font-size: 1rem;
          transition: transform .3s ease;
        }

        .lg-btn:hover i {
          transform: scale(1.15);
        }

        /* ━━ ANIMATIONS ━━ */
        @keyframes lgFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          25%      { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
          50%      { transform: translateY(-8px) translateX(-8px); opacity: 0.5; }
          75%      { transform: translateY(-24px) translateX(14px); opacity: 0.7; }
        }

        @keyframes lgFadeUp {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* ━━ DESKTOP: show both cards side by side ━━ */
        @media (min-width: 769px) {
          .lg-tabs { display: none; }
          .lg-hide { display: block !important; }
          .lg-cards { display: flex; }
        }

        /* ━━ MOBILE: tab switch ━━ */
        @media (max-width: 768px) {
          .lg-cards {
            flex-direction: column;
            align-items: center;
          }
          .lg-card {
            max-width: 100%;
            width: 100%;
          }
          .lg-card-title { font-size: 1.3rem; }
          .lg-tab { padding: 9px 22px; font-size: .82rem; }
        }

        @media (max-width: 480px) {
          .lg-card { padding: 28px 22px; }
        }
      `}</style>
    </div>
  );
}