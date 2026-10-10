#!/usr/bin/env python3
"""Apply owner-submitted portfolio project form issues to the site catalog."""
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
MANUAL_FILE = ROOT / "data" / "projects.json"
AUTO_FILE = ROOT / "data" / "auto-projects.json"
EXPECTED_OWNER = "pandeynikhilone"
CLEAR = "clear"


def parse_issue_body(body):
    sections = {}
    pattern = re.compile(r"^###\s+(.+?)\s*\n(.*?)(?=^###\s+|\Z)", re.M | re.S)
    for match in pattern.finditer(body or ""):
        key = match.group(1).strip()
        value = match.group(2).strip()
        if value in {"_No response_", "_No response", "_No response_\n"}:
            value = ""
        sections[key] = value
    return sections


def get(sections, name):
    return str(sections.get(name, "")).strip()


def url_value(value, field_name):
    if not value:
        return ""
    parsed = urlparse(value)
    if parsed.scheme != "https" or not parsed.netloc:
        raise ValueError(f"{field_name} must be a valid https:// URL, or left blank.")
    return value


def read_json(path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return default
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Could not read {path.relative_to(ROOT)} safely.") from exc


def parse_extra_links(raw):
    links = []
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        if "|" not in line:
            raise ValueError("Extra links must use one line per link: Label | https://example.com")
        label, url = [part.strip() for part in line.split("|", 1)]
        if not label:
            raise ValueError("Every extra link needs a label before the | character.")
        safe_url = url_value(url, "Extra link")
        if not safe_url:
            raise ValueError("Extra link URL cannot be blank.")
        links.append({"label": label, "url": safe_url})
    return links


def find_manual_index(projects, repo_name, title):
    repo_key = repo_name.casefold()
    title_key = title.casefold()
    if repo_key:
        for i, project in enumerate(projects):
            if str(project.get("repoName", "")).casefold() == repo_key:
                return i
    for i, project in enumerate(projects):
        if str(project.get("title", "")).casefold() == title_key:
            return i
    return None


def main():
    event_path = os.getenv("GITHUB_EVENT_PATH")
    if not event_path:
        raise RuntimeError("GitHub issue event payload is missing.")

    event = read_json(Path(event_path), {})
    issue = event.get("issue", {})
    actor = issue.get("user", {}).get("login", "")
    if actor.casefold() != EXPECTED_OWNER.casefold():
        raise RuntimeError("Only the repository owner can change portfolio projects.")

    sections = parse_issue_body(issue.get("body", ""))
    action = get(sections, "Action").casefold()
    action = action.replace(" project", "").strip()
    title = get(sections, "Project title")
    repo_name = get(sections, "Repository name (optional)")
    description = get(sections, "Short description")
    category = get(sections, "Category")
    tech_raw = get(sections, "Technologies (comma-separated)")
    source_raw = get(sections, "Source code URL")
    demo_raw = get(sections, "Live demo URL")
    status_raw = get(sections, "Status note")
    links_raw = get(sections, "Extra links (one per line: Label | https://example.com)")

    if action not in {"add", "edit", "remove"}:
        raise ValueError("Action must be Add project, Edit project, or Remove project.")
    if not title:
        raise ValueError("Project title is required.")
    if repo_name.casefold() == CLEAR:
        repo_name = ""

    manual = read_json(MANUAL_FILE, {"projects": []})
    auto = read_json(AUTO_FILE, {"projects": [], "hiddenRepoNames": []})
    projects = manual.get("projects")
    if not isinstance(projects, list):
        raise RuntimeError("data/projects.json must contain a projects array.")

    hidden = auto.get("hiddenRepoNames", [])
    if not isinstance(hidden, list):
        hidden = []
    hidden_map = {str(item).casefold() for item in hidden if isinstance(item, str)}

    index = find_manual_index(projects, repo_name, title)

    if action == "remove":
        if index is not None:
            removed = projects.pop(index)
            removed_title = removed.get("title", title)
            removed_repo = str(removed.get("repoName", "")).strip()
            print(f"Removed manually curated project: {removed_title}")
            # Hide the corresponding automatic card too, if it is a repo.
            if removed_repo:
                hidden_map.add(removed_repo.casefold())
        else:
            # When a card is automatic-only, allow the repository name or title.
            auto_projects = auto.get("projects", [])
            auto_match = next(
                (
                    project for project in auto_projects
                    if (
                        (repo_name and str(project.get("repoName", "")).casefold() == repo_name.casefold())
                        or str(project.get("title", "")).casefold() == title.casefold()
                    )
                ),
                None,
            )
            target_repo = repo_name or (str(auto_match.get("repoName", "")).strip() if auto_match else "")
            if target_repo:
                hidden_map.add(target_repo.casefold())
                print(f"Hidden auto-discovered repository: {target_repo}")
            else:
                raise ValueError("No matching project found. Provide its exact title or repository name.")
    else:
        source_url = "" if source_raw.casefold() == CLEAR else url_value(source_raw, "Source code URL")
        demo_url = "" if demo_raw.casefold() == CLEAR else url_value(demo_raw, "Live demo URL")
        extra_links = parse_extra_links(links_raw) if links_raw and links_raw.casefold() != CLEAR else []

        if action == "add" and not description:
            raise ValueError("Short description is required when adding a project.")

        # Edit only fields that have a value; use the word CLEAR to remove
        # optional URLs/status. Blank fields otherwise preserve existing values.
        if index is None:
            if action == "edit":
                raise ValueError("No manually curated project matched. For an automatically discovered project, add a manual entry to override it, or use Remove to hide it.")
            project = {
                "repoName": repo_name,
                "title": title,
                "description": description,
                "category": category or "Software project",
                "technologies": [x.strip() for x in tech_raw.split(",") if x.strip()],
            }
            if source_url:
                project["sourceUrl"] = source_url
            if demo_url:
                project["demoUrl"] = demo_url
            if status_raw and status_raw.casefold() != CLEAR:
                project["status"] = status_raw
            if extra_links:
                project["links"] = extra_links
            projects.append(project)
            print(f"Added project: {title}")
        else:
            project = projects[index]
            if repo_name:
                project["repoName"] = repo_name
            if title:
                project["title"] = title
            if description:
                project["description"] = description
            if category:
                project["category"] = category
            if tech_raw:
                project["technologies"] = [x.strip() for x in tech_raw.split(",") if x.strip()]
            if source_raw:
                if source_raw.casefold() == CLEAR:
                    project.pop("sourceUrl", None)
                else:
                    project["sourceUrl"] = source_url
            if demo_raw:
                if demo_raw.casefold() == CLEAR:
                    project.pop("demoUrl", None)
                else:
                    project["demoUrl"] = demo_url
            if status_raw:
                if status_raw.casefold() == CLEAR:
                    project.pop("status", None)
                else:
                    project["status"] = status_raw
            if links_raw:
                if links_raw.casefold() == CLEAR:
                    project.pop("links", None)
                else:
                    project["links"] = extra_links
            print(f"Updated project: {project.get('title', title)}")

        # If an owner adds a repository manually, allow it even if previously hidden.
        if repo_name:
            hidden_map.discard(repo_name.casefold())

    manual["projects"] = projects
    auto["hiddenRepoNames"] = sorted(hidden_map)
    MANUAL_FILE.write_text(json.dumps(manual, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    AUTO_FILE.write_text(json.dumps(auto, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Portfolio project form failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        sys.exit(1)
