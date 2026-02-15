const voices = [
  {
    gradient: 'linear-gradient(135deg,#2d5016,#1a3a0a)',
    text: "The escrow payment system gives me complete peace of mind. I've completed over 50 assignments and always received payment on time. My income has grown 3x in just 6 months!",
    author: 'Priya Sharma',
    role: 'Business Associate • Mumbai',
  },
  {
    gradient: 'linear-gradient(135deg,#3a4010,#1a2a06)',
    text: "The UGC quality is outstanding! Real customers sharing genuine experiences has increased our social engagement by 180%. Best investment we've made for our brand.",
    author: 'Rajesh Kumar',
    role: 'Restaurant Owner • Bangalore',
  },
  {
    gradient: 'linear-gradient(135deg,#1a3040,#0a1a2a)',
    text: 'The phygital model is brilliant. I can work remotely while building strong local connections. The community support and training have been invaluable for my career growth.',
    author: 'Aisha Patel',
    role: 'Digital Marketing Specialist • Delhi',
  },
  {
    gradient: 'linear-gradient(135deg,#3a2020,#1a0a0a)',
    text: "The phygital approach works perfectly for our business. We've expanded to 12 cities with consistent quality. The associate network is reliable and professional.",
    author: 'Vikram Gupta',
    role: 'Regional Manager • Chennai',
  },
  {
    gradient: 'linear-gradient(135deg,#2a1a3a,#100a1a)',
    text: "Organic leads from Saubh.Tech convert 4x better than our paid campaigns. We've reduced CAC by 60% while improving lead quality. Absolutely worth it!",
    author: 'Sneha Kulkarni',
    role: 'Marketing Head, EduTech Pro • Pune',
  },
  {
    gradient: 'linear-gradient(135deg,#1a3020,#0a1a10)',
    text: 'Saubh Tech has given me financial stability. The guaranteed payments and continuous training help me grow professionally. My income increased from ₹15k to ₹55k monthly.',
    author: 'Deepak Verma',
    role: 'Freelance Marketer • Ranchi',
  },
];

export default function Community() {
  return (
    <section className="community section-pad" id="community" aria-labelledby="community-title">
      <div className="container">
        <div className="community-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-comments"></i> Community Voice
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-dark)' }}>
            Community Voice
          </h2>
          <p className="section-subtitle" style={{ color: '#666' }}>
            Real stories from Associates and clients.
          </p>
        </div>
        <div className="community-row">
          {voices.map((voice) => (
            <div key={voice.author} className="voice-card">
              <div className="voice-thumb" style={{ background: voice.gradient }}>
                <div className="play-btn">
                  <i className="fas fa-play"></i>
                </div>
              </div>
              <div className="voice-body">
                <p className="voice-text">{voice.text}</p>
                <p className="voice-author">{voice.author}</p>
                <p className="voice-role">{voice.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
