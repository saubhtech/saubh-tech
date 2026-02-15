const cards = [
  { icon: 'fas fa-handshake', title: 'Physical Trust', delay: '0s' },
  { icon: 'fas fa-rocket', title: 'Digital Scalability', delay: '.1s' },
  { icon: 'fas fa-arrows-turn-to-dots', title: 'Phygital Synergy', delay: '.2s' },
];

export default function Phygital() {
  return (
    <section className="phygital section-pad" aria-labelledby="phygital-title">
      <div className="container">
        <div className="phygital-header anim-up">
          <span className="section-tag">
            <i className="fas fa-sparkles"></i> The Future is Phygital (Physical + Digital)
          </span>
        </div>
        <div className="phygital-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="phygital-card anim-up"
              style={{ transitionDelay: card.delay }}
            >
              <div className="phygital-icon">
                <i className={card.icon}></i>
              </div>
              <h3>{card.title}</h3>
            </div>
          ))}
        </div>
        <div className="phygital-tagline anim-up">
          <h3>Gig-Work empowers you to work locally. scale globally.</h3>
          <p>Work from anywhere, anytime, with guaranteed escrow payment.</p>
        </div>
      </div>
    </section>
  );
}
