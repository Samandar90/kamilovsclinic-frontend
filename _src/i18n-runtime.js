/**
 * Переключение языка. Выбор хранится в localStorage под ключом "kc-lang".
 *
 * Обычные тексты подставляются через textContent, поэтому разметка внутри
 * перевода напечаталась бы как текст: это безопасное поведение по умолчанию.
 * Когда разметка нужна (<strong> внутри фразы), элемент помечается отдельным
 * атрибутом data-i18n-html. Значения берутся только из этого словаря,
 * пользовательский ввод сюда не попадает.
 */
(function () {
  var DICT = window.KC_DICT;
  var DEFAULT_LANG = "ru";
  var lang = DEFAULT_LANG;

  try {
    if (localStorage.getItem("kc-lang") === "uz") lang = "uz";
  } catch (e) {
    /* приватный режим: язык живёт до закрытия страницы */
  }

  function tr(key) {
    var value = DICT[lang][key];
    return value !== undefined ? value : DICT[DEFAULT_LANG][key];
  }

  function each(attr, apply) {
    document.querySelectorAll("[" + attr + "]").forEach(function (el) {
      var value = tr(el.getAttribute(attr));
      if (value !== undefined) apply(el, value);
    });
  }

  function apply() {
    document.documentElement.lang = lang;
    each("data-i18n", function (el, v) { el.textContent = v; });
    each("data-i18n-html", function (el, v) { el.innerHTML = v; });
    each("data-i18n-placeholder", function (el, v) { el.setAttribute("placeholder", v); });
    each("data-i18n-aria", function (el, v) { el.setAttribute("aria-label", v); });
    each("data-i18n-title", function (el, v) { el.setAttribute("title", v); });

    document.querySelectorAll(".kc-lang-btn").forEach(function (btn) {
      var on = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.dispatchEvent(new CustomEvent("kc:lang"));
  }

  window.KC = window.KC || {};
  window.KC.t = tr;
  window.KC.lang = function () { return lang; };

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".kc-lang-btn") : null;
    if (!btn) return;
    lang = btn.getAttribute("data-lang") === "uz" ? "uz" : DEFAULT_LANG;
    try {
      localStorage.setItem("kc-lang", lang);
    } catch (err) {
      /* язык переключится, но не запомнится */
    }
    apply();
  });

  document.addEventListener("DOMContentLoaded", apply);
})();
