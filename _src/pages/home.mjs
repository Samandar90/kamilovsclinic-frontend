import {
  head, header, footer, modal, scripts, skyLayers, status, leadForm, doctorCard,
  tx, t, aria, brand, ui, serviceUrl, esc, PHONE, PHONE_SHOWN, YANDEX_ORG,
} from "../components.mjs";
import { doctors } from "../data/doctors.mjs";

/* Отдельным блоком: тексты обязаны слово в слово совпадать с видимыми (faq.*). */
const faqItems = [1, 2, 3, 4, 5];

const structured = () => `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      "name": "Kamilovs Clinic",
      "url": "https://www.kamilovsclinic.uz/",
      "image": "https://www.kamilovsclinic.uz/images/og-cover.jpg",
      "logo": "https://www.kamilovsclinic.uz/images/logo.svg",
      "description": "Многопрофильная клиника в Ташкенте. Работаем 24/7: приём врачей, диагностика, анализы, стоматология, неврология.",
      "telephone": "${PHONE}",
      "priceRange": "$$",
      "currenciesAccepted": "UZS",
      "medicalSpecialty": ["Dentistry", "Neurology", "Pediatric", "Diagnostic"],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "ул. Хувайдо, 7",
        "addressLocality": "Ташкент",
        "addressCountry": "UZ"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 41.342219, "longitude": 69.203739 },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      },
      "availableLanguage": ["ru", "uz"]
    }
    </script>
    <script type="application/ld+json">
    ${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((n) => ({
        "@type": "Question",
        name: t(`faq.q${n}.question`),
        acceptedAnswer: { "@type": "Answer", text: t(`faq.q${n}.answer`) },
      })),
    })}
    </script>`;

/* ---------- Герой: три арки с настоящими врачами ---------- */
const HERO_DOCTORS = [
  { id: 2, tint: "cyan", pos: "left" },
  { id: 8, tint: "lamp", pos: "center" },
  { id: 6, tint: "green", pos: "right" },
];

const heroArch = ({ id, tint, pos }) => {
  const d = doctors.find((x) => x.id === id);
  const specKey = `doc.spec.${d.spec}`;
  return `<figure class="kc-arch kc-arch--${pos} kc-tint--${tint}">
              <span class="kc-arch__halo" aria-hidden="true"></span>
              <span class="kc-arch__glass" aria-hidden="true"></span>
              <span class="kc-arch__line" aria-hidden="true"></span>
              <img src="images/doctors/cut-${d.id}.webp" alt="${esc(d.name)} — ${esc(t(specKey))}" width="800" height="680" ${pos === "center" ? 'fetchpriority="high"' : ""} decoding="async" />
              <figcaption><b>${esc(d.name)}</b>${tx("span", specKey)}</figcaption>
            </figure>`;
};

const hero = () => `<section class="kc-hero" data-kc-hero>
        ${skyLayers({ live: true })}
        <div class="kc-wrap kc-hero__grid">
          <div class="kc-hero__copy">
            ${status()}
            <h1 class="kc-hero__title">
              ${tx("span", "hero.title1")}
              ${tx("em", "hero.title2")}
            </h1>
            ${tx("p", "hero.sub", 'class="kc-hero__sub"')}
            <div class="kc-hero__cta">
              <button class="kc-btn kc-btn--lamp kc-btn--lg" type="button" data-kc-book data-kc-goal="booking_open">
                ${tx("span", "hero.cta1")}<i class="kc-btn__ico" aria-hidden="true">${ui.arrow}</i>
              </button>
              <a class="kc-btn kc-btn--glass kc-btn--lg" href="tel:${PHONE}"><i class="kc-btn__lead" aria-hidden="true">${ui.phone}</i><span class="kc-num">${PHONE_SHOWN}</span></a>
            </div>
          </div>

          <div class="kc-hero__stage">
            <div class="kc-orb" aria-hidden="true"><div class="kc-orb__path"><i class="kc-orb__sun"></i><i class="kc-orb__moon"></i></div></div>
            ${HERO_DOCTORS.map(heroArch).join("\n            ")}
          </div>
        </div>

        <div class="kc-ground">
          <div class="kc-ground__light" aria-hidden="true"></div>
          <div class="kc-wrap kc-dial" data-kc-dial>
            <p class="kc-dial__status" aria-live="off">
              <b class="kc-num" data-kc-dial-time>24/7</b>
              <span data-kc-dial-phase>${t("sky.evening")}</span>
            </p>
            <div class="kc-dial__track">
              <input class="kc-dial__range" type="range" min="0" max="1439" step="1" value="720" ${aria("sky.slider")} data-kc-range />
              <div class="kc-dial__ticks" aria-hidden="true">
                <span style="--at:0">00</span><span style="--at:.25">06</span><span style="--at:.5">12</span><span style="--at:.75">18</span><span style="--at:1">24</span>
              </div>
            </div>
            ${tx("p", "sky.hint", 'class="kc-dial__hint"')}
          </div>
        </div>
      </section>`;

/* ---------- Цифры ---------- */
const metrics = () => `<section class="kc-metrics-wrap" ${aria("a11y.metrics")}>
        <div class="kc-wrap">
          <div class="kc-metrics" data-reveal-group>
            <div class="kc-metric" data-reveal>
              <b class="kc-metric__num">24/7</b>
              ${tx("span", "metric.1")}
            </div>
            <div class="kc-metric" data-reveal>
              <b class="kc-metric__num"><span data-kc-count="15">15</span>+</b>
              ${tx("span", "metric.2")}
            </div>
            <div class="kc-metric" data-reveal>
              <b class="kc-metric__num"><span data-kc-count="10000">10 000</span>+</b>
              ${tx("span", "metric.3")}
            </div>
          </div>
        </div>
      </section>`;

/* ---------- Направления ---------- */
const tile = (ruName, key, icon, tint) => `<a class="kc-tile kc-tint--${tint}" href="${serviceUrl(ruName)}" data-reveal>
              <span class="kc-tile__flood" aria-hidden="true"></span>
              <span class="kc-tile__icon">${brand[icon]}</span>
              ${tx("h3", `svc.${key}.title`)}
              ${tx("p", `svc.${key}.text`)}
              <i class="kc-tile__go" aria-hidden="true">${ui.arrow}</i>
            </a>`;

const services = () => `<section class="kc-section" id="services">
        <div class="kc-wrap">
          <div class="kc-head" data-reveal>
            ${tx("p", "services.kicker", 'class="kc-eyebrow"')}
            ${tx("h2", "services.title")}
          </div>

          <div class="kc-bento" data-reveal-group>
            <a class="kc-feature" href="${serviceUrl("Стоматология")}" data-reveal>
              <img src="images/room-dental-tall.webp" alt="Стоматологический кабинет Kamilovs Clinic" width="760" height="1000" loading="lazy" decoding="async" />
              <span class="kc-feature__body">
                <span class="kc-feature__icon">${brand.tooth}</span>
                ${tx("span", "svc.dental.title", 'class="kc-feature__title"')}
                ${tx("span", "svc.dental.text", 'class="kc-feature__text"')}
              </span>
              <i class="kc-tile__go" aria-hidden="true">${ui.arrow}</i>
            </a>
            ${tile("Неврология", "neuro", "brain", "cyan")}
            ${tile("Анализы и лаборатория", "lab", "flask", "green")}
            ${tile("Педиатрия", "ped", "bear", "lamp")}
            ${tile("Диагностика", "diag", "stethoscope", "cyan")}
            ${tile("Процедуры", "proc", "drop", "green")}
            <a class="kc-tile kc-tile--all" href="services.html" data-reveal>
              ${tx("h3", "services.all")}
              ${tx("p", "services.allText")}
              <i class="kc-tile__go" aria-hidden="true">${ui.arrow}</i>
            </a>
          </div>
        </div>
      </section>`;

/* ---------- Почему возвращаются ---------- */
const WHY = [
  ["clock", "cyan"],
  ["pulse", "green"],
  ["person", "lamp"],
  ["heart", "green"],
  ["receipt", "cyan"],
];

const why = () => `<section class="kc-section kc-why" id="about">
        <div class="kc-why__tile" aria-hidden="true"></div>
        <div class="kc-wrap kc-why__grid">
          <div class="kc-why__aside" data-reveal>
            <div class="kc-head kc-head--light">
              ${tx("p", "benefits.kicker", 'class="kc-eyebrow kc-eyebrow--light"')}
              ${tx("h2", "benefits.title")}
              ${tx("p", "benefits.lead")}
            </div>
            <button class="kc-btn kc-btn--lamp" type="button" data-kc-book data-kc-goal="booking_open">${tx("span", "cta.btn")}<i class="kc-btn__ico" aria-hidden="true">${ui.arrow}</i></button>
          </div>
          <div class="kc-why__list">
            ${WHY.map(([icon, tint], i) => `<article class="kc-whycard kc-tint--${tint}" style="--i:${i}">
              <span class="kc-whycard__icon">${brand[icon]}</span>
              <div>
                ${tx("h3", `why.${i + 1}.title`)}
                ${tx("p", `why.${i + 1}.text`)}
              </div>
            </article>`).join("\n            ")}
          </div>
        </div>
      </section>`;

/* ---------- Врачи ---------- */
const team = () => `<section class="kc-section" id="doctors" data-kc-doctors>
        <div class="kc-wrap">
          <div class="kc-head-row" data-reveal>
            <div class="kc-head">
              ${tx("p", "doctors.kicker", 'class="kc-eyebrow"')}
              ${tx("h2", "doctors.title")}
              ${tx("p", "doctors.sub")}
            </div>
            <div class="kc-docs__ctrl">
              <button class="kc-round" type="button" data-doc-nav="prev" ${aria("a11y.prev")}>${ui.arrowLeft}</button>
              <button class="kc-round" type="button" data-doc-nav="next" ${aria("a11y.next")}>${ui.arrow}</button>
            </div>
          </div>
        </div>
        <div class="kc-docs">
          <div class="kc-docs__track" tabindex="0" role="group" ${aria("a11y.doctors")}>
            ${doctors.map((d) => doctorCard(d, { reveal: false })).join("\n            ")}
          </div>
        </div>
        <div class="kc-wrap kc-docs__more" data-reveal>
          <a class="kc-link" href="doctors.html">${tx("span", "doctors.more")}${ui.arrow}</a>
        </div>
      </section>`;

/* ---------- Клиника изнутри: только настоящие снимки ---------- */
const gallery = () => `<section class="kc-section kc-section--sand" id="gallery">
        <div class="kc-wrap">
          <div class="kc-head" data-reveal>
            ${tx("p", "gallery.kicker", 'class="kc-eyebrow"')}
            ${tx("h2", "gallery.title")}
          </div>
          <div class="kc-gal" data-reveal-group>
            <figure class="kc-gal__item kc-gal__item--a" data-reveal>
              <div class="kc-gal__frame"><img src="images/room-dental-tall.webp" alt="Стоматологический кабинет Kamilovs Clinic" width="760" height="1000" loading="lazy" decoding="async" /></div>
              ${tx("figcaption", "gallery.cap1")}
            </figure>
            <figure class="kc-gal__item kc-gal__item--b" data-reveal>
              <div class="kc-gal__frame"><img src="images/room-dental-detail.webp" alt="Рабочее место стоматолога с инструментами" width="760" height="1000" loading="lazy" decoding="async" /></div>
              ${tx("figcaption", "gallery.cap2")}
            </figure>
            <figure class="kc-gal__item kc-gal__item--c" data-reveal>
              <div class="kc-gal__frame"><img src="images/room-procedure.webp" alt="Процедурный кабинет Kamilovs Clinic" width="760" height="1000" loading="lazy" decoding="async" /></div>
              ${tx("figcaption", "gallery.cap3")}
            </figure>
          </div>
        </div>
      </section>`;

/* ---------- Путь пациента ---------- */
const journey = () => `<section class="kc-section">
        <div class="kc-wrap">
          <div class="kc-head" data-reveal>
            ${tx("p", "flow.kicker", 'class="kc-eyebrow"')}
            ${tx("h2", "flow.title")}
          </div>
          <ol class="kc-journey">
            ${[1, 2, 3, 4].map((n) => `<li class="kc-step">
              <span class="kc-step__dot" aria-hidden="true">${n}</span>
              ${tx("h3", `flow.step${n}.title`)}
              ${tx("p", `flow.step${n}.text`)}
            </li>`).join("\n            ")}
          </ol>
        </div>
      </section>`;

/* ---------- Отзывы ---------- */
const reviews = () => `<section class="kc-section kc-section--mist" id="reviews" data-kc-reviews>
        <div class="kc-wrap kc-reviews">
          <div class="kc-reviews__aside" data-reveal>
            <div class="kc-head">
              ${tx("p", "reviews.kicker", 'class="kc-eyebrow"')}
              ${tx("h2", "reviews.title")}
              ${tx("p", "reviews.lead")}
            </div>
            <a class="kc-link" target="_blank" rel="noopener" href="https://yandex.uz/maps/org/${YANDEX_ORG}/reviews/">${tx("span", "reviews.link")}${ui.arrow}</a>
          </div>
          <div class="kc-reviews__frame" data-reveal></div>
        </div>
      </section>`;

/* ---------- FAQ ---------- */
const faq = () => `<section class="kc-section" id="faq">
        <div class="kc-wrap kc-faq">
          <div class="kc-faq__aside" data-reveal>
            <div class="kc-head">
              ${tx("p", "faq.kicker", 'class="kc-eyebrow"')}
              ${tx("h2", "faq.title")}
              ${tx("p", "faq.aside.text")}
            </div>
            <a class="kc-btn kc-btn--outline" href="tel:${PHONE}"><i class="kc-btn__lead" aria-hidden="true">${ui.phone}</i>${tx("span", "faq.call")}</a>
          </div>
          <div class="kc-acc" data-reveal>
            ${faqItems.map((n, i) => `<article class="kc-acc__item${i === 0 ? " is-open" : ""}">
              <button class="kc-acc__q" type="button" aria-expanded="${i === 0}">
                ${tx("span", `faq.q${n}.question`)}
                <span class="kc-acc__icon" aria-hidden="true"></span>
              </button>
              <div class="kc-acc__a"><div>${tx("p", `faq.q${n}.answer`)}</div></div>
            </article>`).join("\n            ")}
          </div>
        </div>
      </section>`;

/* ---------- Запись ---------- */
const booking = () => `<section class="kc-book" id="booking">
        ${skyLayers()}
        <div class="kc-wrap kc-book__grid">
          <div class="kc-book__copy" data-reveal>
            ${tx("p", "cta.kicker", 'class="kc-eyebrow kc-eyebrow--light"')}
            ${tx("h2", "cta.title")}
            ${tx("p", "cta.text", 'class="kc-book__text"')}
            <ul class="kc-book__points">
              ${[1, 2, 3].map((n) => `<li>${ui.check}${tx("span", `cta.point${n}`)}</li>`).join("\n              ")}
            </ul>
          </div>
          <div class="kc-book__card" data-kc-form-card data-reveal>
            ${tx("h3", "form.title", "data-kc-form-head")}
            ${tx("p", "form.sub", 'class="kc-book__sub" data-kc-form-head')}
            ${leadForm({ id: "kcHomeForm", context: "home_booking", prefix: "kch" })}
          </div>
        </div>
      </section>`;

/* ---------- Контакты ---------- */
const contacts = () => `<section class="kc-section" id="contacts">
        <div class="kc-wrap">
          <div class="kc-head" data-reveal>
            ${tx("p", "contacts.kicker", 'class="kc-eyebrow"')}
            ${tx("h2", "contacts.title")}
          </div>
          <div class="kc-place" data-reveal>
            <div class="kc-map">
              <iframe src="https://yandex.uz/map-widget/v1/org/${YANDEX_ORG}/?ll=69.203739%2C41.342219&z=17" title="${esc(t("contacts.mapTitle"))}" data-i18n-title="contacts.mapTitle" allowfullscreen="true" loading="lazy"></iframe>
            </div>
            <div class="kc-place__card">
              <dl class="kc-place__list">
                <div>${tx("dt", "contacts.address")}${tx("dd", "contacts.addressValue")}</div>
                <div>${tx("dt", "contacts.phone")}<dd><a href="tel:${PHONE}">${PHONE_SHOWN}</a></dd></div>
                <div>${tx("dt", "contacts.hours")}${tx("dd", "contacts.hoursValue")}</div>
                <div data-kc-social-card hidden>${tx("dt", "contacts.messengers")}<dd><span class="kc-socials" data-kc-social="light"></span></dd></div>
              </dl>
              <a class="kc-btn kc-btn--navy kc-btn--block" target="_blank" rel="noopener" href="https://yandex.uz/maps/org/${YANDEX_ORG}/">${tx("span", "contacts.route")}<i class="kc-btn__ico" aria-hidden="true">${ui.arrow}</i></a>
            </div>
          </div>
        </div>
      </section>`;

export default {
  file: "index.html",
  render() {
    return `${head({
      path: "",
      title: "Kamilovs Clinic — круглосуточная клиника 24/7 в Ташкенте",
      description: `Kamilovs Clinic — многопрофильная клиника в Ташкенте. Работаем 24/7 без выходных: приём врачей, диагностика, анализы, стоматология, неврология. Запись онлайн и по телефону ${PHONE_SHOWN}.`,
      ogDescription: "Многопрофильная клиника в Ташкенте. Работаем 24/7 — приём врачей, диагностика, анализы. Запись онлайн.",
      preload: '<link rel="preload" as="font" type="font/woff2" href="fonts/ysabeau-office-italic.woff2" crossorigin />\n    <link rel="preload" as="image" href="images/doctors/cut-8.webp" fetchpriority="high" />',
      structured: structured(),
    })}

  <body>
    ${header({ home: true })}

    <main id="main">
      ${hero()}
      ${metrics()}
      ${services()}
      ${why()}
      ${team()}
      ${gallery()}
      ${journey()}
      ${reviews()}
      ${faq()}
      ${booking()}
      ${contacts()}
    </main>

    ${footer()}
    ${modal("home_modal")}

    ${scripts(["kc-home", "kc-reviews"])}
  </body>
</html>
`;
  },
};
