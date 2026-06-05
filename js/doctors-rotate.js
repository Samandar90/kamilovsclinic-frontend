// js/doctors-rotate.js

let rotateTimer = null;

function initDoctorsRotate() {
  const list = document.querySelector(".kc-docs__list");
  if (!list) return;

  if (rotateTimer) {
    clearInterval(rotateTimer);
    rotateTimer = null;
  }

  const originalCards = Array.from(list.querySelectorAll(".kc-docs__card"));
  if (!originalCards.length) return;

  const templates = originalCards.map((card) => card.cloneNode(true));
  let startIndex = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 720) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function renderGroup() {
    const perView = getVisibleCount();
    list.innerHTML = "";

    for (let i = 0; i < perView; i++) {
      const src = templates[(startIndex + i) % templates.length];
      const card = src.cloneNode(true);
      card.classList.remove("is-visible");
      list.appendChild(card);

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

  renderGroup();

  const INTERVAL = 4000;
  rotateTimer = setInterval(nextGroup, INTERVAL);

  window.addEventListener("resize", renderGroup);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(rotateTimer);
    } else {
      rotateTimer = setInterval(nextGroup, INTERVAL);
    }
  });
}

window.initDoctorsRotate = initDoctorsRotate;
