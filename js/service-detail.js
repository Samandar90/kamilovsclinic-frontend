// js/service-detail.js

// 1) Данные по услугам
const KC_SERVICES = {
  dental: {
    slug: "dental",
    category: "Стоматология",
    title: "Стоматология",
    lead:
      "Современная стоматология для взрослых и детей — бережное лечение без боли и лишнего стресса.",
    tags: ["Лечение кариеса", "Гигиена и отбеливание", "Эстетика улыбки"],
    duration: "30–60 минут",
    priceFrom: "от 280 000 сум",

    doctor: {
      label: "ВЕДЁТ ПРИЁМ",
      name: "Эмиль Янг",
      role: "Стоматолог",
      exp: "Более 8 лет опыта",
      note:
        "Специализируется на эстетической и терапевтической стоматологии, аккуратно работает с пациентами, которые боятся лечения.",
      linkText: "Посмотреть всех стоматологов",
      linkHref: "doctors.html"
    },

    noteBlock: {
      title: "Важно перед визитом",
      text:
        "Если есть предыдущие снимки или выписки, возьмите их с собой — это поможет точнее спланировать лечение."
    },

    about: {
      title: "Как проходит приём у стоматолога",
      text:
        "На первичной консультации врач выслушает ваши жалобы, проведёт осмотр и при необходимости сделает снимки. Затем врач объяснит состояние зубов простым языком, предложит несколько вариантов лечения и примерный план по этапам."
    },

    steps: [
      "Осмотр и диагностика, при необходимости — рентген.",
      "Подробное обсуждение с пациентом, выбор подходящего плана лечения.",
      "Проведение запланированных процедур с контролем боли и комфорта.",
      "Рекомендации по уходу и, при необходимости, план дальнейших визитов."
    ],

    indications: {
      title: "Когда стоит записаться",
      list: [
        "Ноющая или резкая боль в зубах, чувствительность к холодному/горячему.",
        "Наличие тёмных пятен, сколов или трещин на зубах.",
        "Неприятный запах изо рта, кровоточивость дёсен.",
        "Давно не были на профилактическом осмотре (более 6–12 месяцев)."
      ]
    },

    benefits: [
      {
        title: "Комфорт и обезболивание",
        text:
          "Применяем современные анестетики и мягкие техники — все процедуры максимально комфортны для пациента."
      },
      {
        title: "Поэтапный план лечения",
        text:
          "Вы заранее знаете, какие шаги предстоят, сколько визитов потребуется и какая будет итоговая стоимость."
      },
      {
        title: "Эстетический результат",
        text:
          "Мы уделяем внимание не только здоровью зубов, но и красоте улыбки — подбираем оттенки и форму пломб/реставраций."
      }
    ],

    faq: [
      {
        q: "Больно ли лечить зубы?",
        a:
          "Мы используем современные анестетики, поэтому лечение проходит комфортно. Если вы сильно переживаете, скажите врачу — он подберёт мягкий протокол."
      },
      {
        q: "Сколько длится приём?",
        a:
          "В среднем от 30 до 60 минут, в зависимости от сложности лечения. Некоторые процедуры можно разделить на несколько коротких визитов."
      },
      {
        q: "Можно ли совместить консультацию и лечение?",
        a:
          "Да, во многих случаях диагностика и лечение проводятся в один день — администратор подскажет варианты при записи."
      }
    ],

    ctaText:
      "Укажите удобное время и опишите ваш запрос — администратор предложит ближайшие слоты и врача."
  }

  // сюда потом добавишь cardio, neuro и т.д. по этому же шаблону
};

// 2) Инициализация страницы
(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || "dental";
  const data = KC_SERVICES[slug];

  if (!data) {
    // если slug неизвестный — покажем сообщение
    const main = document.querySelector(".sd-hero__main");
    if (main) {
      main.innerHTML =
        "<h1 class='sd-title'>Услуга не найдена</h1>" +
        "<p class='sd-subtitle'>Проверьте ссылку или вернитесь к списку услуг.</p>" +
        "<div style='margin-top:16px;'>" +
        "<a class='sd-btn sd-btn--primary' href='services.html'>Все услуги клиники</a>" +
        "</div>";
    }
    document.querySelectorAll("[data-sd-title]").forEach((el) => {
      el.textContent = "Услуга не найдена";
    });
    return;
  }

  // Заголовки / категория
  document.querySelectorAll("[data-sd-title]").forEach((el) => {
    el.textContent = data.title;
  });

  const titleMain = document.querySelector("[data-sd-title-main]");
  if (titleMain) titleMain.textContent = data.title;

  const catEl = document.querySelector("[data-sd-category]");
  if (catEl) catEl.textContent = data.category;

  const leadEl = document.querySelector("[data-sd-lead]");
  if (leadEl) leadEl.textContent = data.lead;

  // Теги
  const tagsWrap = document.querySelector("[data-sd-tags]");
  if (tagsWrap) {
    tagsWrap.innerHTML = "";
    if (Array.isArray(data.tags)) {
      data.tags.forEach((t) => {
        const span = document.createElement("span");
        span.className = "sd-tag";
        span.textContent = t;
        tagsWrap.appendChild(span);
      });
    }
  }

  // Мета
  const durEl = document.querySelector("[data-sd-duration]");
  if (durEl) durEl.textContent = data.duration;

  const priceEl = document.querySelector("[data-sd-price]");
  if (priceEl) priceEl.textContent = data.priceFrom;

  // Блок врача
  const doctorBox = document.querySelector("[data-sd-doctor]");
  if (doctorBox && data.doctor) {
    doctorBox.innerHTML = `
      <h4>${data.doctor.label || "ВЕДЁТ ПРИЁМ"}</h4>
      <div class="sd-doctor__name">${data.doctor.name}</div>
      <div class="sd-doctor__role">${data.doctor.role || ""}</div>
      <div class="sd-doctor__exp">${data.doctor.exp || ""}</div>
      <p class="sd-doctor__note">${data.doctor.note || ""}</p>
      ${
        data.doctor.linkHref
          ? `<a class="sd-doctor__link" href="${data.doctor.linkHref}">${data.doctor.linkText ||
              "Посмотреть всех врачей"}</a>`
          : ""
      }
    `;
  }

  // Заметка сбоку
  const noteBox = document.querySelector("[data-sd-note-block]");
  if (noteBox && data.noteBlock) {
    noteBox.innerHTML = `
      <h4>${data.noteBlock.title}</h4>
      <p>${data.noteBlock.text}</p>
    `;
  }

  // Описание + шаги
  const aboutWrap = document.querySelector("[data-sd-about]");
  if (aboutWrap) {
    aboutWrap.innerHTML = "";
    if (data.about) {
      const h2 = document.createElement("h2");
      h2.className = "sd-h2";
      h2.textContent = data.about.title;
      const p = document.createElement("p");
      p.className = "sd-text";
      p.textContent = data.about.text;
      aboutWrap.appendChild(h2);
      aboutWrap.appendChild(p);
    }

    if (Array.isArray(data.steps) && data.steps.length) {
      const h3 = document.createElement("h3");
      h3.className = "sd-h3";
      h3.textContent = "Этапы приёма";
      const ul = document.createElement("ul");
      ul.className = "sd-steps";
      data.steps.forEach((s) => {
        const li = document.createElement("li");
        li.textContent = s;
        ul.appendChild(li);
      });
      aboutWrap.appendChild(h3);
      aboutWrap.appendChild(ul);
    }
  }

  // Показания / кому подходит
  const indWrap = document.querySelector("[data-sd-indications]");
  if (indWrap && data.indications) {
    indWrap.innerHTML = "";
    const h3 = document.createElement("h3");
    h3.className = "sd-h3";
    h3.textContent = data.indications.title;
    const ul = document.createElement("ul");
    ul.className = "sd-list";
    data.indications.list.forEach((i) => {
      const li = document.createElement("li");
      li.textContent = i;
      ul.appendChild(li);
    });
    indWrap.appendChild(h3);
    indWrap.appendChild(ul);
  }

  // Преимущества
  const benWrap = document.querySelector("[data-sd-benefits]");
  if (benWrap && Array.isArray(data.benefits)) {
    benWrap.innerHTML = "";
    data.benefits.forEach((b) => {
      const card = document.createElement("article");
      card.className = "sd-benefit";
      card.innerHTML = `
        <h3>${b.title}</h3>
        <p>${b.text}</p>
      `;
      benWrap.appendChild(card);
    });
  }

  // FAQ
  const faqWrap = document.querySelector("[data-sd-faq]");
  if (faqWrap && Array.isArray(data.faq)) {
    faqWrap.innerHTML = "";
    data.faq.forEach((item, idx) => {
      const block = document.createElement("div");
      block.className = "sd-faq__item" + (idx === 0 ? " sd-open" : "");
      block.innerHTML = `
        <button class="sd-faq__q" type="button">
          <span>${item.q}</span>
          <span class="sd-faq__toggle">+</span>
        </button>
        <div class="sd-faq__a">
          <p>${item.a}</p>
        </div>
      `;
      faqWrap.appendChild(block);
    });

    // аккордеон
    faqWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".sd-faq__q");
      if (!btn) return;
      const item = btn.parentElement;
      const open = item.classList.contains("sd-open");
      if (open) {
        item.classList.remove("sd-open");
      } else {
        item.classList.add("sd-open");
      }
    });
  }

  // Текст в CTA
  const ctaText = document.querySelector("[data-sd-cta-text]");
  if (ctaText && data.ctaText) {
    ctaText.textContent = data.ctaText;
  }
})();
