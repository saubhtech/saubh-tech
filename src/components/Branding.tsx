const cards = [
  {
    icon: 'fas fa-layer-group',
    title: 'Aggregation',
    subtitle: 'User Generated Content (UGC) Hub',
    desc: 'Users create authentic content including reviews, testimonials, and videos that resonate with your audience.',
    delay: '0s',
  },
  {
    icon: 'fas fa-tower-broadcast',
    title: 'Amplification',
    subtitle: 'Social Media Amplification (SMA) Network',
    desc: 'Multi-channel people-to-people content distribution that multiplies reach, drives engagement and visibility.',
    delay: '.1s',
  },
  {
    icon: 'fas fa-gears',
    title: 'Automation',
    subtitle: 'Organic Leads Generation (OLG) Engine',
    desc: 'Unified multi-channel campaigns, landing pages, and sign-ups delivering pre-qualified leads directly to your CRM sales funnel.',
    delay: '.2s',
  },
];

export default function Branding() {
  return (
    <section className="branding section-pad" id="branding" aria-labelledby="branding-title">
      <div className="container">
        <div className="branding-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-bullhorn"></i> Branding
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-dark)' }}>
            No Business Without a Brand.
          </h2>
        </div>
        <div className="branding-sub anim-up">
          <p>No Brand Without Social Proof.</p>
        </div>
        <div className="branding-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="branding-card anim-up"
              style={{ transitionDelay: card.delay }}
            >
              <div className="branding-card-icon">
                <i className={card.icon}></i>
              </div>
              <h3>{card.title}</h3>
              <h4>{card.subtitle}</h4>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
