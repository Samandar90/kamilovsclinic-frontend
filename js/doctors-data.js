/**
 * Единый источник данных о врачах.
 *
 * Чтобы добавить врача:
 * 1. Положите фото в images/doctors/ как doctor-N.webp (N = id)
 * 2. Добавьте объект в массив doctors ниже
 *
 * Фильтры и карточки строятся автоматически из этого массива.
 */

const doctors = [
  {
    id: 1,
    fullName: "Тилляева Нозимахон Рахматхоновна",
    specialty: "Детский невролог",
    image: "images/doctors/doctor-1.webp",
    featured: true,
  },
  {
    id: 2,
    fullName: "Абдуллох Абдураззакович",
    specialty: "Стоматолог терапевт",
    description: "Проводит терапевтическое лечение зубов: лечение кариеса и его осложнений, эстетические реставрации и профилактику. Делает акцент на бережном подходе и понятных рекомендациях для пациентов.",
    image: "images/doctors/doctor-2.webp",
    featured: true,
  },
  {
    id: 3,
    fullName: "Гульхида Абдуназировна",
    specialty: "Хиджама",
    description: "Специалист по хиджаме (баночному массажу): безопасное применение суннской методики для снятия мышечного напряжения, улучшения кровообращения и общего самочувствия. Индивидуальный подбор зон и режима процедуры с учётом состояния пациента.",
    image: "images/doctors/doctor-3.webp",
    featured: true,
  },
  {
    id: 4,
    fullName: "Зиеда Давранбаевна",
    specialty: "Лаборант",
    description: "Проводит клинико-диагностические анализы: подготовка биоматериала, контроль качества исследований и своевременная передача результатов врачам. Соблюдает протоколы лаборатории и требования безопасности при работе с образцами.",
    image: "images/doctors/doctor-4.webp",
    featured: true,
  },
  {
    id: 5,
    fullName: "Шамсиддин Бахтиер огли",
    specialty: "Стоматолог ортопед",
    description: "Специализируется на ортопедической стоматологии: восстановление зубов коронками, мостовидными и съёмными протезами. Подбирает оптимальные несъёмные и съёмные конструкции с учётом эстетики и жевательной функции.",
    image: "images/doctors/doctor-5.webp",
    featured: true,
  },
  {
    id: 6,
    fullName: "Нодирахон Нуритдиновна",
    specialty: "Врач лаборатории",
    description: "Обеспечивает лабораторную поддержку клиники: подготовка биоматериала, контроль качества исследований и своевременная передача результатов врачам. Соблюдает протоколы лаборатории и требования безопасности.",
    image: "images/doctors/doctor-6.webp",
    featured: true,
  },
  {
    id: 7,
    fullName: "Латофат Гайратжановна",
    specialty: "Интегратив Стоматолог",
    description: "Практикует интегративную стоматологию: комплексный подход к здоровью полости рта и связь стоматологического лечения с общим состоянием организма. Составляет индивидуальный план терапии для устойчивого результата и профилактики осложнений.",
    image: "images/doctors/doctor-7.webp",
    featured: true,
  },
  {
    id: 8,
    fullName: "Мукаддас Равшановна",
    specialty: "Невролог",
    description:
      "Диагностика и лечение заболеваний нервной системы: головные боли, боли в спине, нарушения сна и другие неврологические состояния. Подробно объясняет назначения и сопровождает пациента на каждом этапе лечения.",
    image: "images/doctors/doctor-8.webp",
    featured: true,
  },
  {
    id: 9,
    fullName: "Мухаммадрахим Алишер огли",
    specialty: "Стоматолог терапевт",
    description:
      "Проводит терапевтическое лечение зубов: лечение кариеса, пульпита и других заболеваний полости рта. Работает бережно и подробно объясняет каждый этап лечения.",
    image: "images/doctors/doctor-9.webp",
    featured: true,
  },
];

const BADGE_VARIANTS = ["cyan", "blue", "green"];

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeJs(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}

function specialtySlug(specialty) {
  return specialty
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zа-яё0-9-]/gi, "");
}

function getUniqueSpecialties() {
  const seen = new Map();
  doctors.forEach((doc) => {
    const slug = specialtySlug(doc.specialty);
    if (!seen.has(slug)) {
      seen.set(slug, doc.specialty);
    }
  });
  return Array.from(seen.entries()).map(([slug, label]) => ({ slug, label }));
}

function getBadgeVariant(index) {
  return BADGE_VARIANTS[index % BADGE_VARIANTS.length];
}

function getHomepageDoctors() {
  const featured = doctors.filter((d) => d.featured);
  return featured.length ? featured : doctors;
}

window.kcOpenDoctorModal = function (fullName, specialty) {
  const serviceInput = document.querySelector(
    '#kcModalForm [name="service"], #kcModal [name="service"]'
  );
  if (serviceInput) {
    serviceInput.value = specialty + " — " + fullName;
  }
  if (typeof window.kcOpenModal === "function") {
    window.kcOpenModal();
  }
};

function createDoctorCardHTML(doctor, index) {
  const slug = specialtySlug(doctor.specialty);
  const variant = getBadgeVariant(index);
  const alt = doctor.specialty + " — " + doctor.fullName;
  const safeName = escapeJs(doctor.fullName);
  const safeSpecialty = escapeJs(doctor.specialty);

  return (
    '<li class="kc-docs__card" data-doc-spec="' +
    slug +
    '" data-reveal>' +
    '<div class="kc-docs__media">' +
    '<img src="' +
    escapeHtml(doctor.image) +
    '" alt="' +
    escapeHtml(alt) +
    '" class="kc-docs__img" loading="lazy" decoding="async" width="400" height="380" />' +
    '<span class="kc-docs__badge kc-docs__badge--' +
    variant +
    '">' +
    escapeHtml(doctor.specialty) +
    "</span>" +
    "</div>" +
    '<div class="kc-docs__body">' +
    '<h3 class="kc-docs__name">' +
    escapeHtml(doctor.fullName) +
    "</h3>" +
    '<p class="kc-docs__role">' +
    escapeHtml(doctor.specialty) +
    "</p>" +
    '<button class="kc-docs__btn" type="button" onclick="kcOpenDoctorModal(\'' +
    safeName +
    "', '" +
    safeSpecialty +
    "')\">Записаться</button>" +
    "</div>" +
    "</li>"
  );
}

function renderDoctorsPage() {
  const filterContainer = document.querySelector(
    ".kc-docs-page-filter__buttons"
  );
  const listEl = document.querySelector(".kc-docs-page-grid__list");
  if (!listEl) return;

  if (!doctors.length) {
    listEl.innerHTML =
      '<li class="kc-docs-page-grid__empty">Врачи скоро появятся в каталоге.</li>';
    if (filterContainer) {
      const allBtn = filterContainer.querySelector('[data-doc-filter="all"]');
      filterContainer.innerHTML = "";
      if (allBtn) filterContainer.appendChild(allBtn);
    }
    return;
  }

  if (filterContainer) {
    const allBtn = filterContainer.querySelector('[data-doc-filter="all"]');
    filterContainer.innerHTML = "";
    if (allBtn) {
      filterContainer.appendChild(allBtn);
    } else {
      const btn = document.createElement("button");
      btn.className = "is-active";
      btn.setAttribute("data-doc-filter", "all");
      btn.setAttribute("data-i18n", "docs.filter.all");
      btn.textContent = "Все";
      filterContainer.appendChild(btn);
    }

    getUniqueSpecialties().forEach(({ slug, label }) => {
      const btn = document.createElement("button");
      btn.setAttribute("data-doc-filter", slug);
      btn.textContent = label;
      filterContainer.appendChild(btn);
    });
  }

  listEl.innerHTML = doctors
    .map((doc, i) => createDoctorCardHTML(doc, i))
    .join("");
}

function renderDoctorsHomepage() {
  const listEl = document.querySelector(".kc-docs__list");
  if (!listEl) return;

  const homepageDoctors = getHomepageDoctors();

  if (!homepageDoctors.length) {
    listEl.innerHTML =
      '<li class="kc-docs-page-grid__empty">Врачи скоро появятся в каталоге.</li>';
    return;
  }

  listEl.innerHTML = homepageDoctors
    .map((doc, i) => createDoctorCardHTML(doc, i))
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderDoctorsPage();
  renderDoctorsHomepage();

  if (typeof window.initDoctorsFilters === "function") {
    window.initDoctorsFilters();
  }
  if (typeof window.initDoctorsRotate === "function") {
    window.initDoctorsRotate();
  }

  document.dispatchEvent(new CustomEvent("doctors:rendered"));
});
