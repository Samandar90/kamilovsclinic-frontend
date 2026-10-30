import { head, header, footer, modal, scripts, pageHero, leadForm, tx, t, ui, esc, PHONE, PHONE_SHOWN, YANDEX_ORG } from "../components.mjs";

export default {
  file: "contacts.html",
  render() {
    return `${head({
      path: "contacts.html",
      title: "Контакты клиники в Ташкенте — адрес, телефон, карта | Kamilovs Clinic",
      description: `Контакты Kamilovs Clinic: ул. Хувайдо, 7, Ташкент. Телефон ${PHONE_SHOWN}. Работаем 24/7. Запись онлайн и построение маршрута на карте.`,
      ogTitle: "Контакты Kamilovs Clinic в Ташкенте",
      ogDescription: `Адрес: ул. Хувайдо, 7, Ташкент. Телефон ${PHONE_SHOWN}. Работаем 24/7.`,
    })}

  <body>
    ${header({ active: "contacts.html" })}

    <main id="main">
      ${pageHero({
        crumbs: [{ href: "index.html", key: "nav.home" }, { key: "nav.contacts" }],
        kicker: "contacts.kicker",
        title: "page.contacts.title",
        lead: "page.contacts.lead",
      })}

      <div class="kc-pagebody">
        <div class="kc-wrap">
          <div class="kc-contacts">
            <div class="kc-infos" data-reveal>
              <div class="kc-info">
                <span class="kc-info__icon">${ui.pin}</span>
                <div>${tx("h3", "contacts.address")}${tx("p", "contacts.addressValue")}</div>
              </div>
              <div class="kc-info">
                <span class="kc-info__icon">${ui.phone}</span>
                <div>${tx("h3", "contacts.phone")}<a href="tel:${PHONE}">${PHONE_SHOWN}</a></div>
              </div>
              <div class="kc-info">
                <span class="kc-info__icon">${ui.clock}</span>
                <div>${tx("h3", "contacts.hours")}${tx("p", "contacts.hoursValue")}</div>
              </div>
              <div class="kc-info" data-kc-social-card hidden>
                <span class="kc-info__icon">${ui.chat}</span>
                <div>${tx("h3", "contacts.messengers")}<div class="kc-socials" data-kc-social="light"></div></div>
              </div>
              ${tx("p", "page.contacts.urgent", 'class="kc-urgent"')}
              <!-- Реквизиты и лицензию подставляет js/kc-legal.js. Пока поля в js/kc-config.js
                   пустые, карточка скрыта: «Лицензия № ___» выглядит хуже, чем её отсутствие. -->
              <div class="kc-legal-card" data-kc-legal-card hidden></div>
            </div>

            <div class="kc-formcard" data-kc-form-card data-reveal>
              ${tx("h2", "page.contacts.formTitle", "data-kc-form-head")}
              ${tx("p", "form.sub", "data-kc-form-head")}
              ${leadForm({ context: "contacts_page", prefix: "kcp" })}
            </div>
          </div>

          <div class="kc-contacts__map" data-reveal>
            <div class="kc-map">
              <iframe src="https://yandex.uz/map-widget/v1/org/${YANDEX_ORG}/?ll=69.203739%2C41.342219&z=17" title="${esc(t("contacts.mapTitle"))}" data-i18n-title="contacts.mapTitle" allowfullscreen="true" loading="lazy"></iframe>
            </div>
            <p style="margin-top: 20px">
              <a class="kc-link" target="_blank" rel="noopener" href="https://yandex.uz/maps/org/${YANDEX_ORG}/">${tx("span", "contacts.route")}${ui.arrow}</a>
            </p>
          </div>
        </div>
      </div>
    </main>

    ${footer()}
    ${modal("contacts_modal")}

    ${scripts(["kc-legal"])}
  </body>
</html>
`;
  },
};
