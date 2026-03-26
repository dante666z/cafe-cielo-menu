let activeCategory = "todo";
const carouselTimers = new Map();

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getImageSrc(item) {
  return `img/productos/${item.img}`;
}

function applyImageFallback(image, categoryId) {
  const fallback = fallbackImageMap[categoryId] || "latte.png";
  image.addEventListener(
    "error",
    () => {
      image.src = `img/productos/${fallback}`;
    },
    { once: true }
  );
}

function getPrimaryItems(categoryId) {
  return menuData.items[categoryId];
}

function getDisplayCategories() {
  return menuData.categories.filter((category) => category.id !== "todo");
}

function getSecondaryItems(categoryId) {
  const fallback = categoryId === "frias" ? "casa" : "frias";
  return {
    category: menuData.categories.find((item) => item.id === fallback),
    items: menuData.items[fallback].slice(0, 4),
  };
}

function getFeaturedItems() {
  return featuredSelections
    .map((selection) => {
      const item = menuData.items[selection.categoryId].find(
        (entry) => normalizeText(entry.nombre) === normalizeText(selection.itemName)
      );

      if (!item) {
        return null;
      }

      return {
        ...item,
        categoryId: selection.categoryId,
        badge: selection.badge || item.badge || "Recomendado",
      };
    })
    .filter(Boolean);
}

function renderCategories() {
  const strip = document.getElementById("categoryStrip");
  const phoneCategories = document.getElementById("phoneCategories");

  strip.innerHTML = menuData.categories
    .map(
      (category) => `
        <button
          class="cat-btn ${category.id === activeCategory ? "is-active" : ""}"
          type="button"
          data-category="${category.id}"
          role="tab"
          aria-selected="${category.id === activeCategory}"
        >
          <span class="cat-btn-icon">${category.icon}</span>
          <span>${category.label}</span>
        </button>
      `
    )
    .join("");

  phoneCategories.innerHTML = menuData.categories
    .map(
      (category) => `
        <button class="phone-cat ${category.id === activeCategory ? "is-active" : ""}" type="button" data-category="${category.id}">
          <div>${category.icon}</div>
          <span>${category.label}</span>
        </button>
      `
    )
    .join("");
}

function renderPrimarySection() {
  const primaryGrid = document.getElementById("primaryGrid");
  const primaryTitle = document.getElementById("primaryTitle");
  const primaryIcon = document.getElementById("primaryIcon");

  if (activeCategory === "todo") {
    primaryGrid.classList.add("all-grid-mode");
    primaryTitle.textContent = "Todo el Menu";
    primaryIcon.textContent = "\u2728";

    primaryGrid.innerHTML = getDisplayCategories()
      .map((category) => {
        const items = menuData.items[category.id];
        return `
          <section class="all-category-block is-visible">
            <div class="section-head section-head-inline">
              <div class="section-title-wrap">
                <span class="section-icon">${category.icon}</span>
                <h3>${category.title}</h3>
              </div>
              <span class="section-dots" aria-hidden="true">...</span>
            </div>
            <div class="card-grid">
              ${items
                .map(
                  (item) => `
                    <article class="product-card is-visible">
                      <div class="product-card-media">
                        <img src="${getImageSrc(item)}" alt="${item.nombre}" data-fallback-category="${category.id}">
                      </div>
                      <div class="product-card-content">
                        <h4>${item.nombre}</h4>
                        <p>${item.desc}</p>
                        <div class="card-meta">
                          <span class="card-price">${item.precio}</span>
                          ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ""}
                        </div>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>
          </section>
        `;
      })
      .join("");
    return;
  }

  primaryGrid.classList.remove("all-grid-mode");
  const category = menuData.categories.find((item) => item.id === activeCategory);
  const items = getPrimaryItems(activeCategory);

  primaryTitle.textContent = category.title;
  primaryIcon.textContent = category.icon;

  primaryGrid.innerHTML = items
    .map(
      (item, index) => `
        <article class="product-card reveal" style="transition-delay:${index * 90}ms">
          <div class="product-card-media">
            <img src="${getImageSrc(item)}" alt="${item.nombre}" data-fallback-category="${activeCategory}">
          </div>
          <div class="product-card-content">
            <h4>${item.nombre}</h4>
            <p>${item.desc}</p>
            <div class="card-meta">
              <span class="card-price">${item.precio}</span>
              ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ""}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderSecondarySection() {
  const { category, items } = getSecondaryItems(activeCategory);
  const container = document.getElementById("secondaryList");

  document.getElementById("secondaryTitle").textContent = category.title;
  document.getElementById("secondaryIcon").textContent = category.icon;

  container.innerHTML = items
    .map(
      (item) => `
        <article class="stack-card">
          <img src="${getImageSrc(item)}" alt="${item.nombre}" data-fallback-category="${category.id}">
          <div>
            <h4>${item.nombre}</h4>
            <p>${item.desc}</p>
          </div>
          <div class="stack-card-price">${item.precio}</div>
        </article>
      `
    )
    .join("");

  const teaList = document.getElementById("teaList");
  teaList.innerHTML = menuData.items.tesLatte
    .slice(0, 3)
    .map(
      (item) => `
        <article class="mini-card">
          <img src="${getImageSrc(item)}" alt="${item.nombre}" data-fallback-category="tesLatte">
          <div>
            <strong>${item.nombre}</strong>
            <p>${item.desc}</p>
          </div>
          <strong>${item.precio}</strong>
        </article>
      `
    )
    .join("");
}

function renderPhonePreview() {
  const phoneSections = document.getElementById("phoneSections");
  const sectionGroups =
    activeCategory === "todo"
      ? getDisplayCategories().map((category) => ({
          title: category.title,
          icon: category.icon,
          items: menuData.items[category.id],
          categoryId: category.id,
        }))
      : (() => {
          const activeCategoryData = menuData.categories.find((item) => item.id === activeCategory);
          return [
            {
              title: activeCategoryData.title,
              icon: activeCategoryData.icon,
              items: menuData.items[activeCategory],
              categoryId: activeCategory,
            },
          ];
        })();

  phoneSections.innerHTML = sectionGroups
    .map(
      (group) => `
        <section id="phone-section-${group.categoryId}" data-phone-section="${group.categoryId}">
          <div class="phone-section-title">
            <h4>${group.icon} ${group.title}</h4>
            <span>...</span>
          </div>
          <div class="phone-stack phone-stack-featured">
            ${group.items
              .map(
                (item) => `
                  <article class="phone-featured-card">
                    <div class="phone-featured-media">
                      <img src="${getImageSrc(item)}" alt="${item.nombre}" data-fallback-category="${group.categoryId}">
                    </div>
                    <div class="phone-featured-content">
                      <h4>${item.nombre}</h4>
                      <p>${item.desc}</p>
                      <div class="phone-price-pill">${item.precio}</div>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function scrollToCategoryTarget() {
  const mobileView = window.matchMedia("(max-width: 900px)").matches;

  if (!mobileView) {
    const desktopSection = document.getElementById("section-primary");
    desktopSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const targetId = activeCategory === "todo" ? "mobileExperience" : `phone-section-${activeCategory}`;
  const menuSection = document.getElementById(targetId);
  menuSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildFeaturedSlide(item, className) {
  return `
    <article class="${className}">
      <div class="${className.includes("phone") ? "phone-featured-media" : "featured-media"}">
        <span class="tag">${item.badge}</span>
        <img src="${getImageSrc(item)}" alt="${item.nombre}" data-fallback-category="${item.categoryId}">
      </div>
      <div class="${className.includes("phone") ? "phone-featured-content" : "featured-content"}">
        <div class="tag tag-inline">${item.badge}</div>
        <h4>${item.nombre}</h4>
        <p>${item.desc}</p>
        <div class="${className.includes("phone") ? "phone-price-pill" : "price-pill"}">${item.precio}</div>
      </div>
    </article>
  `;
}

function setupCarousel(trackId, dotsId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const dots = document.getElementById(dotsId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);

  if (!track || !dots || !prev || !next) {
    return;
  }

  if (carouselTimers.has(trackId)) {
    window.clearInterval(carouselTimers.get(trackId));
    carouselTimers.delete(trackId);
  }

  const slides = Array.from(track.children);
  if (!slides.length) {
    dots.innerHTML = "";
    prev.disabled = true;
    next.disabled = true;
    return;
  }

  let activeIndex = 0;
  let autoplayPaused = false;

  function goToSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    const targetSlide = slides[activeIndex];
    track.scrollTo({ left: targetSlide.offsetLeft, behavior: "smooth" });
    Array.from(dots.children).forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
  }

  function startAutoplay() {
    const autoplayId = window.setInterval(() => {
      if (autoplayPaused || document.hidden) {
        return;
      }

      goToSlide(activeIndex + 1);
    }, 4200);

    carouselTimers.set(trackId, autoplayId);
  }

  function pauseAutoplay() {
    autoplayPaused = true;
  }

  function resumeAutoplay() {
    autoplayPaused = false;
  }

  dots.innerHTML = slides
    .map(
      (_, index) => `
        <button
          class="carousel-dot ${index === 0 ? "is-active" : ""}"
          type="button"
          aria-label="Ir al recomendado ${index + 1}"
          aria-current="${index === 0 ? "true" : "false"}"
          data-index="${index}"
        ></button>
      `
    )
    .join("");

  dots.querySelectorAll("[data-index]").forEach((dot) => {
    dot.onclick = () => {
      goToSlide(Number(dot.dataset.index));
    };
  });

  prev.onclick = () => {
    goToSlide(activeIndex - 1);
  };

  next.onclick = () => {
    goToSlide(activeIndex + 1);
  };

  track.onscroll = () => {
    const slideWidth = slides[0].offsetWidth + 16;
    const nextIndex = Math.round(track.scrollLeft / slideWidth);
    if (nextIndex !== activeIndex && nextIndex >= 0 && nextIndex < slides.length) {
      activeIndex = nextIndex;
      Array.from(dots.children).forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
        dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
      });
    }
  };

  track.onmouseenter = pauseAutoplay;
  track.onmouseleave = resumeAutoplay;
  track.onpointerdown = pauseAutoplay;
  track.onpointerup = resumeAutoplay;
  track.onpointerleave = resumeAutoplay;
  track.onpointercancel = resumeAutoplay;
  prev.onmouseenter = pauseAutoplay;
  prev.onmouseleave = resumeAutoplay;
  next.onmouseenter = pauseAutoplay;
  next.onmouseleave = resumeAutoplay;
  dots.onmouseenter = pauseAutoplay;
  dots.onmouseleave = resumeAutoplay;

  startAutoplay();
}

function bindCategoryEvents() {
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderUI();
      scrollToCategoryTarget();
    });
  });
}

function activateReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });
}

function wireImageFallbacks() {
  document.querySelectorAll("img[data-fallback-category]").forEach((image) => {
    applyImageFallback(image, image.dataset.fallbackCategory);
  });
}

function renderFeatured() {
  const featuredItems = getFeaturedItems();
  const featuredTrack = document.getElementById("featuredTrack");
  const phoneFeaturedTrack = document.getElementById("phoneFeaturedTrack");

  if (!featuredTrack || !phoneFeaturedTrack) {
    return;
  }

  featuredTrack.innerHTML = featuredItems.map((item) => buildFeaturedSlide(item, "featured-card")).join("");
  phoneFeaturedTrack.innerHTML = featuredItems.map((item) => buildFeaturedSlide(item, "phone-featured-card")).join("");

  setupCarousel("featuredTrack", "featuredDots", "featuredPrev", "featuredNext");
  setupCarousel("phoneFeaturedTrack", "phoneFeaturedDots", "phoneFeaturedPrev", "phoneFeaturedNext");
}

function renderUI() {
  renderCategories();
  renderFeatured();
  renderPrimarySection();
  renderSecondarySection();
  renderPhonePreview();
  wireImageFallbacks();
  bindCategoryEvents();
  document.querySelectorAll(".topbar, .hero, .menu-layout, .featured, .menu-section, .all-category-block, .phone-preview, .info-panel, .contact-panel").forEach((element) => {
    element.classList.add("is-visible");
  });
  activateReveal();
}

function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.getElementById("body");

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("theme-dark");
    body.classList.toggle("theme-light");
  });
}

function setupMobileNav() {
  const hamburgerToggle = document.getElementById("hamburgerToggle");
  const mobileNav = document.getElementById("mobileNav");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!hamburgerToggle || !mobileNav) {
    return;
  }

  hamburgerToggle.addEventListener("click", () => {
    const isOpen = !mobileNav.hasAttribute("hidden");
    if (isOpen) {
      mobileNav.setAttribute("hidden", "");
      hamburgerToggle.classList.remove("is-open");
      hamburgerToggle.setAttribute("aria-expanded", "false");
      return;
    }

    mobileNav.removeAttribute("hidden");
    hamburgerToggle.classList.add("is-open");
    hamburgerToggle.setAttribute("aria-expanded", "true");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.setAttribute("hidden", "");
      hamburgerToggle.classList.remove("is-open");
      hamburgerToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupCategoryDrag() {
  const strip = document.getElementById("categoryStrip");
  if (!strip) {
    return;
  }

  let isPointerDown = false;
  let hasDragged = false;
  let startX = 0;
  let startScrollLeft = 0;

  strip.addEventListener("pointerdown", (event) => {
    isPointerDown = true;
    hasDragged = false;
    startX = event.clientX;
    startScrollLeft = strip.scrollLeft;
  });

  strip.addEventListener("pointermove", (event) => {
    if (!isPointerDown) {
      return;
    }

    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) > 6) {
      hasDragged = true;
      strip.classList.add("is-dragging");
    }
    strip.scrollLeft = startScrollLeft - deltaX;
  });

  const stopDragging = () => {
    if (!isPointerDown) {
      return;
    }

    isPointerDown = false;
    strip.classList.remove("is-dragging");
  };

  strip.addEventListener("pointerup", stopDragging);
  strip.addEventListener("pointercancel", stopDragging);
  strip.addEventListener("pointerleave", stopDragging);

  strip.addEventListener(
    "click",
    (event) => {
      if (!hasDragged) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      hasDragged = false;
    },
    true
  );
}

renderUI();
setupThemeToggle();
setupMobileNav();
setupCategoryDrag();

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});
