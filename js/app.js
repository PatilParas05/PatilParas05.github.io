/* Portfolio UI — all interactive behavior in one file */

if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

/* --- Theme (dark / light) --- */
(function initTheme() {
  const stored = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
}

/* --- Preloader --- */
document.addEventListener("DOMContentLoaded", () => {
  const minimumDisplayTime = new Promise((resolve) => setTimeout(resolve, 1000));
  const pageHasLoaded = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve);
  });

  Promise.all([pageHasLoaded, minimumDisplayTime]).then(() => {
    const loader = document.getElementById("loading-screen");
    if (!loader) return;

    loader.classList.add("elements-out", "fade-out");
    document.body.classList.add("hero-start");

    loader.addEventListener("transitionend", (e) => {
      if (e.target === loader && e.propertyName === "opacity") {
        loader.remove();
      }
    });
  });

  /* Theme toggle */
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  /* Mobile nav */
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.querySelector(".navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", (event) => {
      navbar.classList.toggle("active");
      menuToggle.classList.toggle("open");
      event.stopPropagation();
    });

    document.addEventListener("click", (event) => {
      if (navbar.classList.contains("active") && !navbar.contains(event.target)) {
        navbar.classList.remove("active");
        menuToggle.classList.remove("open");
      }
    });
  }

  /* Role ticker */
  initTicker();

  /* Daily quote */
  initDailyQuote();

  /* Scroll animations */
  initScrollObserver();

  /* Bento parallax tilt (lightweight) */
  initParallaxCards();
});

window.addEventListener("beforeunload", () => window.scrollTo(0, 0));

/* --- Ticker --- */
function initTicker() {
  const track = document.getElementById("ticker-track");
  if (!track) return;

  const totalItems = track.children.length;
  const tickerRestDuration = 75;
  const slideDuration = 200;
  const tickerSpeed = tickerRestDuration + slideDuration;
  let tickerIndex = 0;
  let timeoutId = null;

  function playTicker() {
    tickerIndex++;

    requestAnimationFrame(() => {
      track.style.transition = `transform ${slideDuration / 1000}s cubic-bezier(0.25, 1, 0.5, 1)`;
      track.style.transform = `translateY(-${tickerIndex * (100 / totalItems)}%)`;
    });

    let nextDelay = tickerSpeed;
    const checkIndex = tickerIndex % (totalItems - 1);
    if (track.children[checkIndex]?.classList.contains("ticker-item-gold")) {
      nextDelay = 5000;
    }

    if (tickerIndex === totalItems - 1) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          track.style.transition = "none";
          tickerIndex = 0;
          track.style.transform = "translateY(0%)";
        });
      }, slideDuration);
    }

    timeoutId = setTimeout(playTicker, nextDelay);
  }

  function start() {
    timeoutId = setTimeout(playTicker, 1200);
  }

  if (document.body.classList.contains("hero-start")) {
    start();
  } else {
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("hero-start")) {
        start();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { attributes: true });
  }

  return () => clearTimeout(timeoutId);
}

/* --- Daily quote --- */
function initDailyQuote() {
  const quotes = [
    "Trying to be someone else is a waste of the person you are.",
    "All we have to decide is what to do with the time that is given us.",
    "How strange it is to be anything at all.",
    "Nothing matters — so take a paper and paint something badly.",
    "Be kind to yourself. It's going to be okay.",
    "If you've survived till now, take this as a sign. Live a little.",
    "Build something you wish existed.",
    "The story must go on.",
  ];

  const el = document.getElementById("daily-quote-text");
  if (!el) return;

  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }

  el.textContent = `"${quotes[Math.abs(hash) % quotes.length]}"`;
}

/* --- Scroll observer --- */
function initScrollObserver() {
  const standardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );

  const asciiObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30% 0px" }
  );

  document
    .querySelectorAll(
      ".project-heading-text, .project-card-link, .project-btn-wrapper, .blog-heading-text, .blog-single-link, .blog-btn-wrapper, .info-heading-text, .info-lede, .info-card, .info-btn-wrapper"
    )
    .forEach((el) => standardObserver.observe(el));

  document
    .querySelectorAll(".ascii-leaf-parent-container, .ascii-leaves-parent-container")
    .forEach((el) => asciiObserver.observe(el));
}

/* --- Simple parallax tilt on bento cards --- */
function initParallaxCards() {
  const cards = document.querySelectorAll(".parallax-card");
  if (!cards.length || window.matchMedia("(pointer: coarse)").matches) return;

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.zIndex = "10";
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.zIndex = "";
    });
  });
}