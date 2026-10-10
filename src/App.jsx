import SiteHeader from "./components/SiteHeader.jsx";
import HeroSection from "./components/HeroSection.jsx";
import ProjectsSection from "./components/ProjectsSection.jsx";
import ExperienceSection from "./components/ExperienceSection.jsx";
import SkillsSection from "./components/SkillsSection.jsx";
import EducationSection from "./components/EducationSection.jsx";
import ContactSection from "./components/ContactSection.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import MotionEffects from "./components/MotionEffects.jsx";

export default function App() {
  return (
    <>
      <MotionEffects />
      <SiteHeader />
      <main id="main" className="wrap">
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
        <SkillsSection />
        <EducationSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
