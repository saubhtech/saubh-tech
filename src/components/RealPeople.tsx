const cards = [
  {
    icon: 'fas fa-briefcase',
    title: 'Verified Providers',
    items: [
      'List offerings across multiple sectors and territories.',
      'Bid on assignments, procure prepaid demand,',
      'Complete work, get escrow-guaranteed payments.',
    ],
    delay: '0s',
  },
  {
    icon: 'fas fa-user-tie',
    title: 'Verified Clients',
    items: [
      'Post assignments to outsource requirements.',
      'Call or chat with verified providers.',
      'Compare bids, and hire with escrow protection.',
    ],
    delay: '.1s',
  },
];

export default function RealPeople() {
  return (
    <section className="real-people section-pad" aria-labelledby="rp-title">
      <div className="container">
        <div className="rp-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-bolt"></i> Real People. Real Work. Real Trust.
          </span>
        </div>
        <div className="rp-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rp-card anim-up"
              style={{ transitionDelay: card.delay }}
            >
              <div className="rp-card-head">
                <div className="rp-card-icon">
                  <i className={card.icon}></i>
                </div>
                <h3>{card.title}</h3>
              </div>
              <ul>
                {card.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <a href="#offer" className="btn btn-outline dark">
            <i className="fas fa-hand-holding-heart"></i> Offer Service/Product
          </a>
          <a href="#post" className="btn btn-outline dark">
            <i className="fas fa-plus-circle"></i> Post Requirements
          </a>
          <a href="#demo" className="btn btn-outline dark">
            <i className="fas fa-calendar-check"></i> Schedule a Demo
          </a>
        </div>
      </div>
    </section>
  );
}
