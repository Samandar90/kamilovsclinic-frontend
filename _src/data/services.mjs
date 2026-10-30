/**
 * Каталог услуг. Отсюда строятся страница «Услуги», страницы услуг,
 * плитка на главной и ключи перевода (svc.<id>.* — добавляются в словарь сборкой).
 *
 * Параметр ?service= у страницы услуги — это русское название (ru) категории
 * или услуги: старые ссылки вида service-detail.html?service=Стоматология работают.
 */
export const categories = [
  {
    id: "stomatology",
    icon: "tooth",
    ru: "Стоматология",
    uz: "Stomatologiya",
    items: [
      { ru: ["Консультация стоматолога", "Осмотр, план лечения и понятные рекомендации."], uz: ["Stomatolog konsultatsiyasi", "Ko‘rik, davolash rejasi va tushunarli tavsiyalar."] },
      { ru: ["Лечение кариеса", "Бережное лечение с современными материалами."], uz: ["Kariesni davolash", "Zamonaviy materiallar bilan ehtiyotkor davolash."] },
      { ru: ["Лечение пульпита и каналов", "Эндодонтическое лечение под контролем врача."], uz: ["Pulpit va kanallarni davolash", "Shifokor nazorati ostida endodontik davolash."] },
      { ru: ["Эстетическая реставрация зубов", "Восстановление формы и цвета зуба."], uz: ["Tishlarni estetik tiklash", "Tishning shakli va rangini tiklash."] },
      { ru: ["Профессиональная гигиена", "Чистка, удаление налёта и камня."], uz: ["Professional gigiyena", "Tozalash, karash va tish toshini olib tashlash."] },
      { ru: ["Отбеливание зубов", "Безопасное осветление эмали."], uz: ["Tishlarni oqartirish", "Emalni xavfsiz oqartirish."] },
      { ru: ["Удаление зубов", "Простое и сложное удаление без боли."], uz: ["Tish olib tashlash", "Oddiy va murakkab holatlarda og‘riqsiz olib tashlash."] },
      { ru: ["Протезирование (коронки, мосты)", "Несъёмные конструкции с учётом эстетики."], uz: ["Protezlash (koronka, ko‘prik)", "Estetikani hisobga olgan holda olinmaydigan konstruksiyalar."] },
      { ru: ["Съёмное протезирование", "Удобные съёмные протезы."], uz: ["Olinadigan protezlash", "Qulay olinadigan protezlar."] },
      { ru: ["Лечение дёсен", "Диагностика и лечение заболеваний дёсен."], uz: ["Milklarni davolash", "Milk kasalliklarini aniqlash va davolash."] },
      { ru: ["Детская стоматология", "Спокойный приём для маленьких пациентов."], uz: ["Bolalar stomatologiyasi", "Kichik bemorlar uchun xotirjam qabul."] },
      { ru: ["Интегративная стоматология", "Комплексный подход к здоровью полости рта."], uz: ["Integrativ stomatologiya", "Og‘iz bo‘shlig‘i salomatligiga kompleks yondashuv."] },
    ],
  },
  {
    id: "neurology",
    icon: "brain",
    ru: "Неврология",
    uz: "Nevrologiya",
    items: [
      { ru: ["Консультация невролога", "Диагностика заболеваний нервной системы."], uz: ["Nevrolog konsultatsiyasi", "Asab tizimi kasalliklarini aniqlash."] },
      { ru: ["Лечение головных болей и мигрени", "Подбор эффективной схемы лечения."], uz: ["Bosh og‘rig‘i va migrenni davolash", "Samarali davolash sxemasini tanlash."] },
      { ru: ["Лечение боли в спине и шее", "Помощь при болях и защемлениях."], uz: ["Orqa va bo‘yin og‘rig‘ini davolash", "Og‘riq va qisilishlarda yordam."] },
      { ru: ["Диагностика нарушений сна", "Выявление причин бессонницы."], uz: ["Uyqu buzilishlarini aniqlash", "Uyqusizlik sabablarini aniqlash."] },
      { ru: ["Лечение невралгии", "Снятие боли и восстановление."], uz: ["Nevralgiyani davolash", "Og‘riqni bartaraf etish va tiklanish."] },
      { ru: ["Неврология детского возраста", "Наблюдение и лечение у детей."], uz: ["Bolalar nevrologiyasi", "Bolalarni kuzatish va davolash."] },
    ],
  },
  {
    id: "pediatrics",
    icon: "bear",
    ru: "Педиатрия",
    uz: "Pediatriya",
    items: [
      { ru: ["Консультация педиатра", "Осмотр и рекомендации для ребёнка."], uz: ["Pediatr konsultatsiyasi", "Bola ko‘rigi va tavsiyalar."] },
      { ru: ["Профилактический осмотр", "Контроль здоровья и развития."], uz: ["Profilaktik ko‘rik", "Salomatlik va rivojlanishni nazorat qilish."] },
      { ru: ["Наблюдение за развитием ребёнка", "Регулярный контроль по возрасту."], uz: ["Bola rivojlanishini kuzatish", "Yoshga mos muntazam nazorat."] },
      { ru: ["Консультация по вакцинации", "Индивидуальный план прививок."], uz: ["Emlash bo‘yicha konsultatsiya", "Individual emlash rejasi."] },
    ],
  },
  {
    id: "lab",
    icon: "flask",
    ru: "Анализы и лаборатория",
    uz: "Tahlillar va laboratoriya",
    items: [
      { ru: ["Общий анализ крови", "Базовое исследование показателей крови."], uz: ["Umumiy qon tahlili", "Qon ko‘rsatkichlarining asosiy tekshiruvi."] },
      { ru: ["Биохимический анализ крови", "Оценка работы внутренних органов."], uz: ["Biokimyoviy qon tahlili", "Ichki a’zolar faoliyatini baholash."] },
      { ru: ["Гормональные исследования", "Анализ гормонального фона."], uz: ["Gormonal tekshiruvlar", "Gormonal fonni tahlil qilish."] },
      { ru: ["Анализы на инфекции", "Выявление инфекционных заболеваний."], uz: ["Infeksiyalarga tahlillar", "Yuqumli kasalliklarni aniqlash."] },
      { ru: ["Анализы для госпитализации", "Полный пакет перед поступлением."], uz: ["Shifoxonaga yotqizish uchun tahlillar", "Yotqizishdan oldingi to‘liq to‘plam."] },
      { ru: ["Программа Check-up", "Комплексное обследование организма."], uz: ["Check-up dasturi", "Organizmni kompleks tekshirish."] },
    ],
  },
  {
    id: "diagnostics",
    icon: "stethoscope",
    ru: "Диагностика",
    uz: "Diagnostika",
    items: [
      { ru: ["Консультация терапевта", "Первичный приём и маршрутизация."], uz: ["Terapevt konsultatsiyasi", "Birlamchi qabul va yo‘naltirish."] },
      { ru: ["ЭКГ (электрокардиография)", "Оценка работы сердца."], uz: ["EKG (elektrokardiografiya)", "Yurak faoliyatini baholash."] },
      { ru: ["Функциональная диагностика", "Современные методы обследования."], uz: ["Funksional diagnostika", "Zamonaviy tekshiruv usullari."] },
      { ru: ["Ультразвуковая диагностика", "УЗИ-обследование по направлениям."], uz: ["Ultratovush diagnostikasi", "Yo‘nalishlar bo‘yicha UTT tekshiruvi."] },
    ],
  },
  {
    id: "procedures",
    icon: "drop",
    ru: "Процедуры",
    uz: "Muolajalar",
    items: [
      { ru: ["Хиджама (баночная терапия)", "Суннская методика по индивидуальной программе."], uz: ["Hijoma (banka terapiyasi)", "Individual dastur bo‘yicha sunnat usuli."] },
      { ru: ["Лечебный массаж", "Снятие напряжения и улучшение кровообращения."], uz: ["Davolovchi massaj", "Zo‘riqishni yo‘qotish va qon aylanishini yaxshilash."] },
      { ru: ["Инфузионная терапия (капельницы)", "Восстановление под контролем врача."], uz: ["Infuzion terapiya (tomchi dori)", "Shifokor nazorati ostida tiklanish."] },
      { ru: ["Внутримышечные инъекции", "Назначенные процедуры в комфортных условиях."], uz: ["Mushak ichiga inyeksiyalar", "Tayinlangan muolajalar qulay sharoitda."] },
      { ru: ["Перевязки и обработка ран", "Профессиональный уход за раной."], uz: ["Bog‘lash va yaralarni tozalash", "Yarani professional parvarish qilish."] },
    ],
  },
  {
    id: "extra",
    icon: "calendar",
    ru: "Дополнительно",
    uz: "Qo‘shimcha",
    items: [
      { ru: ["Онлайн-консультация", "Связь с врачом дистанционно."], uz: ["Onlayn konsultatsiya", "Shifokor bilan masofaviy aloqa."] },
      { ru: ["Медицинские справки и осмотры", "Оформление по запросу."], uz: ["Tibbiy ma’lumotnomalar va ko‘riklar", "So‘rov bo‘yicha rasmiylashtirish."] },
      { ru: ["Сопровождение лечения", "Контроль и повторные приёмы."], uz: ["Davolashni kuzatib borish", "Nazorat va takroriy qabullar."] },
    ],
  },
];

/** Ключи перевода для каталога, чтобы страницы и словарь не расходились. */
export const catKey = (cat) => `cat.${cat.id}`;
export const itemKey = (cat, i) => `cat.${cat.id}.${i}`;

/** Записи словаря для всех названий и описаний каталога. */
export function catalogDictionary(lang) {
  const out = {};
  for (const cat of categories) {
    out[catKey(cat)] = cat[lang];
    cat.items.forEach((item, i) => {
      out[`${itemKey(cat, i)}.title`] = item[lang][0];
      out[`${itemKey(cat, i)}.text`] = item[lang][1];
    });
  }
  return out;
}

/** Ссылка на страницу услуги: параметр остаётся русским, как в старых ссылках. */
export const serviceUrl = (ruName) =>
  `service-detail.html?service=${encodeURIComponent(ruName)}`;
