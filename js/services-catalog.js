/* =========================================================
   Kamilovs Clinic — services catalog (static, no prices)
   Renders categorized services into #kc-services-root and
   builds category filter buttons. Works fully on GitHub Pages.
   ========================================================= */

const KC_SERVICE_CATEGORIES = [
  {
    id: "stomatology",
    name: "Стоматология",
    icon:
      '<path d="M12 5.6c-1.5-1.3-3.1-1.9-4.5-1.5C5.9 4.5 5 5.9 5 7.8c0 1.6.4 2.7.7 4.3.2 1 .3 2.4.6 3.9.2 1.2.5 2.7 1.2 3.3.6.5 1.3.2 1.6-.8.3-1 .5-2.4.9-3.3.2-.5.6-.9 1-.9s.8.4 1 .9c.4.9.6 2.3.9 3.3.3 1 1 1.3 1.6.8.7-.6 1-2.1 1.2-3.3.3-1.5.4-2.9.6-3.9.3-1.6.7-2.7.7-4.3 0-1.9-.9-3.3-2.5-3.7-1.4-.4-3 .2-4.5 1.5Z"/>',
    items: [
      ["Консультация стоматолога", "Осмотр, план лечения и понятные рекомендации."],
      ["Лечение кариеса", "Бережное лечение с современными материалами."],
      ["Лечение пульпита и каналов", "Эндодонтическое лечение под контролем врача."],
      ["Эстетическая реставрация зубов", "Восстановление формы и цвета зуба."],
      ["Профессиональная гигиена", "Чистка, удаление налёта и камня."],
      ["Отбеливание зубов", "Безопасное осветление эмали."],
      ["Удаление зубов", "Простое и сложное удаление без боли."],
      ["Протезирование (коронки, мосты)", "Несъёмные конструкции с учётом эстетики."],
      ["Съёмное протезирование", "Удобные съёмные протезы."],
      ["Лечение дёсен", "Диагностика и лечение заболеваний дёсен."],
      ["Детская стоматология", "Спокойный приём для маленьких пациентов."],
      ["Интегративная стоматология", "Комплексный подход к здоровью полости рта."],
    ],
  },
  {
    id: "neurology",
    name: "Неврология",
    icon:
      '<path d="M12 4.5a2.6 2.6 0 0 0-5 .7 2.5 2.5 0 0 0-1.9 3.2A2.7 2.7 0 0 0 5 11.7a2.6 2.6 0 0 0 1.7 2.4A2.4 2.4 0 0 0 9 17.4a2.5 2.5 0 0 0 3 .6Zm0 0a2.6 2.6 0 0 1 5 .7 2.5 2.5 0 0 1 1.9 3.2A2.7 2.7 0 0 1 19 11.7a2.6 2.6 0 0 1-1.7 2.4 2.4 2.4 0 0 1-2.3 3.3 2.5 2.5 0 0 1-3 .6Z"/><path d="M12 4.5V18"/>',
    items: [
      ["Консультация невролога", "Диагностика заболеваний нервной системы."],
      ["Лечение головных болей и мигрени", "Подбор эффективной схемы лечения."],
      ["Лечение боли в спине и шее", "Помощь при болях и защемлениях."],
      ["Диагностика нарушений сна", "Выявление причин бессонницы."],
      ["Лечение невралгии", "Снятие боли и восстановление."],
      ["Неврология детского возраста", "Наблюдение и лечение у детей."],
    ],
  },
  {
    id: "pediatrics",
    name: "Педиатрия",
    icon:
      '<circle cx="12" cy="8.5" r="4.5"/><path d="M9.5 7.7h.01M14.5 7.7h.01M10 10.4c.6.5 1.3.7 2 .7s1.4-.2 2-.7"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    items: [
      ["Консультация педиатра", "Осмотр и рекомендации для ребёнка."],
      ["Профилактический осмотр", "Контроль здоровья и развития."],
      ["Наблюдение за развитием ребёнка", "Регулярный контроль по возрасту."],
      ["Консультация по вакцинации", "Индивидуальный план прививок."],
    ],
  },
  {
    id: "lab",
    name: "Анализы и лаборатория",
    icon:
      '<path d="M9 3h6M10 3v5.2L5.6 16.8A2 2 0 0 0 7.4 20h9.2a2 2 0 0 0 1.8-3.2L14 8.2V3"/><path d="M7.3 14.5h9.4"/>',
    items: [
      ["Общий анализ крови", "Базовое исследование показателей крови."],
      ["Биохимический анализ крови", "Оценка работы внутренних органов."],
      ["Гормональные исследования", "Анализ гормонального фона."],
      ["Анализы на инфекции", "Выявление инфекционных заболеваний."],
      ["Анализы для госпитализации", "Полный пакет перед поступлением."],
      ["Программа Check-up", "Комплексное обследование организма."],
    ],
  },
  {
    id: "diagnostics",
    name: "Диагностика",
    icon:
      '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M5 3h2M13 3h2"/><path d="M10 16v1a4 4 0 0 0 8 0v-1.2"/><circle cx="18" cy="13.5" r="2.2"/>',
    items: [
      ["Консультация терапевта", "Первичный приём и маршрутизация."],
      ["ЭКГ (электрокардиография)", "Оценка работы сердца."],
      ["Функциональная диагностика", "Современные методы обследования."],
      ["Ультразвуковая диагностика", "УЗИ-обследование по направлениям."],
    ],
  },
  {
    id: "procedures",
    name: "Процедуры",
    icon:
      '<path d="M12 21c4-2.6 7-6 7-9.8A4.2 4.2 0 0 0 12 8a4.2 4.2 0 0 0-7 3.2C5 15 8 18.4 12 21Z"/><path d="M9.5 11.5h5M12 9v5"/>',
    items: [
      ["Хиджама (баночная терапия)", "Суннская методика по индивидуальной программе."],
      ["Лечебный массаж", "Снятие напряжения и улучшение кровообращения."],
      ["Инфузионная терапия (капельницы)", "Восстановление под контролем врача."],
      ["Внутримышечные инъекции", "Назначенные процедуры в комфортных условиях."],
      ["Перевязки и обработка ран", "Профессиональный уход за раной."],
    ],
  },
  {
    id: "extra",
    name: "Дополнительно",
    icon:
      '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v3M16 3v3M8.5 14.5l2.2 2.2L15.5 12"/>',
    items: [
      ["Онлайн-консультация", "Связь с врачом дистанционно."],
      ["Медицинские справки и осмотры", "Оформление по запросу."],
      ["Сопровождение лечения", "Контроль и повторные приёмы."],
    ],
  },
];

function kcSvg(inner) {
  return (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
    inner +
    "</svg>"
  );
}

function kcEsc(s) {
  var d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
function kcEscAttr(s) {
  return String(s).replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

const KC_CHECK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4 10-10"/></svg>';

function renderServicesCatalog() {
  var root = document.querySelector("#kc-services-root");
  if (!root) return;

  var filterWrap = document.querySelector("#kc-services-filter");
  if (filterWrap) {
    var btns = ['<button class="kc-filter__btn is-active" data-filter="all">Все</button>'];
    KC_SERVICE_CATEGORIES.forEach(function (c) {
      btns.push(
        '<button class="kc-filter__btn" data-filter="' +
          c.id +
          '">' +
          kcEsc(c.name) +
          "</button>"
      );
    });
    filterWrap.innerHTML = btns.join("");
  }

  root.innerHTML = KC_SERVICE_CATEGORIES.map(function (cat) {
    var cards = cat.items
      .map(function (it) {
        var title = it[0];
        var desc = it[1];
        return (
          '<article class="kc-svc-card" data-reveal>' +
          '<span class="kc-svc-card__check">' +
          KC_CHECK_ICON +
          "</span>" +
          '<div class="kc-svc-card__body">' +
          '<h3 class="kc-svc-card__title">' +
          kcEsc(title) +
          "</h3>" +
          '<p class="kc-svc-card__text">' +
          kcEsc(desc) +
          "</p>" +
          '<div class="kc-svc-card__actions">' +
          '<button class="kc-svc-card__btn" type="button" onclick="kcOpenServiceModal(\'' +
          kcEscAttr(title) +
          "')\">Записаться</button>" +
          '<a class="kc-svc-card__more" href="service-detail.html?service=' +
          encodeURIComponent(title) +
          '">Подробнее</a>' +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    return (
      '<div class="kc-svc-cat" data-cat="' +
      cat.id +
      '">' +
      '<header class="kc-svc-cat__head" data-reveal>' +
      '<span class="kc-ico kc-ico--teal">' +
      kcSvg(cat.icon) +
      "</span>" +
      '<h2 class="kc-svc-cat__name">' +
      kcEsc(cat.name) +
      "</h2>" +
      "</header>" +
      '<div class="kc-svc-grid">' +
      cards +
      "</div>" +
      "</div>"
    );
  }).join("");

  // reveal
  root.querySelectorAll("[data-reveal]").forEach(function (el) {
    el.classList.add("is-in");
  });

  // filter behaviour
  if (filterWrap) {
    filterWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".kc-filter__btn");
      if (!btn) return;
      filterWrap
        .querySelectorAll(".kc-filter__btn")
        .forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      root.querySelectorAll(".kc-svc-cat").forEach(function (cat) {
        cat.style.display =
          f === "all" || cat.getAttribute("data-cat") === f ? "" : "none";
      });
    });
  }
}

// open booking modal pre-filled with the chosen service
window.kcOpenServiceModal = function (title) {
  var input = document.querySelector('#kcModal [name="service"]');
  if (input) input.value = title;
  if (typeof window.kcOpenModal === "function") window.kcOpenModal();
};

document.addEventListener("DOMContentLoaded", renderServicesCatalog);
