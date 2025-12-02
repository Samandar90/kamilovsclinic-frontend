// js/doctors-rotate.js
document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".kc-docs__list");
  if (!list) return;

  // Берём исходные карточки из HTML и сохраняем как шаблон
  const originalCards = Array.from(list.querySelectorAll(".kc-docs__card"));
  if (!originalCards.length) return;

  const templates = originalCards.map((card) => card.cloneNode(true));
  let startIndex = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 720) return 1;   // мобилка
    if (window.innerWidth <= 1024) return 2;  // планшет
    return 3;                                 // десктоп
  }

  function renderGroup() {
    const perView = getVisibleCount();

    // Очищаем список
    list.innerHTML = "";

    // Добавляем нужное количество карточек подряд
    for (let i = 0; i < perView; i++) {
      const src = templates[(startIndex + i) % templates.length];
      const card = src.cloneNode(true);
      card.classList.remove("is-visible");
      list.appendChild(card);

      // красивое появление
      requestAnimationFrame(() => {
        card.classList.add("is-visible");
      });
    }
  }

  function nextGroup() {
    const perView = getVisibleCount();
    startIndex = (startIndex + perView) % templates.length;
    renderGroup();
  }

  // первый рендер
  renderGroup();

  // авто-смена каждые 4 секунды
  const INTERVAL = 4000;
  let timer = setInterval(nextGroup, INTERVAL);

  // При ресайзе просто заново рендерим (и не сбиваем индекс)
  window.addEventListener("resize", () => {
    renderGroup();
  });

  // На всякий случай: при уходе со вкладки ставим на паузу
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      timer = setInterval(nextGroup, INTERVAL);
    }
  });
});
