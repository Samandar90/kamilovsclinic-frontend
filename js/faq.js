// js/faq.js
document.addEventListener("DOMContentLoaded", () => {
  const faqRoot = document.querySelector(".kc-faq");
  if (!faqRoot) return;

  const items = Array.from(faqRoot.querySelectorAll(".kc-faq__item"));

  // Аккордеон: открытие/закрытие
  items.forEach((item) => {
    const btn = item.querySelector(".kc-faq__question");
    const answer = item.querySelector(".kc-faq__answer");
    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // закрываем все
      items.forEach((it) => {
        const ans = it.querySelector(".kc-faq__answer");
        const b = it.querySelector(".kc-faq__question");
        if (!ans || !b) return;
        it.classList.remove("is-open");
        b.setAttribute("aria-expanded", "false");
        ans.style.maxHeight = "0px";
      });

      // если текущий был закрыт — открываем
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });

    // если по умолчанию is-open (первый вопрос) — выставляем высоту
    if (item.classList.contains("is-open")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
      btn.setAttribute("aria-expanded", "true");
    }
  });

  // Плавное появление блока FAQ при скролле
  const revealTargets = faqRoot.querySelectorAll("[data-faq-reveal]");
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
      { threshold: 0.18 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }
});
