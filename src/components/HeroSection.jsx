import { highlights, profile } from "../data/portfolio.js";

export default function HeroSection() {
  return (
    <section className="hero" id="top" style={{ borderTop: 0 }}>
      <div className="hero-grid">
        <div className="reveal">
          <div className="hero-badge"><span className="live-dot" aria-hidden="true" />MCA student · Open to developer internships</div>
          <h1>I build web products with <span className="hero-title-accent">React and Node.</span></h1>
          <p className="hero-copy">
            I'm {profile.name}, pursuing my MCA at Amity University Lucknow. I have hands-on experience building
            <strong> React and TypeScript interfaces</strong>, integrating APIs, working with chart-driven data,
            and developing full-stack features for a product review platform. I am focused on writing useful,
            maintainable software and growing as a full-stack developer.
          </p>
          <div className="actions">
            <a className="button primary" href="#projects">View projects <span className="button-arrow" aria-hidden="true">↘</span></a>
            <a className="button light" href="#contact">Discuss an opportunity <span className="button-arrow" aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub profile</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn profile</a>
            <a href={"mailto:" + profile.email}>Email</a>
            <span>{profile.location}</span>
          </div>
        </div>
        <aside className="hero-art reveal delay-2" aria-label="A visual summary of current software development work">
          <div className="art-window">
            <div className="window-bar" aria-hidden="true"><span className="window-dot" /><span className="window-dot" /><span className="window-dot" /><span className="window-label">SELECTED WORK / 01</span></div>
            <div className="art-content">
              <div className="art-kicker"><span>FULL-STACK PROJECT</span><span className="art-status">IN PROGRESS</span></div>
              <div className="art-heading">Better reviews.<br /><span>Better choices.</span></div>
              <div className="art-summary"><div className="art-avatar">TR</div><div className="art-summary-main"><strong>TruLoop</strong><span>Product review platform</span></div><span className="art-stars">NEXT.JS</span></div>
              <div className="art-bottom"><div className="art-mini"><span>FRONTEND</span><strong>React + Next.js</strong></div><div className="art-mini"><span>BACKEND</span><strong>Node + MongoDB</strong></div></div>
            </div>
          </div>
          <div className="floating-note"><div className="floating-icon" aria-hidden="true">↗</div><div><strong>Build. Test. Improve.</strong><span>FRONTEND / APIS / DEBUGGING</span></div></div>
        </aside>
      </div>
      <div className="proof-strip" aria-label="Selected experience highlights">
        {highlights.map((item) => <div className="proof-item" key={item.value}><div className="proof-value">{item.value}</div><div className="proof-label">{item.label}</div></div>)}
      </div>
    </section>
  );
}
