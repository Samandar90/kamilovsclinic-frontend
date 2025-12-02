// js/reveal.js
// Простая и безопасная анимация появления по data-reveal

(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    const root = document.body || document.documentElement;
    if (!root) return;

    // Включаем "режим анимации" только когда JS точно работает
    root.classList.add("reveal-init");

    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!elements.length) return;

    function show(el) {
      el.classList.add("is-visible");
    }

    // IntersectionObserver — современный способ
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              show(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
        }
      );

      elements.forEach((el) => observer.observe(el));
    } else {
      // Фоллбек для старых браузеров — просто по скроллу
      function onScroll() {
        const winH =
          window.innerHeight || document.documentElement.clientHeight;

        elements.forEach((el) => {
          if (el.classList.contains("is-visible")) return;

          const rect = el.getBoundingClientRect();
          if (rect.top < winH * 0.85) {
            show(el);
          }
        });
      }

      window.addEventListener("scroll", onScroll);
      window.addEventListener("resize", onScroll);
      onScroll();
    }
  });
})();
