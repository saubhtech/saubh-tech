export default function BrandingSection() {
  const cards = [
    { label: 'Aggregation', labelColor: 'text-saubh-green', title: 'User Generated Content (UGC) Hub', desc: 'Users create authentic content including reviews, testimonials, and videos that resonate with your audience.', grad: 'card-grad-green' },
    { label: 'Amplification', labelColor: 'text-saubh-orange', title: 'Social Media Amplification (SMA) Network', desc: 'Multi-channel people-to-people content distribution that multiplies reach, drives engagement and visibility.', grad: 'card-grad-orange' },
    { label: 'Automation', labelColor: 'text-saubh-red', title: 'Organic Leads Generation (OLG) Engine', desc: 'Unified multi-channel campaigns, landing pages, and sign-ups delivering pre-qualified leads directly to your CRM sales funnel.', grad: 'card-grad-red' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#0A1A0A] via-[#112211] to-[#1A1206]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 anim-up">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-saubh-card border border-saubh-border rounded-full font-heading text-[0.82rem] font-medium tracking-wider uppercase">
            <i className="fas fa-palette text-saubh-orange" />
            <span className="text-saubh-orange">Branding</span>
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-5 text-saubh-text">
            No Business Without a <span className="text-saubh-orange">Brand</span>.<br />No Brand Without <span className="text-saubh-red">Social Proof</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.title} className={`card-grad ${card.grad} bg-saubh-card border border-saubh-border rounded-card p-12 text-center hover:border-white/20 transition-all anim-up`}>
              <div className={`font-heading font-bold text-[0.8rem] tracking-[2px] uppercase mb-4 ${card.labelColor}`}>{card.label}</div>
              <h3 className="font-heading font-bold text-lg text-saubh-text mb-4">{card.title}</h3>
              <p className="text-saubh-muted text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
