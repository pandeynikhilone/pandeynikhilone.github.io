import { highlights, profile } from "../data/portfolio.js";

export default function HeroSection() {
  return (
    <section className="hero" id="top" style={{ borderTop: 0 }}>
      <div className="hero-grid">
        <div className="reveal">
          <div className="hero-badge"><span className="live-dot" aria-hidden="true" />MCA student in {profile.location}</div>
          <h1>I build web experiences that feel <span className="hero-title-accent">clear and useful.</span></h1>
          <p className="hero-copy">
            I'm {profile.name}, an MCA student at Amity University Lucknow. I've worked on{" "}
            <strong>React and TypeScript interfaces</strong>, connected frontend features to backend APIs,
            and built full-stack features for a product review platform. I like making things work well
            and keeping the code easy to extend.
          </p>
          <div className="actions">
            <a className="button primary" href="#projects">Explore my work <span className="button-arrow" aria-hidden="true">↘</span></a>
            <a className="button light" href="#contact">Get in touch <span className="button-arrow" aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub profile</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn profile</a>
            <span>{profile.location}</span>
          </div>
        </div>
        <aside className="hero-art reveal delay-2" aria-label="A visual summary of current software development work">
          <div className="art-window">
            <div className="window-bar" aria-hidden="true"><span className="window-dot" /><span className="window-dot" /><span className="window-dot" /><span className="window-label">SELECTED WORK / 01</span></div>
            <div className="art-content">
              <div className="art-kicker"><span>FULL-STACK PROJECT</span><span className="art-status">LIVE DEMO</span></div>
              <div className="art-heading">Better reviews.<br /><span>Better choices.</span></div>
              <div className="art-summary"><div className="art-avatar">TR</div><div className="art-summary-main"><strong>Truloop</strong><span>Product review platform</span></div><span className="art-stars">NEXT.JS</span></div>
              <div className="art-bottom"><div className="art-mini"><span>FRONTEND</span><strong>React + Tailwind</strong></div><div className="art-mini"><span>BACKEND</span><strong>Node + MongoDB</strong></div></div>
            </div>
          </div>
          <div className="floating-note"><div className="floating-icon" aria-hidden="true">↗</div><div><strong>Built through iteration</strong><span>DESIGN / CODE / DEBUG</span></div></div>
        </aside>
      </div>
      <div className="proof-strip" aria-label="Selected experience highlights">
        {highlights.map((item) => <div className="proof-item" key={item.value}><div className="proof-value">{item.value}</div><div className="proof-label">{item.label}</div></div>)}
      </div>
    </section>
  );
}
