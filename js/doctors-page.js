// js/doctors-page.js
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(
    ".kc-docs-page-filter__buttons button"
  );
  const cards = document.querySelectorAll(
    ".kc-docs-page-grid__list .kc-docs__card"
  );

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-doc-filter");

      // активная кнопка
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // показываем/скрываем карточки
      cards.forEach((card) => {
        const spec = card.getAttribute("data-doc-spec");

        if (filter === "all" || spec === filter) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
