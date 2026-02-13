'use client';

export default function WorkflowSection() {
  return (
    <section className="steps" aria-label="How it works">
      <div className="container">
        <div className="steps-track">
          <div className="step-card anim-up">
            <div className="step-num">1</div>
            <div className="step-icon"><i className="fas fa-user-check"></i></div>
            <h4>Sign Up, Get Verified</h4>
          </div>
          <div className="step-card anim-up" style={{ transitionDelay: '.1s' }}>
            <div className="step-num">2</div>
            <div className="step-icon"><i className="fas fa-file-invoice-dollar"></i></div>
            <h4>Procure Prepaid Demand</h4>
          </div>
          <div className="step-card anim-up" style={{ transitionDelay: '.2s' }}>
            <div className="step-num">3</div>
            <div className="step-icon"><i className="fas fa-gavel"></i></div>
            <h4>Bid on Assignments</h4>
          </div>
          <div className="step-card anim-up" style={{ transitionDelay: '.3s' }}>
            <div className="step-num">4</div>
            <div className="step-icon"><i className="fas fa-clipboard-check"></i></div>
            <h4>Fulfil Requirements</h4>
          </div>
          <div className="step-card anim-up" style={{ transitionDelay: '.4s' }}>
            <div className="step-num">5</div>
            <div className="step-icon"><i className="fas fa-money-bill-wave"></i></div>
            <h4>Get Paid Instantly Securely</h4>
          </div>
        </div>
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
    </section>
  );
}
