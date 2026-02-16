'use client';

import { useTranslation } from '@/lib/i18n';

const gradients = [
  'linear-gradient(135deg,#2d5016,#1a3a0a)',
  'linear-gradient(135deg,#3a4010,#1a2a06)',
  'linear-gradient(135deg,#1a3040,#0a1a2a)',
  'linear-gradient(135deg,#3a2020,#1a0a0a)',
  'linear-gradient(135deg,#2a1a3a,#100a1a)',
  'linear-gradient(135deg,#1a3020,#0a1a10)',
];

export default function Community() {
  const { t } = useTranslation();

  const voices = [1, 2, 3, 4, 5, 6].map((n, i) => ({
    gradient: gradients[i],
    text: t(`community.v${n}.text`),
    author: t(`community.v${n}.author`),
    role: t(`community.v${n}.role`),
  }));

  return (
    <section className="community section-pad" id="community" aria-labelledby="community-title">
      <div className="container">
        <div className="community-header anim-up">
          <span className="section-tag light">
            <i className="fas fa-comments"></i> {t('community.tag')}
          </span>
          <h2 className="section-title" style={{ color: 'var(--text-dark)' }}>
            {t('community.title')}
          </h2>
          <p className="section-subtitle" style={{ color: '#666' }}>
            {t('community.subtitle')}
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
