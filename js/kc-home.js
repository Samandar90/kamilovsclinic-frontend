/**
 * kc-home.js — секции главной страницы.
 *
 * Глубина в герое, счётчики цифр, карусель врачей, видео о клинике,
 * таймлайн приёма, аккордеон FAQ.
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

  /* ================= Видео «Клиника изнутри» ================= */
  function initTour() {
    var root = document.querySelector("[data-kc-tour]");
    var video = root && root.querySelector("video");
    if (!video) return;

    var toggle = root.querySelector(".kc-tour__toggle");
    var chapters = [].slice.call(root.querySelectorAll(".kc-tour__chapter"));
    var length = Number(root.getAttribute("data-length")) || 1;
    var starts = chapters.map(function (c) { return Number(c.getAttribute("data-at")); });
    var saver = navigator.connection && navigator.connection.saveData;
    // Само видео включается, только когда это уместно: не при экономии трафика и не при «меньше движения»
    var stopped = reduced || !!saver;
    var raf = 0;

    video.removeAttribute("controls"); // на странице свои кнопки
    toggle.hidden = false;

    // Обложка подгружается, когда до блока осталось немного: первому экрану она не нужна
    var poster = video.getAttribute("data-poster");
    if (poster && "IntersectionObserver" in window) {
      var lazy = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        lazy.disconnect();
        video.poster = poster;
      }, { rootMargin: "150% 0px" });
      lazy.observe(video);
    } else if (poster) {
      video.poster = poster;
    }

    function paint() {
      var t = video.currentTime || 0;
      chapters.forEach(function (c, i) {
        var end = i + 1 < starts.length ? starts[i + 1] : length;
        var p = Math.min(1, Math.max(0, (t - starts[i]) / (end - starts[i])));
        c.style.setProperty("--p", p.toFixed(3));
        c.classList.toggle("is-active", t >= starts[i] && t < end);
      });
    }
    function loop() {
      paint();
      raf = requestAnimationFrame(loop);
    }
    function sync() {
      var paused = video.paused;
      root.classList.toggle("is-paused", paused);
      var key = paused ? "tour.play" : "tour.pause";
      toggle.setAttribute("data-i18n-aria", key);
      if (window.KC && window.KC.t) toggle.setAttribute("aria-label", window.KC.t(key));
      cancelAnimationFrame(raf);
      if (paused) paint();
      else loop();
    }
    function play() {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }

    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    toggle.addEventListener("click", function () {
      stopped = !video.paused;
      if (stopped) video.pause();
      else play();
    });
    // Подписи — это оглавление: нажатие переносит к своему кабинету
    chapters.forEach(function (c, i) {
      c.addEventListener("click", function () {
        video.currentTime = starts[i] + 0.05;
        stopped = false;
        play();
        paint();
      });
    });

    // Видео играет, только пока его видно: так не тратятся трафик и батарея
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (!stopped) play();
        } else {
          video.pause();
        }
      }, { threshold: 0.35 }).observe(video);
    }
    sync();
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
    initTour();
    initFaq();
  });
})();
