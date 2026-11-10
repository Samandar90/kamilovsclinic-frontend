/**
 * Сборка сайта: node _src/build.mjs
 *
 * Без зависимостей. Страницы из _src/pages собираются в готовые HTML-файлы
 * в корне репозитория — их и раздаёт GitHub Pages. Папки с подчёркиванием
 * Jekyll на GitHub Pages не публикует, поэтому _src на сайт не попадает.
 *
 * Сборка останавливается с ошибкой, если у текста нет перевода: на сайт не
 * может попасть страница с ключом вместо слов или с дырой в узбекской версии.
 */
import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { dictionaries } from "./i18n.mjs";
import { catalogDictionary, categories } from "./data/services.mjs";
import { doctors } from "./data/doctors.mjs";

import home from "./pages/home.mjs";
import services from "./pages/services.mjs";
import serviceDetail from "./pages/service-detail.mjs";
import doctorsPage from "./pages/doctors.mjs";
import contacts from "./pages/contacts.mjs";
import privacy from "./pages/privacy.mjs";
import notFound from "./pages/404.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const pages = [home, services, serviceDetail, doctorsPage, contacts, privacy, notFound];

// Ключи собираем из готовых страниц: так словарь точно совпадает с разметкой.
const usedKeys = new Set();
for (const page of pages) {
  const html = await page.render();
  for (const match of html.matchAll(/data-i18n(?:-html|-placeholder|-aria|-title)?="([^"]+)"/g)) {
    usedKeys.add(match[1]);
  }
  await writeFile(join(root, page.file), html, "utf8");
  console.log("  ", page.file);
}

/* ---------- Словарь ---------- */

// Тексты, которые подставляются только из скриптов, а в разметке не встречаются.
const RUNTIME_KEYS = ["sky.night", "sky.dawn", "sky.morning", "sky.day", "sky.evening", "sky.late", "page.detail.fallbackTitle", "page.detail.fallbackSub", "page.detail.sub", "page.detail.kicker", "tour.play"];

const full = {
  ru: { ...dictionaries.ru, ...catalogDictionary("ru") },
  uz: { ...dictionaries.uz, ...catalogDictionary("uz") },
};

const problems = [];
for (const key of new Set([...usedKeys, ...RUNTIME_KEYS])) {
  for (const lang of ["ru", "uz"]) {
    if (!(key in full[lang])) problems.push(`нет ключа «${key}» в словаре ${lang}`);
  }
}
for (const key of Object.keys(dictionaries.ru)) {
  if (!(key in dictionaries.uz)) problems.push(`«${key}» есть в ru, но нет в uz`);
}
for (const key of Object.keys(dictionaries.uz)) {
  if (!(key in dictionaries.ru)) problems.push(`«${key}» есть в uz, но нет в ru`);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

const catalogKeys = new Set(Object.keys(catalogDictionary("ru")));
const keep = new Set([...usedKeys, ...RUNTIME_KEYS, ...catalogKeys]);
const pick = (dict) => Object.fromEntries(Object.entries(dict).filter(([key]) => keep.has(key)));

const unused = Object.keys(dictionaries.ru).filter((key) => !keep.has(key));
if (unused.length) console.warn("Неиспользуемые тексты в _src/i18n.mjs:", unused.join(", "));

// Каталог для страницы услуги: что к чему относится и кто принимает.
const catalog = categories.map((cat) => ({
  id: cat.id,
  name: cat.ru,
  items: cat.items.map((item) => item.ru[0]),
  doctors: doctors.filter((d) => d.categories.includes(cat.id)).map((d) => d.id),
}));

const runtime = await readFile(join(here, "i18n-runtime.js"), "utf8");
const dictionaryJs = `/* Собрано из _src/i18n.mjs и _src/data. Править там, затем node _src/build.mjs. */
window.KC_DICT = ${JSON.stringify({ ru: pick(full.ru), uz: pick(full.uz) })};
window.KC_CATALOG = ${JSON.stringify(catalog)};
${runtime}`;
await writeFile(join(root, "js", "kc-i18n.js"), dictionaryJs, "utf8");
console.log("   js/kc-i18n.js", Math.round(dictionaryJs.length / 1024), "КБ");
