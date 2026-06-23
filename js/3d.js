/* =========================================================
   Kamilovs Clinic — 3D / modern interactions
   - Injects hero depth layers (orbs + grid)
   - Pointer parallax on hero (desktop only)
   - 3D tilt on cards (desktop only)
   Performance: single rAF loop, passive listeners, fully
   disabled on touch / small screens / reduced-motion.
   ========================================================= */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined") return;

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Desktop = real hover + fine pointer + wide enough viewport.
  var isDesktop =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    window.innerWidth > 768;

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ---- 1. Inject hero depth layers (cheap, decorative) ---- */
  function buildHero() {
    var hero = document.getElementById("kc-hero");
    if (!hero || hero.querySelector(".kc-orbs")) return hero;

    var grid = document.createElement("div");
    grid.className = "kc-hero-grid";
    grid.setAttribute("aria-hidden", "true");

    var orbs = document.createElement("div");
    orbs.className = "kc-orbs";
    orbs.setAttribute("aria-hidden", "true");
    for (var i = 1; i <= 3; i++) {
      var o = document.createElement("span");
      o.className = "kc-orb kc-orb--" + i;
      orbs.appendChild(o);
    }

    // Insert behind the content (first children of the hero).
    hero.insertBefore(orbs, hero.firstChild);
    hero.insertBefore(grid, hero.firstChild);
    return hero;
  }

  /* ---- 2. Hero pointer parallax (desktop only) ---- */
  function initHeroParallax(hero) {
    if (!hero || !isDesktop || reduceMotion) return;
    var container = hero.querySelector(".kc-hero-container");
    if (!container) return;

    var tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = null;

    function loop() {
      // ease toward target
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      container.style.setProperty("--px", cx.toFixed(3));
      container.style.setProperty("--py", cy.toFixed(3));
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    hero.addEventListener(
      "pointermove",
      function (e) {
        var r = hero.getBoundingClientRect();
        // -1 .. 1 normalized
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (!raf) raf = requestAnimationFrame(loop);
      },
      { passive: true }
    );

    hero.addEventListener(
      "pointerleave",
      function () {
        tx = 0;
        ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      },
      { passive: true }
    );
  }

  /* ---- 3. Card glow that follows the cursor (desktop only) ----
     Only sets --mx / --my custom properties for the ::before sheen.
     Uses NO transform, so it never conflicts with the cards' existing
     CSS keyframe reveal animations (e.g. kc-benefits-in). */
  function initCardSheen() {
    if (!isDesktop || reduceMotion) return;

    var cards = document.querySelectorAll(
      ".kc-card3, .kc-card, .kc-benefits__item, .kc-why__item, .kc-flow__step"
    );
    if (!cards.length) return;

    cards.forEach(function (card) {
      var raf = null;
      var pending = null;

      function apply() {
        raf = null;
        if (!pending) return;
        card.style.setProperty("--mx", pending.mx.toFixed(1) + "%");
        card.style.setProperty("--my", pending.my.toFixed(1) + "%");
      }

      card.addEventListener(
        "pointermove",
        function (e) {
          var r = card.getBoundingClientRect();
          pending = {
            mx: ((e.clientX - r.left) / r.width) * 100,
            my: ((e.clientY - r.top) / r.height) * 100,
          };
          if (!raf) raf = requestAnimationFrame(apply);
        },
        { passive: true }
      );
    });
  }

  onReady(function () {
    var hero = buildHero();
    initHeroParallax(hero);
    initCardSheen();
  });
})();
