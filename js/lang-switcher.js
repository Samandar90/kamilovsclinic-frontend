// Простая база переводов — ТОЛЬКО текущие тексты
const translations = {
  ru: {
    //nav
    "nav.home": "Главная",
    "nav.about": "О клинике",
    "nav.services": "Услуги",
    "nav.doctors": "Врачи",
    "nav.contacts": "Контакты",
    "header.book": "Записаться",
    "header.callMobile": "Позвонить: +998 95 088 41 41",

    //hero
    "hero.badge": "Работаем 24/7 без выходных",
    "hero.titleLine1": "Добро пожаловать в",
    "hero.subtitle":
      "Современная диагностика и внимательный уход для каждого пациента.",
    "hero.ctaServices": "Наши услуги",
    "hero.ctaBook": "Записаться",

    "hero.card1.title": "Экстренная помощь",
    "hero.card1.text":
      "Круглосуточные консультации и поддержка при неотложных состояниях.",
    "hero.card2.title": "Работаем без выходных",
    "hero.card2.text":
      "Доступны 24 часа в сутки, без выходных и праздников. Всегда рядом, когда это важно.",
    "hero.card3.title": "Расписание клиники",
    "hero.card3.text":
      "Удобный приём специалистов и диагностика для взрослых и детей.",

    // services section
    "services.kicker": "ЧТО МЫ ДЕЛАЕМ",
    "services.title": "Услуги клиники",
    "services.lead":
      "Комплексная диагностика, лечение и профилактика на базе современного оборудования и команды экспертов.",
    "services.text":
      "Индивидуальный подход, комфортные условия, точная диагностика и прозрачные рекомендации — основа нашей работы.",
    "services.cta": "Подробнее об услугах",

    "services.slide1.title": "Обзор клиники",
    "services.slide1.text": "Короткий обзор отделений и сервиса",
    "services.slide2.title": "Цифровая диагностика",
    "services.slide2.text": "Точные исследования для взрослых и детей",
    "services.slide3.title": "Лучшие специалисты",
    "services.slide3.text": "Команда экспертов по ключевым направлениям",

    // benefits section
    "benefits.kicker": "Почему выбирают нас",
    "benefits.title": "Преимущества Kamilovs Clinic",
    "benefits.lead":
      "Мы соединяем современную медицину, комфорт и человеческое отношение — чтобы каждое обращение было максимально спокойным и понятным.",

    "benefits.card1.title": "Опытные специалисты",
    "benefits.card1.text":
      "Врачи с многолетней практикой и узкой специализацией — каждый пациент получает выверенные решения.",
    "benefits.card1.tag": "Персональный подход",

    "benefits.card2.title": "Современная диагностика",
    "benefits.card2.text":
      "Цифровые исследования, точные результаты и понятные расшифровки — без лишних ожиданий.",
    "benefits.card2.tag": "Точность результатов",

    "benefits.card3.title": "Минимум ожидания",
    "benefits.card3.text":
      "Онлайн-запись, чёткие слоты и продуманное расписание — вы проводите время в клинике с пользой, а не в очереди.",
    "benefits.card3.tag": "Удобное расписание",

    "benefits.card4.title": "Комфорт и сервис",
    "benefits.card4.text":
      "Чистые кабинеты, заботливый персонал и внимательное отношение с момента записи до завершения лечения.",
    "benefits.card4.tag": "Комфорт пациента",

    "benefits.card5.title": "Связь 24/7",
    "benefits.card5.text":
      "Мы на связи по телефону и мессенджерам — вы всегда знаете, к кому обратиться с вопросом.",
    "benefits.card5.tag": "Поддержка 24/7",

    "benefits.card6.title": "Прозрачные цены",
    "benefits.card6.text":
      "Понятные планы лечения, без скрытых услуг — вы сразу видите, за что платите.",
    "benefits.card6.tag": "Честная стоимость",

    // FAQ section
    "faq.kicker": "FAQ",
    "faq.title": "Частые вопросы пациентов",
    "faq.lead":
      "Мы заранее отвечаем на популярные вопросы — чтобы визит в клинику был спокойным и предсказуемым.",

    "faq.aside.title": "Перед визитом",
    "faq.aside.text":
      "Если вы не нашли ответ на свой вопрос — просто позвоните нам, администратор поможет подобрать врача и время.",
    "faq.stats1.label": "работаем без выходных",
    "faq.stats2.label": "обычное ожидание приёма",
    "faq.call": "📞 Позвонить в клинику",
    "faq.aside.num": "5–10 мин",

    "faq.q1.question": "Нужно ли заранее записываться на приём?",
    "faq.q1.answer":
      "Запись заранее помогает выбрать удобное время и сократить ожидание. Но при необходимости мы стараемся принять и в день обращения — особенно при острых состояниях.",

    "faq.q2.question": "Какие анализы можно сдать в клинике?",
    "faq.q2.answer":
      "Мы выполняем основные лабораторные анализы: общий и биохимический анализ крови, гормоны, инфекции, анализы для госпитализации и программ check-up. Полный список можно уточнить у администратора.",

    "faq.q3.question":
      "Можно ли записаться на приём онлайн или через мессенджер?",
    "faq.q3.answer":
      "Да, вы можете оставить заявку через сайт, написать в мессенджер или позвонить. Администратор уточнит детали и подтвердит время приёма.",

    "faq.q4.question": "Что взять с собой на первый приём?",
    "faq.q4.answer":
      "Возьмите паспорт, список принимаемых препаратов и, по возможности, предыдущие выписки и результаты анализов. Это поможет врачу быстрее разобраться в ситуации.",

    "faq.q5.question": "Работаете ли вы с детьми?",
    "faq.q5.answer":
      "Да, в клинике есть педиатры и узкие детские специалисты. Мы создаём максимально спокойную атмосферу для ребёнка и родителей.",

    // DOCTORS SECTION (RU)
    "doctors.kicker": "КОМАНДА ЭКСПЕРТОВ",
    "doctors.title": "Наши специалисты",
    "doctors.sub":
      "Диагностика, лечение и внимание к деталям — команда врачей, на которых можно положиться.",

    "doctors.card1.badge": "Неврология",
    "doctors.card1.name": "Ф.И.О",
    "doctors.card1.role": "Невролог",
    "doctors.card1.text":
      "Индивидуальный подход к каждому пациенту, современная диагностика и мягкое сопровождение лечения.",

    "doctors.card2.badge": "Стоматология",
    "doctors.card2.name": "Ф.И.О",
    "doctors.card2.role": "Стоматолог",
    "doctors.card2.text":
      "Эстетическая и терапевтическая стоматология, бережное отношение к пациентам любого возраста.",

    "doctors.card3.badge": "Диагностика",
    "doctors.card3.name": "Ф.И.О",
    "doctors.card3.role": "Врач УЗ-диагностики",
    "doctors.card3.text":
      "Точные заключения и подробные объяснения каждого шага исследования для пациента.",

    "doctors.more": "Смотреть всех врачей",

    // ABOUT SECTION (RU)
    "about.kicker": "Почему нас выбирают",
    "about.title": "Забота, технологии и доверие",
    "about.lead":
      "Мы совмещаем современную диагностику, внимательное отношение и прозрачные рекомендации, чтобы пациент чувствовал себя спокойно на каждом этапе лечения.",
    "about.note":
      "Наша команда работает 24/7, чтобы вы могли получить помощь именно тогда, когда она нужна — без лишнего ожидания.",

    "about.card1.title": "Круглосуточная работа",
    "about.card1.text":
      "Приём пациентов, консультации и поддержка без выходных и праздников.",

    "about.card2.title": "Направлений",
    "about.card2.text":
      "Диагностика и лечение по ключевым направлениям взрослой и детской медицины.",

    "about.card3.title": "пациентов в год",
    "about.card3.text":
      "Нам доверяют семьи, которые возвращаются к нам снова и рекомендуют клинику близким.",

    "about.card4.value": "Опыт",
    "about.card4.title": "Врачи-эксперты",
    "about.card4.text":
      "Врачи с большим практическим опытом, внимательным подходом и постоянным повышением квалификации.",

    // FLOW SECTION (RU)
    "flow.kicker": "ЭТАПЫ ОБСЛУЖИВАНИЯ",
    "flow.title": "Как проходит приём в Kamilovs Clinic",
    "flow.lead":
      "Мы заботимся о том, чтобы каждый этап визита был понятным и комфортным — от записи до получения результатов и рекомендаций.",
    "flow.note":
      "Можно записаться через сайт, по телефону или в мессенджере — вы получите напоминание о приёме и подробную консультацию врача.",

    "flow.step1.title": "Заявка или звонок",
    "flow.step1.text":
      "Вы оставляете заявку на сайте или звоните в клинику. Наш администратор подбирает удобное время и врача.",

    "flow.step2.title": "Подтверждение и напоминание",
    "flow.step2.text":
      "Мы подтверждаем запись, отправляем SMS или сообщение в мессенджер с датой, временем и адресом клиники.",

    "flow.step3.title": "Приём у врача",
    "flow.step3.text":
      "Врач проводит осмотр, задаёт уточняющие вопросы, при необходимости назначает диагностику и анализы.",

    "flow.step4.title": "План лечения и сопровождение",
    "flow.step4.text":
      "Вы получаете понятный план лечения, рекомендации и при необходимости — повторный приём или онлайн-консультацию.",

    // FOOTER SECTION (RU)
    "footer.text":
      "Современная многопрофильная клиника в центре Ташкента. Работаем 24/7 — рядом, когда это важно.",
    "footer.addr": "📍 ул. Хувайдо, 7, Ташкент",
    "footer.hours": "🕒 Работаем круглосуточно",
    "footer.cta": "Записаться",
    "footer.mapTitle": "Как нас найти",
    "footer.mapText":
      "Kamilovs’ clinic на Яндекс Картах — построить удобный маршрут за пару секунд.",
    "footer.bottomNote": "Сайт создан с заботой о пациентах.",
    "footer.toTop": "↑ Наверх",

    // MODAL SECTION (RU)
    "modal.title": "Записаться в Kamilovs Clinic",
    "modal.sub":
      "Оставьте контакты — наш администратор ответит в течение 5 минут.",

    "modal.field.name.label": "Имя",
    "modal.field.name.placeholder": "Ваше имя",

    "modal.field.phone.label": "Телефон*",
    "modal.field.phone.placeholder": "+998 XX XXX XX XX",
    "modal.field.phone.hint": "Мы позвоним только по вашей заявке — без спама.",

    "modal.field.service.label": "Интересующая услуга",
    "modal.field.service.placeholder": "Например: кардиология",

    "modal.field.message.label": "Комментарий",
    "modal.field.message.placeholder": "Опишите ваш вопрос, жалобу или симптом",

    "modal.submit": "Отправить заявку",
    "modal.privacy":
      "Нажимая «Отправить заявку», вы соглашаетесь с политикой обработки персональных данных.",

    //SERVICES PAGE TRANSLATIONS (RU)

    // NAV — "О клинике" и мобильный звонок
    "nav.about": "О клинике",
    "header.mobileCall": "Позвонить: +998 95 088 41 41",

    // SERVICES LIST (services.html)
    "servicesList.kicker": "Направления",
    "servicesList.title": "Основные услуги клиники",
    "servicesList.lead":
      "Ниже — основные направления. Полный перечень и цены можно уточнить у администратора клиники.",

    // Стоматология — карточка 1
    "servicesList.card1.tag": "Стоматология",
    "servicesList.card1.title": "Лечение и гигиена",
    "servicesList.card1.text":
      "Лечение кариеса, эстетическая реставрация, профессиональная чистка, рекомендации по уходу.",
    "servicesList.card1.item1": "Осмотр и консультация",
    "servicesList.card1.item2": "Лечение кариеса и пульпита",
    "servicesList.card1.item3": "Гигиена, полировка, рекомендации",
    "servicesList.card1.price": "от 250 000 сум",
    "servicesList.card1.cta": "Записаться",
    "servicesList.card1.more": "Подробнее",

    // Блок "Как подготовиться"
    "servicesPrep.title": "Как подготовиться к визиту",
    "servicesPrep.lead":
      "Небольшая подготовка помогает сделать приём более информативным и точным.",
    "servicesPrep.item1": "Возьмите с собой паспорт и предыдущие заключения.",
    "servicesPrep.item2": "Запишите заранее принимаемые лекарства и дозировки.",
    "servicesPrep.item3":
      "На анализы крови приходите натощак (если рекомендовано).",
    "servicesPrep.item4":
      "Придите чуть раньше, чтобы спокойно оформить документы.",
    "servicesPrep.card.text":
      "Остались вопросы по услугам, анализам или ценам?\nНапишите администратору или позвоните — мы поможем подобрать удобное время и врача.",
    "servicesPrep.card.btn": "📞 Позвонить в клинику",

    //SERVICES-DETAILS PAGE TRANSLATIONS (RU)
    // SERVICE DETAIL (RU)
    "sd.breadcrumb.current": "Услуга",

    "sd.meta.durationLabel": "Длительность приёма",
    "sd.meta.priceLabel": "Примерная стоимость",

    "sd.hero.ctaPrimary": "Записаться на приём",
    "sd.hero.ctaSecondary": "Все услуги",

    "sd.benefits.title": "Почему пациенты выбирают эту услугу",

    "sd.cta.title": "Оставьте заявку — подберём удобное время приёма",
    "sd.cta.text":
      "Администратор свяжется с вами, уточнит детали и подберёт врача по вашему запросу.",
    "sd.cta.btn": "Записаться сейчас",

    // ===== DOCTORS PAGE / HERO =====
    "docs.hero.kicker": "КОМАНДА ЭКСПЕРТОВ",
    "docs.hero.title": "Врачи Kamilovs Clinic",
    "docs.hero.lead":
      "Неврологи, терапевты, педиатры, стоматологи и другие специалисты — собрали команду, которой можно доверить здоровье семьи.",
    "docs.hero.note":
      "На этой странице вы можете познакомиться с врачами клиники и выбрать нужное направление. Администратор подберёт удобное время приёма.",
    "docs.hero.btn": "Записаться к врачу",
    "docs.hero.hint": "Работаем 24/7, запись по телефону и онлайн.",

    "docs.hero.card.title": "Популярные направления",
    "docs.hero.card.item1": "Неврология и терапия",
    "docs.hero.card.item2": "Педиатрия и наблюдение детей",
    "docs.hero.card.item3": "Стоматология и гигиена полости рта",
    "docs.hero.card.item4": "УЗИ-диагностика и check-up программы",
    "docs.hero.card.text":
      "Не знаете, к кому записаться? Просто позвоните администратору — поможем выбрать специалиста.",

    // ===== DOCTORS PAGE / FILTER =====
    "docs.filter.label": "Фильтр по направлениям:",
    "docs.filter.all": "Все",
    "docs.filter.neuro": "Невролог",
    "docs.filter.therapy": "Терапевт",
    "docs.filter.pediatrics": "Педиатр",
    "docs.filter.stom": "Стоматолог",
    "docs.filter.uzd": "УЗИ",
    "docs.filter.cardio": "Кардиолог",
    "docs.filter.gyno": "Гинеколог",
    "docs.filter.ent": "ЛОР",

    // ===== DOCTORS PAGE / CARD 1 =====
    "docs.card1.badge": "Стоматолог",
    "docs.card1.name": "Ф.И.О",
    "docs.card1.role": "Стоматология",
    "docs.card1.text":
      "Диагностика и лечение головных болей, нарушений сна, неврозов. Подробно объясняет каждое назначение.",

    // ===== DOCTORS PAGE / CTA =====
    "docs.cta.title": "Не знаете, к кому записаться?",
    "docs.cta.text":
      "Оставьте заявку на сайте или позвоните — администратор уточнит жалобы и порекомендует специалиста.",
    "docs.cta.btn": "Записаться онлайн",

    // header / nav
    "nav.home": "Главная",
    "nav.services": "Услуги",
    "nav.doctors": "Врачи",
    "nav.contacts": "Контакты",
    "header.btnRecord": "Записаться",
    "header.mobile.call": "Позвонить: +998 95 088 41 41",

    // hero
    "contacts.hero.pill": "Контакты клиники",
    "contacts.hero.title.main": "Всегда на связи",
    "contacts.hero.subtitle":
      "Позвоните, напишите или приезжайте в клинику — мы поможем подобрать врача, объясним подготовку к приёму и подскажем по анализам.",
    "contacts.hero.chip.address": "📍 Ташкент, ул. Хувайдо, 7",
    "contacts.hero.chip.phone": "📞 +998 95 088 41 41",
    "contacts.hero.chip.hours": "🕒 Работаем круглосуточно",
    "contacts.hero.btn.call": "Позвонить в клинику",
    "contacts.hero.btn.online": "Записаться онлайн",

    "contacts.hero.card.badge": "🩺 Быстрая запись",
    "contacts.hero.card.title": "Нужна помощь сейчас?",
    "contacts.hero.card.text":
      "Оставьте заявку или позвоните — администратор подскажет, к какому врачу лучше обратиться и когда можно прийти.",
    "contacts.hero.card.li1": "Перезвон в течение 10–20 минут",
    "contacts.hero.card.li2": "Подбор врача по жалобам",
    "contacts.hero.card.li3": "Напоминание о приёме",
    "contacts.hero.card.phoneLabel": "Круглосуточный номер",
    "contacts.hero.card.btn": "Оставить заявку",

    // main contacts block
    "contacts.main.title": "Как с нами связаться",
    "contacts.main.text":
      "Вы можете записаться на приём по телефону, через сайт или мессенджеры. Мы аккуратно уточним жалобы, удобное время и сразу подскажем, нужна ли подготовка к визиту.",
    "contacts.main.card1.title": "📍 Адрес клиники",
    "contacts.main.card1.text":
      "Ташкент, ул. Хувайдо, 7\nУдобный подъезд и понятные ориентиры рядом.",
    "contacts.main.card2.title": "📞 Телефон и мессенджеры",
    "contacts.main.card2.text":
      "Телефон: +998 95 088 41 41\nTelegram / звонок — по этому же номеру.",
    "contacts.main.card3.title": "🕒 Режим работы",
    "contacts.main.card3.text":
      "Приём пациентов: 24/7\nАнализы и диагностика — по записи.",
    "contacts.main.card4.title": "✉️ Электронная почта",
    "contacts.main.card4.text": "По общим вопросам: info@kamilovs.uz",
    "contacts.main.highlight":
      "Если состояние острое или вам плохо — лучше сразу позвонить в клинику, чем заполнять форму. Так мы быстрее среагируем.",

    // map
    "contacts.map.title": "Мы на карте",
    "contacts.map.text": "Постройте маршрут до Kamilovs Clinic за пару секунд.",
    "contacts.map.hint":
      "🚗 На машине — подъезд прямо к входу клиники.\n🚶‍♂️ Пешком — ориентируйтесь по вывеске «Kamilovs Clinic».",

    // form
    "contacts.form.title": "Оставить заявку онлайн",
    "contacts.form.text":
      "Заполните форму — администратор свяжется с вами, уточнит детали и подтвердит приём.",
    "contacts.form.tag.fast": "⏱ Перезвон за 10–20 минут",
    "contacts.form.tag.safe": "🔒 Персональные данные под защитой",

    "contacts.form.field.name.label": "Имя *",
    "contacts.form.field.name.placeholder": "Ваше имя",

    "contacts.form.field.phone.label": "Телефон *",
    "contacts.form.field.phone.placeholder": "+998 XX XXX XX XX",

    "contacts.form.field.topic.label": "Тема обращения",
    "contacts.form.field.topic.option.empty": "Выберите вариант",
    "contacts.form.field.topic.option.appointment": "Запись на приём",
    "contacts.form.field.topic.option.tests": "Анализы и диагностика",
    "contacts.form.field.topic.option.price": "Вопрос по стоимости",
    "contacts.form.field.topic.option.other": "Другое",

    "contacts.form.field.time.label": "Удобное время для звонка",
    "contacts.form.field.time.placeholder": "Например: сегодня после 18:00",

    "contacts.form.field.message.label": "Комментарий",
    "contacts.form.field.message.placeholder":
      "Кратко опишите жалобы или ваш вопрос",

    "contacts.form.consent": "Согласен(а) на обработку персональных данных",
    "contacts.form.submit": "Отправить заявку",
    "contacts.form.hint":
      "Обычно мы перезваниваем в течение 10–20 минут в рабочее время.",

    // footer
    "footer.text":
      "Современная многопрофильная клиника в центре Ташкента. Работаем 24/7 — рядом, когда это важно.",
    "footer.address": "📍 ул. Хувайдо, 7, Ташкент",
    "footer.phone": "+998 95 088 41 41",
    "footer.email": "info@kamilovs.uz",
    "footer.hours": "🕒 Работаем круглосуточно",
    "footer.mapTitle": "Как нас найти",
    "footer.mapText":
      "Kamilovs’ clinic на Яндекс Картах — построить удобный маршрут за пару секунд.",
    "footer.bottom.left": "© {year} Kamilovs Clinic.",
    "footer.bottom.right": "Сайт создан с заботой о пациентах.",

    // modal (повтор тех же ключей, что на других страницах)
    "modal.title": "Записаться в Kamilovs Clinic",
    "modal.sub":
      "Оставьте контакты — наш администратор ответит в течение <strong>5 минут</strong>.",
    "modal.field.name.label": "Имя",
    "modal.field.name.placeholder": "Ваше имя",
    "modal.field.phone.label": "Телефон*",
    "modal.field.phone.placeholder": "+998 XX XXX XX XX",
    "modal.field.phone.hint": "Мы позвоним только по вашей заявке — без спама.",
    "modal.field.service.label": "Интересующая услуга",
    "modal.field.service.placeholder": "Например: кардиология",
    "modal.field.message.label": "Комментарий",
    "modal.field.message.placeholder": "Опишите ваш вопрос, жалобу или симптом",
    "modal.submit": "Отправить заявку",
    "modal.privacy":
      "Нажимая «Отправить заявку», вы соглашаетесь с политикой обработки персональных данных.",
  },

  uz: {
    //nav
    "nav.home": "Bosh sahifa",
    "nav.about": "Klinika haqida",
    "nav.services": "Xizmatlar",
    "nav.doctors": "Shifokorlar",
    "nav.contacts": "Aloqa",
    "header.book": "Qabulga yozilish",
    "header.callMobile": "Qo‘ng‘iroq: +998 95 088 41 41",

    // hero
    "hero.badge": "24/7, dam olish kunlarisiz ishlaymiz",
    "hero.titleLine1": "Xush kelibsiz",
    "hero.subtitle":
      "Har bir bemor uchun zamonaviy diagnostika va e’tiborli parvarish.",
    "hero.ctaServices": "Xizmatlarimiz",
    "hero.ctaBook": "Qabulga yozilish",

    "hero.card1.title": "Shoshilinch yordam",
    "hero.card1.text":
      "Shoshilinch holatlarda 24/7 maslahat va qo‘llab-quvvatlash.",
    "hero.card2.title": "Dam olishsiz ishlaymiz",
    "hero.card2.text":
      "24 soat davomida, bayram va dam olish kunlarisiz. Eng muhim paytda yoningizdamiz.",
    "hero.card3.title": "Klinika jadvali",
    "hero.card3.text": "Kattalar va bolalar uchun qulay qabul va diagnostika.",

    // services section
    "services.kicker": "BIZ NIMA QILAMIZ",
    "services.title": "Klinika xizmatlari",
    "services.lead":
      "Zamonaviy uskunalar va tajribali mutaxassislar jamoasi asosida kompleks diagnostika, davolash va profilaktika.",
    "services.text":
      "Individual yondashuv, qulay sharoit, aniq diagnostika va ochiq tavsiyalar — ishimizning asosi.",
    "services.cta": "Xizmatlar haqida batafsil",

    "services.slide1.title": "Klinika haqida qisqacha",
    "services.slide1.text": "Bo‘limlar va servis haqida qisqa tanishtiruv",
    "services.slide2.title": "Raqamli diagnostika",
    "services.slide2.text": "Kattalar va bolalar uchun aniq tekshiruvlar",
    "services.slide3.title": "Eng yaxshi mutaxassislar",
    "services.slide3.text":
      "Asosiy yo‘nalishlar bo‘yicha tajribali shifokorlar jamoasi",

    // benefits section
    "benefits.kicker": "Nega bizni tanlashadi",
    "benefits.title": "Kamilovs Clinic afzalliklari",
    "benefits.lead":
      "Zamonaviy tibbiyot, qulaylik va insoniy munosabatni birlashtiramiz — har bir murojaat iloji boricha xotirjam va tushunarli bo‘lishi uchun.",

    "benefits.card1.title": "Tajribali mutaxassislar",
    "benefits.card1.text":
      "Ko‘p yillik tajribaga ega, tor yo‘nalishli shifokorlar — har bir bemor uchun asosli yechimlar.",
    "benefits.card1.tag": "Shaxsiy yondashuv",

    "benefits.card2.title": "Zamonaviy diagnostika",
    "benefits.card2.text":
      "Raqamli tekshiruvlar, aniq natijalar va tushunarli izohlar — ortiqcha kutishlarsiz.",
    "benefits.card2.tag": "Natijalar aniqligi",

    "benefits.card3.title": "Minimal navbat",
    "benefits.card3.text":
      "Onlayn yozuv, aniq vaqt oralig‘i va o‘ylangan jadval — klinikada vaqtingiz navbatda emas, foydali o‘tadi.",
    "benefits.card3.tag": "Qulay jadval",

    "benefits.card4.title": "Qulaylik va servis",
    "benefits.card4.text":
      "Toza xonalar, e’tiborli xodimlar va g‘amxo‘r munosabat — yozuvdan davolash yakunigacha.",
    "benefits.card4.tag": "Bemor qulayligi",

    "benefits.card5.title": "24/7 aloqa",
    "benefits.card5.text":
      "Telefon va messenjerlar orqali aloqadamiz — savollaringiz bo‘lsa, kimga murojaat qilishni doim bilasiz.",
    "benefits.card5.tag": "24/7 qo‘llab-quvvatlash",

    "benefits.card6.title": "Shaffof narxlar",
    "benefits.card6.text":
      "Tushunarli davolash rejasi, yashirin xizmatlarsiz — nimaga to‘layotganingizni darhol ko‘rasiz.",
    "benefits.card6.tag": "Halol narx",

    // FAQ section
    "faq.kicker": "FAQ",
    "faq.title": "Bemorlar tez-tez beradigan savollar",
    "faq.lead":
      "Klinikaga tashrif iloji boricha xotirjam va oldindan tushunarli bo‘lishi uchun mashhur savollarga oldindan javob beramiz.",

    "faq.aside.title": "Tashrifdan oldin",
    "faq.aside.text":
      "Agar savolingizga javob topa olmagan bo‘lsangiz, bizga qo‘ng‘iroq qiling — administrator sizga shifokor va qulay vaqtni tanlashda yordam beradi.",
    "faq.stats1.label": "dam olish kunlarisiz ishlaymiz",
    "faq.stats2.label": "odatdagi qabul kutish vaqti",
    "faq.call": "📞 Klinikaga qo‘ng‘iroq qilish",
    "faq.aside.num": "5–10 min",

    "faq.q1.question": "Qabulga oldindan yozilish shartmi?",
    "faq.q1.answer":
      "Oldindan yozilish sizga qulay vaqtni tanlash va kutish vaqtini kamaytirishga yordam beradi. Biroq zarurat bo‘lsa, ayniqsa o‘tkir holatlarda, biz ko‘pincha murojaat kunining o‘zida ham qabul qilishga harakat qilamiz.",

    "faq.q2.question": "Klinikada qaysi tahlillar topshirish mumkin?",
    "faq.q2.answer":
      "Biz asosiy laborator tahlillarni bajarib beramiz: umumiy va biokimyoviy qon tahlili, gormonlar, infeksiyalar, shifoxonaga yotqizish va check-up dasturlari uchun tahlillar. To‘liq ro‘yxatni administrator bilan aniqlashtirishingiz mumkin.",

    "faq.q3.question":
      "Qabulga onlayn yoki messenjer orqali yozilish mumkinmi?",
    "faq.q3.answer":
      "Ha, siz sayt orqali so‘rov qoldirishingiz, messenjerga yozishingiz yoki qo‘ng‘iroq qilishingiz mumkin. Administrator barcha tafsilotlarni aniqlashtirib, qabul vaqtini tasdiqlaydi.",

    "faq.q4.question": "Birinchi qabuga nimalarni olib kelish kerak?",
    "faq.q4.answer":
      "Pasport, qabul qilinayotgan dori vositalari ro‘yxati va imkon bo‘lsa, avvalgi epikrizlar hamda tahlil natijalarini olib keling. Bu shifokorga vaziyatni tezroq tushunishga yordam beradi.",

    "faq.q5.question": "Siz bolalar bilan ham ishlaysizmi?",
    "faq.q5.answer":
      "Ha, klinikamizda pediatrlar va tor yo‘nalishli bolalar mutaxassislari mavjud. Biz bola va ota-onalar uchun maksimal xotirjam muhit yaratishga harakat qilamiz.",

    // DOCTORS SECTION (UZ)
    "doctors.kicker": "Mutaxassislar jamoasi",
    "doctors.title": "Bizning mutaxassislar",
    "doctors.sub":
      "Diagnostika, davolash va mayda tafsilotlarga e’tibor — ishonishingiz mumkin bo‘lgan shifokorlar jamoasi.",

    "doctors.card1.badge": "Nevrologiya",
    "doctors.card1.name": "F.I.Sh.",
    "doctors.card1.role": "Nevrolog",
    "doctors.card1.text":
      "Har bir bemorga individual yondashuv, zamonaviy diagnostika va davolash jarayonining yumshoq kuzatuvi.",

    "doctors.card2.badge": "Stomatologiya",
    "doctors.card2.name": "F.I.Sh.",
    "doctors.card2.role": "Stomatolog",
    "doctors.card2.text":
      "Estetik va terapevtik stomatologiya, har qanday yoshdagi bemorlarga ehtiyotkor munosabat.",

    "doctors.card3.badge": "Diagnostika",
    "doctors.card3.name": "F.I.Sh.",
    "doctors.card3.role": "UZ-diagnostika shifokori",
    "doctors.card3.text":
      "Aniq xulosalar va har bir tekshiruv bosqichini bemorga batafsil tushuntirish.",

    "doctors.more": "Barcha shifokorlarni ko‘rish",

    // ABOUT SECTION (UZ)
    "about.kicker": "Nega bizni tanlashadi",
    "about.title": "G‘amxo‘rlik, texnologiyalar va ishonch",
    "about.lead":
      "Har bir bemor har bir davolash bosqichida o‘zini xotirjam his qilishi uchun zamonaviy diagnostika, e’tiborli munosabat va ochiq tavsiyalarni birlashtiramiz.",
    "about.note":
      "Jamoamiz 24/7 ishlaydi, shunda sizga yordam aynan kerak paytda, ortiqcha kutishlarsiz taqdim etiladi.",

    "about.card1.title": "Kecha-kunduz ish rejimi",
    "about.card1.text":
      "Bemorlarni qabul qilish, maslahat va qo‘llab-quvvatlash — dam olish va bayram kunlarisiz.",

    "about.card2.title": "Yo‘nalishlar",
    "about.card2.text":
      "Kattalar va bolalar tibbiyotining asosiy yo‘nalishlari bo‘yicha diagnostika va davolash.",

    "about.card3.title": "bemor yiliga",
    "about.card3.text":
      "Bizga qayta murojaat qiladigan va klinikani yaqinlariga tavsiya qiladigan oilalar ishonch bildiradi.",

    "about.card4.value": "Tajriba",
    "about.card4.title": "Ekspert shifokorlar",
    "about.card4.text":
      "Katta amaliy tajribaga ega, e’tiborli yondashuvli va doimiy ravishda malakasini oshiradigan shifokorlar.",

    // FLOW SECTION (UZ)
    "flow.kicker": "QABUL BOSQICHLARI",
    "flow.title": "Kamilovs Clinic’da qabul qanday o‘tadi",
    "flow.lead":
      "Tashrifning har bir bosqichi tushunarli va qulay bo‘lishi uchun qayddan tortib natijalar va tavsiyalargacha bo‘lgan jarayonga e’tibor beramiz.",
    "flow.note":
      "Sayt orqali, telefon orqali yoki messenjerda yozilishingiz mumkin — sizga qabul eslatmasi va shifokor bilan batafsil maslahat beramiz.",

    "flow.step1.title": "Ariza yoki qo‘ng‘iroq",
    "flow.step1.text":
      "Siz sayt orqali ariza qoldirasiz yoki klinikaga qo‘ng‘iroq qilasiz. Administrator siz uchun qulay vaqt va shifokorni tanlab beradi.",

    "flow.step2.title": "Tasdiqlash va eslatma",
    "flow.step2.text":
      "Qabulingizni tasdiqlaymiz, SMS yoki messenjerda klinika manzili, sana va vaqt bilan xabar yuboramiz.",

    "flow.step3.title": "Shifokor qabulida",
    "flow.step3.text":
      "Shifokor ko‘rikdan o‘tkazadi, aniqlashtiruvchi savollar beradi va zarurat bo‘lsa, diagnostika hamda tahlillarni tayinlaydi.",

    "flow.step4.title": "Davolash rejasi va kuzatuv",
    "flow.step4.text":
      "Siz tushunarli davolash rejasi, tavsiyalar va zarurat bo‘lsa, qayta qabul yoki onlayn-maslahat olasiz.",

    // FOOTER SECTION (UZ)
    "footer.text":
      "Toshkent markazida joylashgan zamonaviy ko‘p tarmoqli klinika. 24/7 ishlaymiz — eng muhim paytda yoningizdamiz.",
    "footer.addr": "📍 Xuvaydo ko‘chasi, 7, Toshkent",
    "footer.hours": "🕒 Kecha-kunduz ishlaymiz",
    "footer.cta": "Qabulga yozilish",
    "footer.mapTitle": "Qanday topish mumkin",
    "footer.mapText":
      "Kamilovs’ Clinic Yandex Xaritalarda — qulay yo‘lni bir necha soniyada tuzib oling.",
    "footer.bottomNote": "Sayt bemorlar haqida g‘amxo‘rlik bilan yaratilgan.",
    "footer.toTop": "↑ Yuqoriga",

    // MODAL SECTION (UZ)
    "modal.title": "Kamilovs Clinic’ga qabulga yozilish",
    "modal.sub":
      "Aloqa ma’lumotlaringizni qoldiring — administratorimiz 5 daqiqa ichida siz bilan bog‘lanadi.",

    "modal.field.name.label": "Ism",
    "modal.field.name.placeholder": "Ismingiz",

    "modal.field.phone.label": "Telefon*",
    "modal.field.phone.placeholder": "+998 XX XXX XX XX",
    "modal.field.phone.hint":
      "Faqat sizning so‘rovingiz bo‘yicha qo‘ng‘iroq qilamiz — spam yo‘q.",

    "modal.field.service.label": "Qiziqtirayotgan xizmat",
    "modal.field.service.placeholder": "Masalan: kardiologiya",

    "modal.field.message.label": "Izoh",
    "modal.field.message.placeholder":
      "Savolingizni, shikoyatingizni yoki simptomlarni yozib bering",

    "modal.submit": "So‘rov yuborish",
    "modal.privacy":
      "“So‘rov yuborish” tugmasini bosish orqali shaxsiy ma’lumotlarni qayta ishlash siyosatiga rozilik bildirasiz.",

    //SERVICES PAGE TRANSLATIONS (UZ)
    // NAV — "О клинике" и мобильный звонок
    "nav.about": "Klinika haqida",
    "header.mobileCall": "Qo‘ng‘iroq qilish: +998 95 088 41 41",

    // SERVICES LIST (services.html)
    "servicesList.kicker": "Yo‘nalishlar",
    "servicesList.title": "Klinikaning asosiy xizmatlari",
    "servicesList.lead":
      "Quyida asosiy yo‘nalishlar keltirilgan. To‘liq ro‘yxat va narxlarni administratorimizdan aniqlashtirishingiz mumkin.",

    // Stomatologiya — karta 1
    "servicesList.card1.tag": "Stomatologiya",
    "servicesList.card1.title": "Davolash va gigiyena",
    "servicesList.card1.text":
      "Kariesni davolash, estetik tiklash, professional tozalash va parvarish bo‘yicha tavsiyalar.",
    "servicesList.card1.item1": "Ko‘rik va konsultatsiya",
    "servicesList.card1.item2": "Karies va pulpiti davolash",
    "servicesList.card1.item3": "Gigiyena, jilolash va tavsiyalar",
    "servicesList.card1.price": "250 000 so‘mdan",
    "servicesList.card1.cta": "Qabulga yozilish",
    "servicesList.card1.more": "Batafsil",

    // "Qabulga tayyorgarlik" bloki
    "servicesPrep.title": "Qabulga qanday tayyorlanish kerak",
    "servicesPrep.lead":
      "Kichik tayyorgarlik qabulni yanada samarali va aniqroq qiladi.",
    "servicesPrep.item1":
      "Pasport va avvalgi xulosalarni o‘zingiz bilan oling.",
    "servicesPrep.item2":
      "Qabul qilinayotgan dorilar va ularning dozalarini oldindan yozib qo‘ying.",
    "servicesPrep.item3":
      "Qon tahlillari uchun (agar tavsiya etilgan bo‘lsa) och qoringa keling.",
    "servicesPrep.item4":
      "Hujjatlarni xotirjam rasmiylashtirish uchun biroz avvalroq keling.",
    "servicesPrep.card.text":
      "Xizmatlar, tahlillar yoki narxlar bo‘yicha savollar qoldimi?\nAdministratorga yozing yoki qo‘ng‘iroq qiling — siz uchun qulay vaqt va shifokorni tanlashda yordam beramiz.",
    "servicesPrep.card.btn": "📞 Klinikaga qo‘ng‘iroq qilish",

    //SERVICES-DETAILS PAGE TRANSLATIONS (UZ)
    // SERVICE DETAIL (UZ)
    "sd.breadcrumb.current": "Xizmat",

    "sd.meta.durationLabel": "Qabul davomiyligi",
    "sd.meta.priceLabel": "Taxminiy narx",

    "sd.hero.ctaPrimary": "Qabulga yozilish",
    "sd.hero.ctaSecondary": "Barcha xizmatlar",

    "sd.benefits.title": "Nega bemorlar bu xizmatni tanlashadi",

    "sd.cta.title": "Ariza qoldiring — sizga qulay qabul vaqtini tanlaymiz",
    "sd.cta.text":
      "Administrator siz bilan bog‘lanib, tafsilotlarni aniqlashtiradi va so‘rovingizga mos shifokorni tanlashga yordam beradi.",
    "sd.cta.btn": "Hozir yozilish",

    // ===== DOCTORS PAGE / HERO =====
    "docs.hero.kicker": "MUTAХASSISLAR JAMOASI",
    "docs.hero.title": "Kamilovs Clinic shifokorlari",
    "docs.hero.lead":
      "Neyrologlar, terapevtlar, pediatrlar, stomatologlar va boshqa mutaxassislar — butun oila salomatligini ishonib topshirsa bo‘ladigan jamoa.",
    "docs.hero.note":
      "Ushbu sahifada siz klinika shifokorlari bilan tanishib, kerakli yo‘nalishni tanlashingiz mumkin. Administrator sizga qulay qabul vaqtini tanlab beradi.",
    "docs.hero.btn": "Shifokorga yozilish",
    "docs.hero.hint": "Biz 24/7 ishlaymiz, telefon va onlayn yozilish mavjud.",

    "docs.hero.card.title": "Ommabop yo‘nalishlar",
    "docs.hero.card.item1": "Neyrologiya va terapiya",
    "docs.hero.card.item2": "Pediatriya va bolalarni kuzatish",
    "docs.hero.card.item3": "Stomatologiya va og‘iz bo‘shlig‘i gigiyenasi",
    "docs.hero.card.item4": "UZI diagnostika va check-up dasturlari",
    "docs.hero.card.text":
      "Qaysi shifokorga yozilishni bilmaysizmi? Oddiygina administratorga qo‘ng‘iroq qiling — sizga mutaxassisni tanlashda yordam beramiz.",

    // ===== DOCTORS PAGE / FILTER =====
    "docs.filter.label": "Yo‘nalish bo‘yicha filtrlash:",
    "docs.filter.all": "Barchasi",
    "docs.filter.neuro": "Neyrolog",
    "docs.filter.therapy": "Terapevt",
    "docs.filter.pediatrics": "Pediatr",
    "docs.filter.stom": "Stomatolog",
    "docs.filter.uzd": "UZI",
    "docs.filter.cardio": "Kardiolog",
    "docs.filter.gyno": "Ginekolog",
    "docs.filter.ent": "LOR",

    // ===== DOCTORS PAGE / CARD 1 =====
    "docs.card1.badge": "Stomatologiya",
    "docs.card1.name": "F.I.Sh.",
    "docs.card1.role": "Stomatologiya",
    "docs.card1.text":
      "Bosh og‘rig‘i, uyqusizlik va nevrozlarni tashxislash va davolash. Har bir tavsiyani batafsil tushuntirib beradi.",

    // ===== DOCTORS PAGE / CTA =====
    "docs.cta.title": "Qaysi shifokorga yozilishni bilmaysizmi?",
    "docs.cta.text":
      "Saytda ariza qoldiring yoki qo‘ng‘iroq qiling — administrator shikoyatlaringizni aniqlab, mos mutaxassisni tavsiya qiladi.",
    "docs.cta.btn": "Onlayn yozilish",

    // header / nav
    "nav.home": "Bosh sahifa",
    "nav.services": "Xizmatlar",
    "nav.doctors": "Shifokorlar",
    "nav.contacts": "Kontaktlar",
    "header.btnRecord": "Qabulga yozilish",
    "header.mobile.call": "Qo‘ng‘iroq qilish: +998 95 088 41 41",

    // hero
    "contacts.hero.pill": "Klinika kontaktlari",
    "contacts.hero.title.main": "Har doim aloqadamiz",
    "contacts.hero.subtitle":
      "Qo‘ng‘iroq qiling, yozing yoki klinikaga tashrif buyuring — shifokor tanlashda, qabulga tayyorgarlik va tahlillar bo‘yicha yordam beramiz.",
    "contacts.hero.chip.address": "📍 Toshkent, Xuvaydo ko‘chasi, 7",
    "contacts.hero.chip.phone": "📞 +998 95 088 41 41",
    "contacts.hero.chip.hours": "🕒 24/7 ishlaymiz",
    "contacts.hero.btn.call": "Klinikaga qo‘ng‘iroq qilish",
    "contacts.hero.btn.online": "Onlayn yozilish",

    "contacts.hero.card.badge": "🩺 Tezkor yozilish",
    "contacts.hero.card.title": "Hozir yordam kerakmi?",
    "contacts.hero.card.text":
      "Ariza qoldiring yoki qo‘ng‘iroq qiling — administrator qaysi shifokorga va qachon kelganingiz maqul bo‘lishini aytib beradi.",
    "contacts.hero.card.li1": "10–20 daqiqa ichida qayta qo‘ng‘iroq",
    "contacts.hero.card.li2": "Shikoyatlaringiz bo‘yicha shifokor tanlash",
    "contacts.hero.card.li3": "Qabul sanasi eslatmalari",
    "contacts.hero.card.phoneLabel": "24/7 telefon raqami",
    "contacts.hero.card.btn": "Ariza qoldirish",

    // main contacts block
    "contacts.main.title": "Qanday bog‘lanish mumkin",
    "contacts.main.text":
      "Qabulga telefon orqali, sayt orqali yoki messenjerlar orqali yozilishingiz mumkin. Shikoyatlaringizni, qulay vaqtni aniqlab olamiz va qabulga tayyorgarlik kerakmi, aytamiz.",
    "contacts.main.card1.title": "📍 Klinikamiz manzili",
    "contacts.main.card1.text":
      "Toshkent, Xuvaydo ko‘chasi, 7\nKirish qulay, yo‘l-yo‘riqlar aniq.",
    "contacts.main.card2.title": "📞 Telefon va messenjerlar",
    "contacts.main.card2.text":
      "Telefon: +998 95 088 41 41\nTelegram / qo‘ng‘iroq — shu raqam orqali.",
    "contacts.main.card3.title": "🕒 Ish vaqti",
    "contacts.main.card3.text":
      "Bemorlarni qabul qilish: 24/7\nTahlillar va diagnostika — oldindan yozilish asosida.",
    "contacts.main.card4.title": "✉️ Elektron pochta",
    "contacts.main.card4.text": "Umumiy savollar uchun: info@kamilovs.uz",
    "contacts.main.highlight":
      "Agar holatingiz og‘ir bo‘lsa yoki o‘zingizni yomon his qilsangiz — formani to‘ldirishdan ko‘ra darhol klinikaga qo‘ng‘iroq qilganingiz ma’qul. Shunda biz tezroq yordam bera olamiz.",

    // map
    "contacts.map.title": "Biz xaritada",
    "contacts.map.text":
      "Kamilovs Clinic manziliga yo‘lni bir necha soniyada tuzing.",
    "contacts.map.hint":
      "🚗 Mashinada — klinika kirish qismigacha bemalol borishingiz mumkin.\n🚶‍♂️ Piyoda — «Kamilovs Clinic» yozuvi bo‘yicha yo‘l toping.",

    // form
    "contacts.form.title": "Onlayn ariza qoldiring",
    "contacts.form.text":
      "Arizani to‘ldiring — administrator siz bilan bog‘lanadi, tafsilotlarni aniqlaydi va qabulni tasdiqlaydi.",
    "contacts.form.tag.fast": "⏱ 10–20 daqiqada qayta qo‘ng‘iroq",
    "contacts.form.tag.safe": "🔒 Shaxsiy ma’lumotlaringiz himoyalangan",

    "contacts.form.field.name.label": "Ism *",
    "contacts.form.field.name.placeholder": "Ismingiz",

    "contacts.form.field.phone.label": "Telefon *",
    "contacts.form.field.phone.placeholder": "+998 XX XXX XX XX",

    "contacts.form.field.topic.label": "Murojaat mavzusi",
    "contacts.form.field.topic.option.empty": "Variantni tanlang",
    "contacts.form.field.topic.option.appointment": "Qabulga yozilish",
    "contacts.form.field.topic.option.tests": "Tahlillar va diagnostika",
    "contacts.form.field.topic.option.price": "Narx bo‘yicha savol",
    "contacts.form.field.topic.option.other": "Boshqa",

    "contacts.form.field.time.label": "Qulay qo‘ng‘iroq vaqti",
    "contacts.form.field.time.placeholder":
      "Masalan: bugun soat 18:00 dan keyin",

    "contacts.form.field.message.label": "Izoh",
    "contacts.form.field.message.placeholder":
      "Qisqacha shikoyatlaringiz yoki savolingizni yozing",

    "contacts.form.consent": "Shaxsiy ma’lumotlarimni qayta ishlashga roziman",
    "contacts.form.submit": "Ariza yuborish",
    "contacts.form.hint":
      "Odatda ish vaqtida 10–20 daqiqa ichida qayta qo‘ng‘iroq qilamiz.",

    // footer
    "footer.text":
      "Zamonaviy ko‘p tarmoqli klinika Toshkent markazida. 24/7 ishlaymiz — sizga kerak bo‘lgan vaqtda yoningizdamiz.",
    "footer.address": "📍 Xuvaydo ko‘chasi, 7, Toshkent",
    "footer.phone": "+998 95 088 41 41",
    "footer.email": "info@kamilovs.uz",
    "footer.hours": "🕒 24/7 ishlaymiz",
    "footer.mapTitle": "Qanday topish mumkin",
    "footer.mapText":
      "Kamilovs Clinic manzilini Yandex Xaritalarda bir necha soniyada toping.",
    "footer.bottom.left": "© {year} Kamilovs Clinic.",
    "footer.bottom.right": "Sayt bemorlar haqida g‘amxo‘rlik bilan yaratilgan.",

    // modal
    "modal.title": "Kamilovs Clinic ga yozilish",
    "modal.sub":
      "Kontaktlaringizni qoldiring — administrator <strong>5 daqiqa</strong> ichida javob beradi.",
    "modal.field.name.label": "Ism",
    "modal.field.name.placeholder": "Ismingiz",
    "modal.field.phone.label": "Telefon*",
    "modal.field.phone.placeholder": "+998 XX XXX XX XX",
    "modal.field.phone.hint":
      "Faqat sizning arizangiz bo‘yicha qo‘ng‘iroq qilamiz — spam bo‘lmaydi.",
    "modal.field.service.label": "Qaysi xizmat qiziqtiradi",
    "modal.field.service.placeholder": "Masalan: kardiologiya",
    "modal.field.message.label": "Izoh",
    "modal.field.message.placeholder":
      "Savolingiz yoki shikoyatlaringizni yozing",
    "modal.submit": "Ariza yuborish",
    "modal.privacy":
      "«Ariza yuborish» tugmasini bosish orqali shaxsiy ma’lumotlaringizni qayta ishlashga rozilik bildirasiz.",
  },
};

const DEFAULT_LANG = "ru";

// применяем переводы по data-i18n
function applyTranslations(lang) {
  const dict = translations[lang] || translations[DEFAULT_LANG];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // поддержка плейсхолдеров (если понадобится позже)
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.setAttribute("placeholder", dict[key]);
    }
  });
}

// визуально подсвечиваем выбранный язык
function setActiveButton(lang) {
  document
    .querySelectorAll(".kc-lang-btn")
    .forEach((btn) => btn.classList.remove("kc-lang-btn--active"));

  const active = document.querySelector(`.kc-lang-btn[data-lang="${lang}"]`);
  if (active) {
    active.classList.add("kc-lang-btn--active");
  }
}

// инициализация
document.addEventListener("DOMContentLoaded", () => {
  const currentLang = localStorage.getItem("kc-lang") || DEFAULT_LANG;

  applyTranslations(currentLang);
  setActiveButton(currentLang);

  document.querySelectorAll(".kc-lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (!lang) return;

      localStorage.setItem("kc-lang", lang);
      applyTranslations(lang);
      setActiveButton(lang);
    });
  });
});
