export default function PhygitalSection() {
  const cards = [
    { icon: 'fa-handshake', title: 'Physical Trust', color: 'text-saubh-green', grad: 'card-grad-green', delay: '' },
    { icon: 'fa-rocket', title: 'Digital Scalability', color: 'text-saubh-orange', grad: 'card-grad-orange', delay: 'transition-delay-100' },
    { icon: 'fa-arrows-turn-to-dots', title: 'Phygital Synergy', color: 'text-saubh-red', grad: 'card-grad-red', delay: 'transition-delay-200' },
  ];

  return (
    <section className="py-20 bg-saubh-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center anim-up">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-saubh-card border border-saubh-border rounded-full font-heading text-[0.82rem] font-medium tracking-wider uppercase text-saubh-muted">
            <i className="fas fa-sparkles" /> The Future is Phygital (Physical + Digital)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {cards.map((card) => (
            <div key={card.title} className={`card-grad ${card.grad} bg-saubh-card border border-saubh-border rounded-card p-10 text-center hover:border-white/20 transition-all anim-up`} style={{ transitionDelay: card.delay ? '0.1s' : undefined }}>
              <div className={`w-14 h-14 rounded-2xl bg-saubh-card border border-saubh-border flex items-center justify-center text-2xl ${card.color} mx-auto mb-5`}>
                <i className={`fas ${card.icon}`} />
              </div>
              <h3 className="font-heading font-bold text-lg text-saubh-text">{card.title}</h3>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center anim-up">
          <h3 className="font-heading font-bold text-xl text-saubh-text mb-2">Gig empowers you to work locally. scale globally.</h3>
          <p className="text-saubh-muted">Work from anywhere, anytime, with guaranteed escrow payment.</p>
        </div>
      </div>
    </section>
  );
}
