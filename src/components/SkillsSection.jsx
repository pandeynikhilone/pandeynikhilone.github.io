import { skillGroups } from "../data/portfolio.js";

export default function SkillsSection() {
  return <section className="section" id="skills">
    <div className="section-head">
      <div><div className="eyebrow">03 / Technical toolkit</div><h2>Technical skills</h2></div>
      <p className="section-intro">Technologies and development practices from my experience and project work.</p>
    </div>
    <div className="toolkit-grid">
      {skillGroups.map((group) => <article className="toolkit-card" key={group.number}>
        <div className="toolkit-head"><span className="toolkit-icon">{group.number}</span><h3>{group.title}</h3></div>
        <p>{group.description}</p>
      </article>)}
    </div>
  </section>;
}
