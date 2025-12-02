// js/service-detail-data.js

document.addEventListener("DOMContentLoaded", () => {
  // 1) Берём slug из URL: service-detail.html?slug=dental
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    console.warn("Нет slug в URL (?slug=...). Страница останется с дефолтным текстом.");
    return;
  }

  const API_URL = `http://127.0.0.1:8000/api/services/${encodeURIComponent(slug)}/`;

  // 2) Находим элементы на странице по data-атрибутам
  const elCategory   = document.querySelector("[data-sd-category]");
  const elTitleMain  = document.querySelector("[data-sd-title-main]");
  const elLead       = document.querySelector("[data-sd-lead]");
  const elTagsWrap   = document.querySelector("[data-sd-tags]");
  const elDuration   = document.querySelector("[data-sd-duration]");
  const elPrice      = document.querySelector("[data-sd-price]");
  const elDoctorBox  = document.querySelector("[data-sd-doctor]");
  const elNoteBox    = document.querySelector("[data-sd-note-block]");

  // 3) Тянем данные из Django API
  fetch(API_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Service data:", data);

      // Ожидаем примерно такую структуру:
      // {
      //   "slug": "dental",
      //   "title": "...",
      //   "category_name": "Стоматология",
      //   "short_intro": "...",
      //   "duration": "30–40 минут",
      //   "price_from": 350000,
      //   "tags": ["Взрослые", "Дети"],
      //   "doctor_name": "...",
      //   "doctor_role": "...",
      //   "doctor_experience": "...",
      //   "doctor_note": "...",
      //   "note": "Важно приходить натощак..." (или похожее поле)
      // }

      // Категория (пилюля)
      if (elCategory) {
        elCategory.textContent =
          data.category_name || data.category || "Направление";
      }

      // Название услуги
      if (elTitleMain && (data.title || data.name)) {
        elTitleMain.textContent = data.title || data.name;
      }

      // Краткое описание / lead
      if (elLead && (data.short_intro || data.lead || data.subtitle)) {
        elLead.textContent =
          data.short_intro || data.lead || data.subtitle;
      }

      // Длительность
      if (elDuration && data.duration) {
        elDuration.textContent = data.duration;
      }

      // Цена
      if (elPrice) {
        if (data.price_from !== null && data.price_from !== undefined) {
          const num = Number(data.price_from);
          const formatted = isNaN(num)
            ? data.price_from
            : num.toLocaleString("ru-RU");
          elPrice.textContent = `от ${formatted} сум`;
        } else {
          elPrice.textContent = "Стоимость уточняйте у администратора";
        }
      }

      // Теги
      if (elTagsWrap) {
        elTagsWrap.innerHTML = "";
        let tags = [];

        if (Array.isArray(data.tags)) {
          tags = data.tags;
        } else if (typeof data.tags === "string" && data.tags.trim() !== "") {
          tags = data.tags.split(",").map((t) => t.trim());
        }

        tags.forEach((tag) => {
          if (!tag) return;
          const span = document.createElement("span");
          span.className = "sd-tag";
          span.textContent = tag;
          elTagsWrap.appendChild(span);
        });
      }

      // Карточка врача (правая колонка)
      if (elDoctorBox) {
        // Если в API есть отдельное поле doctor (объект) — можно его тоже поддержать
        const doctorObj = data.doctor || null;

        const doctorName =
          (doctorObj && doctorObj.name) || data.doctor_name || "";
        const doctorRole =
          (doctorObj && doctorObj.role) || data.doctor_role || "";
        const doctorExp =
          (doctorObj && doctorObj.experience) || data.doctor_experience || "";
        const doctorExtra = data.doctor_note || "";

        // Если вообще нет доктора — можно скрыть блок
        if (!doctorName && !doctorRole && !doctorExp && !doctorExtra) {
          elDoctorBox.style.display = "none";
        } else {
          elDoctorBox.innerHTML = `
            <h4>Ведущий специалист</h4>
            ${
              doctorName
                ? `<div class="sd-doctor__name">${doctorName}</div>`
                : ""
            }
            ${
              doctorRole
                ? `<div class="sd-doctor__role">${doctorRole}</div>`
                : ""
            }
            ${
              doctorExp
                ? `<div class="sd-doctor__exp">${doctorExp}</div>`
                : ""
            }
            ${
              doctorExtra
                ? `<div class="sd-doctor__note">${doctorExtra}</div>`
                : ""
            }
          `;
        }
      }

      // Заметка врача / важное примечание
      if (elNoteBox) {
        const note =
          data.note ||
          data.patient_note ||
          data.prep_note ||
          data.important_note;

        if (!note) {
          elNoteBox.style.display = "none";
        } else {
          elNoteBox.innerHTML = `
            <h4>Важно перед приёмом</h4>
            <p>${note}</p>
          `;
        }
      }

      // Авто-подстановка названия услуги в поле "Услуга" модалки
      const modalServiceInput = document.querySelector("#bk-service");
      if (modalServiceInput && (data.title || data.name)) {
        modalServiceInput.value = data.title || data.name;
      }
    })
    .catch((err) => {
      console.error("Ошибка загрузки данных услуги:", err);
      // Можно мягко подсказать пользователю
      if (elTitleMain) {
        elTitleMain.textContent = "Услуга временно недоступна";
      }
      if (elLead) {
        elLead.textContent =
          "К сожалению, не удалось загрузить данные услуги. Попробуйте обновить страницу или свяжитесь с администратором клиники.";
      }
    });
});
