const menuToggle = document.querySelector("[data-menu-toggle]");
const menuToggleLabel = menuToggle?.querySelector(".sr-only");
const siteNav = document.querySelector("[data-nav]");
const paginationButtons = document.querySelectorAll("[data-pagination] button");
const brandGallery = document.querySelector("[data-brand-gallery]");
const brandCards = document.querySelectorAll("[data-brand-slide]");
const brandPagerButtons = document.querySelectorAll("[data-brand-page]");
const noticeToggleButtons = document.querySelectorAll("[data-notice-toggle]");
const reservationForm = document.querySelector("[data-reservation-form]");
const reservationMessage = document.querySelector("[data-reservation-message]");
const familySite = document.querySelector("[data-family-site]");
const familyToggle = document.querySelector("[data-family-toggle]");
const familyMenu = document.querySelector("[data-family-menu]");
const familyCurrent = document.querySelector("[data-family-current]");
const familyOptions = document.querySelectorAll("[data-family-option]");
let brandSlideTimer;
const revealTargets = [
  ".section__heading",
  ".event-card",
  ".flow-card",
  ".signature-menu__media",
  ".signature-menu__copy",
  ".brand-story__copy",
  ".story-card",
  ".notice__intro",
  ".feature-card",
  ".notice-item",
  ".sub-hero__content",
  ".menu-dish",
  ".price-band article",
  ".event-detail-card",
  ".membership-ladder__intro",
  ".membership-ladder__tiers article",
  ".store-search",
  ".store-card",
  ".brand-values__intro",
  ".brand-values__grid article",
  ".reservation-form",
  ".reservation-info article",
];

if (menuToggle && siteNav) {
  const setMenuState = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    siteNav.classList.toggle("is-open", isOpen);

    if (menuToggleLabel) {
      menuToggleLabel.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
    }
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isExpanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });
}

paginationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.target);

    paginationButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

const sectionButtons = Array.from(paginationButtons).filter((button) => button.dataset.target);
const sections = sectionButtons
  .map((button) => document.querySelector(button.dataset.target))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) {
      return;
    }

    sectionButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.target === `#${visibleEntry.target.id}`,
      );
    });
  },
  {
    threshold: [0.34, 0.5, 0.66],
  },
);

sections.forEach((section) => sectionObserver.observe(section));

const getActiveBrandPage = () =>
  Array.from(brandPagerButtons).find((button) => button.classList.contains("is-active"))
    ?.dataset.brandPage ?? "0";

const setBrandSlide = (page) => {
  if (!brandGallery || !brandCards.length) {
    return;
  }

  brandGallery.classList.add("is-changing");

  window.setTimeout(() => {
    brandCards.forEach((card) => {
      const isVisible = card.dataset.brandSlide === page;
      card.hidden = !isVisible;
      card.classList.toggle("is-visible", isVisible);
    });

    brandPagerButtons.forEach((button) => {
      const isActive = button.dataset.brandPage === page;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", String(isActive));
    });

    brandGallery.classList.remove("is-changing");
  }, 180);
};

const startBrandAutoSlide = () => {
  if (brandPagerButtons.length < 2) {
    return;
  }

  window.clearInterval(brandSlideTimer);
  brandSlideTimer = window.setInterval(() => {
    const pages = Array.from(brandPagerButtons).map((button) => button.dataset.brandPage);
    const activeIndex = pages.indexOf(getActiveBrandPage());
    const nextPage = pages[(activeIndex + 1) % pages.length];
    setBrandSlide(nextPage);
  }, 7000);
};

brandPagerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setBrandSlide(button.dataset.brandPage);
    startBrandAutoSlide();
  });
});

startBrandAutoSlide();

noticeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const noticeItem = button.closest(".notice-item");
    const detail = noticeItem?.querySelector(".notice-item__detail");

    if (!noticeItem || !detail) {
      return;
    }

    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.setAttribute("aria-label", isExpanded ? "공지 펼치기" : "공지 접기");
    button.textContent = isExpanded ? "+" : "−";
    noticeItem.classList.toggle("is-open", !isExpanded);
    detail.hidden = isExpanded;
  });
});

if (reservationForm && reservationMessage) {
  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    reservationMessage.hidden = false;
    reservationMessage.focus?.();
  });
}

if (familySite && familyToggle && familyMenu && familyCurrent) {
  const setFamilyMenuState = (isOpen) => {
    familyToggle.setAttribute("aria-expanded", String(isOpen));
    familyMenu.hidden = !isOpen;
    familySite.classList.toggle("is-open", isOpen);
  };

  familyToggle.addEventListener("click", () => {
    const isExpanded = familyToggle.getAttribute("aria-expanded") === "true";
    setFamilyMenuState(!isExpanded);
  });

  familyOptions.forEach((option) => {
    option.addEventListener("click", () => {
      familyCurrent.textContent = option.textContent;
      familyOptions.forEach((item) => item.setAttribute("aria-selected", "false"));
      option.setAttribute("aria-selected", "true");
      setFamilyMenuState(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!familySite.contains(event.target)) {
      setFamilyMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setFamilyMenuState(false);
    }
  });
}

const revealElements = revealTargets.flatMap((selector) =>
  Array.from(document.querySelectorAll(selector)),
);

revealElements.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${Math.min(index * 60, 240)}ms`);
});

const showReveal = (element) => {
  element.classList.add("is-visible");
  revealObserver.unobserve(element);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        showReveal(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  },
);

revealElements.forEach((element) => revealObserver.observe(element));

// Safety net: the IntersectionObserver can miss elements that are skipped over by
// an instant anchor jump (the pagination dots and SCROLL cue jump to #event/#brand).
// On every scroll/resize/load, reveal anything already at or above the viewport so
// nothing can stay stuck invisible regardless of how the user moves through the page.
const revealElementsInView = () => {
  const triggerLine = window.innerHeight * 0.92;
  revealElements.forEach((element) => {
    if (element.classList.contains("is-visible")) {
      return;
    }
    if (element.getBoundingClientRect().top < triggerLine) {
      showReveal(element);
    }
  });
};

let revealFrame = 0;
const scheduleRevealCheck = () => {
  if (revealFrame) {
    return;
  }
  revealFrame = window.requestAnimationFrame(() => {
    revealFrame = 0;
    revealElementsInView();
  });
};

window.addEventListener("scroll", scheduleRevealCheck, { passive: true });
window.addEventListener("resize", scheduleRevealCheck, { passive: true });
window.addEventListener("load", revealElementsInView);
// Browsers pause CSS transitions on background tabs, so an element marked while
// hidden can sit in its pre-reveal state. Re-check once the tab becomes visible.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    revealElementsInView();
  }
});
revealElementsInView();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Solidify the header once the page is scrolled past the hero top.
const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("site-header--solid", window.scrollY > 24);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

// GSAP is a progressive enhancement layer only. Content visibility is owned by
// the CSS reveal + IntersectionObserver above, so a missing/blocked GSAP CDN can
// never leave content stuck invisible. Two rules keep it safe:
//  - intro animations are TIME-based (a .from timeline always plays to its end),
//    never scroll-gated, so nothing can freeze in its hidden start state;
//  - scroll effects only ever drive parallax/decoration, never opacity of copy.
const gsapReady = !prefersReducedMotion && !!window.gsap;

// Hero intro choreography. Run synchronously (script is at end of <body>, so the
// hero markup and GSAP are already parsed) and add `has-gsap` before first paint
// so the CSS fallback keyframes stand down — avoiding a double-animation flash.
if (gsapReady) {
  const gsap = window.gsap;
  document.documentElement.classList.add("has-gsap");

  gsap
    .timeline({
      defaults: { ease: "power3.out" },
      // Strip the inline styles once played so nothing lingers in a hidden state
      // and later hover/transition styles are unaffected.
      onComplete() {
        gsap.set(".hero-copy > *, .hero-pagination, .scroll-indicator", { clearProps: "all" });
      },
    })
    .from(".hero-copy > *", { y: 42, opacity: 0, duration: 0.85, stagger: 0.09 })
    .from(".hero-pagination", { x: 28, opacity: 0, duration: 0.6 }, "-=0.5")
    .from(".scroll-indicator", { y: -12, opacity: 0, duration: 0.55 }, "-=0.35");
}

// Scroll-driven effects need final layout, so wait for load (and image decode).
const initScrollEffects = () => {
  const gsap = window.gsap;
  const scrollTrigger = window.ScrollTrigger;

  if (!gsapReady || !scrollTrigger) {
    return;
  }

  gsap.registerPlugin(scrollTrigger);

  // Depth: full-bleed cover backgrounds drift/scale gently as they scroll past.
  // Content imagery is intentionally NOT scaled — upscaling a raster image softens
  // and crops it, so event/signature/brand photos stay pixel-crisp.
  gsap.to(".hero__image", {
    yPercent: 8,
    scale: 1.05,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  gsap.to(".brand-story__backdrop img", {
    yPercent: 12,
    scale: 1.06,
    ease: "none",
    scrollTrigger: { trigger: ".brand-story", start: "top bottom", end: "bottom top", scrub: true },
  });

  // Thin scroll-progress bar across the very top of the page.
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);
  gsap.to(progressBar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      scrub: 0.3,
    },
  });

  // Recompute trigger positions once the heavy hero imagery has settled.
  window.setTimeout(() => scrollTrigger.refresh(), 400);
};

window.addEventListener("load", initScrollEffects);
