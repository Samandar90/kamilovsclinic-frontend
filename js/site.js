/* =========================================================
   Kamilovs Clinic — shared site behaviour for inner pages
   (year, scroll reveal, booking modal). Header burger and
   i18n live in header.js / lang-switcher.js.
   ========================================================= */
(function () {
  // Year
  document.addEventListener("DOMContentLoaded", function () {
    var y = document.getElementById("kc-year");
    if (y) y.textContent = new Date().getFullYear();
  });

  // Reveal on scroll (adds .is-in — matches CSS)
  document.addEventListener("DOMContentLoaded", function () {
    var els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) { io.observe(el); });
  });

  // Booking modal
  document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("kcModal");
    if (!modal) return;
    var body = document.body;

    window.kcOpenModal = function () {
      modal.classList.add("kc-modal--open");
      modal.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
    };
    window.kcCloseModal = function () {
      modal.classList.remove("kc-modal--open");
      modal.setAttribute("aria-hidden", "true");
      body.style.overflow = "";
    };
    modal.querySelectorAll("[data-kc-close]").forEach(function (el) {
      el.addEventListener("click", window.kcCloseModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("kc-modal--open")) {
        window.kcCloseModal();
      }
    });
  });
})();
