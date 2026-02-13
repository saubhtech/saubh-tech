export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-20 relative overflow-hidden bg-gradient-to-br from-[#0A1A0A] via-[#112211] via-60% to-[#1A0E0A] hero-glow">
      {/* Badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 relative z-10 anim-up">
        <span className="inline-flex items-center gap-2 px-5 py-2 bg-saubh-card border border-saubh-border rounded-full font-heading text-[0.82rem] font-medium tracking-wider uppercase">
          <i className="fas fa-shield-halved text-saubh-green" />
          <span className="text-saubh-green">Community-Verified</span>
        </span>
        <span className="inline-flex items-center gap-2 px-5 py-2 bg-saubh-card border border-saubh-border rounded-full font-heading text-[0.82rem] font-medium tracking-wider uppercase">
          <i className="fas fa-lock text-saubh-orange" />
          <span className="text-saubh-orange">Escrow-Protected</span>
        </span>
      </div>

      {/* Title */}
      <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 relative z-10 anim-up">
        <span className="grad-text">Phygital Gig</span><br />Marketplace
      </h1>

      {/* Subtitle */}
      <p className="text-saubh-muted text-lg max-w-xl mx-auto mb-10 relative z-10 anim-up">
        Connect with verified individuals and businesses worldwide for secure gig work payments.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap justify-center gap-4 relative z-10 anim-up">
        <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn btn-gradient-primary text-white font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform">
          <i className="fas fa-user-plus" /> Register for Gig
        </a>
        <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-saubh-orange text-saubh-orange font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent">
          <i className="fas fa-plus-circle" /> Post Requirements
        </a>
        <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-white/25 text-saubh-text font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent">
          <i className="fas fa-calendar-check" /> Schedule a Demo
        </a>
      </div>
    </section>
  );
}
