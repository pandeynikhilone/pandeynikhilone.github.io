import { useEffect, useState } from "react";
import { profile } from "../data/portfolio.js";
import ThemeToggle from "./ThemeToggle.jsx";

const navigation = [
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Skills", "#skills"],
  ["Education", "#education"]
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 660) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="topline">
        <div className="wrap topline-inner">
          <span className="live-label"><span className="live-dot" aria-hidden="true" />OPEN TO SOFTWARE DEVELOPMENT INTERNSHIPS</span>
          <a href={"mailto:" + profile.email}>Say hello <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <header className="site-header">
        <nav className="wrap nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label={profile.name + " home"} onClick={closeMenu}>
            <span className="brand-mark">{profile.initials}</span>
            <span className="brand-name">{profile.name}</span>
          </a>
          <div id="primary-navigation" className={"nav-links" + (menuOpen ? " is-open" : "")} aria-hidden={!menuOpen}>
            {navigation.map(([label, href]) => <a key={href} href={href} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>{label}</a>)}
            <a className="nav-cta" href="#contact" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>Contact <span aria-hidden="true">↗</span></a>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <button className="nav-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
              <span className="menu-icon" aria-hidden="true"><span /><span /><span /></span>
              <span className="menu-label">Menu</span>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
