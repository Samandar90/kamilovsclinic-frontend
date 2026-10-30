import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { head, header, footer, modal, scripts, pageHero } from "../components.mjs";

const contentPath = fileURLToPath(new URL("../content/privacy.html", import.meta.url));

export default {
  file: "privacy.html",
  async render() {
    const article = await readFile(contentPath, "utf8");
    return `${head({
      path: "privacy.html",
      title: "Политика обработки персональных данных | Kamilovs Clinic",
      description: "Как Kamilovs Clinic собирает, использует и защищает персональные данные, которые вы оставляете в форме записи на приём.",
      ogDescription: "Какие данные мы собираем через форму записи, зачем и как их защищаем.",
      robots: "index, follow",
    })}

  <body>
    ${header({ active: "" })}

    <main id="main">
      ${pageHero({
        crumbs: [{ href: "index.html", key: "nav.home" }, { key: "page.privacy.title" }],
        kicker: "page.privacy.kicker",
        title: "page.privacy.title",
        long: true,
        lead: "page.privacy.lead",
      })}

      <div class="kc-pagebody">
        <div class="kc-wrap">
          ${article}
        </div>
      </div>
    </main>

    ${footer()}
    ${modal("privacy_modal")}

    ${scripts(["kc-legal"])}
  </body>
</html>
`;
  },
};
