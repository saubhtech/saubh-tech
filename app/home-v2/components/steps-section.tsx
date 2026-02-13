export default function StepsSection() {
  const steps = [
    { num: '1', icon: 'fa-user-plus', title: 'Sign Up, Get Verified', ring: 'border-saubh-green' },
    { num: '2', icon: 'fa-money-bill-transfer', title: 'Procure Prepaid Demand', ring: 'border-saubh-green-dark' },
    { num: '3', icon: 'fa-gavel', title: 'Bid on Assignments', ring: 'border-saubh-orange' },
    { num: '4', icon: 'fa-clipboard-check', title: 'Fulfil Requirements', ring: 'border-saubh-red' },
    { num: '5', icon: 'fa-camera-retro', title: 'Get Paid Instantly Securely', ring: 'border-saubh-red' },
  ];

  return (
    <section className="pb-20 bg-saubh-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-between items-start relative px-5 mt-10 steps-line anim-up">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center relative z-10 flex-1 min-w-[120px] mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-heading font-bold text-2xl bg-saubh-dark ${step.ring} border-[2.5px] text-saubh-text mb-4`}>
                {step.num}
              </div>
              <div className="text-saubh-muted text-2xl mb-2.5"><i className={`fas ${step.icon}`} /></div>
              <h4 className="font-heading font-semibold text-sm text-saubh-text max-w-[140px]">{step.title}</h4>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-10 anim-up">
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
      </div>
    </section>
  );
}
