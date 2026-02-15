const steps = [
  { num: 1, icon: 'fas fa-user-check', title: 'Sign Up, Get Verified', delay: '0s' },
  { num: 2, icon: 'fas fa-file-invoice-dollar', title: 'Procure Prepaid Demand', delay: '.1s' },
  { num: 3, icon: 'fas fa-gavel', title: 'Bid on Assignments', delay: '.2s' },
  { num: 4, icon: 'fas fa-clipboard-check', title: 'Fulfil requirements', delay: '.3s' },
  { num: 5, icon: 'fas fa-money-bill-wave', title: 'Get Paid Instantly securely', delay: '.4s' },
];

export default function Steps() {
  return (
    <section className="steps" aria-label="How it works">
      <div className="container">
        <div className="steps-track">
          {steps.map((step) => (
            <div
              key={step.num}
              className="step-card anim-up"
              style={{ transitionDelay: step.delay }}
            >
              <div className="step-num">{step.num}</div>
              <div className="step-icon">
                <i className={step.icon}></i>
              </div>
              <h4>{step.title}</h4>
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center', marginTop: '48px' }}>
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
    </section>
  );
}
