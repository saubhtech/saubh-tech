const sectors = [
  { emoji: '🌾', name: 'Agriculture, Food & Nutrition' },
  { emoji: '📢', name: 'Branding, Marketing & Sales' },
  { emoji: '💻', name: 'Computing, Data & Digital Technology' },
  { emoji: '🎓', name: 'Education, Skilling & Career' },
  { emoji: '💰', name: 'Finance, Banking & Insurance' },
  { emoji: '🏛️', name: 'Government, Public Sector & Welfare' },
  { emoji: '🩺', name: 'Health, Wellness & Personal Care' },
  { emoji: '👥', name: 'HR, Employment & GigWork' },
  { emoji: '🛠️', name: 'Installation, Repair & Tech Support' },
  { emoji: '⚖️', name: 'Legal, Police & Protection' },
  { emoji: '🏭', name: 'Manufacturing, Procurement & Production' },
  { emoji: '❤️', name: 'Matchmaking, Relationships & Guidance' },
  { emoji: '🎬', name: 'Media, Entertainment & Sports' },
  { emoji: '🏠', name: 'Real Estate, Infra & Construction' },
  { emoji: '🚚', name: 'Transport, Logistics & Storage' },
  { emoji: '✈️', name: 'Travel, Tourism & Hospitality' },
];

export default function Sectors() {
  return (
    <section className="sectors section-pad" id="sectors" aria-labelledby="sectors-title">
      <div className="container">
        <div className="sectors-header anim-up">
          <span className="section-tag">
            <i className="fas fa-compass"></i> Explore Opportunities
          </span>
          <h2 className="section-title" id="sectors-title">
            Explore Opportunities and Offerings across{' '}
            <span className="gradient-text">16 sectors</span>
          </h2>
        </div>
        <div className="sectors-grid">
          {sectors.map((sector, i) => (
            <div
              key={sector.name}
              className="sector-chip anim-up"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <span className="emoji">{sector.emoji}</span>
              {sector.name}
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <a href="#offer" className="btn btn-primary">
            <i className="fas fa-hand-holding-heart"></i> Offer Service/Product
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
