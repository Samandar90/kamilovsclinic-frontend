Inter — © The Inter Project Authors
Лицензия: SIL Open Font License 1.1 — https://openfontlicense.org
Источник: https://fonts.google.com/specimen/Inter

Файлы получены из Google Fonts и лежат в репозитории намеренно:
сторонний запрос к fonts.googleapis.com блокировал бы рендер страницы
и добавлял лишние DNS + TLS к первой загрузке.

Подмножества разделены по unicode-range (см. css/kc-tokens.css), поэтому
браузер скачивает только нужные диапазоны:

  inter-latin.woff2         латиница, пунктуация, типографские кавычки
  inter-cyrillic.woff2      кириллица (русская версия сайта)
  inter-cyrillic-ext.woff2  расширенная кириллица, про запас

Подмножество latin-ext не включено: ни один символ из его диапазона
в текстах сайта не встречается (проверено), а весит оно 83 КБ.

Чтобы обновить шрифт, скачайте woff2 заново с Google Fonts и сверьте
unicode-range в css/kc-tokens.css с актуальной выдачей их CSS API.
