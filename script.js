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
  ".benefit-card",
  ".membership-ladder__intro",
  ".membership-ladder__tiers article",
  ".benefit-cta",
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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  },
);

revealElements.forEach((element) => revealObserver.observe(element));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initGsapMotion = () => {
  if (prefersReducedMotion || !window.gsap) {
    return;
  }

  const gsap = window.gsap;
  const scrollTrigger = window.ScrollTrigger;

  if (scrollTrigger) {
    gsap.registerPlugin(scrollTrigger);
  }

  document.documentElement.classList.add("has-gsap");
  revealElements.forEach((element) => element.classList.add("is-visible"));

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .from(".site-header", { y: -22, opacity: 0, duration: 0.7 })
    .from(".hero-copy > *", { y: 38, opacity: 0, duration: 0.72, stagger: 0.08 }, "-=0.34")
    .from(".hero-pagination", { x: 26, opacity: 0, duration: 0.65 }, "-=0.42")
    .from(".scroll-indicator", { y: -10, opacity: 0, duration: 0.55 }, "-=0.28");

  if (scrollTrigger) {
    gsap.utils.toArray(".section__heading--modern, .benefit-teaser, .notice").forEach((element) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
        },
        y: 36,
        opacity: 0,
        duration: 0.78,
        ease: "power3.out",
      });
    });

    gsap.utils.toArray(".visit-flow__grid, .event-grid, .signature-menu__list").forEach((group) => {
      const items = group.children;

      gsap.from(items, {
        scrollTrigger: {
          trigger: group,
          start: "top 78%",
        },
        y: 42,
        opacity: 0,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
      });
    });

    gsap.to(".hero", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      backgroundPosition: "center 58%",
      ease: "none",
    });

    gsap.utils.toArray(".event-card--visual img, .signature-menu__media img").forEach((image) => {
      gsap.fromTo(
        image,
        { scale: 1.04 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          ease: "none",
        },
      );
    });
  }
};

window.addEventListener("load", initGsapMotion);
