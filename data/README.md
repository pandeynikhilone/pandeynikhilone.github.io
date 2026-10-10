# Portfolio project editing (easy mode)

You do not need to edit `index.html` to change the project cards. Edit only `data/projects.json`.

## Manual edits
1. Open this repository on GitHub.
2. Open `data/projects.json`, click the pencil (Edit this file).
3. Edit a project's title, description, category, technologies, links, or status.
4. Commit the change to `main`. The site deployment workflow starts automatically.

### Project fields
- `repoName`: exact repository name used to override an automatically discovered entry. Use an empty string for a standalone case study with no public source repository.
- `title`: title on the project card.
- `description`: one or two sentences in your own words.
- `category`: short label shown at the top of the card.
- `technologies`: array of short technology labels.
- `sourceUrl`: optional https URL to source code.
- `sourceLabel`: optional label for the source link (defaults to "Source code").
- `demoUrl`: optional https URL to a live demo.
- `demoLabel`: optional label for the demo link (defaults to "Live demo").
- `links`: optional array of additional links, each with `label` and an https `url`.
- `status`: optional note displayed under tags; useful for explaining that source code is private or that a demo is not available.

Keep the JSON valid: use double quotes, add commas between fields, and do not add a comma after the last item.

## Automatic discovery of new public repositories
1. Open the repository you want to feature.
2. On the repository's Code page, use the About section's gear icon.
3. Add the GitHub topic `portfolio` and save it.
4. Wait for the daily refresh (about 24 hours), or use **Actions → Refresh and Deploy Career Portfolio → Run workflow** to refresh it now.

Only your own public repositories that are not forks or archived and have the `portfolio` topic are automatically discovered. Private repositories never enter the automatic catalog. If a project is already in `data/projects.json`, the hand-picked entry takes priority and the duplicate automatic card is hidden.

## Deployment configuration (one-time)
Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. The `Refresh and Deploy Career Portfolio` workflow publishes the website whenever `main` changes and refreshes the discovered project list daily.
