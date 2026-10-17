import { experience } from "../data/portfolio.js";

export default function ExperienceSection() {
  return <section className="section experience-section" id="experience">
    <div className="section-head">
      <div><div className="eyebrow">02 / Experience</div><h2>Experience</h2></div>
      <p className="section-intro">Internship and volunteer experience across frontend development, application state, data visualisation, and event registration.</p>
    </div>
    <div className="timeline">
      {experience.map((item) => <article className="timeline-item" key={item.company + item.period}>
        <div className="timeline-date">{item.period}</div>
        <div className="timeline-main">
          <div className="timeline-heading"><h3>{item.company}</h3><span className="timeline-role">{item.role}</span></div>
          <div className="timeline-company">{item.tools}</div>
          <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
      </article>)}
    </div>
  </section>;
}
