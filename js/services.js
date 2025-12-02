// services.js
// Каталог услуг: загрузка из /data/services.json, поиск и фильтр по категории

(function () {
  let services = [];
  let filtered = [];

  document.addEventListener("clinic:partialsReady", initServices);

  function initServices() {
    const listEl = document.getElementById("servicesList");
    const searchInput = document.getElementById("servicesSearch");
    const categorySelect = document.getElementById("servicesCategory");

    if (!listEl || !searchInput || !categorySelect) return;

    fetch("data/services.json")
      .then((res) => res.json())
      .then((data) => {
        services = Array.isArray(data) ? data : [];
        filtered = services;
        render();
      })
      .catch((err) => {
        console.error(err);
        listEl.textContent = "Не удалось загрузить список услуг.";
      });

    searchInput.addEventListener("input", () => {
      applyFilters();
      render();
    });

    categorySelect.addEventListener("change", () => {
      applyFilters();
      render();
    });

    function applyFilters() {
      const q = searchInput.value.trim().toLowerCase();
      const cat = categorySelect.value;

      filtered = services.filter((s) => {
        const matchCat = cat ? s.category === cat : true;
        const inName = s.name.toLowerCase().includes(q);
        const inShort = (s.short || "").toLowerCase().includes(q);
        return matchCat && (inName || inShort);
      });
    }

    function render() {
      if (!filtered.length) {
        listEl.innerHTML = `<p class="services-empty">Ничего не найдено. Попробуйте изменить фильтры.</p>`;
        return;
      }

      listEl.innerHTML = filtered
        .map(
          (s) => `
          <article class="service-card glass-card">
            <div class="service-card__body">
              <h2 class="service-card__title">${s.name}</h2>
              <p class="service-card__meta">
                <span>${mapCategory(s.category)}</span>
                ${
                  s.duration
                    ? `<span>⏱ ${s.duration}</span>`
                    : ""
                }
              </p>
              <p class="service-card__short">${s.short || ""}</p>
            </div>
            <div class="service-card__footer">
              <p class="service-card__price">
                <span>${formatPrice(s.price)}</span>
              </p>
              <button
                type="button"
                class="btn btn-primary service-card__btn"
                data-booking-open
                data-service="${s.id}"
              >
                Записаться
              </button>
            </div>
          </article>
        `
        )
        .join("");

      // Кнопки "Записаться" после перерендера — снова привязываем к модалке
      const event = new CustomEvent("clinic:partialsReady");
      document.dispatchEvent(event);
    }
  }

  function mapCategory(cat) {
    switch (cat) {
      case "therapy":
        return "Терапия";
      case "cardiology":
        return "Кардиология";
      case "pediatrics":
        return "Педиатрия";
      case "diagnostics":
        return "Диагностика";
      default:
        return "Услуга";
    }
  }

  function formatPrice(value) {
    if (typeof value !== "number") return "";
    return value.toLocaleString("ru-RU") + " сум";
  }
})();
