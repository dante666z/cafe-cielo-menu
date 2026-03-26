function getProductImage(categoryId, item) {
  const fallback = fallbackImageMap[categoryId] || "latte.png";
  return `img/productos/${item.img || fallback}`;
}

function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.getElementById("body");

  if (!themeToggle || !body) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("theme-dark");
    body.classList.toggle("theme-light");
  });
}

function getPrintableCategories() {
  return menuData.categories.filter((category) => category.id !== "todo");
}

function buildPrintableMenu() {
  const container = document.getElementById("printMenuGrid");

  container.innerHTML = getPrintableCategories()
    .map((category) => {
      const items = menuData.items[category.id] || [];

      return `
        <section class="print-category" id="categoria-${category.id}">
          <div class="card-header">
            <div class="card-hero">
              <div class="hero-copy">
                <h3>Café Cielo</h3>
              </div>
              <div class="hero-qr">
                <img src="img/QR-cafe-cielo.png" alt="QR del menú de Café Cielo">
              </div>
              <div class="hero-brand">
                <img class="brand-logo-light" src="img/logo-cafe-cielo-light.svg" alt="Logo de Café Cielo">
                <img class="brand-logo-dark" src="img/logo-cafe-cielo-dark.svg" alt="Logo de Café Cielo">
              </div>
            </div>
            <section class="info-strip">
              <div>
                <strong>Ubicación</strong>
                <span>San Dionisio Ocotepec</span>
              </div>
              <div>
                <strong>Pedidos</strong>
                <span>WhatsApp 951 613 4521</span>
              </div>
              <div>
                <strong>Nota</strong>
                <span>Las imágenes son ilustrativas.</span>
              </div>
            </section>
          </div>
          <div class="category-head">
            <div class="category-title-wrap">
              <span class="category-icon">${category.icon}</span>
              <div>
                <h2>${category.title}</h2>
                <span class="item-count">${items.length} productos</span>
              </div>
            </div>
          </div>
          <div class="product-list">
            ${items
              .map(
                (item) => `
                  <article class="print-item">
                    <img src="${getProductImage(category.id, item)}" alt="${item.nombre}" loading="lazy">
                    <div class="item-copy">
                      <h3>${item.nombre}</h3>
                      <p>${item.desc}</p>
                    </div>
                    <div class="item-price">${item.precio}</div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

buildPrintableMenu();
setupThemeToggle();
