/**
 * kc-contact-widget.js — каналы связи: плавающий виджет + ссылки в футере.
 *
 * Всё строится из js/kc-config.js. Незаполненный хэндл = канал просто не
 * отрисовывается, поэтому «пустых» кнопок на сайте не появится.
 *
 * Футерные ссылки рендерятся в контейнер [data-kc-social], чтобы хэндлы
 * жили в одном месте, а не были размазаны по пяти HTML-файлам.
 */
(function () {
  var KC = window.KC || {};
  var cfg = window.KC_CONFIG || {};

  var LABEL = {
    ru: { write: "Написать в", call: "Позвонить", open: "Связаться с нами", close: "Закрыть" },
    uz: { write: "Yozish:", call: "Qo‘ng‘iroq qilish", open: "Biz bilan bog‘lanish", close: "Yopish" },
  };

  function L(key) {
    var lang = KC.lang ? KC.lang() : "ru";
    return (LABEL[lang] || LABEL.ru)[key];
  }

  var ICON = {
    telegram:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M21.7 3.4 2.9 10.6c-1.1.4-1.1 1.1-.2 1.4l4.7 1.5 1.8 5.5c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.5c.3-1.3-.5-1.9-1-1.9Zm-3.1 3.4-8.6 7.8-.3 3.6-1.8-5.4 10.3-6.5c.4-.3.8-.1.4.5Z"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Z"/><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="7" r="1.2" fill="currentColor"/></svg>',
    phone:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 3h2.5c.5 0 .9.3 1 .8l.9 3.2c.1.4 0 .8-.4 1l-1.8 1.3a12.6 12.6 0 0 0 5.9 5.9l1.3-1.8c.2-.3.6-.5 1-.4l3.2.9c.5.1.8.5.8 1V17a3 3 0 0 1-3 3A16.5 16.5 0 0 1 3.6 6a3 3 0 0 1 3-3Z"/></svg>',
  };

  // Собираем список доступных каналов один раз.
  function channels() {
    var out = [];
    if (KC.telegramUrl) {
      out.push({ key: "telegram", url: KC.telegramUrl, name: "Telegram", goal: "messenger_click", ext: true });
    }
    if (KC.instagramUrl) {
      out.push({ key: "instagram", url: KC.instagramUrl, name: "Instagram", goal: "messenger_click", ext: true });
    }
    if (cfg.phone) {
      out.push({ key: "phone", url: "tel:" + cfg.phone, name: cfg.phoneDisplay || cfg.phone, goal: "phone_click", ext: false });
    }
    return out;
  }

  function linkAttrs(ch) {
    return (
      'href="' + ch.url + '" data-kc-goal="' + ch.goal + '"' +
      (ch.ext ? ' target="_blank" rel="noopener"' : "")
    );
  }

  /* ---- Плавающий виджет -------------------------------------------------- */

  function renderWidget(list) {
    // Только мессенджеры: телефон уже есть в шапке, дублировать не нужно.
    var messengers = list.filter(function (c) { return c.key !== "phone"; });
    if (!messengers.length) return null;

    var root = document.createElement("div");
    root.className = "kc-contact-widget";
    root.innerHTML =
      '<div class="kc-contact-widget__list">' +
      messengers
        .map(function (ch) {
          return (
            '<a class="kc-contact-widget__item kc-contact-widget__item--' + ch.key + '" ' +
            linkAttrs(ch) + ' aria-label="' + L("write") + " " + ch.name + '">' +
            ICON[ch.key] +
            '<span class="kc-contact-widget__name">' + ch.name + "</span>" +
            "</a>"
          );
        })
        .join("") +
      "</div>" +
      '<button class="kc-contact-widget__toggle" type="button" aria-expanded="false" aria-label="' +
      L("open") + '">' + ICON.telegram + "</button>";

    var toggle = root.querySelector(".kc-contact-widget__toggle");
    toggle.addEventListener("click", function () {
      var open = root.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? L("close") : L("open"));
    });

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target) && root.classList.contains("is-open")) {
        root.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", L("open"));
      }
    });

    return root;
  }

  /* ---- Ссылки в футере --------------------------------------------------- */

  // Слоты помечаются data-kc-social. Значение "light" — вариант для светлого
  // фона (страница контактов), пустое — для тёмного футера.
  function renderSlots(list) {
    var slots = document.querySelectorAll("[data-kc-social]");
    if (!slots.length) return;

    var messengers = list.filter(function (c) { return c.key !== "phone"; });

    slots.forEach(function (slot) {
      var cls =
        slot.getAttribute("data-kc-social") === "light"
          ? "kc-social-link kc-social-link--light"
          : "kc-social-link";

      slot.innerHTML = messengers
        .map(function (ch) {
          return (
            '<a class="' + cls + '" ' + linkAttrs(ch) + ' aria-label="' +
            L("write") + " " + ch.name + '">' + ICON[ch.key] +
            "<span>" + ch.name + "</span></a>"
          );
        })
        .join("");
      slot.hidden = !messengers.length;
    });

    // Карточку целиком прячем, если ни один канал не настроен.
    document.querySelectorAll("[data-kc-social-card]").forEach(function (card) {
      card.hidden = !messengers.length;
    });
  }

  /* ---- Старт ------------------------------------------------------------- */

  function build() {
    var list = channels();

    var existing = document.querySelector(".kc-contact-widget");
    if (existing) existing.remove();

    var widget = renderWidget(list);
    if (widget) document.body.appendChild(widget);

    renderSlots(list);
  }

  document.addEventListener("DOMContentLoaded", function () {
    build();
    if (KC.onLangChange) KC.onLangChange(build); // перерисовать подписи при смене языка
  });
})();
