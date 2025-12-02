// js/forms.js

document.addEventListener("DOMContentLoaded", function () {
  const currentUrl = window.location.href;

  // всем скрытым полям page_url подставляем текущий адрес страницы
  document
    .querySelectorAll('input[name="page_url"]')
    .forEach((el) => (el.value = currentUrl));
});
