const stats = [
  { num: '6.9x', text: 'higher conversion rates from UGC vs traditional ads', delay: '0s' },
  { num: '65%', text: 'lower customer acquisition costs vs paid advertising', delay: '.1s' },
  { num: '82%', text: 'more engagement, trust, and conversion through organic leads', delay: '.2s' },
  { num: '40%', text: 'increase in repeat orders due to peer recommendations', delay: '.3s' },
];

export default function ProvenResults() {
  return (
    <section className="proven section-pad" aria-labelledby="proven-title">
      <div className="container">
        <div className="proven-header anim-up">
          <span className="section-tag">
            <i className="fas fa-chart-line"></i> Proven Results
          </span>
        </div>
        <div className="proven-grid">
          {stats.map((stat) => (
            <div
              key={stat.num}
              className="proven-card anim-up"
              style={{ transitionDelay: stat.delay }}
            >
              <div className="proven-num">{stat.num}</div>
              <p>
                <span className="check">✓</span> {stat.text}
              </p>
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
