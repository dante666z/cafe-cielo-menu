let activeCategory = "todo";
const carouselTimers = new Map();
const orderState = new Map();
const whatsappNumber = "529516134521";
let storeStatus = {
  isOpen: true,
  message: "Estamos recibiendo pedidos",
  deliveryEnabled: false,
  remoteAvailable: true,
};

function syncDeliverySelection(source) {
  const sourceSwitch = document.getElementById(source === "mobile" ? "deliverySwitchMobile" : "deliverySwitch");
  const targetSwitch = document.getElementById(source === "mobile" ? "deliverySwitch" : "deliverySwitchMobile");

  if (sourceSwitch && targetSwitch) {
    targetSwitch.checked = sourceSwitch.checked;
  }

  updateDeliveryUI();
}

function isDeliverySelected() {
  return document.getElementById("orderSheet")?.hasAttribute("hidden")
    ? Boolean(document.getElementById("deliverySwitch")?.checked)
    : Boolean(document.getElementById("deliverySwitchMobile")?.checked);
}

function updateDeliveryUI() {
  const deliverySelected = storeStatus.deliveryEnabled && isDeliverySelected();
  const copy = deliverySelected ? "Enviar a domicilio" : "Recoger en el café";
  const note = storeStatus.deliveryEnabled
    ? ""
    : "Por el momento no se cuenta con envíos a domicilio, solo para recoger en el café.";

  ["", "Mobile"].forEach((suffix) => {
    const switchInput = document.getElementById(`deliverySwitch${suffix}`);
    const copyNode = document.getElementById(`deliveryToggleCopy${suffix}`);
    const noteNode = document.getElementById(`deliveryNote${suffix}`);
    const addressLabel = document.getElementById(`customerAddress${suffix}`)?.closest(".order-field")?.querySelector("span");

    if (switchInput) {
      switchInput.disabled = !storeStatus.deliveryEnabled;
      if (!storeStatus.deliveryEnabled) {
        switchInput.checked = false;
      }
    }

    if (copyNode) {
      copyNode.textContent = copy;
    }

    if (noteNode) {
      noteNode.hidden = storeStatus.deliveryEnabled;
      noteNode.textContent = note;
    }

    if (addressLabel) {
      addressLabel.textContent = deliverySelected ? "Domicilio y referencias" : "Referencias (opcional si recogerá en el café)";
    }
  });
}

function getMexicoCityNow(timezone = "America/Mexico_City") {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const weekday = weekdayMap[parts.find((part) => part.type === "weekday")?.value] ?? 0;
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";

  return {
    weekday,
    minutes: Number(hour) * 60 + Number(minute),
  };
}

function timeStringToMinutes(value) {
  if (!value) {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function resolveStoreStatus(settings, hours) {
  const mode = settings?.operation_mode || "manual";

  if (mode === "manual") {
    return {
      isOpen: Boolean(settings?.manual_is_open),
      message: settings?.manual_message || (settings?.manual_is_open ? "Estamos recibiendo pedidos." : "Por ahora no estamos recibiendo pedidos."),
    };
  }

  const now = getMexicoCityNow(settings?.timezone || "America/Mexico_City");
  const normalizedHours = Array.isArray(hours) ? hours : [];
  const today = normalizedHours.find((entry) => Number(entry.day_of_week) === now.weekday);

  if (!today || !today.is_enabled) {
    return {
      isOpen: false,
      message: "Hoy no estamos recibiendo pedidos.",
    };
  }

  const openMinutes = timeStringToMinutes(today.open_time);
  const closeMinutes = timeStringToMinutes(today.close_time);

  if (openMinutes === null || closeMinutes === null) {
    return {
      isOpen: false,
      message: "En este momento estamos fuera de horario de servicio.",
    };
  }

  const isOpen = now.minutes >= openMinutes && now.minutes < closeMinutes;

  return {
    isOpen,
    message: isOpen ? "Estamos recibiendo pedidos." : "En este momento estamos fuera de horario de servicio.",
  };
}

function getItemKey(categoryId, itemName) {
  return `${categoryId}::${normalizeText(itemName)}`;
}

function parsePrice(price) {
  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
}

function formatCurrency(value) {
  return `$${value}`;
}

function getItemByKey(key) {
  const [categoryId, itemSlug] = key.split("::");
  const item = (menuData.items[categoryId] || []).find((entry) => normalizeText(entry.nombre) === itemSlug);
  return item ? { ...item, categoryId } : null;
}

function getOrderCount() {
  let count = 0;
  orderState.forEach((entry) => {
    count += entry.quantity;
  });
  return count;
}

function getOrderTotal() {
  let total = 0;
  orderState.forEach((entry) => {
    total += parsePrice(entry.precio) * entry.quantity;
  });
  return total;
}

function showToast(message) {
  const stack = document.getElementById("toastStack");
  if (!stack) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2200);
}

function buildOrderControls(item, categoryId, className = "card-actions") {
  const key = getItemKey(categoryId, item.nombre);
  const current = orderState.get(key)?.quantity || 0;

  if (!storeStatus.isOpen) {
    return "";
  }

  if (current > 0) {
    return `
      <div class="${className}">
        <div class="qty-pill">
          <button class="qty-btn" type="button" data-order-action="decrease" data-order-key="${key}" aria-label="Quitar una unidad">-</button>
          <span class="qty-value">${current}</span>
          <button class="qty-btn" type="button" data-order-action="increase" data-order-key="${key}" aria-label="Agregar una unidad">+</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="${className}">
      <button class="order-btn" type="button" data-order-action="add" data-order-key="${key}">
        Agregar
      </button>
    </div>
  `;
}

function syncOrderFields(sourcePrefix) {
  const sourceName = document.getElementById(sourcePrefix === "mobile" ? "customerNameMobile" : "customerName");
  const sourceAddress = document.getElementById(sourcePrefix === "mobile" ? "customerAddressMobile" : "customerAddress");
  const sourceNotes = document.getElementById(sourcePrefix === "mobile" ? "orderNotesMobile" : "orderNotes");

  const targetName = document.getElementById(sourcePrefix === "mobile" ? "customerName" : "customerNameMobile");
  const targetAddress = document.getElementById(sourcePrefix === "mobile" ? "customerAddress" : "customerAddressMobile");
  const targetNotes = document.getElementById(sourcePrefix === "mobile" ? "orderNotes" : "orderNotesMobile");

  if (sourceName && targetName) targetName.value = sourceName.value;
  if (sourceAddress && targetAddress) targetAddress.value = sourceAddress.value;
  if (sourceNotes && targetNotes) targetNotes.value = sourceNotes.value;
}

function getOrderCustomerData() {
  const isMobileOpen = !document.getElementById("orderSheet")?.hasAttribute("hidden");
  const prefix = isMobileOpen ? "Mobile" : "";
  return {
    name: document.getElementById(`customerName${prefix}`)?.value.trim() || "",
    address: document.getElementById(`customerAddress${prefix}`)?.value.trim() || "",
    notes: document.getElementById(`orderNotes${prefix}`)?.value.trim() || "",
    deliveryType: storeStatus.deliveryEnabled && isDeliverySelected() ? "delivery" : "pickup",
  };
}

function getSupabaseFallbackStatus() {
  return {
    isOpen: false,
    message: "Por el momento el menú está en modo consulta. Los pedidos en línea no están disponibles.",
    deliveryEnabled: false,
    remoteAvailable: false,
  };
}

function syncOrderDockToggleIcon() {
  const orderDock = document.getElementById("orderDock");
  const orderDockToggle = document.getElementById("orderDockToggle");
  const icon = orderDockToggle?.querySelector("i");

  if (!orderDock || !orderDockToggle || !icon) {
    return;
  }

  const isCollapsed = orderDock.classList.contains("is-collapsed");
  icon.className = `fa-solid ${isCollapsed ? "fa-chevron-up" : "fa-chevron-down"}`;
  orderDockToggle.setAttribute("aria-label", isCollapsed ? "Expandir pedido" : "Contraer pedido");
}

function buildWhatsAppMessage() {
  const customer = getOrderCustomerData();
  const lines = ["Hola, quiero hacer este pedido de Café Cielo:", ""];

  if (customer.name) {
    lines.push(`Nombre: ${customer.name}`, "");
  }

  lines.push(`Tipo de entrega: ${customer.deliveryType === "delivery" ? "Enviar a domicilio" : "Recoger en el café"}`, "");

  lines.push("Pedido:");
  orderState.forEach((entry) => {
    const subtotal = parsePrice(entry.precio) * entry.quantity;
    lines.push(`- ${entry.quantity}x ${entry.nombre} - ${formatCurrency(subtotal)}`);
  });

  if (customer.address) {
    lines.push("", customer.deliveryType === "delivery" ? "Domicilio y referencias:" : "Referencias:", customer.address);
  }

  if (customer.notes) {
    lines.push("", "Notas del pedido:", customer.notes);
  }

  lines.push("", `Total estimado: ${formatCurrency(getOrderTotal())}`);
  lines.push("", "Quedo pendiente de confirmación de existencias. Gracias.");
  return lines.join("\n");
}

function renderOrderPanels() {
  const orderItems = document.getElementById("orderItems");
  const orderItemsMobile = document.getElementById("orderItemsMobile");
  const orderEmptyState = document.getElementById("orderEmptyState");
  const orderEmptyStateMobile = document.getElementById("orderEmptyStateMobile");
  const orderTotal = document.getElementById("orderTotal");
  const orderTotalMobile = document.getElementById("orderTotalMobile");
  const orderCountPill = document.getElementById("orderCountPill");
  const mobileOrderSummary = document.getElementById("mobileOrderSummary");
  const orderDock = document.getElementById("orderDock");
  const mobileTrigger = document.getElementById("mobileOrderTrigger");
  const orderSheet = document.getElementById("orderSheet");
  const orderSheetBackdrop = document.getElementById("orderSheetBackdrop");
  const count = getOrderCount();
  const total = formatCurrency(getOrderTotal());
  const storeStatusBanner = document.getElementById("storeStatusBanner");

  const itemsMarkup = Array.from(orderState.entries())
    .map(([key, entry]) => {
      const subtotal = parsePrice(entry.precio) * entry.quantity;
      return `
        <article class="order-item">
          <img src="${getImageSrc(entry)}" alt="${entry.nombre}">
          <div class="order-item-copy">
            <h4>${entry.nombre}</h4>
            <p>${entry.desc}</p>
            <div class="order-item-meta">
              <div class="qty-pill">
                <button class="qty-btn" type="button" data-order-action="decrease" data-order-key="${key}">-</button>
                <span class="qty-value">${entry.quantity}</span>
                <button class="qty-btn" type="button" data-order-action="increase" data-order-key="${key}">+</button>
              </div>
              <strong>${formatCurrency(subtotal)}</strong>
            </div>
            <button class="remove-item-btn" type="button" data-order-action="remove" data-order-key="${key}">Quitar</button>
          </div>
        </article>
      `;
    })
    .join("");

  if (orderItems) orderItems.innerHTML = itemsMarkup;
  if (orderItemsMobile) orderItemsMobile.innerHTML = itemsMarkup;
  if (orderEmptyState) orderEmptyState.hidden = count > 0;
  if (orderEmptyStateMobile) orderEmptyStateMobile.hidden = count > 0;
  if (orderTotal) orderTotal.textContent = total;
  if (orderTotalMobile) orderTotalMobile.textContent = total;
  if (orderCountPill) orderCountPill.textContent = `${count} ${count === 1 ? "producto" : "productos"}`;
  if (mobileOrderSummary) mobileOrderSummary.textContent = `${count} • ${total}`;

  if (mobileTrigger) {
    mobileTrigger.classList.toggle("has-items", count > 0);
    mobileTrigger.hidden = !storeStatus.isOpen;
  }

  if (orderDock) {
    orderDock.hidden = !storeStatus.isOpen;
  }

  syncOrderDockToggleIcon();

  if (!storeStatus.isOpen) {
    orderSheet?.setAttribute("hidden", "");
    orderSheetBackdrop?.setAttribute("hidden", "");
    document.getElementById("body")?.classList.remove("order-sheet-open");
  }

  if (storeStatusBanner) {
    storeStatusBanner.hidden = storeStatus.isOpen && storeStatus.remoteAvailable;
    storeStatusBanner.textContent = storeStatus.message || "Por ahora no estamos recibiendo pedidos.";
  }

  document.querySelectorAll("#sendOrderBtn, #sendOrderBtnMobile").forEach((button) => {
    button.disabled = !storeStatus.isOpen;
  });

  updateDeliveryUI();
}

function updateOrder(action, key) {
  const current = orderState.get(key);
  const itemData = current || getItemByKey(key);

  if (!itemData) {
    return;
  }

  if (action === "add" || action === "increase") {
    const nextQuantity = (current?.quantity || 0) + 1;
    orderState.set(key, { ...itemData, quantity: nextQuantity });
    showToast(`${itemData.nombre} agregado al pedido`);
  }

  if (action === "decrease") {
    const nextQuantity = (current?.quantity || 0) - 1;
    if (nextQuantity <= 0) {
      orderState.delete(key);
      showToast(`${itemData.nombre} eliminado del pedido`);
    } else {
      orderState.set(key, { ...itemData, quantity: nextQuantity });
      showToast(`Cantidad actualizada: ${itemData.nombre}`);
    }
  }

  if (action === "remove") {
    orderState.delete(key);
    showToast(`${itemData.nombre} eliminado del pedido`);
  }

  renderUI();
  renderOrderPanels();
}

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
                        ${buildOrderControls(item, category.id)}
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
            ${buildOrderControls(item, activeCategory)}
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
            ${buildOrderControls(item, category.id, "stack-card-actions")}
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
            ${buildOrderControls(item, "tesLatte", "mini-card-actions")}
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
                      ${buildOrderControls(item, group.categoryId, "phone-card-actions")}
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

function setupOrderInteractions() {
  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-order-action]");
    if (actionButton) {
      updateOrder(actionButton.dataset.orderAction, actionButton.dataset.orderKey);
      return;
    }

    if (event.target.closest("#mobileOrderTrigger")) {
      document.getElementById("orderSheet")?.removeAttribute("hidden");
      document.getElementById("orderSheetBackdrop")?.removeAttribute("hidden");
      document.getElementById("body")?.classList.add("order-sheet-open");
      return;
    }

    if (event.target.closest("#orderSheetClose") || event.target.closest("#orderSheetBackdrop")) {
      document.getElementById("orderSheet")?.setAttribute("hidden", "");
      document.getElementById("orderSheetBackdrop")?.setAttribute("hidden", "");
      document.getElementById("body")?.classList.remove("order-sheet-open");
      return;
    }

    if (event.target.closest("#orderDockToggle")) {
      document.getElementById("orderDock")?.classList.toggle("is-collapsed");
      syncOrderDockToggleIcon();
    }
  });

  ["", "Mobile"].forEach((suffix) => {
    document.getElementById(`customerName${suffix}`)?.addEventListener("input", () => syncOrderFields(suffix ? "mobile" : "desktop"));
    document.getElementById(`customerAddress${suffix}`)?.addEventListener("input", () => syncOrderFields(suffix ? "mobile" : "desktop"));
    document.getElementById(`orderNotes${suffix}`)?.addEventListener("input", () => syncOrderFields(suffix ? "mobile" : "desktop"));
    document.getElementById(`sendOrderBtn${suffix}`)?.addEventListener("click", handleSendOrder);
  });

  document.getElementById("deliverySwitch")?.addEventListener("change", () => syncDeliverySelection("desktop"));
  document.getElementById("deliverySwitchMobile")?.addEventListener("change", () => syncDeliverySelection("mobile"));
}

async function handleSendOrder() {
  if (!storeStatus.isOpen) {
    if (window.Swal) {
      await Swal.fire({
        icon: "info",
        title: "Pedidos deshabilitados",
        text: storeStatus.message || "Por ahora no estamos recibiendo pedidos.",
        confirmButtonText: "Entendido",
      });
    }
    return;
  }

  if (!orderState.size) {
    if (window.Swal) {
      await Swal.fire({
        icon: "info",
        title: "Tu pedido está vacío",
        text: "Agrega al menos un producto antes de enviar tu mensaje por WhatsApp.",
        confirmButtonText: "Entendido",
      });
    }
    return;
  }

  const customer = getOrderCustomerData();

  const addressRequired = customer.deliveryType === "delivery";

  if (!customer.name || (addressRequired && !customer.address)) {
    if (window.Swal) {
      await Swal.fire({
        icon: "info",
        title: "Faltan datos del pedido",
        text: addressRequired
          ? "Nombre y domicilio con referencias son obligatorios para envío a domicilio."
          : "Nombre es obligatorio antes de enviar tu pedido por WhatsApp.",
        confirmButtonText: "Entendido",
      });
    }
    return;
  }

  const result = window.Swal
    ? await Swal.fire({
        icon: "warning",
        title: "Antes de enviar tu pedido",
        html: "Tu pedido está sujeto a existencias.<br>Por favor reconfirma disponibilidad, tiempos y detalles al enviar tu mensaje por WhatsApp.",
        confirmButtonText: "Continuar a WhatsApp",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        reverseButtons: true,
      })
    : { isConfirmed: window.confirm("Tu pedido está sujeto a existencias. ¿Deseas continuar a WhatsApp?") };

  if (!result.isConfirmed) {
    return;
  }

  const message = encodeURIComponent(buildWhatsAppMessage());
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener");
}

async function loadStoreStatus() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    storeStatus = getSupabaseFallbackStatus();
    renderUI();
    renderOrderPanels();
    return;
  }

  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("operation_mode, manual_is_open, manual_message, timezone, delivery_enabled")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      throw error || new Error("No se pudo leer store_settings");
    }

    const { data: hoursData, error: hoursError } = await supabase
      .from("store_hours")
      .select("day_of_week, is_enabled, open_time, close_time")
      .order("day_of_week", { ascending: true });

    if (hoursError) {
      throw hoursError;
    }

    if (!data) {
      storeStatus = {
        isOpen: true,
        message: "Estamos recibiendo pedidos",
        deliveryEnabled: false,
        remoteAvailable: true,
      };
    } else {
      storeStatus = resolveStoreStatus(data, Array.isArray(hoursData) ? hoursData : []);
      storeStatus.deliveryEnabled = Boolean(data.delivery_enabled);
      storeStatus.remoteAvailable = true;
    }
  } catch (error) {
    storeStatus = getSupabaseFallbackStatus();
  }

  renderUI();
  renderOrderPanels();
}

renderUI();
renderOrderPanels();
setupThemeToggle();
setupMobileNav();
setupCategoryDrag();
setupOrderInteractions();
loadStoreStatus();

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});
