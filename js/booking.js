// booking.js
// Логика модального окна "Записаться":
// - Открытие/закрытие
// - Маска телефона (Uzbekistan)
// - Валидация
// - Защита от двойного клика (дублей)
// - Отправка на proxy /api/telegram-booking

(function () {
  let backdrop;
  let modal;
  let form;
  let submitBtn;
  let statusEl;
  let lastActiveElement = null;
  let isSubmitting = false;

  document.addEventListener("clinic:partialsReady", initBookingModal);

  function initBookingModal() {
    backdrop = document.querySelector("[data-booking-backdrop]");
    modal = document.querySelector("[data-booking-modal]");
    form = document.getElementById("bookingForm");
    submitBtn = form?.querySelector("[data-booking-submit]");
    statusEl = document.getElementById("bookingStatus");

    if (!backdrop || !modal || !form || !submitBtn || !statusEl) return;

    // Открытие из разных кнопок
    const openers = document.querySelectorAll("[data-booking-open]");
    openers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const defaultService = btn.getAttribute("data-service") || "";
        openModal(defaultService);
      });
    });

    // Закрытие
    const closers = modal.querySelectorAll("[data-booking-close]");
    closers.forEach((btn) =>
      btn.addEventListener("click", () => {
        closeModal();
      })
    );

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !backdrop.hasAttribute("hidden")) {
        closeModal();
      }
    });

    // Маска телефона
    const phoneInput = document.getElementById("bookingPhone");
    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        phoneInput.value = formatUzPhone(phoneInput.value);
      });
    }

    form.addEventListener("submit", onSubmit);
  }

  function openModal(defaultService) {
    if (!backdrop || !modal) return;

    lastActiveElement = document.activeElement;

    backdrop.removeAttribute("hidden");
    document.body.classList.add("body--no-scroll");

    if (defaultService) {
      const serviceSelect = document.getElementById("bookingService");
      if (serviceSelect) {
        const option = Array.from(serviceSelect.options).find(
          (o) => o.value === defaultService
        );
        if (option) {
          serviceSelect.value = defaultService;
        }
      }
    }

    // Сброс формы и статуса
    form.reset();
    clearErrors();
    setStatus("");

    // Фокус на поле имени
    const firstInput = form.querySelector("input, select, textarea, button");
    if (firstInput) {
      firstInput.focus();
    }
  }

  function closeModal() {
    if (!backdrop || !modal) return;
    backdrop.setAttribute("hidden", "true");
    document.body.classList.remove("body--no-scroll");

    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  }

  function formatUzPhone(value) {
    // Простейшая маска: +998 90 123 45 67
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("998")) {
      digits = digits.slice(3);
    }

    let result = "+998";

    if (digits.length > 0) {
      result += " " + digits.slice(0, 2);
    }
    if (digits.length >= 3) {
      result += " " + digits.slice(2, 5);
    }
    if (digits.length >= 6) {
      result += " " + digits.slice(5, 7);
    }
    if (digits.length >= 8) {
      result += " " + digits.slice(7, 9);
    }

    return result.trim();
  }

  function onSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    clearErrors();
    setStatus("");

    const formData = new FormData(form);
    const data = {
      name: formData.get("name")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      service: formData.get("service")?.toString().trim(),
      date: formData.get("date")?.toString().trim(),
      time: formData.get("time")?.toString().trim(),
      comment: formData.get("comment")?.toString().trim(),
      agree: formData.get("agree") === "on",
    };

    const isValid = validate(data);
    if (!isValid) return;

    isSubmitting = true;
    lockSubmit(true);

    sendToTelegram(data)
      .then(() => {
        setStatus(
          "Заявка отправлена. Мы свяжемся с вами в ближайшее время.",
          "success"
        );
        form.reset();
      })
      .catch((err) => {
        console.error(err);
        setStatus(
          "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь по телефону.",
          "error"
        );
      })
      .finally(() => {
        isSubmitting = false;
        lockSubmit(false);
      });
  }

  function validate(data) {
    let ok = true;

    if (!data.name || data.name.length < 2) {
      showError("name", "Введите имя и фамилию.");
      ok = false;
    }

    const phoneDigits = (data.phone || "").replace(/\D/g, "");
    if (
      !data.phone ||
      phoneDigits.length !== 12 ||
      !phoneDigits.startsWith("998")
    ) {
      showError(
        "phone",
        "Введите корректный номер телефона формата +998 XX XXX XX XX."
      );
      ok = false;
    }

    if (!data.agree) {
      showError("agree", "Необходимо согласиться с обработкой данных.");
      ok = false;
    }

    // Дата не обязательна, но если указана — пусть будет в будущем (просто пример)
    if (data.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateVal = new Date(data.date);
      if (dateVal < today) {
        showError("date", "Дата не может быть в прошлом.");
        ok = false;
      }
    }

    return ok;
  }

  function showError(field, message) {
    const el = document.querySelector(`[data-error-for="${field}"]`);
    if (el) {
      el.textContent = message;
    }
  }

  function clearErrors() {
    document.querySelectorAll(".form__error").forEach((el) => {
      el.textContent = "";
    });
  }

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    if (!message) {
      statusEl.removeAttribute("data-status");
    } else if (type) {
      statusEl.setAttribute("data-status", type);
    }
  }

  function lockSubmit(lock) {
    if (!submitBtn) return;
    submitBtn.disabled = lock;
    if (lock) {
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = "Отправляем...";
    } else {
      submitBtn.textContent = submitBtn.dataset.label || "Отправить";
    }
  }

  async function sendToTelegram(data) {
    // ВРЕМЕННЫЙ ФЕЙК — всегда успех.
    console.log("FAKE sendToTelegram", data);
    await new Promise((resolve) => setTimeout(resolve, 600));
    // ничего не возвращаем и не бросаем ошибки
  }
})();
