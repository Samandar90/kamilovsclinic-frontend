import { head, header, footer, modal, scripts, skyLayers, status, tx, ui, PHONE, PHONE_SHOWN } from "../components.mjs";

export default {
  file: "404.html",
  render() {
    return `${head({
      path: "404.html",
      title: "Страница не найдена | Kamilovs Clinic",
      description: "Такой страницы нет. Клиника Kamilovs Clinic открыта круглосуточно.",
      robots: "noindex",
      noCanonical: true,
    })}

  <body>
    ${header({ active: "" })}

    <main id="main">
      <section class="kc-lost">
        ${skyLayers()}
        <div class="kc-wrap">
          ${status()}
          <h1>${tx("span", "page.404.title")}${tx("em", "page.404.titleEm")}</h1>
          ${tx("p", "page.404.text")}
          <div class="kc-hero__cta">
            <a class="kc-btn kc-btn--lamp kc-btn--lg" href="index.html">${tx("span", "page.404.home")}<i class="kc-btn__ico" aria-hidden="true">${ui.arrow}</i></a>
            <a class="kc-btn kc-btn--glass kc-btn--lg" href="tel:${PHONE}"><i class="kc-btn__lead" aria-hidden="true">${ui.phone}</i><span class="kc-num">${PHONE_SHOWN}</span></a>
          </div>
        </div>
      </section>
    </main>

    ${footer()}
    ${modal("not_found_modal")}

    ${scripts()}
  </body>
</html>
`;
  },
};
