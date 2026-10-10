#!/usr/bin/env python3
"""Discover public repositories opted into the portfolio with the 'portfolio' topic.

The curated list lives in data/projects.json and is never overwritten by this script.
If GitHub's public API is temporarily unavailable, retain the last good auto list.
"""
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "auto-projects.json"
OWNER = "pandeynikhilone"
SITE_REPO = f"{OWNER}/{OWNER}.github.io"
TOPIC = "portfolio"
API_ROOT = "https://api.github.com"
HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "NikhilPandeyCareerPortfolio",
}


def request_json(url, attempts=3):
    last_error = None
    for attempt in range(attempts):
        request = Request(url, headers=HEADERS)
        try:
            with urlopen(request, timeout=20) as response:
                return json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
            if attempt < attempts - 1:
                time.sleep(2 ** attempt)
    raise RuntimeError(f"GitHub API request failed: {type(last_error).__name__}")


def repository_topics(repo):
    # The list-repositories response often includes topics. Use the dedicated
    # endpoint only if the field is absent in the current API response.
    if isinstance(repo.get("topics"), list):
        return repo["topics"]

    owner = repo.get("owner", {}).get("login", OWNER)
    name = repo["name"]
    encoded_owner = quote(owner, safe="")
    encoded_name = quote(name, safe="")
    payload = request_json(f"{API_ROOT}/repos/{encoded_owner}/{encoded_name}/topics")
    return payload.get("names", [])


def title_from_repo(name):
    return name.replace("-", " ").replace("_", " ").strip()


def main():
    try:
        repositories = []
        page = 1
        while True:
            url = (
                f"{API_ROOT}/users/{OWNER}/repos"
                f"?per_page=100&page={page}&type=owner&sort=updated"
            )
            batch = request_json(url)
            if not isinstance(batch, list):
                raise RuntimeError("GitHub returned an unexpected repository list.")
            repositories.extend(batch)
            if len(batch) < 100:
                break
            page += 1

        prior_catalog = {}
        if OUTPUT.exists():
            try:
                prior_catalog = json.loads(OUTPUT.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                prior_catalog = {}
        hidden_repo_names = {
            str(name).casefold()
            for name in prior_catalog.get("hiddenRepoNames", [])
            if isinstance(name, str) and name.strip()
        }

        selected = []
        for repo in repositories:
            if repo.get("private", True) or repo.get("fork") or repo.get("archived"):
                continue
            full_name = str(repo.get("full_name", ""))
            if full_name.casefold() == SITE_REPO.casefold():
                continue
            if repo.get("name", "").casefold() in hidden_repo_names:
                continue
            topics = repository_topics(repo)
            if TOPIC not in topics:
                continue

            technologies = []
            language = repo.get("language")
            if language:
                technologies.append(language)
            for topic in topics:
                if topic != TOPIC and topic not in technologies and len(technologies) < 6:
                    technologies.append(topic.replace("-", " "))

            description = repo.get("description") or (
                "Public repository by Nikhil Pandey. Add a short repository description "
                "to explain the problem it solves and what you built."
            )
            homepage = repo.get("homepage")
            if not isinstance(homepage, str) or not homepage.startswith("https://"):
                homepage = ""

            entry = {
                "repoName": repo["name"],
                "title": title_from_repo(repo["name"]),
                "description": description,
                "category": language or "GitHub project",
                "technologies": technologies,
                "sourceUrl": repo.get("html_url", ""),
                "sourceLabel": "Source code",
                "demoUrl": homepage,
                "demoLabel": "Live demo",
                "stars": int(repo.get("stargazers_count", 0)),
                "updatedAt": repo.get("pushed_at") or repo.get("updated_at") or "",
            }
            selected.append(entry)

        selected.sort(
            key=lambda p: (p["stars"], p["updatedAt"], p["title"].casefold()),
            reverse=True,
        )
        document = {
            "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "rule": (
                "Only non-fork, non-archived public repositories owned by "
                f"{OWNER} and tagged with the GitHub topic '{TOPIC}' are shown."
            ),
            "hiddenRepoNames": sorted(hidden_repo_names),
            "projects": selected,
        }
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(
            json.dumps(document, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Discovered {len(selected)} opted-in public repositories.")
        for project in selected:
            print(f"- {project['repoName']}")
    except Exception as exc:
        # The workflow will keep the previous file if this script fails.
        print(
            f"Project discovery failed; preserve the last known good catalog. "
            f"Reason: {type(exc).__name__}: {exc}",
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
