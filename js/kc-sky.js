/**
 * kc-sky.js — небо над клиникой.
 *
 * Главное обещание клиники — она открыта всегда. Поэтому небо на сайте живёт
 * по настоящему времени Ташкента: ночью звёзды и окна светятся ярче, утром
 * розовеет горизонт, днём глубокая бирюза. На главной время можно подвигать
 * ползунком и убедиться, что в любой час клиника открыта.
 *
 * Палитра подобрана так, чтобы белый текст читался при любом времени суток:
 * верх и середина неба всегда дают контраст от 4.5:1, светлым бывает только
 * горизонт, а он скрыт за арками и панелью со шкалой.
 *
 * Скрипт отвечает за время и за запасной вид неба, собранный из CSS-слоёв.
 * На устройствах посильнее первый экран рисует 3D-сцена (js/3d/hero.js): она
 * берёт отсюда то же самое состояние неба через KC.sky, поэтому оба вида
 * всегда показывают одно и то же время.
 *
 * Скорость. Весь сайт получает цвета неба переменными раз в 20 секунд. Первый
 * экран при движении времени перерисовывать нельзя: большой градиент на телефоне
 * тормозит. Там две готовые заливки плавно проступают друг сквозь друга, а всё
 * остальное двигается через opacity и transform, это работа видеокарты.
 *
 * Скрипт подключён в <head>: значения задаются до первой отрисовки.
 */
(function () {
  // час, верх неба, середина, горизонт, яркость звёзд
  var KEYS = [
    [0, "#050f20", "#0a2038", "#103a58", 1],
    [4.5, "#061126", "#0d2544", "#1f4468", 0.9],
    [6, "#0e2447", "#2b4a78", "#c97f6b", 0.3],
    [7.5, "#103a64", "#2f6e97", "#f2b27a", 0],
    [10, "#07507a", "#0e7ba1", "#5fc1cf", 0],
    [13, "#045d86", "#07809f", "#66cdd6", 0],
    [16.5, "#07527b", "#12789c", "#8fcfc8", 0],
    [18.5, "#103a66", "#3f5f8c", "#f0a36b", 0.05],
    [19.75, "#0d2a52", "#43406f", "#e5765c", 0.25],
    [21, "#081a36", "#142f55", "#3a4f7c", 0.7],
    [24, "#050f20", "#0a2038", "#103a58", 1],
  ];

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function parse(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  var RGB = KEYS.map(function (k) {
    return [parse(k[1]), parse(k[2]), parse(k[3])];
  });

  function lerp3(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }
  function rgb(c) {
    return "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")";
  }

  /**
   * Состояние неба в данную минуту суток: одно описание и для CSS-слоёв,
   * и для 3D-сцены. Цвета — числа 0..255.
   */
  function state(minutes) {
    var h = minutes / 60;
    var i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1][0] <= h) i++;
    var t = (h - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0]);
    var stars = KEYS[i][4] + (KEYS[i + 1][4] - KEYS[i][4]) * t;

    // Солнце идёт с 6 до 20, луна — с 20 до 6, по одной дуге над арками.
    var day = h >= 6 && h < 20;
    var path = day ? (h - 6) / 14 : ((h + 24 - 20) % 24) / 10;

    return {
      segment: i, // отрезок таблицы и доля пройденного в нём
      blend: t,
      top: lerp3(RGB[i][0], RGB[i + 1][0], t),
      mid: lerp3(RGB[i][1], RGB[i + 1][1], t),
      low: lerp3(RGB[i][2], RGB[i + 1][2], t),
      stars: stars,
      glow: 0.5 + stars * 0.5, // окна клиники светятся ярче, когда вокруг темно
      day: day,
      path: path, // 0..1 вдоль дуги
      rise: Math.min(1, Math.min(path, 1 - path) * 10), // плавное появление у краёв дуги
    };
  }

  /** Время Ташкента в минутах. В Узбекистане нет перехода на летнее время. */
  function nowMinutes() {
    var d = new Date(Date.now() + 5 * 3600 * 1000);
    return d.getUTCHours() * 60 + d.getUTCMinutes();
  }

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }
  function label(minutes) {
    return pad(Math.floor(minutes / 60)) + ":" + pad(Math.floor(minutes % 60));
  }

  function phaseKey(minutes) {
    var h = minutes / 60;
    if (h < 5) return "sky.night";
    if (h < 8) return "sky.dawn";
    if (h < 12) return "sky.morning";
    if (h < 17) return "sky.day";
    if (h < 21) return "sky.evening";
    return "sky.late";
  }

  /* ---------- Общий доступ ко времени ---------- */
  var listeners = [];
  var api = {
    state: state,
    now: nowMinutes,
    minutes: nowMinutes(), // время, которое сейчас показано на странице
    cssOff: false, // true, когда первый экран рисует 3D-сцена и CSS-слои не нужны
    restoreCss: function () {
      api.cssOff = false;
    },
    on: function (fn) {
      listeners.push(fn);
    },
  };
  window.KC = window.KC || {};
  window.KC.sky = api;

  function emit(minutes) {
    api.minutes = minutes;
    for (var i = 0; i < listeners.length; i++) listeners[i](minutes);
  }

  /* ---------- Переменные для всего сайта ---------- */
  var themeMeta = null;
  function paintPage(minutes) {
    var st = state(minutes);
    var s = root.style;
    s.setProperty("--sky-a", rgb(st.top));
    s.setProperty("--sky-b", rgb(st.mid));
    s.setProperty("--sky-c", rgb(st.low));
    s.setProperty("--stars", st.stars.toFixed(3));
    s.setProperty("--glow", st.glow.toFixed(3));
    themeMeta = themeMeta || document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", rgb(st.top));
  }

  paintPage(nowMinutes());

  /* ---------- Запасное небо первого экрана: CSS-слои ---------- */
  function gradient(key) {
    return "linear-gradient(180deg," + key[1] + " 0%," + key[2] + " 62%," + key[3] + " 100%)";
  }

  function createHeroSky(hero) {
    var from = hero.querySelector(".kc-sky__from");
    var to = hero.querySelector(".kc-sky__to");
    var night = hero.querySelector(".kc-sky__night");
    var path = hero.querySelector(".kc-orb__path");
    var sun = hero.querySelector(".kc-orb__sun");
    var moon = hero.querySelector(".kc-orb__moon");
    var halos = [].slice.call(hero.querySelectorAll(".kc-arch__halo"));
    var ground = hero.querySelector(".kc-ground__light");
    var current = -1;

    return function paint(minutes) {
      var st = state(minutes);
      if (st.segment !== current) {
        current = st.segment;
        from.style.background = gradient(KEYS[current]);
        to.style.background = gradient(KEYS[current + 1]);
      }
      to.style.opacity = st.blend.toFixed(3);
      night.style.opacity = st.stars.toFixed(3);

      halos.forEach(function (el) {
        el.style.opacity = (st.glow * 0.5).toFixed(3);
      });
      if (ground) ground.style.opacity = st.glow.toFixed(3);

      path.style.transform =
        "translate(" + (st.path * 100).toFixed(2) + "%," + ((1 - Math.sin(st.path * Math.PI)) * 100).toFixed(2) + "%)";
      sun.style.opacity = st.day ? st.rise.toFixed(3) : "0";
      moon.style.opacity = st.day ? "0" : st.rise.toFixed(3);
    };
  }

  /* ---------- После загрузки разметки ---------- */
  function tr(key) {
    return window.KC && window.KC.t ? window.KC.t(key) : "";
  }

  function updateClocks() {
    var text = label(nowMinutes());
    document.querySelectorAll("[data-kc-time]").forEach(function (el) {
      el.textContent = text;
    });
  }

  function initDial() {
    var dial = document.querySelector("[data-kc-dial]");
    var hero = document.querySelector("[data-kc-hero]");
    if (!dial || !hero) return null;

    var paint = createHeroSky(hero);
    var range = dial.querySelector("[data-kc-range]");
    var time = dial.querySelector("[data-kc-dial-time]");
    var phase = dial.querySelector("[data-kc-dial-phase]");
    var shown = nowMinutes();
    var shownPhase = null;
    var raf = null;
    var back = null;
    var held = false;

    function show(minutes) {
      shown = minutes;
      if (!api.cssOff) paint(minutes);
      emit(minutes);
      range.value = Math.round(minutes);
      range.style.setProperty("--p", (minutes / 1439).toFixed(4));
      var text = label(minutes);
      time.textContent = text;
      range.setAttribute("aria-valuetext", text);
      var key = phaseKey(minutes);
      if (key !== shownPhase) {
        var phrase = tr(key);
        if (phrase) {
          phase.textContent = phrase;
          shownPhase = key;
        }
      }
    }

    function glide(from, to, ms) {
      cancelAnimationFrame(raf);
      if (reduced) {
        show(to);
        return;
      }
      var start = performance.now();
      function step(ts) {
        var t = Math.min(1, (ts - start) / ms);
        var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        show(from + (to - from) * e);
        if (t < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }

    function returnLater() {
      clearTimeout(back);
      back = setTimeout(function () {
        back = null;
        glide(shown, nowMinutes(), 1400);
      }, 5000);
    }

    range.addEventListener("input", function () {
      cancelAnimationFrame(raf);
      clearTimeout(back);
      back = null;
      show(Number(range.value));
    });
    ["pointerdown", "touchstart"].forEach(function (name) {
      range.addEventListener(name, function () {
        held = true;
        cancelAnimationFrame(raf);
        clearTimeout(back);
        back = null;
      }, { passive: true });
    });
    ["pointerup", "touchend", "change", "blur"].forEach(function (name) {
      range.addEventListener(name, function () {
        held = false;
        returnLater();
      });
    });

    // При первом заходе небо за пару секунд проживает часть дня и приходит к «сейчас».
    var now = nowMinutes();
    var seen = true;
    try {
      seen = sessionStorage.getItem("kc-sky-intro") === "1";
      sessionStorage.setItem("kc-sky-intro", "1");
    } catch (e) {
      /* нет хранилища — обойдёмся без вступления */
    }
    if (seen || reduced) {
      show(now);
    } else {
      var from = Math.max(0, now - 420);
      show(from);
      // Ждём отрисовки страницы, но недолго: на медленной связи load наступает поздно,
      // а всё это время небо показывало бы не то время суток.
      var started = false;
      var start = function () {
        if (started) return;
        started = true;
        glide(from, now, 2400);
      };
      window.addEventListener("load", start);
      setTimeout(start, 1500);
    }

    // 3D-сцена может выключиться (например, при потере видеокарты): возвращаем CSS-небо.
    api.restoreCss = function () {
      api.cssOff = false;
      paint(shown);
    };

    return {
      tick: function () {
        if (!held && !back) show(nowMinutes());
      },
      refresh: function () {
        shownPhase = null;
        show(shown);
      },
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateClocks();
    var dial = initDial();
    document.addEventListener("kc:lang", function () {
      if (dial) dial.refresh();
    });
    setInterval(function () {
      paintPage(nowMinutes());
      updateClocks();
      if (dial) dial.tick();
      else emit(nowMinutes());
    }, 20000);
  });
})();
