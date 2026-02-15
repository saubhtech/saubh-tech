const cards = [
  {
    icon: 'fas fa-chart-pie',
    title: 'Data & Marketing',
    desc: 'Upload or extract targeted data. Generate leads through multichannel campaigns Email, WhatsApp, RCM, Call, Virtual Meeting, Social-media, and In-person Visits.',
    delay: '0s',
  },
  {
    icon: 'fas fa-headset',
    title: 'Sales & Support',
    desc: 'No more guessing or missing opportunities. Using unified communication system (UCS) connect with your leads, set follow-up reminders and close the deals faster.',
    delay: '.1s',
  },
  {
    icon: 'fas fa-users-gear',
    title: 'HR & Recruitment',
    desc: 'Automate your HR Management. Post requirements, let interested candidates contact you and get the best talents to turn your vision into reality.',
    delay: '.2s',
  },
  {
    icon: 'fas fa-route',
    title: 'Career Choice',
    desc: '1500 occupations, based on Ability, Activity, Industry, Interest, Knowledge, Outlook, Pathway, Preference, Sector, Skills, STEM, Technology, Traits, and Zone.',
    delay: '.3s',
  },
];

export default function SaubhOS() {
  return (
    <section className="saubhos section-pad" id="saubhos" aria-labelledby="saubhos-title">
      <div className="container">
        <div className="saubhos-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-microchip"></i> SaubhOS – Operating System
          </span>
        </div>
        <div className="saubhos-grid">
          {cards.map((card) => (
            <div
              key={card.title}
              className="saubhos-card anim-up"
              style={{ transitionDelay: card.delay }}
            >
              <div className="saubhos-card-icon">
                <i className={card.icon}></i>
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="btn-group" style={{ justifyContent: 'center', marginTop: '48px' }}>
          <a href="#saubhos-free" className="btn btn-outline dark">
            <i className="fas fa-download"></i> Get Free SaubhOS
          </a>
          <a href="#demo" className="btn btn-outline dark">
            <i className="fas fa-calendar-check"></i> Schedule a Demo
          </a>
        </div>
      </div>
    </section>
  );
}
