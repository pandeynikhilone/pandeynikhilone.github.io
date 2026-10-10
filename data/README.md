# Project catalog editing

The portfolio displays a hand-picked catalog plus the automatically discovered public repositories.

## Edit a curated project
1. Open data/projects.json.
2. Click the pencil icon on GitHub or edit the file locally.
3. Add, remove, or update an entry in the projects array.
4. Commit to main. The GitHub Actions workflow builds and deploys the React site.

Use the project request form:
https://github.com/pandeynikhilone/pandeynikhilone.github.io/issues/new?template=portfolio-project.yml

## Automatic discovery
Add the topic portfolio to a repository you own. It must be public, not a fork, and not archived. The Python refresh script updates data/auto-projects.json on the daily schedule.

## How the React app reads the catalog
The Vite configuration copies both JSON files into the production build under dist/data/. The React project section loads those JSON files at runtime. You do not need to edit a React component when only a project's description, tags, or links change.

Keep project technologies and responsibilities accurate and specific.
