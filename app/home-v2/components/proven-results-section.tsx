export default function ProvenResultsSection() {
  const stats = [
    { value: '6.9x', color: 'text-saubh-green', desc: 'higher conversion rates from UGC vs traditional ads', grad: 'card-grad-green' },
    { value: '65%', color: 'text-saubh-orange', desc: 'lower customer acquisition costs vs paid advertising', grad: 'card-grad-orange' },
    { value: '82%', color: 'text-saubh-red', desc: 'more engagement, trust, and conversion through organic leads', grad: 'card-grad-red' },
    { value: '40%', color: 'grad-text', desc: 'increase in repeat orders due to peer recommendations', grad: 'card-grad-multi' },
  ];

  return (
    <section className="py-20 bg-saubh-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 anim-up">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-saubh-card border border-saubh-border rounded-full font-heading text-[0.82rem] font-medium tracking-wider uppercase">
            <i className="fas fa-chart-line text-saubh-green" />
            <span className="text-saubh-green">Proven Results</span>
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.value} className={`card-grad ${stat.grad} bg-saubh-card border border-saubh-border rounded-card p-10 text-center hover:border-white/20 transition-all anim-up`}>
              <div className={`font-heading text-5xl font-extrabold mb-3 ${stat.color}`}>{stat.value}</div>
              <p className="text-saubh-muted text-sm text-left flex items-start gap-2">
                <i className="fas fa-check text-saubh-green flex-shrink-0 mt-1" /> {stat.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 anim-up">
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn btn-gradient-primary text-white font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform"><i className="fas fa-user-plus" /> Register for Gig</a>
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-saubh-orange text-saubh-orange font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent"><i className="fas fa-plus-circle" /> Post Requirements</a>
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-white/25 text-saubh-text font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent"><i className="fas fa-calendar-check" /> Schedule a Demo</a>
        </div>
      </div>
    </section>
  );
}
