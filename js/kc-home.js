/**
 * kc-home.js — секции главной страницы.
 *
 * Герой, карусель врачей, таймлайн приёма, аккордеон FAQ.
 * Данные врачей берутся из js/doctors-data.js — единого источника,
 * который используется и на странице «Врачи».
 */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= Герой ================= */
  function initHero() {
    var hero = document.querySelector(".kc-hero");
    if (!hero) return;

    var img = hero.querySelector(".kc-hero__media img");

    // Каскад запускаем после загрузки фонового кадра, иначе текст
    // проявляется на пустом тёмном прямоугольнике.
    function start() {
      hero.classList.add("is-ready");
    }
    if (!img || img.complete) {
      requestAnimationFrame(start);
    } else {
      img.addEventListener("load", start);
      img.addEventListener("error", start);
      // Страховка: если картинка не отвечает, контент всё равно покажем.
      setTimeout(start, 1400);
    }

    hero.querySelectorAll("[data-hero-step]").forEach(function (el, i) {
      el.style.setProperty("--i", i);
    });
  }

  /* ================= Карусель врачей ================= */
  function initDoctors() {
    var root = document.querySelector("[data-kc-doctors]");
    if (!root) return;

    var track = root.querySelector(".kc-docs__track");
    var prev = root.querySelector('[data-doc-nav="prev"]');
    var next = root.querySelector('[data-doc-nav="next"]');
    if (!track) return;

    if (typeof doctors === "undefined" || !doctors.length) {
      root.remove();
      return;
    }

    var list = doctors.filter(function (d) {
      return d.featured;
    });
    if (!list.length) list = doctors.slice();

    track.innerHTML = list
      .map(function (d) {
        var name = String(d.fullName || "").trim();
        var spec = String(d.specialty || "").trim();
        return (
          '<article class="kc-doc" data-reveal>' +
          '<div class="kc-doc__photo">' +
          '<img src="' + d.image + '" alt="' + escapeAttr(name) + " — " + escapeAttr(spec) +
          '" loading="lazy" decoding="async" width="300" height="400" />' +
          (spec ? '<span class="kc-doc__tag">' + escapeHtml(spec) + "</span>" : "") +
          "</div>" +
          '<h3 class="kc-doc__name">' + escapeHtml(name) + "</h3>" +
          '<p class="kc-doc__spec">' + escapeHtml(spec) + "</p>" +
          "</article>"
        );
      })
      .join("");

    document.dispatchEvent(new CustomEvent("kc:content"));

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
      track.scrollBy({
        left: dir * step(),
        behavior: reduced ? "auto" : "smooth",
      });
    }

    if (prev) prev.addEventListener("click", function () { scrollBy(-1); });
    if (next) next.addEventListener("click", function () { scrollBy(1); });

    // Карусель доступна с клавиатуры: сама лента фокусируема,
    // стрелки листают карточки.
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
      // Прогресс: 0 — секция только вошла снизу, 1 — прошла центр экрана.
      var start = vh * 0.85;
      var end = vh * 0.25;
      var p = (start - rect.top) / (start - end + rect.height * 0.4);
      p = Math.min(1, Math.max(0, p));
      journey.style.setProperty("--journey", p);

      steps.forEach(function (s, i) {
        s.classList.toggle("is-active", p >= (i + 0.35) / steps.length);
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

  /* ================= Вспомогательное ================= */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/\n/g, " ");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHero();
    initDoctors();
    initJourney();
    initFaq();
  });
})();
