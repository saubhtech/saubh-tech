const articles = [
  {
    cat: 'Gig Economy & Phygital Work',
    icon: 'fas fa-globe',
    date: '2025-01-15',
    title: "What Is Phygital Work and Why It's the Future of India's Gig Economy",
    desc: "Discover how phygital work combines physical trust with digital scalability to revolutionize India's gig economy.",
  },
  {
    cat: 'Gig Economy & Phygital Work',
    icon: 'fas fa-chart-line',
    date: '2025-01-14',
    title: "The Rise of India's Gig Economy: Opportunities, Challenges & Trends",
    desc: "Explore the explosive growth of India's gig economy and what it means for workers and businesses.",
  },
  {
    cat: 'Gig Economy & Phygital Work',
    icon: 'fas fa-laptop-code',
    date: '2025-01-13',
    title: 'Why Digital-Only Platforms Are No Longer Enough',
    desc: 'Learn why successful platforms need to integrate physical touchpoints with digital infrastructure.',
  },
  {
    cat: 'Branding, UGC & Trust',
    icon: 'fas fa-video',
    date: '2025-01-07',
    title: 'Why User-Generated Content (UGC) Converts Better Than Paid Ads',
    desc: 'Data-driven insights into why UGC outperforms traditional advertising.',
  },
  {
    cat: 'Branding, UGC & Trust',
    icon: 'fas fa-shield-halved',
    date: '2025-01-06',
    title: 'How UGC Builds Trust Faster Than Traditional Advertising',
    desc: 'The psychology behind why consumers trust peer-generated content.',
  },
  {
    cat: 'Branding, UGC & Trust',
    icon: 'fas fa-scale-balanced',
    date: '2025-01-05',
    title: 'UGC vs Influencer Marketing: What Works Better for Indian SMEs?',
    desc: 'A practical comparison for small and medium businesses in India.',
  },
];

export default function Blog() {
  return (
    <section className="blog section-pad" id="blog" aria-labelledby="blog-title">
      <div className="container">
        <div className="blog-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-newspaper"></i> Gig Economy
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-dark)' }}>
            Gig Economy
          </h2>
          <p className="section-subtitle" style={{ color: '#666' }}>
            Explore insights, tips, and trends in the gig economy, digital branding, and phygital work.
          </p>
        </div>
        <div className="blog-row">
          {articles.map((article, i) => (
            <article
              key={article.title}
              className="blog-card anim-up"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <div className="blog-thumb">
                <span className="blog-cat">{article.cat}</span>
                <div className="blog-thumb-icon">
                  <i className={article.icon}></i>
                </div>
              </div>
              <div className="blog-body">
                <span className="blog-date">{article.date}</span>
                <h3>{article.title}</h3>
                <p>{article.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="blog-more anim-up">
          <a href="#all-articles">
            View All Articles <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
