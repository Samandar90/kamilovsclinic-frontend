// js/gsap-animations.js
// Безопасные GSAP-анимации: если GSAP не загрузился — просто выходим.

(function () {
  if (typeof window === "undefined" || typeof window.gsap === "undefined") {
    console.warn("GSAP не найден — анимации отключены.");
    return;
  }

  const gsap = window.gsap;

  // ===== HERO анимация только на главной =====
  window.addEventListener("load", function () {
    const hero = document.querySelector(".kc-hero");
    if (!hero) return; // на внутренних страницах .kc-hero нет — сразу выходим

    const tl = gsap.timeline({
      defaults: { duration: 0.7, ease: "power3.out" },
    });

    tl.from(".kc-hero-bg", { opacity: 0, scale: 1.05 })
      .from(".kc-hero-logo", { y: 40, opacity: 0, scale: 0.9 }, "-=0.4")
      .from(".kc-hero-badge", { y: 30, opacity: 0 }, "-=0.4")
      .from(
        ".kc-hero-title .kc-hero-title-line",
        { y: 40, opacity: 0, stagger: 0.12 },
        "-=0.3"
      )
      .from(".kc-hero-sub", { y: 30, opacity: 0 }, "-=0.3")
      .from(
        ".kc-hero-cta .kc-hero-btn",
        { y: 30, opacity: 0, stagger: 0.1 },
        "-=0.3"
      )
      .from(
        ".kc-hero-features .kc-card",
        { y: 40, opacity: 0, stagger: 0.08 },
        "-=0.2"
      );
  });
})();
