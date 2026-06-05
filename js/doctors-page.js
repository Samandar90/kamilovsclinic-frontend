// js/doctors-page.js

function initDoctorsFilters() {
  const filterContainer = document.querySelector(
    ".kc-docs-page-filter__buttons"
  );
  if (!filterContainer) return;

  const filterButtons = filterContainer.querySelectorAll("button");
  const cards = document.querySelectorAll(
    ".kc-docs-page-grid__list .kc-docs__card"
  );

  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });

  const freshButtons = filterContainer.querySelectorAll("button");

  freshButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-doc-filter");

      freshButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      cards.forEach((card) => {
        const spec = card.getAttribute("data-doc-spec");
        card.style.display =
          filter === "all" || spec === filter ? "" : "none";
      });
    });
  });
}

window.initDoctorsFilters = initDoctorsFilters;
