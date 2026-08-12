/**
 * kc-ui.js — поведение оболочки сайта.
 *
 * Шапка, скользящий индикатор навигации, мобильная панель, появление
 * блоков при скролле, полоса прогресса, плавающая кнопка и модальное
 * окно записи. Всё, что есть на каждой странице.
 *
 * Логика конкретных секций главной — в js/kc-home.js.
 */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= Шапка ================= */
  function initHeader() {
    var header = document.querySelector(".kc-header");
    if (!header) return;

    // Порог переключения — высота героя минус шапка. На страницах без
    // героя шапка становится матовой сразу после первого скролла.
    var hero = document.querySelector(".kc-hero");
    var threshold = hero ? Math.max(hero.offsetHeight - 140, 60) : 8;

    var ticking = false;
    function update() {
      header.classList.toggle("is-stuck", window.scrollY > threshold);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
    window.addEventListener("resize", function () {
      threshold = hero ? Math.max(hero.offsetHeight - 140, 60) : 8;
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
      if (!el) return;
      // scaleX по ширине в 1px: анимируется на GPU, без пересчёта раскладки.
      pill.style.setProperty("--pill-x", el.offsetLeft + "px");
      pill.style.setProperty("--pill-w", el.offsetWidth);
      nav.classList.add("is-ready");
    }

    var active = nav.querySelector(".kc-nav__link.is-active") || links[0];
    moveTo(active);

    links.forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        moveTo(link);
      });
      link.addEventListener("focus", function () {
        moveTo(link);
      });
    });
    nav.addEventListener("mouseleave", function () {
      moveTo(active);
    });
    window.addEventListener("resize", function () {
      moveTo(active);
    });
    // Шрифт меняет ширину пунктов после загрузки — пересчитываем.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        moveTo(active);
      });
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
      document.body.style.overflow = open ? "hidden" : "";
      // Панель закрыта — её содержимое не должно ловить фокус табом.
      sheet.setAttribute("aria-hidden", open ? "false" : "true");
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
    setOpen(false);
  }

  /* ================= Появление при скролле ================= */
  function initReveal() {
    var items = [].slice.call(document.querySelectorAll("[data-reveal]"));
    if (!items.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach(function (el, i) {
      // Небольшой каскад внутри одной группы элементов.
      var group = el.closest("[data-reveal-group]");
      if (group) {
        var siblings = [].slice.call(group.querySelectorAll("[data-reveal]"));
        el.style.setProperty("--reveal-delay", siblings.indexOf(el) * 70 + "ms");
      }
      io.observe(el);
    });

    // Врачи и услуги дорисовываются скриптами — подхватываем новые узлы.
    document.addEventListener("kc:content", function () {
      document
        .querySelectorAll("[data-reveal]:not(.is-in)")
        .forEach(function (el) {
          io.observe(el);
        });
    });
  }

  /* ================= Полоса прогресса ================= */
  function initProgress() {
    var bar = document.querySelector(".kc-progress");
    if (!bar || reduced) return;
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      bar.style.setProperty("--kc-progress", Math.min(1, Math.max(0, p)));
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  /* ================= Плавающая кнопка ================= */
  function initFab() {
    var fab = document.querySelector(".kc-fab");
    if (!fab) return;
    document.body.classList.add("kc-has-fab");

    var ticking = false;
    function update() {
      // Показываем после первого экрана и прячем над футером,
      // чтобы кнопка не перекрывала контакты.
      var footer = document.querySelector(".kc-footer");
      var nearFooter =
        footer &&
        footer.getBoundingClientRect().top < window.innerHeight - 40;
      fab.classList.toggle(
        "is-visible",
        window.scrollY > window.innerHeight * 0.6 && !nearFooter
      );
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  /* ================= Модальное окно записи ================= */
  function initModal() {
    var modal = document.getElementById("kcModal");
    if (!modal) return;
    var panel = modal.querySelector(".kc-modal__panel");
    var lastFocused = null;

    var FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Панель принимает фокус сама: так скринридер зачитывает заголовок окна,
    // и не нужно угадывать «первое подходящее поле».
    panel.setAttribute("tabindex", "-1");

    function focusables() {
      return [].slice.call(panel.querySelectorAll(FOCUSABLE)).filter(function (el) {
        // Honeypot намеренно уведён за экран, но остаётся в DOM —
        // в обходе по Tab ему делать нечего.
        if (el.closest(".kc-hp")) return false;
        return el.getClientRects().length > 0;
      });
    }

    window.kcOpenModal = function (service) {
      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Клик по конкретной услуге подставляет её в форму.
      if (service) {
        var field = modal.querySelector('input[name="service"]');
        if (field && !field.value) field.value = service;
      }

      // Окно проявляется через transition по visibility — в том же кадре
      // оно ещё не фокусируемо, поэтому ждём следующий кадр.
      requestAnimationFrame(function () {
        panel.focus();
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
      if (e.shiftKey && document.activeElement === first) {
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

  /* ================= Старт ================= */
  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initNavPill();
    initSheet();
    initReveal();
    initProgress();
    initFab();
    initModal();
  });
})();
