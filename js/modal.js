// js/modal.js

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("kcModal");
  const closeBtn = document.getElementById("kcModalClose");
  const overlay = document.querySelector(".kc-modal__overlay");
  const triggers = document.querySelectorAll("[data-open-modal]");

  if (!modal) return;

  // подставляем текущий URL в скрытое поле
  document
    .querySelectorAll('input[name="page_url"]')
    .forEach((el) => (el.value = window.location.href));

  function openModal() {
    modal.classList.add("kc-modal--open");
  }

  function closeModal() {
    modal.classList.remove("kc-modal--open");
  }

  // все кнопки с data-open-modal открывают модалку
  triggers.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // крестик закрывает
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closeModal();
    });
  }

  // клик по фону закрывает
  if (overlay) {
    overlay.addEventListener("click", function () {
      closeModal();
    });
  }

  // ESC закрывает
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });
});
