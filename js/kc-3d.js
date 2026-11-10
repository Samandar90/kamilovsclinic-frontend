/**
 * kc-3d.js — включает 3D там, где устройство его потянет.
 *
 * Сам по себе скрипт крошечный. Движок и сцены (папка js/3d) загружаются
 * позже и только если они нужны: страница сначала показывается целиком в
 * обычном виде, 3D «проявляется» поверх. На слабых устройствах, при экономии
 * трафика, при настройке «меньше движения» и без видеокарты остаётся обычная версия.
 *
 * Сцены:
 *   [data-kc-hero]  — первый экран главной, js/3d/hero.js
 *   [data-kc-mark]  — объёмный знак клиники, js/3d/mark.js
 *   [data-kc-depth] — объёмные фотографии кабинетов, js/3d/depth.js
 */
(function () {
  var KC = (window.KC = window.KC || {});
  var src = (document.currentScript && document.currentScript.src) || "";
  var base = src.replace(/kc-3d\.js.*$/, "");
  var version = (src.match(/\?v=[\w-]+/) || [""])[0];
  // Через столько после загрузки страницы подключается 3D: к этому времени
  // вступительная анимация закончилась, и подготовка сцены ей не мешает
  var SETTLE_MS = 2400;

  function capable() {
    if (!base || !window.WebGL2RenderingContext || !window.IntersectionObserver || !window.ResizeObserver) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    var c = navigator.connection;
    if (c && (c.saveData || /2g/.test(c.effectiveType || ""))) return false;
    // Слабым устройствам 3D не в радость: оставляем им быструю обычную версию
    return (navigator.hardwareConcurrency || 4) >= 4 && (navigator.deviceMemory || 4) >= 4;
  }

  /** Сцена первого экрана — самая тяжёлая: на телефонах она только для старших моделей. */
  function heroCapable() {
    var phone = window.matchMedia("(pointer: coarse)").matches;
    return !(phone && navigator.deviceMemory && navigator.deviceMemory < 8);
  }

  /**
   * Настоящая видеокарта, а не программная отрисовка: на ней 3D шло бы рывками.
   * Проверка занимает несколько миллисекунд и избавляет устройства без видеокарты
   * от напрасной загрузки движка.
   */
  function hasGpu() {
    try {
      var gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
      if (!gl) return false;
      var lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext(); // проба больше не нужна: память видеокарты освобождаем сразу
      return true;
    } catch (e) {
      return false;
    }
  }

  function load(name) {
    return import(base + "3d/" + name + ".js" + version);
  }

  function idle(fn) {
    if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 1200 });
    else setTimeout(fn, 200);
  }

  /** Запускает fn, когда хотя бы один из элементов подошёл к экрану. */
  function near(elements, fn) {
    var io = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();
      fn();
    }, { rootMargin: "50% 0px" });
    elements.forEach(function (el) { io.observe(el); });
  }

  function quiet() {
    /* 3D — украшение: если оно не загрузилось, страница работает как раньше */
  }

  /** Без 3D на местах объёмных знаков остаются обычные картинки (см. .kc-no3d в стилях). */
  function plain() {
    document.documentElement.classList.add("kc-no3d");
  }

  function mount() {
    if (!hasGpu()) {
      KC.has3d = false;
      plain();
      return;
    }
    var hero = document.querySelector("[data-kc-hero]");
    if (hero && KC.sky && heroCapable()) {
      near([hero], function () {
        load("hero").then(function (m) { return m.mountHero(hero, KC.sky); }).then(function (api) { KC.hero3d = api; }).catch(quiet);
      });
    }

    // Скрытые на этой ширине экрана знаки пропускаем
    var marks = [].slice.call(document.querySelectorAll("[data-kc-mark]")).filter(function (el) { return el.offsetWidth > 0; });
    if (marks.length) {
      near(marks, function () {
        // Видеокарта проверяется при создании сцены: нет её — остаются обычные картинки
        load("mark").then(function (m) { return m.mountMarks(marks); }).then(function (views) { if (!views) plain(); }).catch(plain);
      });
    }

    var photos = [].slice.call(document.querySelectorAll("[data-kc-depth]"));
    if (photos.length) {
      near(photos, function () {
        load("depth").then(function (m) { return m.mountDepth(photos); }).catch(quiet);
      });
    }
  }

  function start() {
    KC.has3d = capable();
    if (!KC.has3d) {
      plain();
      return;
    }
    // 3D подключается, когда страница уже показана и успокоилась, — или сразу,
    // как только посетитель шевельнул мышью: тогда сцена нужна ему уже сейчас
    var begun = false;
    function begin(e) {
      if (begun || (e && e.pointerType !== "mouse")) return;
      begun = true;
      window.removeEventListener("pointermove", begin);
      idle(mount);
    }
    window.addEventListener("pointermove", begin, { passive: true });
    setTimeout(begin, SETTLE_MS);
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();
