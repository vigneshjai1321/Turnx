const body = document.body;
const loader = document.getElementById("loader");
const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");
const menuOverlay = document.getElementById("menuOverlay");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const scrollTopBtn = document.getElementById("scrollTopBtn");

const interactiveSelector = "a, button, .accordion-trigger";

function hideLoader() {
  if (!loader) {
    body.classList.remove("is-loading");
    return;
  }

  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    body.classList.remove("is-loading");
  }, 650);
}

function toggleHeaderOnScroll() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("scrolled", window.scrollY > 32);
}

function toggleScrollTopButton() {
  if (!scrollTopBtn) return;
  scrollTopBtn.classList.toggle("is-visible", window.scrollY > 260);
}

function openMenu() {
  if (!menuToggle || !primaryNav || !menuOverlay) return;
  menuToggle.classList.add("is-active");
  menuToggle.setAttribute("aria-expanded", "true");
  primaryNav.classList.add("is-open");
  menuOverlay.classList.add("is-open");
  body.classList.add("menu-open");
}

function closeMenu() {
  if (!menuToggle || !primaryNav || !menuOverlay) return;
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  primaryNav.classList.remove("is-open");
  menuOverlay.classList.remove("is-open");
  body.classList.remove("menu-open");
}

function setupMobileMenu() {
  if (!menuToggle || !primaryNav || !menuOverlay) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.contains("is-active");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuOverlay.addEventListener("click", closeMenu);

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 960) {
      closeMenu();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function setupRevealOnScroll() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      if (!item) return;

      const currentlyOpen = item.classList.contains("is-open");

      triggers.forEach((otherTrigger) => {
        const otherItem = otherTrigger.closest(".accordion-item");
        if (!otherItem) return;
        otherItem.classList.remove("is-open");
        otherTrigger.setAttribute("aria-expanded", "false");
      });

      if (!currentlyOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function setupCursor() {
  if (!cursorDot || !cursorRing || window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener("mousemove", (event) => {
    dotX = event.clientX;
    dotY = event.clientY;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
  });

  function animateRing() {
    ringX += (dotX - ringX) * 0.2;
    ringY += (dotY - ringY) * 0.2;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }

  animateRing();

  const interactiveElements = document.querySelectorAll(interactiveSelector);
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorRing.classList.add("is-hover");
      if (el.tagName.toLowerCase() === "a") {
        cursorDot.classList.add("is-link");
      }
    });

    el.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("is-hover");
      cursorDot.classList.remove("is-link");
    });
  });
}

function setupScrollTopButton() {
  if (!scrollTopBtn) return;

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function setupClickBubbles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const bubbleLayer = document.createElement("div");
  bubbleLayer.className = "click-bubble-layer";
  bubbleLayer.setAttribute("aria-hidden", "true");
  body.appendChild(bubbleLayer);

  const skipTargets =
    "a, button, input, textarea, select, label, summary, [role='button'], .menu-toggle, .accordion-trigger, .floating-btn, .nav";

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.target instanceof Element && event.target.closest(skipTargets)) return;

      const bubble = document.createElement("span");
      bubble.className = "click-bubble";
      bubble.style.left = `${event.clientX}px`;
      bubble.style.top = `${event.clientY}px`;
      bubble.style.setProperty("--bubble-size", `${Math.floor(52 + Math.random() * 28)}px`);
      bubbleLayer.appendChild(bubble);

      bubble.addEventListener("animationend", () => bubble.remove(), { once: true });
    },
    { passive: true },
  );
}

function forcePageTopOnLoad() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);
  window.setTimeout(() => window.scrollTo(0, 0), 0);
}

window.addEventListener("scroll", toggleHeaderOnScroll, { passive: true });
window.addEventListener("scroll", toggleScrollTopButton, { passive: true });
window.addEventListener("load", hideLoader);
window.addEventListener("load", forcePageTopOnLoad);
window.addEventListener("beforeunload", () => window.scrollTo(0, 0));

toggleHeaderOnScroll();
toggleScrollTopButton();
setupMobileMenu();
setupRevealOnScroll();
setupAccordion();
setupCursor();
setupScrollTopButton();
setupClickBubbles();
