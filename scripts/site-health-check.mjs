import { chromium } from "playwright";
import { appendFileSync, writeFileSync } from "node:fs";

const SITE_URL = process.env.SITE_URL || "https://pandeynikhilone.github.io/";
const REPORT_PATH = "site-health-report.md";
const failures = [];
const warnings = [];
const linkResults = [];
const browserErrors = [];
const startedAt = new Date();

function fail(area, message) { failures.push({ area, message }); }
function warn(area, message) { warnings.push({ area, message }); }
function md(value) { return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ").trim(); }

function contrastRatio(foreground, background) {
  function luminance(rgb) {
    const values = rgb.match(/[\d.]+/g);
    if (!values || values.length < 3) return null;
    const linear = values.slice(0, 3).map((item) => {
      const value = Number(item) / 255;
      return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }
  const fg = luminance(foreground);
  const bg = luminance(background);
  if (fg === null || bg === null) return null;
  return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
}

function renderReport() {
  const overall = failures.length ? "NEEDS ATTENTION" : warnings.length ? "PASSED WITH WARNINGS" : "PASSED";
  const lines = [
    "# Portfolio daily health audit", "",
    "**Result:** " + overall,
    "**Site:** " + SITE_URL,
    "**Checked:** " + startedAt.toISOString(),
    "**Elapsed:** " + Math.round((Date.now() - startedAt.getTime()) / 1000) + " seconds", "",
    "## Recruiter-facing checks", "",
    "- Homepage, page title, H1, and meta description: " + (failures.some((item) => item.area === "Site load" || item.area === "Recruiter content") ? "NEEDS ATTENTION" : "checked"),
    "- Projects and contact links: " + (failures.some((item) => item.area.startsWith("Recruiter") || item.area === "Dead link" || item.area === "Navigation") ? "NEEDS ATTENTION" : "checked"),
    "- Mobile layout and keyboard-accessible menu: " + (failures.some((item) => item.area.startsWith("Mobile")) ? "NEEDS ATTENTION" : "checked"),
    "- Theme contrast: " + (failures.some((item) => item.area === "Contrast") ? "NEEDS ATTENTION" : "checked"),
    "- Browser runtime and first-party assets: " + (failures.some((item) => item.area === "Browser" || item.area === "First-party request") ? "NEEDS ATTENTION" : "checked"),
    "", "## Link audit", "",
    "Checked " + linkResults.length + " unique HTTP(S) page links plus email, phone, and in-page navigation formats.", "",
    "| Result | Link | Context | Details |",
    "|---|---|---|---|",
    ...(linkResults.length ? linkResults.map((item) => "| " + md(item.status) + " | " + md(item.url) + " | " + md(item.label || "(no label)") + " | " + md(item.detail || "") + " |") : ["| Not completed | N/A | N/A | The page did not expose links to check. |"]),
    "", "## Findings", "",
    ...(failures.length ? ["### Failures", ...failures.map((item) => "- **" + md(item.area) + ":** " + md(item.message))] : ["No confirmed failures found."]),
    "",
    ...(warnings.length ? ["### Warnings", ...warnings.map((item) => "- **" + md(item.area) + ":** " + md(item.message))] : ["No warnings."]),
    "", "Desktop and mobile screenshots are attached to the workflow run as artifacts.", ""
  ];
  const report = lines.join("\n");
  writeFileSync(REPORT_PATH, report, "utf8");
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n", "utf8");
  return report;
}

async function mapLimit(items, limit, handler) {
  const output = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      output[index] = await handler(items[index]);
    }
  }));
  return output;
}

async function probeUrl(rawUrl) {
  const result = { url: rawUrl, status: "OK", detail: "" };
  const headers = {
    "User-Agent": "Mozilla/5.0 (compatible; PortfolioHealthCheck/1.0; +https://pandeynikhilone.github.io/)",
    "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8"
  };
  let headError = "";
  try {
    const head = await fetch(rawUrl, { method: "HEAD", redirect: "follow", headers, signal: AbortSignal.timeout(12000) });
    if (head.status >= 200 && head.status < 400) {
      result.detail = "HTTP " + head.status;
      return result;
    }
    if (head.status === 404 || head.status === 410) {
      try {
        const get = await fetch(rawUrl, { method: "GET", redirect: "follow", headers, signal: AbortSignal.timeout(12000) });
        await get.body?.cancel();
        if (get.status === 404 || get.status === 410) {
          result.status = "DEAD";
          result.detail = "HTTP " + get.status;
          return result;
        }
        if (get.status >= 200 && get.status < 400) {
          result.detail = "GET HTTP " + get.status + "; HEAD returned " + head.status;
          return result;
        }
        result.status = "UNVERIFIED";
        result.detail = "HEAD HTTP " + head.status + ", GET HTTP " + get.status;
        return result;
      } catch (error) {
        result.status = "UNVERIFIED";
        result.detail = "HEAD HTTP " + head.status + "; GET failed: " + error.message;
        return result;
      }
    }
    headError = "HEAD HTTP " + head.status;
  } catch (error) {
    headError = "HEAD failed: " + error.message;
  }
  try {
    const get = await fetch(rawUrl, { method: "GET", redirect: "follow", headers, signal: AbortSignal.timeout(15000) });
    await get.body?.cancel();
    if (get.status >= 200 && get.status < 400) {
      result.detail = "GET HTTP " + get.status + (headError ? " (" + headError + ")" : "");
      return result;
    }
    if (get.status === 404 || get.status === 410) {
      result.status = "DEAD";
      result.detail = "GET HTTP " + get.status;
      return result;
    }
    result.status = "UNVERIFIED";
    result.detail = "GET HTTP " + get.status + (headError ? "; " + headError : "");
    return result;
  } catch (error) {
    result.status = "UNVERIFIED";
    result.detail = (headError ? headError + "; " : "") + "GET failed: " + error.message;
    return result;
  }
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, colorScheme: "light" });
  const page = await desktopContext.newPage();
  page.setDefaultTimeout(12000);
  page.on("pageerror", (error) => browserErrors.push("Runtime exception: " + error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push("Console error: " + message.text());
  });
  page.on("requestfailed", (request) => {
    const requestError = request.failure()?.errorText || "request failed";
    if (/ERR_ABORTED/.test(requestError)) return;
    try {
      if (new URL(request.url()).origin === new URL(SITE_URL).origin) fail("First-party request", request.url() + " (" + requestError + ")");
    } catch {}
  });
  page.on("response", (response) => {
    try {
      if (new URL(response.url()).origin === new URL(SITE_URL).origin && response.status() >= 400) fail("First-party request", response.status() + " " + response.url());
    } catch {}
  });

  let response;
  try {
    response = await page.goto(SITE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (!response) fail("Site load", "Navigation returned no HTTP response.");
    else if (!response.ok()) fail("Site load", "Homepage returned HTTP " + response.status() + ".");
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });
    await page.waitForFunction(() => document.querySelectorAll(".project-card").length >= 2, null, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(700);
  } catch (error) {
    fail("Site load", error.message);
  }

  if (response && response.ok()) {
    const info = await page.evaluate(() => ({
      title: document.title.trim(),
      description: document.querySelector('meta[name="description"]')?.content?.trim() || "",
      h1s: Array.from(document.querySelectorAll("h1")).map((node) => node.innerText.trim()).filter(Boolean),
      mainExists: Boolean(document.querySelector("main")),
      projects: Array.from(document.querySelectorAll(".project-card")).map((card) => ({
        title: card.querySelector("h3")?.innerText?.trim() || "",
        description: card.querySelector(".project-body p")?.innerText?.trim() || "",
        links: card.querySelectorAll("a").length
      })),
      sections: ["projects", "experience", "skills", "education", "contact"].map((id) => ({ id, exists: Boolean(document.getElementById(id)) })),
      contact: {
        email: Array.from(document.querySelectorAll('a[href^="mailto:"]')).some((anchor) => anchor.href.includes("@")),
        phone: Array.from(document.querySelectorAll('a[href^="tel:"]')).some((anchor) => /[0-9]{7,}/.test(anchor.href)),
        linkedin: Array.from(document.querySelectorAll('a[href*="linkedin.com"]')).length > 0,
        github: Array.from(document.querySelectorAll('a[href*="github.com"]')).length > 0
      },
      anchors: Array.from(document.querySelectorAll("a")).map((anchor) => ({
        href: anchor.getAttribute("href") || "",
        absoluteHref: anchor.href,
        label: (anchor.innerText || anchor.getAttribute("aria-label") || anchor.getAttribute("title") || "").trim().replace(/\s+/g, " ").slice(0, 100)
      })),
      missingImageAlt: Array.from(document.querySelectorAll("img")).filter((image) => !image.hasAttribute("alt")).map((image) => image.src),
      missingAnchorNames: Array.from(document.querySelectorAll("a")).filter((anchor) => !(anchor.innerText || anchor.getAttribute("aria-label") || anchor.getAttribute("title") || "").trim()).map((anchor) => anchor.href),
      emptyProjectCards: Array.from(document.querySelectorAll(".project-card")).filter((card) => !(card.querySelector("h3")?.innerText?.trim()) || !(card.querySelector(".project-body p")?.innerText?.trim())).length,
      defaultTheme: document.documentElement.dataset.theme || "",
      emailButtonText: document.querySelector(".contact-panel .actions .button")?.innerText?.trim().replace(/\s+/g, " ") || ""
    }));

    if (!info.title) fail("Recruiter content", "Document title is empty.");
    if (!info.description) fail("Recruiter content", "Meta description is empty.");
    if (info.h1s.length !== 1) fail("Recruiter content", "Expected exactly one H1 but found " + info.h1s.length + ".");
    if (!info.mainExists) fail("Recruiter content", "Main landmark is missing.");
    if (info.projects.length < 2) fail("Recruiter content", "Expected at least two project cards; found " + info.projects.length + ".");
    if (info.emptyProjectCards) fail("Recruiter content", info.emptyProjectCards + " project card(s) have a missing title or description.");
    for (const section of info.sections) if (!section.exists) fail("Navigation", "Expected #" + section.id + " section target does not exist.");
    for (const [name, exists] of Object.entries(info.contact)) if (!exists) fail("Recruiter contact", "Expected " + name + " contact method/link is missing.");
    if (info.missingImageAlt.length) warn("Accessibility", info.missingImageAlt.length + " image(s) have no alt attribute.");
    if (info.missingAnchorNames.length) fail("Accessibility", info.missingAnchorNames.length + " link(s) have no accessible name: " + info.missingAnchorNames.slice(0, 5).join(", "));
    if (!/Email me\s*↗/.test(info.emailButtonText)) warn("Recruiter detail", "The Email me button does not show the expected arrow label.");
    if (info.defaultTheme !== "light") fail("Theme", 'A fresh visit should default to light theme, but dataset theme was "' + info.defaultTheme + '".');

    const linkTargets = new Map();
    for (const anchor of info.anchors) {
      const rawHref = anchor.href.trim();
      if (!rawHref || rawHref.startsWith("javascript:") || rawHref.startsWith("data:")) continue;
      let parsed;
      try { parsed = new URL(rawHref, SITE_URL); }
      catch { fail("Link format", 'Invalid href "' + rawHref + '" on "' + anchor.label + '".'); continue; }
      if (parsed.protocol === "mailto:") {
        if (!parsed.pathname.includes("@")) fail("Contact link", 'Invalid email link "' + rawHref + '".');
        continue;
      }
      if (parsed.protocol === "tel:") {
        if (!/\d{7,}/.test(parsed.pathname)) fail("Contact link", 'Invalid telephone link "' + rawHref + '".');
        continue;
      }
      if (!["http:", "https:"].includes(parsed.protocol)) continue;
      if (!linkTargets.has(parsed.href)) linkTargets.set(parsed.href, []);
      if (anchor.label && !linkTargets.get(parsed.href).includes(anchor.label)) linkTargets.get(parsed.href).push(anchor.label);
    }

    const siteOrigin = new URL(SITE_URL).origin;
    const current = new URL(SITE_URL);
    const toProbe = [];
    for (const [href, labels] of linkTargets.entries()) {
      const url = new URL(href);
      const label = labels.join(", ");
      if (url.origin === siteOrigin && url.pathname === current.pathname && url.search === current.search && url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        const exists = await page.evaluate((targetId) => Boolean(document.getElementById(targetId)), id);
        const result = { url: href, label, status: exists ? "OK" : "DEAD", detail: exists ? "In-page target #" + id + " exists" : "In-page target #" + id + " does not exist" };
        linkResults.push(result);
        if (!exists) fail("Dead link", href + " (" + result.detail + ")");
      } else {
        toProbe.push({ url: href, label });
      }
    }

    await mapLimit(toProbe, 5, async (link) => {
      const result = await probeUrl(link.url);
      result.label = link.label;
      linkResults.push(result);
      if (result.status === "DEAD") fail("Dead link", link.url + " (" + result.detail + ")");
      else if (result.status === "UNVERIFIED") warn("Link could not be fully verified", link.url + " (" + result.detail + "). Anti-bot restrictions or temporary rate limits can prevent automated verification.");
    });

    const toggle = page.locator("button.theme-toggle");
    if (!(await toggle.count())) fail("Theme", "Theme toggle button is missing.");
    else {
      for (const mode of ["light", "dark"]) {
        const currentMode = await page.evaluate(() => document.documentElement.dataset.theme || "");
        if (currentMode !== mode) await toggle.click();
        await page.waitForTimeout(120);
        const colors = await page.evaluate(() => {
          const read = (selector) => {
            const node = document.querySelector(selector);
            if (!node) return null;
            const style = getComputedStyle(node);
            return { foreground: style.color, background: style.backgroundColor };
          };
          return {
            theme: document.documentElement.dataset.theme,
            email: read(".contact-panel .actions .button"),
            brand: read(".brand-mark")
          };
        });
        for (const item of [
          { name: "Email me button", colors: colors.email },
          { name: "NP brand mark", colors: colors.brand }
        ]) {
          if (!item.colors) {
            fail("Contrast", item.name + " is missing in " + mode + " theme.");
            continue;
          }
          const contrast = contrastRatio(item.colors.foreground, item.colors.background);
          if (contrast === null || contrast < 4.5) fail("Contrast", item.name + " contrast is " + (contrast === null ? "unavailable" : contrast.toFixed(2) + ":1") + " in " + mode + " theme (foreground " + item.colors.foreground + ", background " + item.colors.background + ").");
        }
      }
    }

    try { await page.screenshot({ path: "site-health-desktop.png", fullPage: true }); }
    catch (error) { warn("Screenshot", "Desktop screenshot could not be saved: " + error.message); }

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const mobilePage = await mobileContext.newPage();
    mobilePage.setDefaultTimeout(12000);
    mobilePage.on("pageerror", (error) => browserErrors.push("Mobile runtime exception: " + error.message));
    try {
      const mobileResponse = await mobilePage.goto(SITE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
      if (!mobileResponse?.ok()) fail("Mobile site load", "Mobile homepage returned HTTP " + (mobileResponse?.status() ?? "no response") + ".");
      await mobilePage.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });
      await mobilePage.waitForTimeout(500);
      const layout = await mobilePage.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        menuExists: Boolean(document.querySelector(".nav-toggle")),
        navExists: Boolean(document.querySelector("#primary-navigation")),
        defaultTheme: document.documentElement.dataset.theme || ""
      }));
      if (layout.documentWidth > layout.viewportWidth + 2) fail("Mobile layout", "Horizontal page overflow: content width " + layout.documentWidth + "px on " + layout.viewportWidth + "px viewport.");
      if (!layout.menuExists || !layout.navExists) fail("Mobile navigation", "Menu button or primary navigation is missing.");
      if (layout.defaultTheme !== "light") fail("Theme", 'Fresh mobile visit should default to light theme, but found "' + layout.defaultTheme + '".');
      if (layout.menuExists && layout.navExists) {
        const menu = mobilePage.locator(".nav-toggle");
        await menu.click();
        if (await menu.getAttribute("aria-expanded") !== "true") fail("Mobile navigation", "Menu button did not open the navigation.");
        if (!(await mobilePage.locator("#primary-navigation.is-open").isVisible())) fail("Mobile navigation", "Expanded navigation is not visible.");
        await mobilePage.keyboard.press("Escape");
        if (await menu.getAttribute("aria-expanded") !== "false") fail("Mobile navigation", "Escape did not close the navigation menu.");
      }
      try { await mobilePage.screenshot({ path: "site-health-mobile.png", fullPage: true }); }
      catch (error) { warn("Screenshot", "Mobile screenshot could not be saved: " + error.message); }
    } catch (error) {
      fail("Mobile test", error.message);
    } finally {
      await mobileContext.close();
    }
  }

  for (const message of [...new Set(browserErrors)]) fail("Browser", message);
} catch (error) {
  fail("Audit setup", error.stack || error.message);
} finally {
  if (browser) await browser.close().catch(() => {});
}

const report = renderReport();
console.log(report);
if (failures.length) process.exitCode = 1;
