/**
 * kc-lead-form.js — отправка заявок без ухода с сайта.
 *
 * Раньше формы уходили обычным cross-origin POST на onrender.com: пациент
 * физически покидал сайт и видел страницу чужого домена. Теперь отправка идёт
 * через fetch(), а результат показывается на месте.
 *
 * Прогрессивное улучшение: атрибут action у форм СОХРАНЁН. Если JS не
 * загрузился, браузер отправит форму по-старому — хуже, но заявка не потеряется.
 *
 * Работает со всеми формами, у которых action указывает на /lead/:
 * 5 модальных окон + встроенные формы на contacts.html и service-detail.html.
 */
(function () {
  var cfg = window.KC_CONFIG || {};
  var KC = window.KC || {};
  var track = KC.track || function () {};

  var TEXT = {
    ru: {
      sending: "Отправляем…",
      okTitle: "Заявка отправлена",
      okText: "Администратор перезвонит в течение 5 минут.",
      okAgain: "Отправить ещё одну заявку",
      errTitle: "Не удалось отправить заявку",
      errText: "Похоже, проблема со связью. Позвоните нам — мы уже готовы помочь:",
      errAgain: "Попробовать ещё раз",
      badPhone: "Укажите номер в формате +998 XX XXX XX XX",
      rateTitle: "Заявка уже принята",
      rateText: "С этого устройства недавно отправлено несколько заявок. Если дело срочное — позвоните, так быстрее:",
    },
    uz: {
      sending: "Yuborilmoqda…",
      okTitle: "Ariza yuborildi",
      okText: "Administrator 5 daqiqa ichida qo‘ng‘iroq qiladi.",
      okAgain: "Yana ariza yuborish",
      errTitle: "Arizani yuborib bo‘lmadi",
      errText: "Aloqada muammo bor. Bizga qo‘ng‘iroq qiling — yordam beramiz:",
      errAgain: "Qayta urinish",
      badPhone: "Raqamni +998 XX XXX XX XX ko‘rinishida kiriting",
      rateTitle: "Ariza allaqachon qabul qilingan",
      rateText: "Bu qurilmadan yaqinda bir necha ariza yuborilgan. Shoshilinch bo‘lsa, qo‘ng‘iroq qiling — bu tezroq:",
    },
  };

  function t(key) {
    var lang = KC.lang ? KC.lang() : "ru";
    return (TEXT[lang] || TEXT.ru)[key];
  }

  /* ---- Телефон ---------------------------------------------------------- */

  // Приводим ввод к виду "+998 90 123 45 67". Пустое поле не трогаем,
  // иначе пользователь не сможет его очистить.
  function formatUzPhone(value) {
    var digits = String(value || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.indexOf("998") === 0) digits = digits.slice(3);
    digits = digits.slice(0, 9);

    var out = "+998";
    if (digits.length) out += " " + digits.slice(0, 2);
    if (digits.length > 2) out += " " + digits.slice(2, 5);
    if (digits.length > 5) out += " " + digits.slice(5, 7);
    if (digits.length > 7) out += " " + digits.slice(7, 9);
    return out;
  }

  function phoneIsValid(value) {
    var digits = String(value || "").replace(/\D/g, "");
    if (digits.indexOf("998") === 0) digits = digits.slice(3);
    return digits.length === 9;
  }

  /* ---- Разметка результата ---------------------------------------------- */

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function successHtml() {
    return (
      '<div class="kc-lead-result__icon kc-lead-result__icon--ok" aria-hidden="true">✓</div>' +
      "<h3>" + escapeHtml(t("okTitle")) + "</h3>" +
      "<p>" + escapeHtml(t("okText")) + "</p>" +
      '<button type="button" class="kc-btn kc-btn--ghost" data-kc-retry>' +
      escapeHtml(t("okAgain")) +
      "</button>"
    );
  }

  // kind: "network" — связь недоступна, "rate" — сработал лимит на бэкенде.
  function errorHtml(kind) {
    var rate = kind === "rate";
    var phone = cfg.phone || "";
    var shown = cfg.phoneDisplay || phone;
    var links =
      '<a class="kc-lead-result__phone" href="tel:' + escapeHtml(phone) + '">' +
      escapeHtml(shown) +
      "</a>";

    if (KC.telegramUrl) {
      links +=
        '<a class="kc-btn kc-btn--ghost" target="_blank" rel="noopener"' +
        ' data-kc-goal="messenger_click" href="' + escapeHtml(KC.telegramUrl) + '">Telegram</a>';
    }

    // При срабатывании лимита кнопка «ещё раз» бессмысленна — она упрётся
    // в тот же лимит, поэтому оставляем только телефон и мессенджер.
    var retry = rate
      ? ""
      : '<button type="button" class="kc-btn kc-btn--ghost" data-kc-retry>' +
        escapeHtml(t("errAgain")) +
        "</button>";

    return (
      '<div class="kc-lead-result__icon kc-lead-result__icon--err" aria-hidden="true">!</div>' +
      "<h3>" + escapeHtml(t(rate ? "rateTitle" : "errTitle")) + "</h3>" +
      "<p>" + escapeHtml(t(rate ? "rateText" : "errText")) + "</p>" +
      '<div class="kc-lead-result__actions">' + links + "</div>" +
      retry
    );
  }

  /* ---- Инициализация одной формы ---------------------------------------- */

  function initForm(form) {
    if (form.hasAttribute("data-kc-ajax")) return;
    form.setAttribute("data-kc-ajax", "1");

    var submitBtn = form.querySelector('[type="submit"]');
    var phoneInput = form.querySelector('input[name="phone"]');
    var pageUrlInput = form.querySelector('input[name="page_url"]');
    var tsInput = form.querySelector('input[name="form_ts"]');
    var busy = false;

    if (pageUrlInput) pageUrlInput.value = window.location.href;

    // Метка времени открытия формы: бэкенд отбрасывает отправку, случившуюся
    // подозрительно быстро. Без JS поле остаётся пустым и проверка пропускается.
    function setFormTimestamp() {
      if (tsInput) tsInput.value = String(Date.now());
    }
    setFormTimestamp();

    // Панель результата — соседний блок, чтобы форму можно было вернуть.
    var result = document.createElement("div");
    result.className = "kc-lead-result";
    result.setAttribute("role", "status");
    result.setAttribute("tabindex", "-1");
    result.hidden = true;
    form.parentNode.insertBefore(result, form.nextSibling);

    // Сообщение об ошибке телефона — под самим полем.
    var phoneError = null;
    if (phoneInput) {
      phoneError = document.createElement("p");
      phoneError.className = "kc-field__error";
      phoneError.hidden = true;
      phoneError.id =
        "kc-phone-err-" + Math.random().toString(36).slice(2, 8);
      phoneInput.parentNode.appendChild(phoneError);

      phoneInput.addEventListener("input", function () {
        phoneInput.value = formatUzPhone(phoneInput.value);
        if (!phoneError.hidden && phoneIsValid(phoneInput.value)) {
          clearPhoneError();
        }
      });
    }

    // У поля уже может быть aria-describedby с подсказкой «без спама» —
    // ошибку добавляем к ней, а не затираем её.
    var describedByBase = phoneInput
      ? phoneInput.getAttribute("aria-describedby") || ""
      : "";

    function showPhoneError() {
      if (!phoneError) return;
      phoneError.textContent = t("badPhone");
      phoneError.hidden = false;
      phoneInput.setAttribute("aria-invalid", "true");
      phoneInput.setAttribute(
        "aria-describedby",
        (describedByBase + " " + phoneError.id).trim()
      );
      phoneInput.focus();
    }

    function clearPhoneError() {
      if (!phoneError) return;
      phoneError.hidden = true;
      phoneInput.removeAttribute("aria-invalid");
      if (describedByBase) {
        phoneInput.setAttribute("aria-describedby", describedByBase);
      } else {
        phoneInput.removeAttribute("aria-describedby");
      }
    }

    function showResult(html) {
      result.innerHTML = html;
      form.hidden = true;
      result.hidden = false;
      result.focus();
    }

    result.addEventListener("click", function (e) {
      if (!e.target.closest("[data-kc-retry]")) return;
      result.hidden = true;
      form.hidden = false;
      var first = form.querySelector("input, textarea");
      if (first) first.focus();
    });

    function setBusy(state) {
      busy = state;
      if (!submitBtn) return;
      submitBtn.disabled = state;
      if (state) {
        submitBtn.dataset.kcLabel = submitBtn.textContent;
        submitBtn.textContent = t("sending");
      } else {
        submitBtn.textContent = submitBtn.dataset.kcLabel || submitBtn.textContent;
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return; // защита от двойного клика

      if (phoneInput && !phoneIsValid(phoneInput.value)) {
        showPhoneError();
        track("lead_validation");
        return;
      }
      clearPhoneError();

      if (pageUrlInput) pageUrlInput.value = window.location.href;
      setBusy(true);

      // Render на бесплатном тарифе просыпается долго — держим щедрый таймаут.
      var controller = new AbortController();
      var timer = setTimeout(function () {
        controller.abort();
      }, cfg.leadTimeoutMs || 30000);

      // URLSearchParams даёт простой CORS-запрос без предварительного OPTIONS.
      var body = new URLSearchParams(new FormData(form));

      fetch(form.action || cfg.leadEndpoint, {
        method: "POST",
        body: body,
        signal: controller.signal,
      })
        .then(function (res) {
          if (res.status === 429) {
            showResult(errorHtml("rate"));
            track("lead_error", { reason: "rate_limit" });
            return;
          }
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          setFormTimestamp();
          showResult(successHtml());
          track("lead_submit");
        })
        .catch(function (err) {
          // Заявка могла и дойти — но лучше лишний звонок, чем потерянный пациент.
          showResult(errorHtml("network"));
          track("lead_error", { reason: err && err.name === "AbortError" ? "timeout" : "network" });
        })
        .finally(function () {
          clearTimeout(timer);
          setBusy(false);
        });
    });
  }

  /* ---- Старт ------------------------------------------------------------ */

  // Цель «открыл окно записи» вешается атрибутом data-kc-goal прямо в разметке:
  // site.js создаёт kcOpenModal внутри DOMContentLoaded, и оборачивать его
  // отсюда — гонка по порядку слушателей.
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('form[action*="/lead/"]').forEach(initForm);
  });
})();
