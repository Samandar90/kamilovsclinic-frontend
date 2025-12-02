// js/service-detail-data.js

document.addEventListener("DOMContentLoaded", () => {
  // 1) Берём slug из URL: service-detail.html?slug=dental
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || "dental";

  const API_URL = `http://127.0.0.1:8000/api/services/${encodeURIComponent(
    slug
  )}/`;

  // 2) Элементы на странице
  const elCategory = document.querySelector("[data-sd-category]");
  const elTitleMain = document.querySelector("[data-sd-title-main]");
  const elLead = document.querySelector("[data-sd-lead]");
  const elTagsWrap = document.querySelector("[data-sd-tags]");
  const elDuration = document.querySelector("[data-sd-duration]");
  const elPrice = document.querySelector("[data-sd-price]");
  const elDoctorBox = document.querySelector("[data-sd-doctor]");
  const elNoteBox = document.querySelector("[data-sd-note-block]");

  // поле услуги в модалке (у тебя id нет, возьмём по name)
  const modalServiceInput = document.querySelector(
    '.kc-modal input[name="service"]'
  );

  // ===== ЛОКАЛЬНЫЕ ПЕРЕВОДЫ ДЛЯ УСЛУГ (UZ) =====
  const LOCAL_UZ = {
    // пример для стоматологии
    dental: {
      category: "Stomatologiya",
      title: "Stomatologiya",
      lead:
        "Kattalar va bolalar uchun zamonaviy stomatologiya — ortiqcha og‘riq va stresssiz davolash.",
      tags: ["Kariesni davolash", "Gigiyena va oqartirish", "Tabassum estetikasi"],
      duration: "30–60 minut",
      // priceFrom берём из API, здесь только хвост текста
      priceLabel: "so‘mdan",

      doctor: {
        heading: "Qabulni olib boradi",
        name: "Emil Yang",
        role: "Stomatolog",
        experience: "8 yildan ortiq tajriba",
        desc:
          "Estetik va terapevtik stomatologiyada ixtisoslashgan, davolashdan qo‘rqadigan bemorlar bilan ham ehtiyotkor ishlaydi.",
        linkText: "Barcha stomatologlarni ko‘rish",
      },

      note: {
        title: "Qabuldan oldin muhim",
        text:
          "Agar oldingi suratlar yoki tibbiy xulosalar bo‘lsa, ularni o‘zingiz bilan oling — bu davolashni aniqroq rejalashtirishga yordam beradi.",
      },
    },
    // сюда потом добавишь neurology / cardiology и т.д.
  };

  // здесь будет лежать ответ API
  let serviceData = null;

  function getCurrentLang() {
    return localStorage.getItem("kc-lang") || "ru";
  }

  // ===== РЕНДЕР УСЛУГИ ПО ЯЗЫКУ =====
  function renderService(lang) {
    if (!serviceData) return;

    const uz = LOCAL_UZ[slug] || null;

    // ---- Категория ----
    let category =
      serviceData.category_name ||
      serviceData.category ||
      (lang === "uz" ? "Yo‘nalish" : "Направление");

    if (lang === "uz" && uz && uz.category) {
      category = uz.category;
    }
    if (elCategory) elCategory.textContent = category;

    // ---- Название услуги ----
    let title = serviceData.title || serviceData.name || "";
    if (lang === "uz" && uz && uz.title) {
      title = uz.title;
    }
    if (elTitleMain) elTitleMain.textContent = title;

    // ---- Краткое описание ----
    let lead =
      serviceData.short_intro ||
      serviceData.lead ||
      serviceData.subtitle ||
      "";
    if (lang === "uz" && uz && uz.lead) {
      lead = uz.lead;
    }
    if (elLead) elLead.textContent = lead;

    // ---- Длительность ----
    let duration = serviceData.duration || "";
    if (lang === "uz" && uz && uz.duration) {
      duration = uz.duration;
    }
    if (elDuration && duration) elDuration.textContent = duration;

    // ---- Цена ----
    if (elPrice) {
      if (
        serviceData.price_from !== null &&
        serviceData.price_from !== undefined
      ) {
        const num = Number(serviceData.price_from);
        const formatted = isNaN(num)
          ? serviceData.price_from
          : num.toLocaleString("ru-RU");

        let priceText;
        if (lang === "uz") {
          // если хочешь фиксированный текст — можно заменить строкой ниже
          priceText =
            (uz && uz.priceText) || `${formatted} ${(uz && uz.priceLabel) || "so‘mdan"}`;
        } else {
          priceText = `от ${formatted} сум`;
        }
        elPrice.textContent = priceText;
      } else {
        elPrice.textContent =
          lang === "uz"
            ? "Narxni administratorimizdan aniqlashtiring"
            : "Стоимость уточняйте у администратора";
      }
    }

    // ---- Теги ----
    if (elTagsWrap) {
      elTagsWrap.innerHTML = "";
      let tags = [];

      if (lang === "uz" && uz && Array.isArray(uz.tags)) {
        tags = uz.tags;
      } else {
        // из API: tags: ["...", "..."] или "a, b, c"
        let raw = serviceData.tags;
        if (Array.isArray(raw)) {
          tags = raw;
        } else if (typeof raw === "string" && raw.trim() !== "") {
          tags = raw.split(",").map((t) => t.trim());
        }
      }

      tags.forEach((tag) => {
        if (!tag) return;
        const span = document.createElement("span");
        span.className = "sd-tag";
        span.textContent = tag;
        elTagsWrap.appendChild(span);
      });
    }

    // ---- Блок врача ----
    if (elDoctorBox) {
      const doctorObj = serviceData.doctor || null;

      let doctorName =
        (doctorObj && doctorObj.name) || serviceData.doctor_name || "";
      let doctorRole =
        (doctorObj && doctorObj.role) || serviceData.doctor_role || "";
      let doctorExp =
        (doctorObj && doctorObj.experience) ||
        serviceData.doctor_experience ||
        "";
      let doctorExtra = serviceData.doctor_note || "";

      let doctorHeading =
        lang === "uz" ? "Qabulni olib boradi" : "Ведущий специалист";
      let doctorLinkText =
        lang === "uz" ? "Barcha shifokorlarni ko‘rish" : "Посмотреть всех врачей";

      if (lang === "uz" && uz && uz.doctor) {
        if (uz.doctor.name) doctorName = uz.doctor.name;
        if (uz.doctor.role) doctorRole = uz.doctor.role;
        if (uz.doctor.experience) doctorExp = uz.doctor.experience;
        if (uz.doctor.desc) doctorExtra = uz.doctor.desc;
        if (uz.doctor.heading) doctorHeading = uz.doctor.heading;
        if (uz.doctor.linkText) doctorLinkText = uz.doctor.linkText;
      }

      if (!doctorName && !doctorRole && !doctorExp && !doctorExtra) {
        elDoctorBox.style.display = "none";
      } else {
        elDoctorBox.style.display = "";
        elDoctorBox.innerHTML = `
          <h4>${doctorHeading}</h4>
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
            doctorExp ? `<div class="sd-doctor__exp">${doctorExp}</div>` : ""
          }
          ${
            doctorExtra
              ? `<p class="sd-doctor__note">${doctorExtra}</p>`
              : ""
          }
          <a href="doctors.html" class="sd-doctor__link">${doctorLinkText}</a>
        `;
      }
    }

    // ---- Важно перед приёмом ----
    if (elNoteBox) {
      let note =
        serviceData.note ||
        serviceData.patient_note ||
        serviceData.prep_note ||
        serviceData.important_note ||
        "";

      let noteTitle =
        lang === "uz" ? "Qabuldan oldin muhim" : "Важно перед приёмом";

      if (lang === "uz" && uz && uz.note) {
        if (uz.note.text) note = uz.note.text;
        if (uz.note.title) noteTitle = uz.note.title;
      }

      if (!note) {
        elNoteBox.style.display = "none";
      } else {
        elNoteBox.style.display = "";
        elNoteBox.innerHTML = `
          <h4>${noteTitle}</h4>
          <p>${note}</p>
        `;
      }
    }

    // ---- Подставляем название услуги в модалку ----
    if (modalServiceInput && title) {
      modalServiceInput.value = title;
    }
  }

  // ===== ЗАПРОС К API ОДИН РАЗ =====
  fetch(API_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Service data:", data);
      serviceData = data;

      // первый рендер по текущему языку
      renderService(getCurrentLang());

      // подписываемся на переключение языка (кнопки RU / UZ)
      document.querySelectorAll(".kc-lang-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const lang = btn.getAttribute("data-lang") || "ru";
          renderService(lang);
        });
      });
    })
    .catch((err) => {
      console.error("Ошибка загрузки данных услуги:", err);
      if (elTitleMain) {
        elTitleMain.textContent = "Услуга временно недоступна";
      }
      if (elLead) {
        elLead.textContent =
          "К сожалению, не удалось загрузить данные услуги. Попробуйте обновить страницу или свяжитесь с администратором клиники.";
      }
    });
});
