/**
 * kc-contact-widget.js — плавающая кнопка связи и ссылки на мессенджеры.
 *
 * Кнопка собирается из js/kc-config.js: незаполненный хэндл = канал просто
 * не появляется. Порядок пунктов снизу вверх — от самого частого действия
 * к дополнительным, потому что ближний к кнопке пункт нажать проще всего.
 *
 * Ссылки в футере и на странице контактов рендерятся в [data-kc-social].
 */
(function () {
  var KC = window.KC || {};
  var cfg = window.KC_CONFIG || {};

  var LABEL = {
    ru: {
      open: "Связаться с нами",
      close: "Закрыть",
      book: "Записаться на приём",
      call: "Позвонить",
      write: "Написать в",
    },
    uz: {
      open: "Biz bilan bog‘lanish",
      close: "Yopish",
      book: "Qabulga yozilish",
      call: "Qo‘ng‘iroq qilish",
      write: "Yozish:",
    },
  };

  function L(key) {
    var lang = KC.lang ? KC.lang() : "ru";
    return (LABEL[lang] || LABEL.ru)[key];
  }

  var ICON = {
    telegram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.7 3.4 2.9 10.6c-1.1.4-1.1 1.1-.2 1.4l4.7 1.5 1.8 5.5c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.5c.3-1.3-.5-1.9-1-1.9Zm-3.1 3.4-8.6 7.8-.3 3.6-1.8-5.4 10.3-6.5c.4-.3.8-.1.4.5Z"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" d="M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Z"/><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="17" cy="7" r="1.3" fill="currentColor"/></svg>',
    phone:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 3h2.5c.5 0 .9.3 1 .8l.9 3.2c.1.4 0 .8-.4 1l-1.8 1.3a12.6 12.6 0 0 0 5.9 5.9l1.3-1.8c.2-.3.6-.5 1-.4l3.2.9c.5.1.8.5.8 1V17a3 3 0 0 1-3 3A16.5 16.5 0 0 1 3.6 6a3 3 0 0 1 3-3Z"/></svg>',
    book:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="4.8" width="17.6" height="15.4" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.2 9.6h17.6M8 3.2v3.2M16 3.2v3.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m9 14.4 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chat:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" d="M20.5 11.8a8.2 8.2 0 0 1-8.8 8.2L5 21l1.2-4A8.2 8.2 0 1 1 20.5 11.8Z"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** Мессенджеры отдельно: они же используются в футере и на контактах. */
  function messengers() {
    var out = [];
    if (KC.telegramUrl) {
      out.push({ key: "telegram", url: KC.telegramUrl, name: "Telegram" });
    }
    if (KC.instagramUrl) {
      out.push({ key: "instagram", url: KC.instagramUrl, name: "Instagram" });
    }
    return out;
  }

  /* ================= Плавающая кнопка ================= */

  function buildFab() {
    var old = document.querySelector(".kc-fab");
    if (old) old.remove();

    var items = [];

    // Снизу вверх: запись ближе всего к пальцу, дальше — звонок и мессенджеры.
    messengers()
      .slice()
      .reverse()
      .forEach(function (m) {
        items.push(
          '<a class="kc-fab__item" href="' + esc(m.url) + '" target="_blank" rel="noopener"' +
            ' data-kc-goal="messenger_click">' +
            '<span class="kc-fab__text">' + esc(m.name) + "</span>" +
            '<span class="kc-fab__icon kc-fab__icon--' + m.key + '">' + ICON[m.key] + "</span>" +
            "</a>"
        );
      });

    if (cfg.phone) {
      items.push(
        '<a class="kc-fab__item" href="tel:' + esc(cfg.phone) + '" data-kc-goal="phone_click">' +
          '<span class="kc-fab__text">' + esc(L("call")) + "</span>" +
          '<span class="kc-fab__icon kc-fab__icon--call">' + ICON.phone + "</span>" +
          "</a>"
      );
    }

    items.push(
      '<button class="kc-fab__item" type="button" data-kc-book data-kc-goal="booking_open">' +
        '<span class="kc-fab__text">' + esc(L("book")) + "</span>" +
        '<span class="kc-fab__icon kc-fab__icon--book">' + ICON.book + "</span>" +
        "</button>"
    );

    var root = document.createElement("div");
    root.className = "kc-fab";
    root.innerHTML =
      '<div class="kc-fab__menu" id="kcFabMenu">' + items.join("") + "</div>" +
      '<button class="kc-fab__toggle" type="button" aria-expanded="false"' +
      ' aria-controls="kcFabMenu" aria-label="' + esc(L("open")) + '">' +
      '<span class="kc-fab__pulse" aria-hidden="true"></span>' +
      '<span class="kc-fab__glyph kc-fab__glyph--open">' + ICON.chat + "</span>" +
      '<span class="kc-fab__glyph kc-fab__glyph--close">' + ICON.close + "</span>" +
      "</button>";

    var toggle = root.querySelector(".kc-fab__toggle");

    function setOpen(open) {
      root.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? L("close") : L("open"));
    }

    toggle.addEventListener("click", function () {
      setOpen(!root.classList.contains("is-open"));
    });

    // Клик по пункту меню закрывает его — иначе после записи меню
    // остаётся раскрытым поверх модального окна.
    root.querySelector(".kc-fab__menu").addEventListener("click", function () {
      setOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.body.appendChild(root);
    document.body.classList.add("kc-has-fab");
    return root;
  }

  /* ================= Ссылки в футере и на контактах ================= */

  function renderSlots() {
    var slots = document.querySelectorAll("[data-kc-social]");
    if (!slots.length) return;
    var list = messengers();

    slots.forEach(function (slot) {
      var cls =
        slot.getAttribute("data-kc-social") === "light"
          ? "kc-social-link kc-social-link--light"
          : "kc-social-link";
      slot.innerHTML = list
        .map(function (m) {
          return (
            '<a class="' + cls + '" href="' + esc(m.url) + '" target="_blank" rel="noopener"' +
            ' data-kc-goal="messenger_click" aria-label="' + esc(L("write") + " " + m.name) + '">' +
            ICON[m.key] + "<span>" + esc(m.name) + "</span></a>"
          );
        })
        .join("");
      slot.hidden = !list.length;
    });

    document.querySelectorAll("[data-kc-social-card]").forEach(function (card) {
      card.hidden = !list.length;
    });
  }

  function build() {
    buildFab();
    renderSlots();
  }

  document.addEventListener("DOMContentLoaded", function () {
    build();
    if (KC.onLangChange) KC.onLangChange(build);
  });
})();
