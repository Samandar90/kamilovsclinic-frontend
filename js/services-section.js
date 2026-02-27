// ===== Reveal on view =====
(() => {
  const els = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("is-revealed"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  els.forEach(el => io.observe(el));
})();

// ===== Carousel (dots + buttons + keyboard + swipe) =====
(() => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const track = root.querySelector(".carousel__track");
  const slides = Array.from(root.querySelectorAll(".carousel__slide"));
  const prevBtn = root.querySelector(".carousel__btn--prev");
  const nextBtn = root.querySelector(".carousel__btn--next");
  const dotsWrap = root.querySelector(".carousel__dots");

  let index = 0;

  // Build dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carousel__dot";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Слайд ${i + 1}`);
    b.setAttribute("aria-selected", i === 0 ? "true" : "false");
    b.addEventListener("click", () => go(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function update() {
    track.style.transform = `translate3d(${-index * 100}%,0,0)`;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    dots.forEach((d, i) => d.setAttribute("aria-selected", i === index ? "true" : "false"));
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  prevBtn?.addEventListener("click", () => go(index - 1));
  nextBtn?.addEventListener("click", () => go(index + 1));

  // Keyboard (when focused anywhere inside slider)
  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  });

  // Touch swipe
  let x0 = null;
  root.addEventListener("touchstart", (e) => {
    x0 = e.touches[0].clientX;
  }, { passive: true });

  root.addEventListener("touchend", (e) => {
    if (x0 == null) return;
    const x1 = e.changedTouches[0].clientX;
    const dx = x1 - x0;
    x0 = null;
    if (Math.abs(dx) < 40) return;
    if (dx > 0) go(index - 1);
    else go(index + 1);
  }, { passive: true });

  update();
})();