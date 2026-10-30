/**
 * Единый источник данных о врачах.
 *
 * Чтобы добавить врача:
 * 1. Положите вырезанное фото в images/doctors/ как cut-N.webp (N = id).
 *    Как его получить — _src/README.md, раздел «Фото врачей».
 * 2. Добавьте объект в массив ниже и тексты в _src/i18n.mjs (doc.spec.* и doc.bio.N).
 * 3. Запустите: node _src/build.mjs
 *
 * tint — цвет арки за спиной врача. Подбирается по одежде: белый халат
 * теряется на светлой арке, тёмная форма — на тёмной.
 * categories — направления из _src/data/services.mjs, по ним врач показывается
 * на странице услуги.
 */
export const doctors = [
  {
    id: 8,
    name: "Мукаддас Равшановна",
    spec: "neuro",
    tint: "lamp",
    categories: ["neurology"],
    bio: true,
  },
  {
    id: 2,
    name: "Абдуллох Абдураззакович",
    spec: "therapist",
    tint: "cyan",
    categories: ["stomatology"],
    bio: true,
  },
  {
    id: 3,
    name: "Гульхида Абдуназировна",
    spec: "hijama",
    tint: "mist",
    categories: ["procedures"],
    bio: true,
  },
  {
    id: 9,
    name: "Мухаммадрахим Алишер огли",
    spec: "therapist",
    tint: "navy",
    categories: ["stomatology"],
    bio: true,
  },
  {
    id: 6,
    name: "Нодирахон Нуритдиновна",
    spec: "labDoctor",
    tint: "green",
    categories: ["lab"],
    bio: true,
  },
  {
    id: 5,
    name: "Шамсиддин Бахтиер огли",
    spec: "orthopedist",
    tint: "lamp",
    categories: ["stomatology"],
    bio: true,
  },
  {
    id: 1,
    name: "Тилляева Нозимахон Рахматхоновна",
    spec: "neuroChild",
    tint: "navy",
    categories: ["neurology", "pediatrics"],
    bio: false,
  },
  {
    id: 7,
    name: "Латофат Гайратжановна",
    spec: "integrative",
    tint: "mist",
    categories: ["stomatology"],
    bio: true,
  },
  {
    id: 4,
    name: "Зиеда Давранбаевна",
    spec: "laborant",
    tint: "cyan",
    categories: ["lab"],
    bio: true,
  },
];
