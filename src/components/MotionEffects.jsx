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

    let revealObserver;
    let itemIndex = 0;

    const registerTarget = (element) => {
      if (!(element instanceof HTMLElement) || element.classList.contains("scroll-reveal")) return;
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", (itemIndex % 4) * 75 + "ms");
      itemIndex += 1;
      if (revealObserver) revealObserver.observe(element);
      else element.classList.add("is-visible");
    };

    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      }, {
        threshold: 0.12,
        rootMargin: "0px 0px -5% 0px"
      });
    }

    const collectTargets = (scope) => {
      if (scope instanceof HTMLElement && scope.matches(REVEAL_TARGETS)) {
        registerTarget(scope);
      }
      if (scope.querySelectorAll) {
        scope.querySelectorAll(REVEAL_TARGETS).forEach(registerTarget);
      }
    };

    collectTargets(document);
    root.classList.add("motion-ready");

    // Projects are fetched after the initial render, so watch for their cards too.
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) collectTargets(node);
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

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
      if (revealObserver) revealObserver.disconnect();
      mutationObserver.disconnect();
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
