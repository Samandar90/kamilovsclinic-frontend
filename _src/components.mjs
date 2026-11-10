/**
 * Общие блоки страниц: <head>, шапка, футер, окно записи, карточки.
 * Страницы (_src/pages/*.mjs) собираются из них в _src/build.mjs.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { dictionaries } from "./i18n.mjs";
import { brand, ui } from "./icons.mjs";
import { categories, catalogDictionary, serviceUrl } from "./data/services.mjs";

const RU = { ...dictionaries.ru, ...catalogDictionary("ru") };

export const PHONE = "+998880998080";
export const PHONE_SHOWN = "+998 88 099 80 80";
export const SITE = "https://www.kamilovsclinic.uz/";
const LEAD_URL = "https://kamilovsclinic-backend.onrender.com/lead/";
export const YANDEX_ORG = "66518861972";

/** Текст ключа на русском. Отсутствующий ключ — ошибка сборки, а не пустое место. */
export function t(key) {
  if (!(key in RU)) throw new Error(`Нет русского текста для ключа «${key}»`);
  return RU[key];
}

/** <tag data-i18n="key">русский текст</tag> */
export function tx(tag, key, attrs = "") {
  return `<${tag}${attrs ? " " + attrs : ""} data-i18n="${key}">${t(key)}</${tag}>`;
}

/** Атрибуты, переводимые на лету: aria-label и т. п. */
export function aria(key) {
  return `aria-label="${esc(t(key))}" data-i18n-aria="${key}"`;
}

export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Хэш стилей, скриптов и текстов: меняется только когда они правда изменились. */
const VERSION = (() => {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const hash = createHash("sha1");
  for (const dir of ["css", "js", "js/3d", "js/vendor", "_src"]) {
    for (const name of readdirSync(join(root, dir)).sort()) {
      if (/\.(css|js|mjs)$/.test(name) && name !== "kc-i18n.js") hash.update(readFileSync(join(root, dir, name)));
    }
  }
  return hash.digest("hex").slice(0, 8);
})();

/* ---------- <head> ---------- */
export function head(p) {
  const canonical = SITE + (p.path || "");
  const ogTitle = p.ogTitle || p.title;
  const ogDescription = p.ogDescription || p.description;
  return `<!doctype html>
<!-- Файл собран командой «node _src/build.mjs». Правьте исходники в папке _src. -->
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${esc(p.title)}</title>
    <meta name="description" content="${esc(p.description)}" />
    <meta name="author" content="Kamilovs Clinic" />
    <meta name="robots" content="${p.robots || "index, follow, max-image-preview:large"}" />
    <meta name="theme-color" content="#091f38" />
    <meta name="geo.region" content="UZ-TK" />
    <meta name="geo.placename" content="Tashkent" />
    <meta name="geo.position" content="41.342219;69.203739" />
    ${p.noCanonical ? "" : `<link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="ru" href="${canonical}" />
    <link rel="alternate" hreflang="uz" href="${canonical}" />
    <link rel="alternate" hreflang="x-default" href="${canonical}" />`}

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Kamilovs Clinic" />
    <meta property="og:title" content="${esc(ogTitle)}" />
    <meta property="og:description" content="${esc(ogDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:locale:alternate" content="uz_UZ" />
    <meta property="og:image" content="${SITE}images/og-cover.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Kamilovs Clinic — круглосуточная клиника 24/7 в Ташкенте" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(ogTitle)}" />
    <meta name="twitter:description" content="${esc(ogDescription)}" />
    <meta name="twitter:image" content="${SITE}images/og-cover.jpg" />

    <link rel="preload" as="font" type="font/woff2" href="fonts/ysabeau-office.woff2" crossorigin />
    <link rel="preload" as="font" type="font/woff2" href="fonts/onest.woff2" crossorigin />
    ${p.preload || ""}
    <link rel="stylesheet" href="css/kc-tokens.css?v=${VERSION}" />
    <link rel="stylesheet" href="css/kc-ui.css?v=${VERSION}" />
    <link rel="stylesheet" href="css/kc-sections.css?v=${VERSION}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <!-- Стартовое состояние анимаций включается только при работающем JS. -->
    <script>document.documentElement.classList.add("kc-js");</script>
    <script src="js/kc-config.js?v=${VERSION}"></script>
    <script src="js/kc-analytics.js?v=${VERSION}"></script>
    <!-- Небо задаётся до первой отрисовки, иначе при загрузке мелькнёт чужое время суток. -->
    <script src="js/kc-sky.js?v=${VERSION}"></script>
    ${p.structured || ""}
  </head>`;
}

/* ---------- Шапка ---------- */
const NAV_HOME = [
  ["index.html", "nav.home"],
  ["#services", "nav.services"],
  ["#doctors", "nav.doctors"],
  ["#about", "nav.about"],
  ["#contacts", "nav.contacts"],
];
const NAV_INNER = [
  ["index.html", "nav.home"],
  ["services.html", "nav.services"],
  ["doctors.html", "nav.doctors"],
  ["contacts.html", "nav.contacts"],
];

export function header({ active = "index.html", home = false } = {}) {
  const nav = home ? NAV_HOME : NAV_INNER;
  const links = nav
    .map(([href, key]) => {
      const on = href === active;
      return tx("a", key, `class="kc-nav__link${on ? " is-active" : ""}" href="${href}"${on ? ' aria-current="page"' : ""}`);
    })
    .join("\n          ");
  const sheet = nav
    .map(([href, key], i) => `<a class="kc-sheet__link" href="${href}" style="--i:${i}">${tx("span", key)}<i aria-hidden="true">${ui.arrow}</i></a>`)
    .join("\n        ");

  return `<a class="kc-skip" href="#main" data-i18n="a11y.skip">${t("a11y.skip")}</a>
    <header class="kc-header">
      <div class="kc-header__inner">
        <a href="index.html" class="kc-header__brand" ${aria("a11y.home")}>
          <img src="images/logo-inverse.svg" alt="" class="kc-logo kc-logo--inverse" width="183" height="50" />
          <img src="images/logo.svg" alt="" class="kc-logo kc-logo--color" width="183" height="50" />
        </a>

        <nav class="kc-nav" ${aria("a11y.nav")}>
          <span class="kc-nav__pill" aria-hidden="true"></span>
          ${links}
        </nav>

        <div class="kc-header__actions">
          <div class="kc-lang" role="group" ${aria("a11y.lang")}>
            <button class="kc-lang__btn kc-lang-btn is-active" data-lang="ru" type="button">RU</button>
            <button class="kc-lang__btn kc-lang-btn" data-lang="uz" type="button">UZ</button>
          </div>
          <a href="tel:${PHONE}" class="kc-header__phone">${ui.phone}<span>${PHONE_SHOWN}</span></a>
          <button class="kc-btn kc-btn--lamp kc-btn--sm kc-header__book" type="button" data-kc-book data-kc-goal="booking_open" data-i18n="header.book">${t("header.book")}</button>
          <button class="kc-burger" type="button" ${aria("a11y.menu")} aria-expanded="false" aria-controls="kcSheet">
            <span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <div class="kc-sheet" id="kcSheet" aria-hidden="true">
      <nav class="kc-sheet__nav" ${aria("a11y.mobileNav")}>
        ${sheet}
      </nav>
      <div class="kc-sheet__foot">
        <a class="kc-sheet__phone" href="tel:${PHONE}">${ui.phone}<span>${PHONE_SHOWN}</span></a>
        <button class="kc-btn kc-btn--lamp kc-btn--lg kc-btn--block" type="button" data-kc-book data-kc-goal="booking_open" data-i18n="header.book">${t("header.book")}</button>
      </div>
    </div>`;
}

/* ---------- Небо ---------- */
export const skyLayers = ({ live = false } = {}) => `<div class="kc-sky" aria-hidden="true">
        ${live ? '<div class="kc-sky__from"></div><div class="kc-sky__to"></div>' : ""}
        <div class="kc-sky__night">
          <div class="kc-sky__stars"></div>
          <div class="kc-sky__stars kc-sky__stars--twinkle"></div>
        </div>
        <div class="kc-sky__tile"></div>
      </div>`;

export const status = () => `<p class="kc-status">
            <i class="kc-status__dot" aria-hidden="true"></i>
            ${tx("span", "sky.open")}
            <span class="kc-status__sep" aria-hidden="true"></span>
            ${tx("span", "sky.city")}
            <span class="kc-status__sep" aria-hidden="true"></span>
            <time class="kc-num" data-kc-time>24/7</time>
          </p>`;

/* ---------- Шапка внутренней страницы ---------- */
export function pageHero({ crumbs = [], kicker, title, lead, titleId, leadId, kickerId, long = false }) {
  const trail = crumbs
    .map((c) => (c.href ? tx("a", c.key, `href="${c.href}"`) : c.id ? `<span id="${c.id}">${c.text}</span>` : tx("span", c.key)))
    .join('<i aria-hidden="true">/</i>');
  return `<section class="kc-phero">
        ${skyLayers()}
        <div class="kc-wrap kc-phero__inner">
          <div class="kc-phero__copy">
            <p class="kc-crumbs">${trail}</p>
            ${kicker ? tx("p", kicker, `class="kc-eyebrow kc-eyebrow--light"${kickerId ? ` id="${kickerId}"` : ""}`) : ""}
            ${titleId ? `<h1 id="${titleId}" class="kc-phero__title">${title}</h1>` : tx("h1", title, `class="kc-phero__title${long ? " kc-phero__title--long" : ""}"`)}
            ${leadId ? `<p id="${leadId}" class="kc-phero__lead">${lead}</p>` : lead ? tx("p", lead, 'class="kc-phero__lead"') : ""}
          </div>
          <!-- Объёмный знак клиники (js/3d/mark.js). Картинка показывается, только если 3D недоступно. -->
          <div class="kc-phero__mark kc-mark3d" data-kc-mark="logo" aria-hidden="true">
            <img src="images/mark.svg" alt="" width="660" height="541" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>`;
}

/* ---------- Форма заявки ---------- */
const CHIPS = [
  "svc.dental.title",
  "svc.neuro.title",
  "svc.ped.title",
  "svc.lab.title",
  "svc.diag.title",
  "svc.proc.title",
];

export function leadForm({ id, context, prefix, service = "", submitKey = "modal.submit" }) {
  const formId = id ? ` id="${id}"` : "";
  const chips = CHIPS.map((key) => tx("button", key, `class="kc-chip" type="button" data-kc-chip`)).join("");
  return `<form action="${LEAD_URL}" method="post"${formId} class="kc-form">
          <input type="hidden" name="form_context" value="${context}" />
          <input type="hidden" name="page_url" value="" />
          <!-- Ловушка для ботов: поле скрыто стилями, живой человек его не видит. -->
          <div class="kc-hp" aria-hidden="true">
            <label>${tx("span", "modal.hp")}
              <input type="text" name="website" tabindex="-1" autocomplete="off" />
            </label>
          </div>
          <input type="hidden" name="form_ts" value="" />

          <div class="kc-form__row">
            <div class="kc-field">
              ${tx("label", "modal.field.name.label", `class="kc-label" for="${prefix}-name"`)}
              <input class="kc-input" type="text" id="${prefix}-name" name="name" autocomplete="name" placeholder="${esc(t("modal.field.name.placeholder"))}" data-i18n-placeholder="modal.field.name.placeholder" />
            </div>
            <div class="kc-field">
              ${tx("label", "modal.field.phone.label", `class="kc-label" for="${prefix}-phone"`)}
              <input class="kc-input" type="tel" id="${prefix}-phone" name="phone" required autocomplete="tel" inputmode="tel" aria-describedby="${prefix}-phone-hint" placeholder="${esc(t("modal.field.phone.placeholder"))}" data-i18n-placeholder="modal.field.phone.placeholder" />
            </div>
          </div>
          ${tx("p", "modal.field.phone.hint", `class="kc-form-hint" id="${prefix}-phone-hint"`)}

          <div class="kc-field">
            ${tx("label", "modal.field.service.label", `class="kc-label" for="${prefix}-service"`)}
            <div class="kc-chips">${chips}</div>
            <input class="kc-input" type="text" id="${prefix}-service" name="service" value="${esc(service)}" placeholder="${esc(t("modal.field.service.placeholder"))}" data-i18n-placeholder="modal.field.service.placeholder" />
          </div>
          <div class="kc-field">
            ${tx("label", "modal.field.message.label", `class="kc-label" for="${prefix}-message"`)}
            <textarea class="kc-input" id="${prefix}-message" name="message" rows="2" placeholder="${esc(t("modal.field.message.placeholder"))}" data-i18n-placeholder="modal.field.message.placeholder"></textarea>
          </div>

          <button class="kc-btn kc-btn--lamp kc-btn--lg kc-btn--block" type="submit" data-i18n="${submitKey}">${t(submitKey)}</button>
          <p class="kc-form-legal">
            ${tx("span", "modal.privacyPrefix")}
            ${tx("a", "modal.privacyLink", 'href="privacy.html"')}${tx("span", "modal.privacySuffix")}
          </p>
        </form>`;
}

/* ---------- Окно записи ---------- */
export function modal(context) {
  return `<div class="kc-modal" id="kcModal" aria-hidden="true">
      <div class="kc-modal__overlay" data-kc-close></div>
      <div class="kc-modal__panel" data-kc-form-card role="dialog" aria-modal="true" aria-labelledby="kcModalTitle">
        <button class="kc-modal__close" type="button" data-kc-close ${aria("a11y.closeModal")}>${ui.close}</button>
        <div class="kc-modal__head" data-kc-form-head>
          ${status()}
          ${tx("h2", "modal.title", 'id="kcModalTitle"')}
          <p class="kc-modal__sub" data-i18n-html="modal.sub">${t("modal.sub")}</p>
        </div>
        <div class="kc-modal__body">
        ${leadForm({ id: "kcModalForm", context, prefix: "kcm" })}
        </div>
      </div>
    </div>`;
}

/* ---------- Футер ---------- */
const FOOTER_SERVICES = [
  ["svc.dental.title", "Стоматология"],
  ["svc.neuro.title", "Неврология"],
  ["svc.ped.title", "Педиатрия"],
  ["svc.lab.title", "Анализы и лаборатория"],
];

export function footer() {
  return `<footer class="kc-footer">
      <div class="kc-footer__tile" aria-hidden="true"></div>
      <div class="kc-wrap">
        <div class="kc-footer__hero">
          <p class="kc-footer__statement">${tx("span", "footer.statement")} ${tx("em", "footer.statementEm")}</p>
          <div class="kc-footer__now">
            ${status()}
            <a class="kc-footer__phone" href="tel:${PHONE}">${PHONE_SHOWN}</a>
          </div>
        </div>

        <div class="kc-footer__top">
          <div class="kc-footer__brand">
            <img src="images/logo-inverse.svg" alt="Kamilovs Clinic" class="kc-footer__logo" width="220" height="60" loading="lazy" />
            ${tx("p", "footer.text", 'class="kc-footer__about"')}
            <div class="kc-footer__socials" data-kc-social hidden></div>
          </div>

          <div>
            ${tx("h3", "footer.nav")}
            <div class="kc-footer__links">
              ${tx("a", "nav.home", 'href="index.html"')}
              ${tx("a", "nav.services", 'href="services.html"')}
              ${tx("a", "nav.doctors", 'href="doctors.html"')}
              ${tx("a", "nav.contacts", 'href="contacts.html"')}
            </div>
          </div>

          <div>
            ${tx("h3", "footer.services")}
            <div class="kc-footer__links">
              ${FOOTER_SERVICES.map(([key, ruName]) => tx("a", key, `href="${serviceUrl(ruName)}"`)).join("\n              ")}
            </div>
          </div>

          <div>
            ${tx("h3", "footer.contactsTitle")}
            <div class="kc-footer__links">
              <a href="tel:${PHONE}">${PHONE_SHOWN}</a>
              ${tx("span", "contacts.addressValue")}
              ${tx("span", "footer.hours")}
              ${tx("a", "footer.privacy", 'href="privacy.html"')}
            </div>
          </div>
        </div>

        <div class="kc-footer__bottom">
          <span>© <span data-kc-year>2026</span> Kamilovs Clinic</span>
          ${tx("span", "footer.bottom.right")}
        </div>
      </div>
    </footer>`;
}

/* ---------- Подвал документа ---------- */
export function scripts(extra = []) {
  const list = ["kc-i18n", ...extra, "kc-ui", "kc-lead-form", "kc-contact-widget", "kc-3d"];
  return list.map((name) => `<script src="js/${name}.js?v=${VERSION}"></script>`).join("\n    ");
}

/* ---------- Карточка врача ---------- */
export function doctorCard(d, { lazy = true, bio = false, tag = "article", reveal = true } = {}) {
  const specKey = `doc.spec.${d.spec}`;
  const alt = `${d.name} — ${t(specKey)}`;
  const bookAttrs = `data-kc-book data-service="${esc(t(specKey) + " — " + d.name)}" data-kc-goal="booking_open"`;
  return `<${tag} class="kc-doc kc-tint--${d.tint}"${reveal ? " data-reveal" : ""} data-spec="${d.spec}">
              <div class="kc-doc__photo" data-tilt="7">
                <span class="kc-doc__arch" aria-hidden="true"></span>
                <img src="images/doctors/cut-${d.id}.webp" alt="${esc(alt)}" width="800" height="680" ${lazy ? 'loading="lazy"' : ""} decoding="async" />
                <button class="kc-doc__book" type="button" ${bookAttrs}>
                  ${tx("span", "doctors.book")}<i aria-hidden="true">${ui.arrow}</i>
                </button>
              </div>
              <h3 class="kc-doc__name">${esc(d.name)}</h3>
              ${tx("p", specKey, 'class="kc-doc__spec"')}
              ${bio && d.bio ? tx("p", `doc.bio.${d.id}`, 'class="kc-doc__bio"') : ""}
            </${tag}>`;
}

export { brand, ui, categories, serviceUrl };
