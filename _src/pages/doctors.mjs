import { head, header, footer, modal, scripts, pageHero, skyLayers, doctorCard, tx, t, esc } from "../components.mjs";
import { doctors } from "../data/doctors.mjs";

/* Фильтр: уникальные специальности в порядке первого появления. */
const specs = [...new Set(doctors.map((d) => d.spec))];

export default {
  file: "doctors.html",
  render() {
    return `${head({
      path: "doctors.html",
      title: "Врачи клиники в Ташкенте — наши специалисты | Kamilovs Clinic",
      description: "Команда врачей Kamilovs Clinic в Ташкенте: стоматологи, неврологи, специалисты лаборатории и процедурного кабинета. Опытные врачи, запись онлайн и по телефону.",
      ogTitle: "Врачи клиники Kamilovs Clinic в Ташкенте",
      ogDescription: "Опытные специалисты: стоматология, неврология, лаборатория, процедуры.",
    })}

  <body>
    ${header({ active: "doctors.html" })}

    <main id="main">
      ${pageHero({
        crumbs: [{ href: "index.html", key: "nav.home" }, { key: "nav.doctors" }],
        kicker: "doctors.kicker",
        title: "page.doctors.title",
        lead: "page.doctors.lead",
      })}

      <div class="kc-pagebody">
        <div class="kc-wrap">
          <div class="kc-filter" data-kc-doc-filter>
            ${tx("button", "doctors.filterAll", 'class="kc-filter__btn is-active" type="button" data-filter="all"')}
            ${specs.map((spec) => tx("button", `doc.spec.${spec}`, `class="kc-filter__btn" type="button" data-filter="${spec}"`)).join("\n            ")}
          </div>

          <div class="kc-docgrid">
            ${doctors.map((d, i) => doctorCard(d, { bio: true, lazy: i > 2 })).join("\n            ")}
          </div>

          <div class="kc-band" data-reveal>
            ${skyLayers()}
            ${tx("h2", "docs.cta.title")}
            ${tx("p", "docs.cta.text")}
            <button class="kc-btn kc-btn--lamp kc-btn--lg" type="button" data-kc-book data-kc-goal="booking_open">${tx("span", "docs.cta.btn")}</button>
          </div>
        </div>
      </div>
    </main>

    ${footer()}
    ${modal("doctors_modal")}

    ${scripts(["kc-catalog"])}
  </body>
</html>
`;
  },
};
