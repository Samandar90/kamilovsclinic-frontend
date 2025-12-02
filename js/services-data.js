// js/services-data.js

document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.querySelector("#kc-services-list");
  if (!listEl) return;

  const API_URL = "http://127.0.0.1:8000/api/services/";

  fetch(API_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error("API error " + res.status);
      }
      return res.json();
    })
    .then((services) => {
      listEl.innerHTML = "";

      services.forEach((svc) => {
        const priceText =
          svc.price_from !== null && svc.price_from !== undefined
            ? "от " +
              Number(svc.price_from).toLocaleString("ru-RU") +
              " сум"
            : "Стоимость уточняйте";

        // создаём карточку в том же стиле, что у тебя
        const card = document.createElement("article");
        card.className = "sn-service-card";
        card.innerHTML = `
          <div class="sn-service-card__inner">
            <span class="sn-service-card__pill">
              ${svc.category_name || "Направление"}
            </span>

            <h3 class="sn-service-card__title">${svc.title}</h3>

            <p class="sn-service-card__text">
              ${svc.short_intro || ""}
            </p>

            <div class="sn-service-card__bottom">
              <div class="sn-service-card__price">${priceText}</div>

              <div class="sn-service-card__actions">
                <button
                  class="kc-btn kc-btn--ghost"
                  type="button"
                  onclick="kcOpenModal('${svc.title.replace(/'/g, "\\'")}')"
                >
                  Записаться
                </button>

                <a
                  class="kc-btn kc-btn--outline"
                  href="service-detail.html?slug=${encodeURIComponent(
                    svc.slug
                  )}"
                >
                  Подробнее
                </a>
              </div>
            </div>
          </div>
        `;

        listEl.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Ошибка загрузки списка услуг:", err);
      listEl.innerHTML =
        '<p style="color:#64748b;">Не удалось загрузить список услуг. Попробуйте обновить страницу или позвоните администратору.</p>';
    });
});
