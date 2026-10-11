function ProjectArtwork({ project }) {
  if (project.screenshotUrl) {
    return <div className="project-art project-screenshot">
      <img
        src={project.screenshotUrl}
        alt={project.screenshotAlt || `${project.title || project.repoName || "Project"} screenshot`}
        loading="lazy"
        decoding="async"
      />
    </div>;
  }

  const name = String(project.repoName || "").toLowerCase();
  if (name === "truloop") {
    return <div className="project-art art-truloop" aria-hidden="true">
      <div className="cover-top"><span className="cover-logo"><span className="cover-mark">TR</span> TRULOOP</span><span className="cover-pill">PRODUCT REVIEW PLATFORM</span></div>
      <div className="cover-title">Real reviews.<br /><span>Better choices.</span></div>
      <div className="cover-footer"><span>HONEST USER FEEDBACK</span><span>NEXT.JS / NODE.JS</span></div>
    </div>;
  }
  if (name === "techfestevent") {
    return <div className="project-art art-techfest" aria-hidden="true">
      <div className="techfest-sheet">
        <div className="techfest-top"><span>COLLEGE TECHFEST</span><span className="techfest-badge">REGISTRATION</span></div>
        <div className="techfest-title">Student registration</div><div className="form-line" /><div className="form-line short" />
        <div className="form-rows"><div className="form-option">Student details</div><div className="form-option">Choose event</div></div>
        <div className="form-submit">REGISTRATION FLOW</div>
      </div>
      <div className="techfest-label">FRONTEND / EVENT SUPPORT</div>
    </div>;
  }
  return <div className="project-art art-truloop" aria-hidden="true">
    <div className="cover-top"><span className="cover-logo"><span className="cover-mark">NP</span> SELECTED PROJECT</span></div>
    <div className="cover-title">{project.title || "Software project"}</div>
    <div className="cover-footer"><span>BUILD / TEST / IMPROVE</span><span>GITHUB</span></div>
  </div>;
}

export default function ProjectCard({ project, index }) {
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];
  const highlights = Array.isArray(project.highlights) ? project.highlights : [];
  const actions = [];
  if (project.demoUrl) actions.push({ label: project.demoLabel || "Live demo", url: project.demoUrl });
  if (project.sourceUrl) actions.push({ label: project.sourceLabel || "Source code", url: project.sourceUrl });
  (Array.isArray(project.links) ? project.links : []).forEach((link) => {
    if (link && link.label && link.url) actions.push({ label: link.label, url: link.url });
  });

  return <article className="project-card">
    <ProjectArtwork project={project} />
    <div className="project-body">
      <div className="project-kicker"><span className="project-index">PROJECT {String(index + 1).padStart(2, "0")}</span><span className="project-type">{project.category || "Software project"}</span></div>
      <h3>{project.title || project.repoName || "Untitled project"}</h3>
      <p>{project.description || "Project details will be added soon."}</p>
      {highlights.length > 0 && <ul className="project-highlights">{highlights.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>}
      {technologies.length > 0 && <div className="tags">{technologies.slice(0, 8).map((technology) => <span className="tag" key={technology}>{technology}</span>)}</div>}
      {actions.length > 0 && <div className="project-links">{actions.map((action) => <a key={action.label + action.url} href={action.url} target="_blank" rel="noopener noreferrer">{action.label} <span aria-hidden="true">↗</span></a>)}</div>}
    </div>
  </article>;
}
