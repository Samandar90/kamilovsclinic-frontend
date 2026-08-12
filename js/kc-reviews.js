/**
 * kc-reviews.js — блок отзывов с Яндекс.Карт.
 *
 * Отзывы не дублируются вручную: виджет тянет их прямо из карточки
 * организации, поэтому они всегда актуальны и их нельзя подделать.
 *
 * iframe создаётся только когда блок подходит к экрану — иначе сторонний
 * запрос к Яндексу тормозил бы загрузку страницы у всех, включая тех,
 * кто до отзывов не доскроллит.
 *
 * Настройка — js/kc-config.js -> reviews.
 */
(function () {
  var cfg = (window.KC_CONFIG || {}).reviews || {};
  var KC = window.KC || {};

  var TITLE = {
    ru: { frame: "Отзывы о Kamilovs Clinic на Яндекс Картах" },
    uz: { frame: "Yandex Xaritalarda Kamilovs Clinic haqida sharhlar" },
  };

  function frameTitle() {
    var lang = KC.lang ? KC.lang() : "ru";
    return (TITLE[lang] || TITLE.ru).frame;
  }

  function mount(host) {
    if (host.querySelector("iframe")) return;

    var frame = document.createElement("iframe");
    frame.src =
      "https://yandex.uz/maps-reviews-widget/" +
      encodeURIComponent(cfg.yandexOrgId) +
      "?comments";
    frame.title = frameTitle();
    frame.loading = "lazy";
    frame.setAttribute("frameborder", "0");
    host.appendChild(frame);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var section = document.querySelector("[data-kc-reviews]");
    if (!section) return;

    // Нет id или блок выключен в настройках — секции на странице не будет.
    if (!cfg.show || !cfg.yandexOrgId) {
      section.remove();
      return;
    }

    var host = section.querySelector(".kc-reviews__frame");
    if (!host) return;

    if (!("IntersectionObserver" in window)) {
      mount(host);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          mount(host);
          io.disconnect();
        });
      },
      { rootMargin: "400px" }
    );
    io.observe(section);
  });
})();
