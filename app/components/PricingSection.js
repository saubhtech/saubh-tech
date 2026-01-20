export default function PricingSection() {
  return (
    <section className="pricing-section" id="branding">
      <div className="container">
        <div className="section-header">
          <h2>Business Operating System</h2>
          <p>Integrate the Power of People + Intelligence of Technology</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="plan-name">Basic</div>
            <div className="plan-price">
              ₹9,999<span>/month</span>
            </div>
            <div className="plan-features">
              <div className="plan-feature">
                <strong>UGC</strong>
                <span>5 contents</span>
              </div>
              <div className="plan-feature">
                <strong>SMA</strong>
                <span>5 Nodes</span>
              </div>
              <div className="plan-feature">
                <strong>Leads</strong>
                <span>50 Organic Leads</span>
              </div>
              <div className="plan-feature">
                <strong>Support</strong>
                <span>Email</span>
              </div>
            </div>
            <button className="btn-plan">Get Started</button>
          </div>
          <div className="pricing-card featured">
            <div className="plan-name">Growth</div>
            <div className="plan-price">
              ₹24,999<span>/month</span>
            </div>
            <div className="plan-features">
              <div className="plan-feature">
                <strong>UGC</strong>
                <span>10 contents</span>
              </div>
              <div className="plan-feature">
                <strong>SMA</strong>
                <span>10 Nodes</span>
              </div>
              <div className="plan-feature">
                <strong>Leads</strong>
                <span>200 Organic Leads</span>
              </div>
              <div className="plan-feature">
                <strong>Support</strong>
                <span>Email + WhatsApp</span>
              </div>
            </div>
            <button className="btn-plan">Get Started</button>
          </div>
          <div className="pricing-card">
            <div className="plan-name">Premium</div>
            <div className="plan-price">
              ₹49,999<span>/month</span>
            </div>
            <div className="plan-features">
              <div className="plan-feature">
                <strong>UGC</strong>
                <span>24 contents</span>
              </div>
              <div className="plan-feature">
                <strong>SMA</strong>
                <span>25 Nodes</span>
              </div>
              <div className="plan-feature">
                <strong>Leads</strong>
                <span>500+ Organic Leads</span>
              </div>
              <div className="plan-feature">
                <strong>Support</strong>
                <span>Email + WhatsApp + Call</span>
              </div>
            </div>
            <button className="btn-plan">Get Started</button>
          </div>
        </div>
      </div>
    </section>
  );
}