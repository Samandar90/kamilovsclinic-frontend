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
 * горизонт, а он скрыт за арками и полосой «земли».
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

  function mix(a, b, t) {
    var pa = parse(a);
    var pb = parse(b);
    return (
      "rgb(" +
      Math.round(pa[0] + (pb[0] - pa[0]) * t) + "," +
      Math.round(pa[1] + (pb[1] - pa[1]) * t) + "," +
      Math.round(pa[2] + (pb[2] - pa[2]) * t) + ")"
    );
  }

  /** Отрезок таблицы, в который попадает время: номер и доля пройденного. */
  function segment(minutes) {
    var h = minutes / 60;
    var i = 0;
    while (i < KEYS.length - 2 && KEYS[i + 1][0] <= h) i++;
    return { i: i, t: (h - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0]) };
  }

  function starsAt(seg) {
    return KEYS[seg.i][4] + (KEYS[seg.i + 1][4] - KEYS[seg.i][4]) * seg.t;
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

  /* ---------- Переменные для всего сайта ---------- */
  var themeMeta = null;
  function paintPage(minutes) {
    var seg = segment(minutes);
    var a = KEYS[seg.i];
    var b = KEYS[seg.i + 1];
    var stars = starsAt(seg);
    var s = root.style;
    s.setProperty("--sky-a", mix(a[1], b[1], seg.t));
    s.setProperty("--sky-b", mix(a[2], b[2], seg.t));
    s.setProperty("--sky-c", mix(a[3], b[3], seg.t));
    s.setProperty("--stars", stars.toFixed(3));
    s.setProperty("--glow", (0.5 + stars * 0.5).toFixed(3));
    themeMeta = themeMeta || document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", mix(a[1], b[1], seg.t));
  }

  paintPage(nowMinutes());

  /* ---------- Живое небо первого экрана ---------- */
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
      var seg = segment(minutes);
      if (seg.i !== current) {
        current = seg.i;
        from.style.background = gradient(KEYS[seg.i]);
        to.style.background = gradient(KEYS[seg.i + 1]);
      }
      to.style.opacity = seg.t.toFixed(3);

      var stars = starsAt(seg);
      night.style.opacity = stars.toFixed(3);

      // Окна клиники светятся ярче, когда вокруг темно.
      var glow = 0.5 + stars * 0.5;
      halos.forEach(function (el) {
        el.style.opacity = (glow * 0.5).toFixed(3);
      });
      if (ground) ground.style.opacity = glow.toFixed(3);

      // Солнце идёт с 6 до 20, луна — с 20 до 6, по одной дуге над арками.
      var h = minutes / 60;
      var day = h >= 6 && h < 20;
      var p = day ? (h - 6) / 14 : ((h + 24 - 20) % 24) / 10;
      var edge = Math.min(1, Math.min(p, 1 - p) * 10);
      path.style.transform =
        "translate(" + (p * 100).toFixed(2) + "%," + ((1 - Math.sin(p * Math.PI)) * 100).toFixed(2) + "%)";
      sun.style.opacity = day ? edge.toFixed(3) : "0";
      moon.style.opacity = day ? "0" : edge.toFixed(3);
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
      paint(minutes);
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
      // Запускаем, когда страница уже отрисована: вступление не должно мешать загрузке.
      window.addEventListener("load", function () {
        glide(from, now, 2400);
      });
    }

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
    }, 20000);
  });
})();
