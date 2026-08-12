/**
 * kc-analytics.js — Яндекс.Метрика и цели конверсии.
 *
 * Счётчик загружается ТОЛЬКО если в js/kc-config.js заполнен metricaId.
 * KC.track() безопасен всегда: без счётчика он просто ничего не делает,
 * поэтому остальной код может вызывать его без проверок.
 *
 * Цели, которые нужно создать в интерфейсе Метрики (тип «JavaScript-событие»):
 *   lead_submit      — заявка успешно отправлена   ← ГЛАВНАЯ КОНВЕРСИЯ
 *   lead_error       — заявку отправить не удалось (следите за этой цифрой)
 *   lead_validation  — пользователь ошибся в форме и не смог отправить
 *   booking_open     — открыто окно записи
 *   phone_click      — клик по номеру телефона
 *   messenger_click  — клик по Telegram / Instagram
 */
(function () {
  var cfg = (window.KC_CONFIG = window.KC_CONFIG || {});
  var counterId = String(cfg.metricaId || "").trim();

  /* ---- Загрузка счётчика ------------------------------------------------ */
  if (counterId) {
    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      for (var j = 0; j < e.scripts.length; j++) {
        if (e.scripts[j].src === r) return;
      }
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    window.ym(counterId, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }

  /* ---- Публичный трекер ------------------------------------------------- */
  function track(goal, params) {
    if (!counterId || typeof window.ym !== "function") return;
    try {
      window.ym(counterId, "reachGoal", goal, params || undefined);
    } catch (e) {
      /* аналитика никогда не должна ронять страницу */
    }
  }

  window.KC = window.KC || {};
  window.KC.track = track;

  /* ---- Автоматические цели ---------------------------------------------
   * Один делегированный слушатель на документ: работает и для элементов,
   * которые появятся позже (карточки врачей, плавающий виджет).
   * -------------------------------------------------------------------- */
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target.closest ? e.target.closest("a[href], button") : null;
      if (!el) return;

      var explicit = el.getAttribute("data-kc-goal");
      if (explicit) {
        track(explicit);
        return;
      }

      var href = el.getAttribute("href") || "";
      if (href.indexOf("tel:") === 0) track("phone_click");
    },
    true
  );
})();
