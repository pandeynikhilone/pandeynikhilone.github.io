import { skillGroups } from "../data/portfolio.js";

export default function SkillsSection() {
  return <section className="section" id="skills">
    <div className="section-head">
      <div><div className="eyebrow">03 / Technical toolkit</div><h2>Tools I have worked with.</h2></div>
      <p className="section-intro">This list reflects the technologies in my resume and project work. I am still developing depth as I build and maintain applications.</p>
    </div>
    <div className="toolkit-grid">
      {skillGroups.map((group) => <article className="toolkit-card" key={group.number}>
        <div className="toolkit-head"><span className="toolkit-icon">{group.number}</span><h3>{group.title}</h3></div>
        <p>{group.description}</p>
      </article>)}
    </div>
  </section>;
}
