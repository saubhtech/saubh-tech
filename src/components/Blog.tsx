'use client';

import { useTranslation } from '@/lib/i18n';

export default function Blog() {
  const { t } = useTranslation();

  const articles = [
    { cat: t('blog.cat1'), icon: 'fas fa-globe', date: '2025-01-15', title: t('blog.art1.title'), desc: t('blog.art1.desc') },
    { cat: t('blog.cat1'), icon: 'fas fa-chart-line', date: '2025-01-14', title: t('blog.art2.title'), desc: t('blog.art2.desc') },
    { cat: t('blog.cat1'), icon: 'fas fa-laptop-code', date: '2025-01-13', title: t('blog.art3.title'), desc: t('blog.art3.desc') },
    { cat: t('blog.cat2'), icon: 'fas fa-video', date: '2025-01-07', title: t('blog.art4.title'), desc: t('blog.art4.desc') },
    { cat: t('blog.cat2'), icon: 'fas fa-shield-halved', date: '2025-01-06', title: t('blog.art5.title'), desc: t('blog.art5.desc') },
    { cat: t('blog.cat2'), icon: 'fas fa-scale-balanced', date: '2025-01-05', title: t('blog.art6.title'), desc: t('blog.art6.desc') },
  ];

  return (
    <section className="blog section-pad" id="blog" aria-labelledby="blog-title">
      <div className="container">
        <div className="blog-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-newspaper"></i> {t('blog.tag')}
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-dark)' }}>
            {t('blog.title')}
          </h2>
          <p className="section-subtitle" style={{ color: '#666' }}>
            {t('blog.subtitle')}
          </p>
        </div>
        <div className="blog-row">
          {articles.map((article, i) => (
            <article
              key={i}
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
            {t('blog.viewAll')} <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
