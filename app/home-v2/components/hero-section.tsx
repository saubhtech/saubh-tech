'use client';

export default function Hero() {
  return (
    <header className="hero" id="gig-work">
      <div className="hero-video-wrap">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster=""
          aria-hidden="true"
        >
          <source src="/videos/saubhtech.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
      </div>
      <div className="hero-orb g"></div>
      <div className="hero-orb o"></div>
      <div className="hero-orb r"></div>
      <div className="hero-content">
        <div className="hero-badges">
          <span className="hero-badge">
            <i className="fas fa-shield-halved"></i> Community-Verified
          </span>
          <span className="hero-badge">
            <i className="fas fa-lock"></i> Escrow-Protected
          </span>
        </div>
        <h1>
          <span className="accent">Phygital Gig Marketplace</span>
        </h1>
        <p className="hero-sub">
          Connect with verified individuals and businesses worldwide for secure
          gig work payments.
        </p>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <a href="#register" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Register for Gig-Work
          </a>
          <a href="#post" className="btn btn-outline">
            <i className="fas fa-plus-circle"></i> Post Requirements
          </a>
          <a href="#demo" className="btn btn-ghost">
            <i className="fas fa-calendar-check"></i> Schedule a Demo
          </a>
        </div>
      </div>
    </header>
  );
}
