import { education } from "../data/portfolio.js";

export default function EducationSection() {
  return <section className="section" id="education">
    <div className="section-head">
      <div><div className="eyebrow">04 / Education</div><h2>Education</h2></div>
    </div>
    <div className="education-grid">
      {education.map((item) => <article className={"education-card" + (item.current ? " current" : "")} key={item.degree}>
        <div><div className="education-label">{item.label}</div><h3>{item.degree}</h3><p>{item.institution}{item.detail && <><br />{item.detail}</>}</p></div>
        <div className="education-period">{item.period}</div>
      </article>)}
    </div>
  </section>;
}
