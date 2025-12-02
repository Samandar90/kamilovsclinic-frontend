document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".kc-header__burger");
  const mobileMenu = document.querySelector(".kc-header__mobile");

  if (!burger || !mobileMenu) return;

  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    mobileMenu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  });
});
