import { profile } from "../data/portfolio.js";

export default function ContactSection() {
  const telephone = profile.phone.replace(/[^+0-9]/g, "");
  return <section className="section" id="contact">
    <div className="contact-panel">
      <div>
        <div className="eyebrow">05 / Contact</div>
        <h2>Let's talk about software, projects, or internships.</h2>
        <p>I'm looking for opportunities where I can contribute to real product work, learn from experienced developers, and keep improving my frontend and full-stack skills.</p>
        <div className="actions"><a className="button" style={{ background: "var(--lime)", color: "var(--ink)", borderColor: "var(--lime)" }} href={"mailto:" + profile.email}>Email me <span className="button-arrow" aria-hidden="true">↗</span></a></div>
      </div>
      <div className="contact-links">
        <a className="contact-link" href={"mailto:" + profile.email}><span>{profile.email}</span><span aria-hidden="true">↗</span></a>
        <a className="contact-link" href={"tel:" + telephone}><span>{profile.phone}</span><span aria-hidden="true">↗</span></a>
        <a className="contact-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer"><span>LinkedIn profile</span><span aria-hidden="true">↗</span></a>
        <a className="contact-link" href={profile.github} target="_blank" rel="noopener noreferrer"><span>GitHub profile</span><span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>;
}
