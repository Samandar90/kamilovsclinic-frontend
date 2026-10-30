import { head, header, footer, modal, scripts, pageHero, skyLayers, tx, t, brand, categories, serviceUrl, esc, PHONE_SHOWN } from "../components.mjs";
import { catKey, itemKey } from "../data/services.mjs";

const TINTS = ["cyan", "green", "lamp", "cyan", "green", "lamp", "cyan"];

const row = (cat, item, i) => {
  const name = item.ru[0];
  return `<div class="kc-row">
                <div>
                  <h3><a href="${serviceUrl(name)}" data-i18n="${itemKey(cat, i)}.title">${esc(name)}</a></h3>
                  <p data-i18n="${itemKey(cat, i)}.text">${esc(item.ru[1])}</p>
                </div>
                <div class="kc-row__actions">
                  ${tx("a", "page.services.more", `class="kc-row__more" href="${serviceUrl(name)}"`)}
                  ${tx("button", "page.services.book", `class="kc-btn kc-btn--outline kc-btn--sm" type="button" data-kc-book data-kc-goal="booking_open" data-service="${esc(name)}"`)}
                </div>
              </div>`;
};

const category = (cat, idx) => `<section class="kc-cat kc-tint--${TINTS[idx % TINTS.length]}" data-cat="${cat.id}" aria-labelledby="cat-${cat.id}">
            <header class="kc-cat__head" data-reveal>
              <span class="kc-cat__icon">${brand[cat.icon]}</span>
              <h2 class="kc-cat__name" id="cat-${cat.id}" data-i18n="${catKey(cat)}">${esc(cat.ru)}</h2>
            </header>
            <div data-reveal>
              ${cat.items.map((item, i) => row(cat, item, i)).join("\n              ")}
            </div>
          </section>`;

export default {
  file: "services.html",
  render() {
    return `${head({
      path: "services.html",
      title: "Услуги клиники в Ташкенте — стоматология, неврология, анализы | Kamilovs Clinic",
      description: `Услуги многопрофильной клиники Kamilovs Clinic в Ташкенте: стоматология, неврология, педиатрия, анализы и лаборатория, диагностика, процедуры и хиджама. Работаем 24/7. Телефон ${PHONE_SHOWN}.`,
      ogTitle: "Услуги клиники Kamilovs Clinic в Ташкенте",
      ogDescription: "Стоматология, неврология, педиатрия, анализы, диагностика и процедуры. Работаем 24/7.",
    })}

  <body>
    ${header({ active: "services.html" })}

    <main id="main">
      ${pageHero({
        crumbs: [{ href: "index.html", key: "nav.home" }, { key: "nav.services" }],
        kicker: "page.services.kicker",
        title: "page.services.title",
        lead: "page.services.lead",
      })}

      <div class="kc-pagebody">
        <div class="kc-wrap">
          <div class="kc-filter" data-kc-filter>
            ${tx("button", "page.services.filterAll", 'class="kc-filter__btn is-active" type="button" data-filter="all"')}
            ${categories.map((cat) => `<button class="kc-filter__btn" type="button" data-filter="${cat.id}" data-i18n="${catKey(cat)}">${esc(cat.ru)}</button>`).join("\n            ")}
          </div>

          ${categories.map(category).join("\n          ")}

          <div class="kc-band" data-reveal>
            ${skyLayers()}
            ${tx("h2", "cta.title")}
            ${tx("p", "cta.text")}
            <button class="kc-btn kc-btn--lamp kc-btn--lg" type="button" data-kc-book data-kc-goal="booking_open">${tx("span", "cta.btn")}</button>
          </div>
        </div>
      </div>
    </main>

    ${footer()}
    ${modal("services_modal")}

    ${scripts(["kc-catalog"])}
  </body>
</html>
`;
  },
};
