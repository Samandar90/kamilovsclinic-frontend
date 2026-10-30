import { head, header, footer, modal, scripts, pageHero, leadForm, doctorCard, tx, t, brand, ui, PHONE_SHOWN } from "../components.mjs";
import { doctors } from "../data/doctors.mjs";

const perk = (n, icon, tint) => `<div class="kc-perk kc-tint--${tint}">
                <span class="kc-perk__icon">${brand[icon]}</span>
                <div>
                  ${tx("h3", `page.detail.perk${n}.title`)}
                  ${tx("p", `page.detail.perk${n}.text`)}
                </div>
              </div>`;

export default {
  file: "service-detail.html",
  render() {
    return `${head({
      path: "service-detail.html",
      title: "Услуга клиники — запись на приём | Kamilovs Clinic",
      description: `Подробнее об услугах Kamilovs Clinic в Ташкенте и запись на приём. Современная клиника, работаем 24/7. Телефон ${PHONE_SHOWN}.`,
      robots: "index, follow",
    })}

  <body>
    ${header({ active: "services.html" })}

    <main id="main">
      ${pageHero({
        crumbs: [
          { href: "index.html", key: "nav.home" },
          { href: "services.html", key: "nav.services" },
          { id: "kc-sd-crumb", text: t("page.detail.kicker") },
        ],
        kicker: "page.detail.kicker",
        kickerId: "kc-sd-kicker",
        titleId: "kc-sd-title",
        title: t("page.detail.fallbackTitle"),
        leadId: "kc-sd-sub",
        lead: t("page.detail.fallbackSub"),
      })}

      <div class="kc-pagebody">
        <div class="kc-wrap kc-detail">
          <div>
            <div class="kc-perks" data-reveal>
              ${perk(1, "person", "cyan")}
              ${perk(2, "clock", "lamp")}
              ${perk(3, "heart", "green")}
            </div>

            <section class="kc-detail__block" id="kc-sd-list-block" hidden>
              ${tx("h2", "page.detail.inCategory")}
              <div id="kc-sd-list"></div>
            </section>

            <section class="kc-detail__block" id="kc-sd-docs-block" hidden>
              ${tx("h2", "page.detail.doctors")}
              <div class="kc-detail__docs" id="kc-sd-docs">
                ${doctors.map((d) => doctorCard(d, { reveal: false }).replace('class="kc-doc', `data-doctor="${d.id}" hidden class="kc-doc`)).join("\n                ")}
              </div>
            </section>

            <p class="kc-detail__block">
              <a class="kc-link" href="services.html">${tx("span", "page.detail.allServices")}${ui.arrow}</a>
            </p>
          </div>

          <aside class="kc-detail__aside">
            <div class="kc-formcard" data-kc-form-card>
              ${tx("h2", "modal.title", "data-kc-form-head")}
              ${tx("p", "form.sub", "data-kc-form-head")}
              ${leadForm({ context: "service_detail", prefix: "kcp" })}
            </div>
          </aside>
        </div>
      </div>
    </main>

    ${footer()}
    ${modal("service_detail_modal")}

    ${scripts(["kc-catalog"])}
  </body>
</html>
`;
  },
};
