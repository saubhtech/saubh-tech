"use client";

import { useEffect, useRef } from "react";

const articles = [
  {
    cat: "Gig Economy & Phygital Work",
    icon: "fa-globe",
    date: "2025-01-15",
    title:
      "What Is Phygital Work and Why It's the Future of India's Gig Economy",
    desc: "Discover how phygital work combines physical trust with digital scalability to revolutionize India's gig economy.",
  },
  {
    cat: "Gig Economy & Phygital Work",
    icon: "fa-chart-line",
    date: "2025-01-14",
    title:
      "The Rise of India's Gig Economy: Opportunities, Challenges & Trends",
    desc: "Explore the explosive growth of India's gig economy and what it means for workers and businesses.",
  },
  {
    cat: "Gig Economy & Phygital Work",
    icon: "fa-laptop-code",
    date: "2025-01-13",
    title: "Why Digital-Only Platforms Are No Longer Enough",
    desc: "Learn why successful platforms need to integrate physical touchpoints with digital infrastructure.",
  },
  {
    cat: "Branding, UGC & Trust",
    icon: "fa-video",
    date: "2025-01-07",
    title: "Why User-Generated Content (UGC) Converts Better Than Paid Ads",
    desc: "Data-driven insights into why UGC outperforms traditional advertising.",
  },
  {
    cat: "Branding, UGC & Trust",
    icon: "fa-shield-halved",
    date: "2025-01-06",
    title: "How UGC Builds Trust Faster Than Traditional Advertising",
    desc: "The psychology behind why consumers trust peer-generated content.",
  },
  {
    cat: "Branding, UGC & Trust",
    icon: "fa-scale-balanced",
    date: "2025-01-05",
    title: "UGC vs Influencer Marketing: What Works Better for Indian SMEs?",
    desc: "A practical comparison for small and medium businesses in India.",
  },
];

export default function GigEconomySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target
              .querySelectorAll(".anim-up")
              .forEach((el) => el.classList.add("visible"));
          }
        });
      },
      { threshold: 0.08 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="ge-section section-pad"
      id="blog"
      aria-labelledby="blog-title"
    >
      {/* BG Image */}
      <div className="ge-bg" />
      {/* Overlay */}
      <div className="ge-overlay" />

      <div className="container ge-container">
        {/* Header — single heading only */}
        <div className="ge-header anim-up">
          {/* <span className="ge-tag">
            <i className="fas fa-newspaper"></i> Gig Economy
          </span> */}
          <h2 className="ge-title" id="blog-title">
            <span className="ge-shimmer">Gig Economy</span>
          </h2>
        </div>

        {/* Blog cards grid */}
        <div className="ge-grid">
          {articles.map((a, i) => (
            <article
              key={a.title}
              className="ge-card anim-up"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <div className="ge-thumb">
                <span className="ge-cat">{a.cat}</span>
                <div className="ge-thumb-icon">
                  <i className={`fas ${a.icon}`}></i>
                </div>
              </div>
              <div className="ge-body">
                <span className="ge-date">{a.date}</span>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/* View all */}
        <div className="ge-more anim-up">
          <a href="#all-articles">
            View All Articles <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>

      <style jsx>{`
        /* ━━ SECTION ━━ */
        .ge-section {
          position: relative;
          overflow: hidden;
          background: #050705;
          color: var(--text-light, #f0ede8);
        }

        /* ━━ BG IMAGE ━━ */
        .ge-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image: url("/learning.png");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.3;
          pointer-events: none;
        }

        /* ━━ OVERLAY ━━ */
        .ge-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(
              180deg,
              rgba(5, 7, 5, 0.88) 0%,
              rgba(5, 7, 5, 0.4) 35%,
              rgba(5, 7, 5, 0.4) 65%,
              rgba(5, 7, 5, 0.88) 100%
            ),
            radial-gradient(
              ellipse 500px 350px at 20% 40%,
              rgba(109, 179, 63, 0.05) 0%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 500px 350px at 80% 60%,
              rgba(240, 150, 14, 0.04) 0%,
              transparent 70%
            );
          pointer-events: none;
        }

        .ge-container {
          position: relative;
          z-index: 2;
        }

        /* ━━ HEADER ━━ */
        .ge-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .ge-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 100px;
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #8fd45e;
          margin-bottom: 20px;
        }

        .ge-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          line-height: 1.2;
          margin-top: 16px;
        }

        .ge-shimmer {
          background: linear-gradient(
            135deg,
            #8fd45e 0%,
            #f0960e 35%,
            #e8553a 65%,
            #8fd45e 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        /* ━━ GRID ━━ */
        .ge-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        /* ━━ CARD ━━ */
        .ge-card {
          border-radius: var(--radius, 16px);
          background: rgba(10, 13, 8, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .ge-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            circle at 50% 0%,
            rgba(109, 179, 63, 0.08),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .ge-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(109, 179, 63, 0.35);
          box-shadow:
            0 0 40px rgba(109, 179, 63, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.35);
        }

        .ge-card:hover::after {
          opacity: 1;
        }

        /* ━━ THUMB ━━ */
        .ge-thumb {
          height: 120px;
          position: relative;
          overflow: hidden;
        }

        .ge-card:nth-child(1) .ge-thumb {
          background: linear-gradient(135deg, #2d5016, #1a3a0a);
        }
        .ge-card:nth-child(2) .ge-thumb {
          background: linear-gradient(135deg, #3a5010, #1a3016);
        }
        .ge-card:nth-child(3) .ge-thumb {
          background: linear-gradient(135deg, #4a3010, #2a1a06);
        }
        .ge-card:nth-child(4) .ge-thumb {
          background: linear-gradient(135deg, #5a2010, #3a1006);
        }
        .ge-card:nth-child(5) .ge-thumb {
          background: linear-gradient(135deg, #1a4020, #0a2a10);
        }
        .ge-card:nth-child(6) .ge-thumb {
          background: linear-gradient(135deg, #3a2030, #1a1020);
        }

        .ge-thumb-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.2);
          transition: all 0.5s ease;
        }

        .ge-card:hover .ge-thumb-icon {
          color: rgba(255, 255, 255, 0.45);
          transform: scale(1.2) rotate(-6deg);
        }

        .ge-cat {
          position: absolute;
          top: 8px;
          left: 8px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.65rem;
          font-weight: 600;
          font-family: var(--font-display);
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        /* ━━ BODY ━━ */
        .ge-body {
          padding: 14px 14px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ge-date {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 6px;
        }

        .ge-card h3 {
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 6px;
          color: #ffffff;
          transition: color 0.3s ease;
        }

        .ge-card:hover h3 {
          color: #8fd45e;
        }

        .ge-card p {
          font-size: 0.75rem;
          color: #9ca39c;
          line-height: 1.5;
          flex: 1;
          transition: color 0.3s ease;
        }

        .ge-card:hover p {
          color: #b8bfb8;
        }

        /* ━━ VIEW ALL ━━ */
        .ge-more {
          text-align: center;
        }

        .ge-more a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-weight: 600;
          color: #8fd45e;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .ge-more a:hover {
          color: #6db33f;
          gap: 14px;
        }

        /* ━━ ANIMATIONS ━━ */
        @keyframes shimmer {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        /* ━━ RESPONSIVE ━━ */
        @media (max-width: 1200px) {
          .ge-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .ge-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .ge-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
