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
  useEffect(() => {
    let active = true;
    Promise.all([readProjectList("data/projects.json"), readProjectList("data/auto-projects.json")])
      .then(([curated, discovered]) => {
        const curatedNames = new Set(curated.map((project) => String(project.repoName || "").toLowerCase()).filter(Boolean));
        const automatic = discovered.filter((project) => !curatedNames.has(String(project.repoName || "").toLowerCase()));
        if (active) setProjects([...curated, ...automatic]);
      })
      .catch((error) => console.error("Portfolio project catalog could not be loaded.", error));
    return () => { active = false; };
  }, []);

  return <section className="section" id="projects">
    <div className="section-head">
      <div><div className="eyebrow">01 / Selected work</div><h2>Projects I can walk you through.</h2></div>
      <p className="section-intro">I have kept the list focused on projects where I can explain the problem, my contribution, and the technical choices. Open the code or live demo to explore further.</p>
    </div>
    <div className="project-grid" aria-label="Portfolio projects">
      {projects.map((project, index) => <ProjectCard key={project.repoName || project.title || index} project={project} index={index} />)}
    </div>
  </section>;
}
