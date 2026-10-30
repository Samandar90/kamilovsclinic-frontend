/**
 * kc-home.js — секции главной страницы.
 *
 * Глубина в герое, счётчики цифр, карусель врачей, таймлайн приёма, аккордеон FAQ.
 * Карточки врачей уже лежат в разметке (их собирает _src/build.mjs).
 */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= Глубина в герое ================= */
  function initDepth() {
    var hero = document.querySelector("[data-kc-hero]");
    var stage = hero && hero.querySelector(".kc-hero__stage");
    if (!stage || reduced || !window.matchMedia("(hover: hover) and (min-width: 1000px)").matches) return;

    var ticking = false;
    var x = 0;
    var y = 0;
    hero.addEventListener("mousemove", function (e) {
      x = e.clientX / window.innerWidth - 0.5;
      y = e.clientY / window.innerHeight - 0.5;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        stage.style.setProperty("--px", x.toFixed(3));
        stage.style.setProperty("--py", y.toFixed(3));
        ticking = false;
      });
    }, { passive: true });
    hero.addEventListener("mouseleave", function () {
      stage.style.setProperty("--px", 0);
      stage.style.setProperty("--py", 0);
    });
  }

  /* ================= Счётчики ================= */
  function initCounters() {
    var items = document.querySelectorAll("[data-kc-count]");
    if (!items.length || reduced || !("IntersectionObserver" in window)) return;

    function format(n) {
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function run(el) {
      var target = Number(el.getAttribute("data-kc-count"));
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / 1500);
        var e = 1 - Math.pow(1 - t, 4);
        el.textContent = format(Math.round(target * e));
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        run(e.target);
      });
    }, { threshold: 0.6 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ================= Карусель врачей ================= */
  function initDoctors() {
    var root = document.querySelector("[data-kc-doctors]");
    if (!root) return;

    var track = root.querySelector(".kc-docs__track");
    var prev = root.querySelector('[data-doc-nav="prev"]');
    var next = root.querySelector('[data-doc-nav="next"]');
    if (!track) return;

    function step() {
      var card = track.querySelector(".kc-doc");
      if (!card) return 300;
      var gap = parseFloat(getComputedStyle(track).columnGap || "16") || 16;
      return card.getBoundingClientRect().width + gap;
    }

    function syncButtons() {
      if (!prev || !next) return;
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }

    function scrollBy(dir) {
      track.scrollBy({ left: dir * step(), behavior: reduced ? "auto" : "smooth" });
    }

    if (prev) prev.addEventListener("click", function () { scrollBy(-1); });
    if (next) next.addEventListener("click", function () { scrollBy(1); });

    // С клавиатуры: сама лента фокусируема, стрелки листают карточки.
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollBy(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollBy(-1);
      }
    });

    track.addEventListener("scroll", function () {
      requestAnimationFrame(syncButtons);
    }, { passive: true });
    window.addEventListener("resize", syncButtons);
    syncButtons();
  }

  /* ================= Таймлайн приёма ================= */
  function initJourney() {
    var journey = document.querySelector(".kc-journey");
    if (!journey) return;
    var steps = [].slice.call(journey.querySelectorAll(".kc-step"));
    if (!steps.length) return;

    if (reduced) {
      journey.style.setProperty("--journey", 1);
      steps.forEach(function (s) { s.classList.add("is-active"); });
      return;
    }

    var ticking = false;
    function update() {
      var rect = journey.getBoundingClientRect();
      var vh = window.innerHeight;
      // Прогресс: 0 — блок только вошёл снизу, 1 — дошёл до верхней трети экрана.
      var start = vh * 0.85;
      var end = vh * 0.3;
      var p = (start - rect.top) / (start - end + rect.height * 0.5);
      p = Math.min(1, Math.max(0, p));
      journey.style.setProperty("--journey", p.toFixed(3));
      steps.forEach(function (s, i) {
        s.classList.toggle("is-active", p >= i / steps.length + 0.02);
      });
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ================= FAQ ================= */
  function initFaq() {
    var acc = document.querySelector(".kc-acc");
    if (!acc) return;

    acc.addEventListener("click", function (e) {
      var btn = e.target.closest(".kc-acc__q");
      if (!btn) return;

      var item = btn.closest(".kc-acc__item");
      var open = item.classList.contains("is-open");

      // Одновременно открыт один вопрос: список остаётся обозримым.
      acc.querySelectorAll(".kc-acc__item.is-open").forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".kc-acc__q").setAttribute("aria-expanded", "false");
      });

      if (!open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDepth();
    initCounters();
    initDoctors();
    initJourney();
    initFaq();
  });
})();
