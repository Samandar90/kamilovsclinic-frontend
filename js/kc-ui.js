/**
 * kc-ui.js — поведение оболочки сайта.
 *
 * Шапка, индикатор навигации, мобильная панель, появление блоков при скролле,
 * окно записи, кнопки быстрого выбора услуги. Всё, что есть на каждой странице.
 *
 * Логика секций главной — в js/kc-home.js.
 */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= Шапка ================= */
  function initHeader() {
    var header = document.querySelector(".kc-header");
    if (!header) return;

    // Шапка прозрачная только над тёмным первым экраном.
    var first = document.querySelector(".kc-hero, .kc-phero, .kc-lost");
    function threshold() {
      return first ? Math.max(first.offsetHeight - 120, 40) : 8;
    }
    var limit = threshold();
    var ticking = false;
    function update() {
      header.classList.toggle("is-stuck", window.scrollY > limit);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener("resize", function () {
      limit = threshold();
      update();
    });
    update();
  }

  /* ================= Индикатор навигации ================= */
  function initNavPill() {
    var nav = document.querySelector(".kc-nav");
    if (!nav) return;
    var pill = nav.querySelector(".kc-nav__pill");
    var links = [].slice.call(nav.querySelectorAll(".kc-nav__link"));
    if (!pill || !links.length) return;

    function moveTo(el) {
      nav.classList.toggle("is-ready", !!el);
      if (!el) return;
      pill.style.setProperty("--pill-x", el.offsetLeft + "px");
      pill.style.setProperty("--pill-w", el.offsetWidth + "px");
    }

    var active = nav.querySelector(".kc-nav__link.is-active");
    moveTo(active);

    links.forEach(function (link) {
      link.addEventListener("mouseenter", function () { moveTo(link); });
      link.addEventListener("focus", function () { moveTo(link); });
    });
    nav.addEventListener("mouseleave", function () { moveTo(active); });
    window.addEventListener("resize", function () { moveTo(active); });
    document.addEventListener("kc:lang", function () { moveTo(active); });

    // На главной пункты ведут к разделам: подсвечиваем тот, который сейчас на экране.
    var anchors = links.filter(function (l) {
      return l.getAttribute("href").charAt(0) === "#" && document.querySelector(l.getAttribute("href"));
    });
    if (anchors.length && "IntersectionObserver" in window) {
      var home = active;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var link = anchors.filter(function (l) {
            return l.getAttribute("href") === "#" + e.target.id;
          })[0];
          if (e.isIntersecting) active = link;
          else if (active === link) active = home;
        });
        moveTo(active);
      }, { rootMargin: "-45% 0px -50% 0px" });
      anchors.forEach(function (l) {
        io.observe(document.querySelector(l.getAttribute("href")));
      });
    }
    // Шрифт меняет ширину пунктов после загрузки — пересчитываем.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { moveTo(active); });
    }
  }

  /* ================= Мобильная панель ================= */
  function initSheet() {
    var burger = document.querySelector(".kc-burger");
    var sheet = document.getElementById("kcSheet");
    if (!burger || !sheet) return;

    function setOpen(open) {
      sheet.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("kc-sheet-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      // Закрытая панель не должна ловить фокус табом.
      sheet.setAttribute("aria-hidden", open ? "false" : "true");
      sheet.inert = !open;
    }

    burger.addEventListener("click", function () {
      setOpen(!sheet.classList.contains("is-open"));
    });
    sheet.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sheet.classList.contains("is-open")) {
        setOpen(false);
        burger.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080 && sheet.classList.contains("is-open")) setOpen(false);
    });
    setOpen(false);
  }

  /* ================= Появление при скролле ================= */
  function initReveal() {
    var items = [].slice.call(document.querySelectorAll("[data-reveal]"));
    if (!items.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

    items.forEach(function (el) {
      // Небольшой каскад внутри одной группы элементов.
      var group = el.closest("[data-reveal-group]");
      if (group) {
        var siblings = [].slice.call(group.querySelectorAll("[data-reveal]"));
        el.style.setProperty("--reveal-delay", siblings.indexOf(el) * 70 + "ms");
      }
      io.observe(el);
    });
  }

  /* ================= Окно записи ================= */
  function initModal() {
    var modal = document.getElementById("kcModal");
    if (!modal) return;
    var panel = modal.querySelector(".kc-modal__panel");
    var lastFocused = null;

    var FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Панель принимает фокус сама: так скринридер зачитывает заголовок окна.
    panel.setAttribute("tabindex", "-1");

    function focusables() {
      return [].slice.call(panel.querySelectorAll(FOCUSABLE)).filter(function (el) {
        // Honeypot намеренно уведён за экран, в обходе по Tab ему делать нечего.
        if (el.closest(".kc-hp")) return false;
        return el.getClientRects().length > 0;
      });
    }

    window.kcOpenModal = function (service) {
      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Клик по конкретной услуге или врачу подставляет их в форму.
      if (service) {
        var field = modal.querySelector('input[name="service"]');
        if (field) {
          field.value = service;
          field.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }

      // Окно проявляется через transition по visibility: в первых кадрах перехода
      // оно ещё считается скрытым и фокус не принимает. Пробуем, пока не получится.
      var tries = 0;
      requestAnimationFrame(function focusPanel() {
        if (!modal.classList.contains("is-open")) return;
        panel.focus();
        if (document.activeElement !== panel && tries++ < 20) requestAnimationFrame(focusPanel);
      });
    };

    window.kcCloseModal = function () {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };

    modal.querySelectorAll("[data-kc-close]").forEach(function (el) {
      el.addEventListener("click", window.kcCloseModal);
    });

    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("is-open")) return;

      if (e.key === "Escape") {
        window.kcCloseModal();
        return;
      }
      // Ловушка фокуса: Tab не должен уводить за пределы окна.
      if (e.key !== "Tab") return;
      var list = focusables();
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];
      if (!panel.contains(document.activeElement)) {
        // Фокус остался на странице под окном: возвращаем его в окно
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Кнопки записи по всему сайту, включая появившиеся позже.
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest ? e.target.closest("[data-kc-book]") : null;
      if (!trigger) return;
      e.preventDefault();
      window.kcOpenModal(trigger.getAttribute("data-service") || "");
    });

    modal.setAttribute("aria-hidden", "true");
  }

  /* ================= Быстрый выбор услуги в форме ================= */
  function initChips() {
    document.querySelectorAll(".kc-form").forEach(function (form) {
      var input = form.querySelector('input[name="service"]');
      var chips = [].slice.call(form.querySelectorAll("[data-kc-chip]"));
      if (!input || !chips.length) return;

      function sync() {
        var value = input.value.trim();
        chips.forEach(function (chip) {
          var on = chip.textContent.trim() === value;
          chip.classList.toggle("is-on", on);
          chip.setAttribute("aria-pressed", on ? "true" : "false");
        });
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          var text = chip.textContent.trim();
          input.value = input.value.trim() === text ? "" : text;
          sync();
        });
      });
      input.addEventListener("input", sync);
      form.addEventListener("reset", function () { setTimeout(sync, 0); });
      document.addEventListener("kc:lang", sync);
      sync();
    });
  }

  /* ================= Год в футере ================= */
  function initYear() {
    document.querySelectorAll("[data-kc-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initNavPill();
    initSheet();
    initReveal();
    initModal();
    initChips();
    initYear();
  });
})();
