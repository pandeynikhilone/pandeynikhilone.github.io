import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard.jsx";

async function readProjectList(path) {
  const response = await fetch(import.meta.env.BASE_URL + path, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load " + path);
  const document = await response.json();
  return Array.isArray(document.projects) ? document.projects : [];
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([readProjectList("data/projects.json"), readProjectList("data/auto-projects.json")])
      .then(([curated, discovered]) => {
        const curatedNames = new Set(curated.map((project) => String(project.repoName || "").toLowerCase()).filter(Boolean));
        const automatic = discovered.filter((project) => !curatedNames.has(String(project.repoName || "").toLowerCase()));
        if (active) setProjects([...curated, ...automatic]);
      })
      .catch((error) => {
        console.error("Portfolio project catalog could not be loaded.", error);
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return <section className="section" id="projects">
    <div className="section-head">
      <div><div className="eyebrow">01 / Selected work</div><h2>TruLoop</h2></div>
      <p className="section-intro">Full-stack product review platform built with Next.js, React, Node.js, Express, and MongoDB.</p>
    </div>
    {loading && <p className="project-status" role="status">Loading project details…</p>}
    {!loading && loadFailed && <p className="project-status" role="status">Project details could not be loaded. Please use the GitHub link to explore my work.</p>}
    {!loading && !loadFailed && projects.length === 0 && <p className="project-status" role="status">Projects are being updated. Please check back soon.</p>}
    <div className="project-grid" aria-label="Portfolio projects">
      {projects.map((project, index) => <ProjectCard key={project.repoName || project.title || index} project={project} index={index} />)}
    </div>
  </section>;
}
