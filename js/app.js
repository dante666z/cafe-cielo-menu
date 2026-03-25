const fallbackImageMap = {
  calientes: "capuchino.png",
  tesLatte: "latte.png",
  tes: "abuela.png",
  frias: "espresso.png",
  casa: "latte.png",
  comida: "americano.png",
};

const featuredSelections = [
  { categoryId: "casa", itemName: "Latte Dulce Corazon", badge: "Popular" },
  { categoryId: "frias", itemName: "Frappe Oreo", badge: "Favorito" },
  { categoryId: "calientes", itemName: "Moka Latte", badge: "Imperdible" },
];

const menuData = {
  categories: [
    { id: "todo", label: "Todo", icon: "\u2728", title: "Todo el Menu" },
    { id: "calientes", label: "Calientes", icon: "\u2615", title: "Bebidas Calientes" },
    { id: "frias", label: "Frias", icon: "\ud83e\uddca", title: "Bebidas Frias" },
    { id: "casa", label: "De la casa", icon: "\u2b50", title: "Bebidas de la Casa" },
    { id: "tes", label: "Tes", icon: "\ud83c\udf75", title: "Tes" },
    { id: "tesLatte", label: "Tes latte", icon: "\ud83c\udf75", title: "Tes Latte" },
    { id: "comida", label: "Comida", icon: "\ud83c\udf7d", title: "Comida" },
  ],
  items: {
    calientes: [
      { nombre: "Espresso", desc: "Sencillo $30 / Doble $35", precio: "$30 - $35", img: "espresso.png" },
      { nombre: "Americano", desc: "Cl\u00e1sico", precio: "$45 - $50", img: "americano.png" },
      { nombre: "Caf\u00e9 de la Abuela", desc: "Receta tradicional", precio: "$45", img: "abuela.png" },
      { nombre: "Capuchino", desc: "Espresso, leche y espuma", precio: "$55 - $60", img: "capuchino.png" },
      { nombre: "Latte Original", desc: "Espresso y leche", precio: "$55 - $60", img: "latte.png" },
      { nombre: "Latte Vainilla", desc: "Espresso, leche y vainilla", precio: "$55 - $60", img: "latte-vainilla.png" },
      { nombre: "Latte Caramelo", desc: "Espresso, leche y caramelo", precio: "$55 - $60", img: "latte-caramelo.png" },
      { nombre: "Moka Latte", desc: "Espresso, leche y chocolate", precio: "$55 - $60", img: "moka.png" },
    ],
    tesLatte: [
      { nombre: "Masala Chai Latte", desc: "T\u00e9 chai, leche y vainilla", precio: "$65", img: "chai.png" },
      { nombre: "Moroccan Mint Latte", desc: "T\u00e9 de menta, leche y vainilla", precio: "$65", img: "mint.png" },
      { nombre: "Earl Gray Latte", desc: "T\u00e9 negro, leche y vainilla", precio: "$65", img: "earl.png" },
    ],
    tes: [
      { nombre: "Hibiscus", desc: "T\u00e9 caliente", precio: "$45", img: "hibiscus.png" },
      { nombre: "Earl Gray", desc: "T\u00e9 cl\u00e1sico", precio: "$45", img: "earl-te.png" },
      { nombre: "Moroccan Mint", desc: "T\u00e9 de menta", precio: "$45", img: "mint-te.png" },
      { nombre: "Cranberry Spice", desc: "T\u00e9 especiado", precio: "$45", img: "cranberry.png" },
      { nombre: "Sencha", desc: "T\u00e9 verde", precio: "$45", img: "sencha.png" },
      { nombre: "Rooibos", desc: "T\u00e9 africano", precio: "$45", img: "rooibos.png" },
      { nombre: "Yerba Mate", desc: "Tradicional", precio: "$45", img: "mate.png" },
      { nombre: "Jasmine Green", desc: "T\u00e9 verde jazm\u00edn", precio: "$45", img: "jasmine.png" },
    ],
    frias: [
      { nombre: "Frappe Vainilla", desc: "Espresso, leche y chantilly", precio: "$60 - $65", img: "frappe-vainilla.png" },
      { nombre: "Frappe Dulce Caramelo", desc: "Caramelo, espresso y leche", precio: "$60 - $65", img: "frappe-caramelo.png" },
      { nombre: "Frappe Moka", desc: "Chocolate, espresso y leche", precio: "$60 - $65", img: "frappe-moka.png" },
      { nombre: "Frappe Oreo", desc: "Galleta oreo, leche y chantilly", precio: "$60 - $65", img: "frappe-oreo.png" },
      { nombre: "Latte Fr\u00edo Original", desc: "Caf\u00e9 y leche sobre hielo", precio: "$60", img: "latte-frio.png" },
      { nombre: "Latte Fr\u00edo Vainilla", desc: "Con vainilla", precio: "$60", img: "latte-vainilla-frio.png" },
      { nombre: "Latte Fr\u00edo Caramelo", desc: "Con caramelo", precio: "$60", img: "latte-caramelo-frio.png" },
      { nombre: "Latte Fr\u00edo Moka", desc: "Con chocolate", precio: "$60", img: "latte-moka-frio.png" },
      { nombre: "Americano Fr\u00edo", desc: "Caf\u00e9 sobre hielo", precio: "$60", img: "americano-frio.png" },
      { nombre: "Matcha Ice Latte", desc: "Matcha, vainilla y leche", precio: "$60", img: "matcha.png" },
      { nombre: "Smoothie Fresa y Pl\u00e1tano", desc: "Natural", precio: "$65", img: "smoothie-fresa.png" },
      { nombre: "Smoothie Pi\u00f1a y Mango", desc: "Refrescante", precio: "$65", img: "smoothie-mango.png" },
    ],
    casa: [
      { nombre: "Latte Dulce Coraz\u00f3n", desc: "Espresso, leche y leche condensada", precio: "$60", img: "latte-corazon-1.png", badge: "Popular" },
      { nombre: "Moka Zapoteco", desc: "Chocolate de la casa + mezcal", precio: "$60", img: "zapoteco.png" },
      { nombre: "Espresso Polar", desc: "Espresso doble con crema", precio: "$60", img: "polar.png" },
      { nombre: "Bubble Twister", desc: "Agua mineral, espresso y lim\u00f3n", precio: "$60", img: "bubble.png" },
      { nombre: "Caribe Coco", desc: "Crema de coco, espresso y leche", precio: "$60", img: "coco.png" },
    ],
    comida: [
      { nombre: "Leandrini Panini", desc: "Pollo, jalape\u00f1o, queso y verduras", precio: "$100", img: "panini-leandrini.png" },
      { nombre: "Panini Chipotle", desc: "Pollo, chipotle y queso", precio: "$100", img: "panini-chipotle.png" },
      { nombre: "Panini Pesto", desc: "Pollo, pesto y queso", precio: "$100", img: "panini-pesto.png" },
      { nombre: "Quesadilla", desc: "Pollo, frijoles, queso y salsas", precio: "$90", img: "quesadilla.png" },
      { nombre: "Crepa Cielo", desc: "Manzana caramelizada", precio: "$65", img: "crepa-cielo.png" },
      { nombre: "Crepa Moka Moka", desc: "Chocolate y pl\u00e1tano", precio: "$65", img: "crepa-moka.png" },
      { nombre: "Crepa Queso Crema", desc: "Fresa o zarzamora", precio: "$55", img: "crepa-queso.png" },
      { nombre: "Crepa Cl\u00e1sica", desc: "Pl\u00e1tano, fresa y nutella", precio: "$65", img: "crepa-clasica.png" },
      { nombre: "Crepa Personalizada", desc: "Endulzante a elegir", precio: "$65", img: "crepa-personalizada.png" },
      { nombre: "Crepa Salada Jam\u00f3n", desc: "Queso manchego y jam\u00f3n", precio: "$65", img: "crepa-jamon.png" },
      { nombre: "Crepa Champi\u00f1ones Jam\u00f3n", desc: "Queso y champi\u00f1ones", precio: "$65", img: "crepa-champ.png" },
      { nombre: "Crepa Champi\u00f1ones Salchicha", desc: "Queso y salchicha", precio: "$65", img: "crepa-salchicha.png" },
      { nombre: "Crepa Pepperoni", desc: "Queso y pepperoni", precio: "$65", img: "crepa-pepperoni.png" },
      { nombre: "Hotdog XL", desc: "Con verduras, aderezos y chile tatemado", precio: "$65", img: "hotdog.png" },
    ],
  },
};

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
        <section>
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
      const mobileView = window.matchMedia("(max-width: 900px)").matches;
      const targetId = mobileView ? "mobileExperience" : "section-primary";
      const menuSection = document.getElementById(targetId);
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
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
