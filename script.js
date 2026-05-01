const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-nav]");
const paginationButtons = document.querySelectorAll("[data-pagination] button");
const brandGallery = document.querySelector("[data-brand-gallery]");
const brandCards = document.querySelectorAll("[data-brand-slide]");
const brandPagerButtons = document.querySelectorAll("[data-brand-page]");
let brandSlideTimer;
const revealTargets = [
  ".section__heading",
  ".event-card",
  ".brand-story__copy",
  ".story-card",
  ".notice__intro",
  ".feature-card",
  ".notice-item",
  ".sub-hero__content",
  ".menu-dish",
  ".price-band article",
  ".event-detail-card",
  ".store-search",
  ".store-card",
  ".brand-values__intro",
  ".brand-values__grid article",
  ".reservation-form",
  ".reservation-info article",
];

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
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
