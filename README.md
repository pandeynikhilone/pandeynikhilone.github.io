# Nikhil Pandey — Career Proof Hub

Public portfolio for software development internships and early-career opportunities.

## Edit or manage projects without changing website code

### Easiest: use the GitHub project form
1. Open [New portfolio project request](https://github.com/pandeynikhilone/pandeynikhilone.github.io/issues/new?template=portfolio-project.yml).
2. Choose **Add project**, **Edit project**, or **Remove project** and fill out the fields.
3. Submit the issue. The owner-only workflow updates the catalog and deploys the site.
4. Open [the live website](https://pandeynikhilone.github.io/) after the workflow succeeds.

Only an issue submitted by this repository's owner is allowed to edit project data. The workflow is triggered when the issue is opened; submit a new form for each change.

### Direct/manual fallback: edit one JSON file
Open `data/projects.json` → click the pencil icon → edit the relevant project → **Commit changes** to `main`. You do not need to touch `index.html`. The site deploys automatically from the Pages workflow when code is pushed to `main`.

The JSON file is the hand-picked list. Entries can include:
- `repoName`: repository name used to override an automatically discovered card; leave empty for a standalone case study.
- `title`, `description`, `category`, `technologies`
- `sourceUrl`, `sourceLabel`, `demoUrl`, `demoLabel`
- `status`: optional accurate note about the project
- `links`: optional array of `{"label":"Case study","url":"https://example.com"}`

### Automatic new-project discovery
For any new public repository, open that repository, click the gear next to **About**, and add the GitHub topic `portfolio`. It will be picked up on the next daily refresh at about **12:07 AM IST**. To refresh immediately, open **Actions → Refresh and Deploy Career Portfolio → Run workflow**.

Only repositories owned by `pandeynikhilone` that are public, non-fork, non-archived, and tagged with `portfolio` can be discovered. Private repositories never enter the automatic catalog. To stop automatically featuring a repository, remove its `portfolio` topic or use the project form's Remove action.

If an entry is in `data/projects.json`, the hand-picked card takes priority over the auto-discovered card for that repo, allowing manual descriptions to override GitHub's defaults.

## One-time publishing setup
Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. Both the refresh workflow and the owner-only project form workflow deploy through GitHub Pages.

## Keep the portfolio credible
- Use factual descriptions and state your own contribution accurately.
- Do not add tokens, API keys, credentials, or private source-code URLs.
- Add a live demo only once it's actually accessible.

## Contact
- LinkedIn: https://www.linkedin.com/in/pandeynikhilone/
- GitHub: https://github.com/pandeynikhilone
- Email: pandeynikhilone@gmail.com
