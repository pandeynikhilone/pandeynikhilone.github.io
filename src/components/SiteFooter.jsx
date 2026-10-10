import { profile } from "../data/portfolio.js";

export default function SiteFooter() {
  return <footer className="wrap footer">
    <span>© <span>{new Date().getFullYear()}</span> {profile.name}. Built with care.</span>
    <div className="footer-links">
      <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="#top">Back to top ↑</a>
    </div>
  </footer>;
}
