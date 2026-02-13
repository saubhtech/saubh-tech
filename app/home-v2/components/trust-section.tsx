export default function TrustSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0A1A0A] via-[#112211] to-[#1A1206]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 anim-up">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-saubh-card border border-saubh-border rounded-full font-heading text-[0.82rem] font-medium tracking-wider uppercase">
            <i className="fas fa-bolt text-saubh-yellow" />
            <span className="text-saubh-yellow">Real People. Real Work. Real Trust.</span>
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-5 text-saubh-text">
            We Connect <span className="text-saubh-orange">Real People</span> with <span className="text-saubh-green">Real Work</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Verified Providers */}
          <div className="bg-saubh-card border border-saubh-border rounded-card p-10 hover:border-white/20 transition-all anim-up">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(109,179,63,0.15)] flex items-center justify-center text-saubh-green text-xl">
                <i className="fas fa-briefcase" />
              </div>
              <h3 className="font-heading font-bold text-lg text-saubh-text">Verified Providers</h3>
            </div>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-3 text-saubh-muted text-[0.95rem]"><span className="text-saubh-green flex-shrink-0 mt-0.5"><i className="fas fa-check" /></span> List offerings across multiple sectors and territories.</li>
              <li className="flex items-start gap-3 text-saubh-muted text-[0.95rem]"><span className="text-saubh-green flex-shrink-0 mt-0.5"><i className="fas fa-check" /></span> Bid on assignments, procure prepaid demand.</li>
              <li className="flex items-start gap-3 text-saubh-muted text-[0.95rem]"><span className="text-saubh-green flex-shrink-0 mt-0.5"><i className="fas fa-check" /></span> Complete work, get escrow-guaranteed payments.</li>
            </ul>
          </div>

          {/* Verified Clients */}
          <div className="bg-saubh-card border border-saubh-border rounded-card p-10 hover:border-white/20 transition-all anim-up">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(232,85,58,0.15)] flex items-center justify-center text-saubh-red text-xl">
                <i className="fas fa-user-tie" />
              </div>
              <h3 className="font-heading font-bold text-lg text-saubh-text">Verified Clients</h3>
            </div>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-3 text-saubh-muted text-[0.95rem]"><span className="text-saubh-red flex-shrink-0 mt-0.5"><i className="fas fa-check" /></span> Post assignments to outsource requirements.</li>
              <li className="flex items-start gap-3 text-saubh-muted text-[0.95rem]"><span className="text-saubh-red flex-shrink-0 mt-0.5"><i className="fas fa-check" /></span> Call or chat with verified providers.</li>
              <li className="flex items-start gap-3 text-saubh-muted text-[0.95rem]"><span className="text-saubh-red flex-shrink-0 mt-0.5"><i className="fas fa-check" /></span> Compare bids, and hire with escrow protection.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 anim-up">
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-saubh-green text-saubh-green font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent"><i className="fas fa-user-plus" /> Offer Service/Product</a>
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-saubh-orange text-saubh-orange font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent"><i className="fas fa-plus-circle" /> Post Requirements</a>
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-btn border-[1.5px] border-white/25 text-saubh-text font-heading font-semibold text-sm no-underline hover:-translate-y-0.5 transition-transform bg-transparent"><i className="fas fa-calendar-check" /> Schedule a Demo</a>
        </div>
      </div>
    </section>
  );
}
