/* Scroll-reveal animation for the About / Experience / Education /
   Activities sections. Kept separate from app.js since this only
   applies to the newly added content sections. */

   document.addEventListener("DOMContentLoaded", () => {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
  
    const revealTargets = document.querySelectorAll(
      [
        ".section-kicker",
        ".section-heading",
        ".about-photo-frame",
        ".about-content > *",
        ".timeline-item",
        ".education-item",
        ".activity-card",
      ].join(", ")
    );
  
    revealTargets.forEach((el, index) => {
      // Small stagger within each parent block so items don't all pop at once.
      el.style.transitionDelay = `${(index % 6) * 0.08}s`;
      revealObserver.observe(el);
    });
  });