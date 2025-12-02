// js/main.js

// ===== REVEAL-Анимации по data-reveal =====
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => io.observe(el));
  } else {
    // старые браузеры — просто показать
    items.forEach((el) => el.classList.add("is-in"));
  }
});

// ===== HOME SERVICES SLIDER (главная) =====
document.addEventListener("DOMContentLoaded", () => {
  // пытаемся найти секцию услуг на главной
  const root =
    document.getElementById("home-services") ||
    document.querySelector(".kc-hero + .kc-hs");

  if (!root) return;

  const media = root.querySelector(".kc-hs__media");
  const slides = Array.from(root.querySelectorAll(".kc-hs__slide"));
  const prevBtn = root.querySelector(".kc-hs__nav--prev");
  const nextBtn = root.querySelector(".kc-hs__nav--next");
  const dotsWrap = root.querySelector(".kc-hs__dots");

  // если чего-то важного нет — вообще не запускаем слайдер
  if (!media || !dotsWrap || !slides.length) return;

  let index = 0;
  let autoTimer = null;
  const AUTO_MS = 4000;

  // создаём точки
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "kc-hs__dot";
    dot.setAttribute("aria-label", `Слайд ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll("button"));

  function update() {
    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
      d.setAttribute("aria-current", i === index ? "true" : "false");
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  if (prevBtn) prevBtn.addEventListener("click", prev);
  if (nextBtn) nextBtn.addEventListener("click", next);

  // авто-прокрутка каждые 4 секунды
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTO_MS);
  }
  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  media.addEventListener("mouseenter", stopAuto);
  media.addEventListener("mouseleave", startAuto);
  media.addEventListener(
    "touchstart",
    () => stopAuto(),
    { passive: true }
  );
  media.addEventListener(
    "touchend",
    () => startAuto(),
    { passive: true }
  );

  // клик по play-кнопке
  media.addEventListener("click", (e) => {
    const play = e.target.closest(".kc-hs__play");
    if (!play) return;
    window.open(
      "https://www.youtube.com/results?search_query=kamilovs+clinic",
      "_blank"
    );
  });

  // init
  update();
  startAuto();
});

// ===== (СТАРЫЙ) DOCTORS-TRACK — ТЕПЕРЬ БЕЗОПАСНО И НЕ ЛОМАЕТСЯ =====
document.addEventListener("DOMContentLoaded", () => {
  const docsSection = document.querySelector(".kc-docs");
  if (!docsSection) return;

  const track = docsSection.querySelector(".kc-docs__track");
  // В новой вёрстке трека нет (есть kc-docs__viewport / kc-docs__list),
  // этим блоком можно не пользоваться — просто выходим, чтобы не было ошибки.
  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".kc-docs__card"));
  if (!cards.length) return;

  const GROUP = 3;
  let groupIndex = 0;
  let autoTimer = null;

  function isDesktop() {
    return window.innerWidth > 900;
  }

  function showGroup(idx) {
    const totalGroups = Math.ceil(cards.length / GROUP);
    groupIndex = (idx + totalGroups) % totalGroups;

    const start = groupIndex * GROUP;
    const end = start + GROUP;

    cards.forEach((card, i) => {
      const visible = i >= start && i < end;
      card.style.opacity = visible ? "1" : "0";
      card.style.pointerEvents = visible ? "auto" : "none";
      card.style.position = visible ? "relative" : "absolute";
      card.style.inset = visible ? "auto" : "0";
      card.style.transform = visible
        ? "translate3d(0, var(--shift-y, 0px), 0)"
        : "translate3d(0, 20px, 0)";
      card.style.transition = "opacity 0.45s ease, transform 0.45s ease";
    });
  }

  function resetForMobile() {
    cards.forEach((card) => {
      card.style.opacity = "";
      card.style.pointerEvents = "";
      card.style.position = "";
      card.style.inset = "";
      card.style.transform = "";
      card.style.transition = "";
    });
  }

  function startAuto() {
    stopAuto();
    if (!isDesktop()) return;
    showGroup(0);
    autoTimer = setInterval(() => {
      showGroup(groupIndex + 1);
    }, 4000);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function handleResize() {
    if (isDesktop()) {
      startAuto();
    } else {
      stopAuto();
      resetForMobile();
    }
  }

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(handleResize._t);
      handleResize._t = setTimeout(handleResize, 150);
    }
  );

  const parallaxCards = cards;
  function updateParallax() {
    const vh = window.innerHeight;
    parallaxCards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = (center - vh / 2) / vh;
      const depth = (i % GROUP) - 1;
      const shift = dist * 18 + depth * 4;
      card.style.setProperty("--shift-y", shift.toFixed(1) + "px");
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(updateParallax);
    },
    { passive: true }
  );

  handleResize();
  updateParallax();
});

// ===== FOOTER: год + кнопка "наверх" =====
document.addEventListener("DOMContentLoaded", () => {
  // год в футере
  const yearEl = document.getElementById("kc-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // кнопка "наверх"
  const toTop = document.querySelector(".kc-to-top");
  if (!toTop) return;

  const toggleToTop = () => {
    if (window.scrollY > 320) {
      toTop.classList.add("is-visible");
    } else {
      toTop.classList.remove("is-visible");
    }
  };

  toggleToTop();
  window.addEventListener("scroll", toggleToTop, { passive: true });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});


  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("kcModal");
    const openBtn = document.getElementById("heroBookBtn");
    const closeBtn = document.getElementById("kcModalClose");
    const overlay = document.querySelector(".kc-modal__overlay");

    // подставляем page_url
    document
      .querySelectorAll('input[name="page_url"]')
      .forEach((el) => (el.value = window.location.href));

    function openModal() {
      if (modal) {
        modal.classList.add("kc-modal--open");
      }
    }

    function closeModal() {
      if (modal) {
        modal.classList.remove("kc-modal--open");
      }
    }

    if (openBtn) {
      openBtn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeModal();
      });
    }

    if (overlay) {
      overlay.addEventListener("click", function () {
        closeModal();
      });
    }
  });



  // Открытие модалки: вызов функции openModal()
  function openModal() {
    document.getElementById("kcModal").classList.add("open");
  }

  // Закрытие
  document.getElementById("kcModalClose").onclick = () => {
    document.getElementById("kcModal").classList.remove("open");
  };

  // Подстановка page_url
  document
    .querySelectorAll('input[name="page_url"]')
    .forEach((el) => (el.value = window.location.href));

  // Перехват отправки формы внутри модалки
  const modalForm = document.getElementById("kcModalForm");
  const modalSuccess = document.getElementById("kcModalSuccess");

  modalForm.addEventListener("submit", async function (e) {
    // НЕ отменяем отправку!  
    // Потому что форма уходит напрямую на backend — это важно.
  });