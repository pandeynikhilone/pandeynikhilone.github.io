import { useEffect } from "react";

const REVEAL_TARGETS = [
  ".section-head",
  ".project-card",
  ".timeline-item",
  ".toolkit-card",
  ".education-card",
  ".contact-panel",
  ".proof-item"
].join(", ");

export default function MotionEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const progress = document.querySelector(".scroll-progress > span");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      if (progress) progress.style.transform = "scaleX(0)";
      return undefined;
    }

    const targets = Array.from(document.querySelectorAll(REVEAL_TARGETS));
    targets.forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", (index % 4) * 75 + "ms");
    });

    root.classList.add("motion-ready");

    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.12,
        rootMargin: "0px 0px -5% 0px"
      });
      targets.forEach((element) => observer.observe(element));
    } else {
      targets.forEach((element) => element.classList.add("is-visible"));
    }

    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      if (!progress) return;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const amount = Math.min(1, Math.max(0, window.scrollY / scrollable));
      progress.style.transform = "scaleX(" + amount + ")";
    };
    const scheduleProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span />
    </div>
  );
}
