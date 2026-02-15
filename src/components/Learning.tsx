const features = [
  { icon: 'fas fa-book-open', text: 'Study with contents and videos', delay: '0s' },
  { icon: 'fas fa-chalkboard-user', text: 'Interactive trainer-led online classes', delay: '.1s' },
  { icon: 'fas fa-certificate', text: 'Certification to boost credibility', delay: '.2s' },
];

const programs = [
  { icon: 'fas fa-heart-pulse', name: 'Life Counselling Professional (LCP)' },
  { icon: 'fas fa-chart-column', name: 'Business Consulting Professional (BCP)' },
];

export default function Learning() {
  return (
    <section className="learning section-pad" id="learning" aria-labelledby="learning-title">
      <div className="container">
        <div className="learning-header anim-up">
          <span className="section-tag">
            <i className="fas fa-graduation-cap"></i> Learning &amp; Skilling
          </span>
          <h2 className="section-title">Invest in Your Future</h2>
        </div>
        <div className="learning-features">
          {features.map((feat) => (
            <div key={feat.text} className="learning-feat anim-up" style={{ transitionDelay: feat.delay }}>
              <i className={feat.icon}></i>
              <p>{feat.text}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-light)',
              marginBottom: '20px',
            }}
          >
            Training Programs
          </p>
        </div>
        <div className="training-row">
          {programs.map((prog) => (
            <div key={prog.name} className="training-badge">
              <i className={prog.icon}></i> {prog.name}
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <a href="#training" className="btn btn-primary">
            <i className="fas fa-play-circle"></i> Join Free Training Session
          </a>
          <a href="#meeting" className="btn btn-outline">
            <i className="fas fa-calendar-check"></i> Schedule a Meeting
          </a>
        </div>
      </div>
    </section>
  );
}
