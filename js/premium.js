/* =========================================================
   Kamilovs Clinic — premium micro-interactions
   Scroll progress bar + count-up stats. Lightweight,
   transform/width only, reduced-motion aware.
   ========================================================= */
(function () {
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Scroll progress bar ----
  function initProgress() {
    var bar = document.createElement("div");
    bar.className = "kc-progress";
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var h =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      var p = h > 0 ? (window.scrollY || window.pageYOffset) / h : 0;
      bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  // ---- Count-up numbers ----
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    if (reduce) {
      el.textContent = prefix + target.toLocaleString("ru-RU") + suffix;
      return;
    }
    var dur = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      var val = Math.round(target * eased);
      el.textContent = prefix + val.toLocaleString("ru-RU") + suffix;
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(animateCount);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animateCount(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    // Note: we intentionally do NOT pre-zero here — the final value
    // stays in the HTML as a safe fallback if rAF never runs (e.g. a
    // backgrounded tab). The count-up starts from 0 inside animateCount.
    els.forEach(function (el) { io.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProgress();
    initCounters();
  });
})();
