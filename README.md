# Nikhil Pandey | Career Portfolio

[![Deployment](https://github.com/pandeynikhilone/pandeynikhilone.github.io/actions/workflows/deploy-portfolio.yml/badge.svg)](https://github.com/pandeynikhilone/pandeynikhilone.github.io/actions/workflows/deploy-portfolio.yml)
[![Site health audit](https://github.com/pandeynikhilone/pandeynikhilone.github.io/actions/workflows/site-health-check.yml/badge.svg)](https://github.com/pandeynikhilone/pandeynikhilone.github.io/actions/workflows/site-health-check.yml)


This is my personal portfolio for software development internships and early-career roles. It is built with React, Vite, and plain CSS. The portfolio itself does not use Tailwind CSS, Bootstrap, or a component UI framework.

## Project structure

    .
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── SiteHeader.jsx
    │   │   ├── HeroSection.jsx
    │   │   ├── ProjectsSection.jsx
    │   │   ├── ProjectCard.jsx
    │   │   ├── ExperienceSection.jsx
    │   │   ├── SkillsSection.jsx
    │   │   ├── EducationSection.jsx
    │   │   ├── ContactSection.jsx
    │   │   └── SiteFooter.jsx
    │   ├── data/
    │   │   └── portfolio.js
    │   └── styles/
    │       └── site.css
    ├── data/
    │   ├── projects.json
    │   └── auto-projects.json
    ├── scripts/
    │   ├── check-portfolio.mjs
    │   ├── manage_project_issue.py
    │   └── update_auto_projects.py
    └── .github/
        └── workflows/

## Run locally

Install Node.js 22 or a compatible newer LTS release. The committed package-lock.json pins the dependency tree, so npm ci can reproduce the same install in CI. From the repository folder, run:

    npm install
    npm run dev

Vite prints a local URL. Open it in your browser. To validate the project data and create a production build, run:

    npm run check
    npm run build
    npm run preview

The Vite build includes both project catalogs from the data folder as static files. The React app reads the same catalog that the Python automation maintains.

## Where to edit things

- Name, contact details, highlights, experience, skills, and education: src/data/portfolio.js
- Page layout and React behavior: the relevant file in src/components/
- Colors, typography, spacing, responsive rules, and animation: src/styles/site.css
- Manually selected project cards: data/projects.json
- Automatically discovered projects: scripts/update_auto_projects.py writes data/auto-projects.json
- Browser tab icon: public/favicon.svg
- Build and publishing automation: files in .github/workflows/

## Project catalog automation

The existing Python automation is retained.

- scripts/update_auto_projects.py discovers opted-in public repositories tagged with the GitHub topic portfolio.
- scripts/manage_project_issue.py updates the curated catalog through the GitHub project request form.
- scripts/check-portfolio.mjs checks required files, project data, installed framework choices, and the no-em-dash copy rule.

The refresh workflow checks the catalog daily and on changes to main. The project request workflow updates the catalog and deploys the site after an owner-submitted form.

## Technologies

- React and React DOM for the interface
- Vite for development and production builds
- Plain CSS for portfolio styling
- Python for repository discovery and project form automation
- GitHub Actions and GitHub Pages for validation and deployment

Project technology labels describe each project itself and are separate from the tools used to build this portfolio.

## Links

- Website: https://pandeynikhilone.github.io/
- LinkedIn: https://www.linkedin.com/in/pandeynikhilone/
- GitHub: https://github.com/pandeynikhilone
- Email: pandeynikhilone@gmail.com
