/**
 * kc-catalog.js — фильтры на страницах «Услуги» и «Врачи» и наполнение
 * страницы услуги. Сам каталог и его тексты лежат в js/kc-i18n.js
 * (собираются из _src/data/services.mjs).
 *
 * Страница услуги получает русское название в параметре ?service=. Показываем
 * только то, что есть в каталоге: произвольный текст из ссылки на страницу
 * клиники не попадает, иначе любой мог бы написать на ней что угодно.
 */
(function () {
  var KC = window.KC || {};
  var CATALOG = window.KC_CATALOG || [];

  /* ================= Фильтры ================= */
  function initFilter(selector, targets, attr) {
    var wrap = document.querySelector(selector);
    if (!wrap) return;
    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      wrap.querySelectorAll("[data-filter]").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      var value = btn.getAttribute("data-filter");
      document.querySelectorAll(targets).forEach(function (el) {
        el.hidden = value !== "all" && el.getAttribute(attr) !== value;
      });
    });
  }

  /* ================= Страница услуги ================= */
  function findService(name) {
    for (var i = 0; i < CATALOG.length; i++) {
      var cat = CATALOG[i];
      if (cat.name === name) return { cat: cat, index: -1 };
      var idx = cat.items.indexOf(name);
      if (idx !== -1) return { cat: cat, index: idx };
    }
    // Старое название плитки на главной.
    if (name === "Процедуры и хиджама") return findService("Процедуры");
    return null;
  }

  function initDetail() {
    var title = document.getElementById("kc-sd-title");
    if (!title) return;

    var sub = document.getElementById("kc-sd-sub");
    var crumb = document.getElementById("kc-sd-crumb");
    var kicker = document.getElementById("kc-sd-kicker");
    var listBlock = document.getElementById("kc-sd-list-block");
    var list = document.getElementById("kc-sd-list");
    var docsBlock = document.getElementById("kc-sd-docs-block");
    var field = document.querySelector('.kc-detail__aside input[name="service"]');

    var param = new URLSearchParams(window.location.search).get("service") || "";
    var found = findService(param);
    if (!found) return;

    var cat = found.cat;
    var isItem = found.index !== -1;

    function key(i, part) {
      return "cat." + cat.id + "." + i + "." + part;
    }

    function render() {
      var name = isItem ? KC.t(key(found.index, "title")) : KC.t("cat." + cat.id);
      title.textContent = name;
      if (crumb) crumb.textContent = name;
      if (kicker) kicker.textContent = isItem ? KC.t("cat." + cat.id) : KC.t("page.detail.kicker");
      if (sub) {
        sub.textContent = isItem
          ? KC.t(key(found.index, "text")) + " " + KC.t("page.detail.sub")
          : KC.t("page.detail.sub");
      }
      document.title = name + " — Kamilovs Clinic";
      if (field) {
        field.value = name;
        field.dispatchEvent(new Event("input", { bubbles: true }));
      }

      list.textContent = "";
      cat.items.forEach(function (itemName, i) {
        var row = document.createElement("div");
        row.className = "kc-row";

        var text = document.createElement("div");
        var h3 = document.createElement("h3");
        var a = document.createElement("a");
        a.href = "service-detail.html?service=" + encodeURIComponent(itemName);
        a.textContent = KC.t(key(i, "title"));
        if (i === found.index) a.setAttribute("aria-current", "page");
        h3.appendChild(a);
        var p = document.createElement("p");
        p.textContent = KC.t(key(i, "text"));
        text.appendChild(h3);
        text.appendChild(p);
        row.appendChild(text);

        var book = document.createElement("button");
        book.type = "button";
        book.className = "kc-btn kc-btn--outline kc-btn--sm";
        book.setAttribute("data-kc-book", "");
        book.setAttribute("data-kc-goal", "booking_open");
        book.setAttribute("data-service", KC.t(key(i, "title")));
        book.textContent = KC.t("page.services.book");
        row.appendChild(book);

        list.appendChild(row);
      });
      listBlock.hidden = false;
    }

    render();
    document.addEventListener("kc:lang", render);

    var shown = 0;
    document.querySelectorAll("[data-doctor]").forEach(function (card) {
      var on = cat.doctors.indexOf(Number(card.getAttribute("data-doctor"))) !== -1;
      card.hidden = !on;
      if (on) shown++;
    });
    if (docsBlock) docsBlock.hidden = shown === 0;
  }

  // Срабатывает после kc-i18n.js: он подключён раньше и слушает то же событие.
  document.addEventListener("DOMContentLoaded", function () {
    initFilter("[data-kc-filter]", "[data-cat]", "data-cat");
    initFilter("[data-kc-doc-filter]", ".kc-docgrid .kc-doc", "data-spec");
    initDetail();
  });
})();
