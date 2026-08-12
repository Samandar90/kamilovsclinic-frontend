/**
 * kc-legal.js — реквизиты организации и лицензия.
 *
 * Значения живут в js/kc-config.js -> legal. Логика та же, что у мессенджеров:
 * пустое поле = блок не показывается. Это осознанно — публиковать «Лицензия
 * № ___» хуже, чем не показывать блок вообще.
 *
 * Работает в двух местах:
 *   [data-legal="ключ"]   — подстановка значения в текст (страница политики);
 *   [data-kc-legal-card]  — карточка с реквизитами (страница контактов).
 */
(function () {
  var legal = (window.KC_CONFIG || {}).legal || {};
  var KC = window.KC || {};

  var LABEL = {
    ru: {
      title: "Реквизиты и лицензия",
      entity: "Юридическое лицо",
      inn: "ИНН",
      license: "Лицензия",
      privacy: "Политика обработки персональных данных",
      issuedBy: "выдана",
      issuedOn: "от",
    },
    uz: {
      title: "Rekvizitlar va litsenziya",
      entity: "Yuridik shaxs",
      inn: "STIR",
      license: "Litsenziya",
      privacy: "Shaxsiy ma’lumotlarni qayta ishlash siyosati",
      issuedBy: "bergan",
      issuedOn: "sana",
    },
  };

  function L(key) {
    var lang = KC.lang ? KC.lang() : "ru";
    return (LABEL[lang] || LABEL.ru)[key];
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** «№ 12345, выдана: Минздрав РУз, от 01.01.2020» — из трёх полей конфига.
   *  Связки берутся из словаря, иначе в узбекской версии оставались русские. */
  function licenseText() {
    var parts = [];
    if (legal.license) parts.push("№ " + legal.license);
    if (legal.licenseIssuer) parts.push(L("issuedBy") + ": " + legal.licenseIssuer);
    if (legal.licenseDate) parts.push(L("issuedOn") + " " + legal.licenseDate);
    return parts.join(", ");
  }

  /** Подстановка в текст политики. Незаполненное поле оставляет прочерк,
   *  который виден при вычитке документа. */
  function fillPlaceholders() {
    var values = {
      entity: legal.entity,
      inn: legal.inn,
      address: legal.address,
      license: licenseText(),
    };

    Object.keys(values).forEach(function (key) {
      var value = (values[key] || "").trim();
      if (!value) return;
      document.querySelectorAll('[data-legal="' + key + '"]').forEach(function (el) {
        el.textContent = value;
      });
    });
  }

  function renderCard() {
    var card = document.querySelector("[data-kc-legal-card]");
    if (!card) return;

    var rows = [];
    if (legal.entity) rows.push([L("entity"), legal.entity]);
    if (legal.inn) rows.push([L("inn"), legal.inn]);
    var lic = licenseText();
    if (lic) rows.push([L("license"), lic]);

    // Ни одного заполненного реквизита — карточки на странице не будет.
    if (!rows.length) {
      card.hidden = true;
      return;
    }

    card.innerHTML =
      "<h3>" + escapeHtml(L("title")) + "</h3>" +
      '<dl class="kc-legal-card__list">' +
      rows
        .map(function (r) {
          return "<dt>" + escapeHtml(r[0]) + "</dt><dd>" + escapeHtml(r[1]) + "</dd>";
        })
        .join("") +
      "</dl>" +
      '<a class="kc-legal-card__link" href="privacy.html">' +
      escapeHtml(L("privacy")) +
      "</a>";
    card.hidden = false;
  }

  function build() {
    fillPlaceholders();
    renderCard();
  }

  document.addEventListener("DOMContentLoaded", function () {
    build();
    if (KC.onLangChange) KC.onLangChange(build);
  });
})();
