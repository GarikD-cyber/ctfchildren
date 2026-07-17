import React, { useEffect, useState } from "react";

const SAVE_PREFIX = "cybercity:v1:";
const GENERAL_SETTINGS = "cybercity:v1:settings";

const MISSIONS = [
  {
    id: 1,
    title: "Опасный профиль",
    district: "Район приватности",
    icon: "🪪",
    color: "violet",
    villain: "Енот-Хитрец",
    story:
      "Енот-Хитрец собрал слишком много сведений о жителях. Очисти профиль героя, пока данные не попали в чужие лапы.",
    lesson:
      "Личные данные помогают понять, кто ты, где живёшь или как с тобой связаться. Любимую книгу обсудить безопасно, а адрес, телефон, пароль, документы и планы семьи должны знать только ты и взрослые, которым ты доверяешь.",
    rule:
      "Перед публикацией остановись и подумай: сможет ли незнакомец использовать эту информацию против меня?",
    check: {
      question: "Что лучше сделать перед публикацией фотографии билета с QR-кодом?",
      options: ["Опубликовать сразу", "Скрыть QR-код и спросить взрослого", "Отправить незнакомцу"],
      correct: 1,
    },
    flag: "FLAG-ПРИВАТНОСТЬ-01",
  },
  {
    id: 2,
    title: "Правда или выдумка ИИ",
    district: "Лаборатория фактов",
    icon: "🤖",
    color: "cyan",
    villain: "Робот Уверяка",
    story:
      "Робот-помощник отвечает очень уверенно, но иногда смешивает факты и выдумки. Помоги городу вернуть правду.",
    lesson:
      "ИИ учится на большом количестве примеров. Он может быстро помогать, но иногда ошибается или придумывает ответ. Уверенный тон не доказывает, что ответ правильный. Важное нужно сверять с надёжным источником или проверять вместе со взрослым.",
    rule: "Важную информацию проверяй по надёжному источнику или вместе со взрослым.",
    check: {
      question: "ИИ уверенно назвал дату школьной экскурсии. Что делать?",
      options: ["Сразу поверить", "Проверить у учителя или в официальном сообщении", "Переслать всем"],
      correct: 1,
    },
    flag: "FLAG-ПРОВЕРКА-02",
  },
  {
    id: 3,
    title: "Мастерская паролей",
    district: "Крепость доступа",
    icon: "🔐",
    color: "orange",
    villain: "Господин Коротыш",
    story:
      "Цифровой замок города слишком слабый. Собери длинную учебную парольную фразу и укрепи ворота.",
    lesson:
      "Длинная парольная фраза обычно надёжнее короткого пароля. Не используй имя, дату рождения и простые цепочки. Для важных аккаунтов нужны разные пароли. Никому не отправляй пароль и код подтверждения — даже другу.",
    rule: "Длинная уникальная фраза сильнее короткого и предсказуемого пароля.",
    check: {
      question: "Кому можно отправить код подтверждения из сообщения?",
      options: ["Другу", "Сотруднику игры", "Никому"],
      correct: 2,
    },
    flag: "FLAG-ПАРОЛЬ-03",
  },
  {
    id: 4,
    title: "Сообщение от незнакомца",
    district: "Площадь общения",
    icon: "💬",
    color: "pink",
    villain: "Спешун-Пугатель",
    story:
      "В городской чат пришли подозрительные сообщения. Выбери безопасную реакцию и останови Спешуна-Пугателя.",
    lesson:
      "Ловушка часто обещает подарок, торопит, пугает, просит открыть ссылку, прислать пароль или код. Подозрительным может быть и сообщение от знакомого, если оно написано необычно. Остановись, проверь отправителя другим способом и покажи сообщение взрослому.",
    rule: "Остановись — проверь отправителя — спроси взрослого.",
    check: {
      question: "Друг неожиданно просит срочно прислать код. Как поступить?",
      options: ["Отправить код", "Проверить друга другим способом и спросить взрослого", "Открыть все ссылки"],
      correct: 1,
    },
    flag: "FLAG-СТОП-04",
  },
  {
    id: 5,
    title: "Лабиринт публичного Wi-Fi",
    district: "Район цифровых маршрутов",
    icon: "📶",
    color: "cyan",
    villain: "Сетевой Двойник",
    story:
      "В Кибергороде появились поддельные точки Wi-Fi. Проведи героя через цифровой лабиринт и не попади в сеть Сетевого Двойника.",
    lesson:
      "Публичным Wi-Fi пользуются разные люди. Открытая сеть без пароля не всегда опасна, но через неизвестную сеть нельзя без необходимости вводить важные пароли, банковские или секретные данные. Замок означает только наличие пароля — он не подтверждает владельца сети. Название подделки может отличаться всего одной буквой или цифрой. Если сеть неизвестна, лучше использовать мобильный интернет или подождать.",
    rule: "Перед подключением проверь точное название сети у взрослого или сотрудника места.",
    check: {
      question: "Ты увидел сети Cafe_Guest и Cafe_Freee_Guest. Что сделать сначала?",
      options: ["Подключиться к той, где больше букв", "Проверить правильное название у сотрудника", "Попробовать обе сети", "Отправить другу пароль"],
      correct: 1,
    },
    flag: "FLAG-СЕТЬ-05",
    success: "Ты нашёл безопасный маршрут. Теперь жители Кибергорода знают: название сети нужно проверять, а важные данные нельзя вводить через неизвестный Wi-Fi.",
  },
  {
    id: 6,
    title: "Найди поддельную картинку",
    district: "Район цифровых маршрутов",
    icon: "🖼️",
    color: "violet",
    villain: "Робот-Обманщик",
    story:
      "Робот-Обманщик разослал жителям поддельные изображения. Найди странные детали, но не делай вывод только по одной подсказке.",
    lesson:
      "ИИ умеет создавать правдоподобные картинки. Иногда остаются странности: лишние детали, непонятные буквы, неверные тени, отражения или повторы. Одна странность ещё не доказывает подделку. Важно проверить автора, источник и подтверждение, а пугающую или важную картинку показать взрослому.",
    rule: "Смотри на детали, проверяй источник и не спеши пересылать изображение.",
    check: {
      question: "На картинке у мультяшного героя шесть пальцев. Что это означает?",
      options: ["Картинка точно создана ИИ", "Это повод проверить изображение внимательнее", "Её нужно сразу переслать", "Изображение всегда настоящее"],
      correct: 1,
    },
    flag: "FLAG-ИЗОБРАЖЕНИЕ-06",
    success: "Ты заметил подозрительные детали и не поверил картинке сразу. Настоящий цифровой детектив всегда проверяет источник.",
  },
  {
    id: 7,
    title: "Почини цифровой щит",
    district: "Район цифровых маршрутов",
    icon: "🛡️",
    color: "orange",
    villain: "Архивный Жук",
    story:
      "На цифровом щите появились трещины: старые программы больше не закрывают новые слабые места. Подбери безопасные обновления.",
    lesson:
      "Уязвимость — это слабое место программы. Обновление похоже на заплатку, которая закрывает дыру в защите. Устанавливай обновления только через официальные настройки или магазин приложений. Не открывай файлы обновлений из случайных сообщений. Иногда после обновления нужен перезапуск, а перед важными изменениями взрослый может сделать резервную копию.",
    rule: "Обновляй устройство через официальные настройки и не доверяй случайным ссылкам.",
    check: {
      question: "В чате прислали «Срочное обновление!» и файл update_super.exe. Что безопаснее?",
      options: ["Открыть файл", "Не открывать, проверить официальный магазин и показать взрослому", "Переслать друзьям", "Отключить обновления навсегда"],
      correct: 1,
    },
    flag: "FLAG-ОБНОВЛЕНИЕ-07",
    success: "Все трещины закрыты. Ты обновил программы безопасным способом и восстановил цифровой щит.",
  },
  {
    id: 8,
    title: "Добрый ответ",
    district: "Район цифровых маршрутов",
    icon: "🤝",
    color: "pink",
    villain: "Эхо-Задира",
    story:
      "В школьном чате появились обидные сообщения. Помоги пострадавшему герою, останови распространение и позови помощь.",
    lesson:
      "Кибербуллинг — это повторяющиеся оскорбления, угрозы, унижение или распространение обидных материалов. Пострадавший не виноват. Не отвечай ещё грубее: сохрани доказательства, заблокируй обидчика, пожалуйся, расскажи взрослому и поддержи человека. Если есть угроза причинить вред, покажи её взрослому сразу. Уважительное несогласие и доброжелательная критика сами по себе не являются травлей.",
    rule: "Останови распространение, сохрани доказательства и обратись за помощью.",
    check: {
      question: "В чат отправили обидную картинку про одноклассника. Что лучше сделать?",
      options: ["Переслать дальше", "Не пересылать, сохранить доказательство, поддержать и сообщить взрослому", "Ответить ещё грубее", "Поставить смеющийся знак"],
      correct: 1,
    },
    flag: "FLAG-ПОДДЕРЖКА-08",
    success: "Ты остановил распространение обидных сообщений и помог герою получить поддержку. Просить помощи — правильно и смело.",
  },
  {
    id: 9,
    title: "Замок с двумя ключами",
    district: "Район разумной защиты",
    icon: "🗝️",
    color: "violet",
    villain: "Одноключник",
    story: "Злодей узнал пароль от главных ворот. Установи второй независимый способ проверки и не дай ему войти.",
    lesson: "Пароль — один способ доказать, что аккаунт твой. Факторы бывают трёх видов: то, что ты знаешь — пароль или секретная фраза; то, что у тебя есть — телефон, приложение с кодом или ключ безопасности; то, чем ты являешься — лицо или отпечаток. Два пароля относятся к одной категории и не становятся двумя факторами. Одноразовый код нельзя сообщать никому: настоящая поддержка не просит его в сообщении.",
    rule: "Для надёжной защиты выбирай два разных фактора и никому не сообщай одноразовый код.",
    check: { question: "Пароль и ещё один пароль — это двухфакторная защита?", options: ["Да, потому что паролей два", "Нет, оба относятся к тому, что человек знает", "Да, если второй пароль длиннее", "Зависит от цвета пароля"], correct: 1 },
    flag: "FLAG-ДВА-КЛЮЧА-09",
    success: "Теперь одного украденного пароля недостаточно. Ты добавил второй независимый способ проверки.",
  },
  {
    id: 10,
    title: "Что нельзя рассказывать ИИ",
    district: "Район разумной защиты",
    icon: "🚦",
    color: "cyan",
    villain: "Болтливый Бот",
    story: "Жители отправляют ИИ-помощнику слишком много сведений о себе и других людях. Очисти запросы до отправки.",
    lesson: "ИИ можно задавать вопросы, но нельзя отправлять ему всё подряд. Зелёные запросы не содержат личных данных. Из жёлтых сначала нужно удалить имя, школу, адрес, чужую фотографию или переписку и при необходимости спросить взрослого. Красные данные — настоящий пароль, код подтверждения, документ и банковские сведения — отправлять нельзя. Чужую фотографию или переписку нельзя загружать без разрешения.",
    rule: "Перед отправкой в ИИ остановись и проверь: есть ли здесь мои или чужие личные данные?",
    check: { question: "В школьном тексте указаны твои фамилия, школа и домашний адрес. Что сделать перед отправкой в ИИ?", options: ["Отправить как есть", "Удалить личные данные и только потом отправить текст", "Добавить номер телефона", "Опубликовать текст"], correct: 1 },
    flag: "FLAG-ДАННЫЕ-ИИ-10",
    success: "Ты научился использовать ИИ без лишних личных данных. Хороший запрос может быть полезным и безопасным одновременно.",
  },
  {
    id: 11,
    title: "Спаси цифровой архив",
    district: "Район разумной защиты",
    icon: "🗄️",
    color: "orange",
    villain: "Цифровая Буря",
    story: "На Кибергород надвигается цифровая буря. Создай дополнительные копии важных файлов до поломки компьютера.",
    lesson: "Резервная копия — дополнительная копия важного файла в другом безопасном месте. Две папки на одном телефоне не помогут, если потеряется сам телефон. Важные файлы лучше хранить минимум в двух местах и иногда проверять копии. Семейным облаком и внешним носителем пользуйся с разрешения взрослого. Неизвестную флешку подключать нельзя.",
    rule: "Важный файл не должен существовать только в одном месте.",
    check: { question: "Фотография хранится в двух папках одного телефона. Это надёжная резервная копия?", options: ["Да, папок две", "Нет: при поломке или потере телефона могут исчезнуть обе папки", "Да, если папки разных цветов", "Копии не нужны"], correct: 1 },
    flag: "FLAG-КОПИЯ-11",
    success: "Цифровая буря прошла, а важные файлы сохранились. Ты заранее создал копии в разных местах.",
  },
  {
    id: 12,
    title: "Следы в цифровом парке",
    district: "Район разумной защиты",
    icon: "👣",
    color: "pink",
    villain: "Эхо-Пересылатель",
    story: "В цифровом парке остаются следы сообщений, фотографий и комментариев. Проследи, куда путешествует информация.",
    lesson: "Цифровой след — информация, которая остаётся после действий в интернете. Даже удалённую публикацию могли переслать или сохранить скриншотом. Личное сообщение тоже могут переслать, а приватность лишь уменьшает круг зрителей. Чужие фотографии публикуют только с разрешения. Добрые и полезные действия тоже создают цифровой след.",
    rule: "Перед публикацией подумай: буду ли я спокойно относиться к этому сообщению завтра и через год?",
    check: { question: "Ты удалил фотографию через пять минут. Может ли она всё ещё остаться у других людей?", options: ["Нет, удаление стирает все копии", "Да, её могли переслать или сохранить скриншотом", "Только через год", "Зависит от цвета фотографии"], correct: 1 },
    flag: "FLAG-СЛЕД-12",
    success: "Ты увидел, как быстро информация может путешествовать по сети. Теперь ты умеешь думать перед публикацией и создавать добрый цифровой след.",
  },
];

const PROFILE_CARDS = [
  ["Любимая книга", "public", "📚"],
  ["Домашний адрес", "private", "🏠"],
  ["Номер телефона", "private", "📱"],
  ["Фотография паспорта", "private", "🛂"],
  ["Название любимой игры", "public", "🎮"],
  ["Настоящий пароль", "private", "🔑"],
  ["Фото домашнего питомца", "public", "🐾"],
  ["Дома неделю никого не будет", "private", "🧳"],
  ["Школьная оценка", "public", "⭐"],
  ["Билет с QR-кодом", "private", "🎟️"],
].map(([label, answer, icon], id) => ({ id, label, answer, icon }));

const FACT_CARDS = [
  {
    text: "У Земли один естественный спутник — Луна.",
    source: "Карточка школьного атласа: у Земли указан один естественный спутник.",
    answer: "confirmed",
  },
  {
    text: "Эйфелева башня находится в Риме.",
    source: "Карточка географического справочника: Эйфелева башня находится в Париже.",
    answer: "false",
  },
  {
    text: "Завтра занятия во всех школах отменены.",
    source: "На карточке нет названия школы, даты и официального автора сообщения.",
    answer: "check",
  },
  {
    text: "При обычном давлении на уровне моря вода кипит примерно при 100 °C.",
    source: "Карточка учебника естествознания подтверждает это значение.",
    answer: "confirmed",
  },
  {
    text: "Сотруднику поддержки можно отправить свой пароль.",
    source: "Правило безопасности сервиса: настоящая поддержка не просит пароль.",
    answer: "false",
  },
  {
    text: "Гриб на фотографии точно безопасно есть.",
    source: "По одной фотографии нельзя надёжно определить безопасность гриба.",
    answer: "check",
  },
];

const CHAT_CARDS = [
  {
    from: "Подарки_Всем_777",
    text: "Ты выиграл новый телефон! Срочно открой gift-now.example.",
    safe: ["block", "adult"],
  },
  {
    from: "Неизвестный игрок",
    text: "Пришли код из SMS — добавлю тебе 5 000 монет.",
    safe: ["nothing", "block", "adult"],
  },
  {
    from: "Маша",
    text: "Привет. Очень срочно отправь пароль, потом объясню.",
    safe: ["verify", "nothing", "adult"],
  },
  {
    from: "Школьный кружок?",
    text: "Занятие перенесли. Перейди по короткой ссылке и войди в аккаунт.",
    safe: ["verify", "adult"],
  },
  {
    from: "Страшный_Модератор",
    text: "Твой аккаунт удалят через 3 минуты! Назови код подтверждения.",
    safe: ["nothing", "block", "adult"],
  },
  {
    from: "Папа? Новый номер",
    text: "Это мой новый номер. Перешли мне код, который сейчас придёт.",
    safe: ["verify", "nothing", "adult"],
  },
];

const ACTIONS = [
  ["open", "Открыть ссылку"],
  ["send", "Отправить код"],
  ["verify", "Проверить отправителя"],
  ["nothing", "Ничего не отправлять"],
  ["block", "Заблокировать"],
  ["adult", "Показать взрослому"],
];

const WIFI_SITUATIONS = [
  { name: "Home_5G", icon: "🏠", text: "Домашняя сеть, которую взрослый уже настроил и подтвердил.", safe: ["connect"] },
  { name: "School_Guest", icon: "🏫", text: "Гостевая сеть школы. Ты ещё не сверял название.", safe: ["check", "adult"] },
  { name: "Cafe_Free_NoPassword", icon: "☕", text: "Открытая сеть кафе без пароля. Нужно отправить обычное сообщение, но сеть не проверена.", safe: ["check", "skip"] },
  { name: "Airport_Free_WiFi", icon: "✈️", text: "Сотрудник аэропорта подтвердил это точное название. Не вводи через неё секретные данные.", safe: ["connect"] },
  { name: "Airport_Free_WiF1", icon: "⚠️", text: "Название почти такое же, но последняя буква заменена цифрой 1.", safe: ["check", "skip", "adult"], tricky: true },
  { name: "FREE_FAST_INTERNET", icon: "🎁", text: "Неизвестная сеть обещает самый быстрый бесплатный интернет.", safe: ["skip", "adult"] },
  { name: "Mobile_Hotspot_Parent", icon: "📱", text: "Родитель включил точку доступа и подтвердил её название.", safe: ["connect"] },
  { name: "Unknown_Network 🔒", icon: "🔒", text: "Неизвестная сеть защищена паролем, но владелец неизвестен.", safe: ["check", "skip", "adult"] },
  { name: "Unknown_Free", icon: "📡", text: "Неизвестная открытая сеть без пароля.", safe: ["skip", "adult"] },
];

const WIFI_ACTIONS = [
  ["connect", "Подключиться"],
  ["check", "Сначала проверить"],
  ["skip", "Не подключаться"],
  ["adult", "Позвать взрослого"],
];

const IMAGE_SCENES = [
  {
    title: "Робот на площади",
    backdrop: "robot",
    details: [
      { id: "fingers", label: "У робота шесть пальцев", icon: "🤖✋", correct: true, x: 24, y: 58 },
      { id: "sign", label: "Надпись «КИБЕRГРАД» искажена", icon: "🔤", correct: true, x: 66, y: 25 },
      { id: "cloud", label: "Облако нарисовано необычно", icon: "☁️", correct: false, x: 80, y: 12 },
      { id: "bench", label: "Обычная яркая скамейка", icon: "🪑", correct: false, x: 53, y: 70 },
    ],
  },
  {
    title: "Зеркальная мастерская",
    backdrop: "mirror",
    details: [
      { id: "reflection", label: "Робот не отражается в зеркале", icon: "🪞", correct: true, x: 63, y: 43 },
      { id: "clock", label: "Два одинаковых часа показывают разное время", icon: "🕒🕘", correct: true, x: 28, y: 23 },
      { id: "lamp", label: "Лампа имеет фантазийную форму", icon: "💡", correct: false, x: 82, y: 68 },
    ],
  },
  {
    title: "Улица повторов",
    backdrop: "street",
    details: [
      { id: "windows", label: "Одинаковый рисунок окон повторяется слишком точно", icon: "🪟🪟", correct: true, x: 30, y: 25 },
      { id: "wheel", label: "У автобуса лишнее колесо", icon: "🚌", correct: true, x: 66, y: 66 },
      { id: "tree", label: "Дерево фиолетового цвета — это стиль сцены", icon: "🌳", correct: false, x: 85, y: 32 },
    ],
  },
  {
    title: "Парк странных теней",
    backdrop: "park",
    details: [
      { id: "shadow", label: "Тень направлена против света", icon: "☀️↔️", correct: true, x: 34, y: 70 },
      { id: "wall", label: "Мяч проходит сквозь стену", icon: "⚽", correct: true, x: 73, y: 55 },
      { id: "faces", label: "У трёх фоновых героев совершенно одинаковые лица", icon: "🙂🙂🙂", correct: true, x: 52, y: 28 },
      { id: "flowers", label: "Цветы разного размера — это нормально", icon: "🌼", correct: false, x: 12, y: 40 },
    ],
  },
];

const SHIELD_DAMAGE = [
  { id: "game", title: "Устаревшая игра", correct: "store", icon: "🎮" },
  { id: "os", title: "Старая система", correct: "settings", icon: "💻" },
  { id: "browser", title: "Браузер просит обновление", correct: "source", icon: "🌐" },
  { id: "unknown", title: "Приложение из неизвестного источника", correct: "adult", icon: "📦" },
  { id: "restart", title: "Нужен перезапуск", correct: "restart", icon: "🔄" },
  { id: "fake", title: "Файл обновления из чата", correct: "delete", icon: "🗑️" },
];

const UPDATE_CARDS = [
  ["settings", "Открыть официальные настройки", true],
  ["store", "Обновить через магазин приложений", true],
  ["restart", "Перезапустить устройство", true],
  ["delete", "Удалить подозрительный файл", true],
  ["adult", "Позвать взрослого", true],
  ["source", "Проверить официальный источник", true],
  ["disable", "Отключить обновления навсегда", false],
  ["download", "Скачать файл из сообщения", false],
];

const BULLY_ACTIONS = [
  ["rough", "Ответить ещё грубее"],
  ["forward", "Переслать другим"],
  ["evidence", "Сохранить доказательство"],
  ["block", "Заблокировать"],
  ["report", "Пожаловаться"],
  ["adult", "Сообщить взрослому"],
  ["support", "Поддержать пострадавшего"],
  ["ignore", "Ничего не делать"],
  ["clarify", "Спокойно уточнить смысл"],
];

const BULLY_SCENES = [
  { type: "Неудачная шутка", from: "Лев", text: "Ой, шутка вышла обидной. Прости, я не хотел тебя задеть.", safe: ["clarify"] },
  { type: "Повторяющиеся оскорбления", from: "Эхо-Задира", text: "Ты опять всё испортил! Уходи! Я буду писать это каждый день.", safe: ["evidence", "block", "report", "adult", "support"] },
  { type: "Прямая угроза", from: "Неизвестный", text: "Завтра я причиню тебе вред. Никому не рассказывай.", safe: ["evidence", "block", "report", "adult"] },
  { type: "Личная фотография", from: "Пересылатель", text: "Смотрите, я выложил личное фото одноклассника без разрешения!", safe: ["evidence", "report", "adult", "support"] },
  { type: "Исключение из чата", from: "Админ класса", text: "Давайте специально удалим Аню и создадим чат, чтобы смеяться над ней.", safe: ["evidence", "report", "adult", "support"] },
  { type: "Уважительное несогласие", from: "Мила", text: "Я не согласна с твоей идеей, но давай спокойно обсудим другой вариант.", safe: ["clarify"] },
  { type: "Поддержка", from: "Друг", text: "Ты не виноват. Я рядом и помогу рассказать взрослому.", safe: ["support"] },
  { type: "Просьба распространить вред", from: "Эхо-Задира", text: "Перешли всем эту унизительную картинку — будет смешно!", safe: ["evidence", "report", "adult", "support"] },
];

const MFA_CARDS = [
  ["password", "Пароль", "know", "🔤"], ["phrase", "Секретная фраза", "know", "💭"],
  ["app", "Код из приложения", "have", "📲"], ["phone", "Телефон", "have", "📱"],
  ["key", "Ключ безопасности", "have", "🔑"], ["finger", "Отпечаток пальца", "are", "☝️"],
  ["face", "Лицо", "are", "🙂"], ["username", "Имя пользователя", "none", "🏷️"],
  ["color", "Любимый цвет", "none", "🎨"], ["twopass", "Два одинаковых пароля", "none", "2️⃣"],
].map(([id, label, group, icon]) => ({ id, label, group, icon }));

const MFA_FACTORS = [
  ["password", "Пароль", "know"], ["second", "Второй пароль", "know"], ["question", "Контрольный вопрос", "know"],
  ["app", "Код из приложения", "have"], ["app2", "Ещё один код из того же приложения", "have"],
  ["key", "Физический ключ", "have"], ["finger", "Отпечаток", "are"], ["face", "Лицо", "are"], ["username", "Имя пользователя", "none"],
].map(([id, label, group]) => ({ id, label, group }));

const AI_TRAFFIC_CARDS = [
  ["Придумай название команды", "green"], ["Объясни, почему идёт дождь", "green"], ["Помоги составить план рассказа", "green"], ["Придумай загадку про робота", "green"],
  ["Проверь текст с полным именем", "yellow"], ["Письмо с номером школы", "yellow"], ["Обработай фотографию ребёнка", "yellow"], ["Перескажи личную переписку друга", "yellow"], ["Документ с адресом", "yellow"],
  ["Настоящий пароль", "red"], ["Одноразовый код", "red"], ["Фотография паспорта", "red"], ["Банковские данные", "red"], ["Имя вместе с точным адресом", "red"], ["Чужой семейный секрет", "red"],
].map(([text, level], id) => ({ id, text, level }));

const AI_CLEAN_REQUESTS = [
  { parts: [["Меня зовут Алексей Петров. ", true], ["Я живу на улице Лесной, 15. ", true], ["Помоги написать рассказ о космосе.", false]] },
  { parts: [["Мой телефон +7 000 123-45-67. ", true], ["Придумай название команды.", false]] },
  { parts: [["Я учусь в школе №77, 5Б класс. ", true], ["Объясни задачу про дроби.", false]] },
  { parts: [["Мой пароль Robot!2026. ", true], ["Расскажи, как придумывают надёжные учебные парольные фразы.", false]] },
  { parts: [["Друг написал мне: «Я боюсь идти домой». ", true], ["Как поддержать человека добрыми словами?", false]] },
  { parts: [["Прикрепляю фотографию документа и сообщаю, что семья уехала до воскресенья. ", true], ["Составь список дел на выходные.", false]] },
];

const ARCHIVE_FILES = [
  ["Семейные фотографии", "backup", "📷"], ["Школьный проект", "backup", "📚"], ["Рисунок", "backup", "🎨"],
  ["Сохранение игры", "adult", "🎮"], ["Временный файл", "again", "🧹"], ["Повторно скачиваемая музыка", "again", "🎵"],
  ["Важный документ", "adult", "📄"], ["Установочный файл программы", "again", "💿"], ["Учебное расписание", "backup", "📅"],
].map(([label, group, icon], id) => ({ id, label, group, icon }));

const BACKUP_TARGETS = [
  ["external", "Внешний носитель взрослого", true], ["cloud", "Семейное облако", true], ["folder", "Вторая папка на том же устройстве", false],
  ["unknown", "Найденная неизвестная флешка", false], ["chat", "Сообщение себе в открытом чате", false],
];

const DIGITAL_SCENARIOS = [
  { title: "Фото друга без разрешения", icon: "🧑‍🤝‍🧑", answer: "spread", path: "Друг увидел → переслал → появился скриншот" },
  { title: "Добрый комментарий", icon: "💚", answer: "positive", path: "Одноклассник увидел → получил поддержку" },
  { title: "Домашний адрес", icon: "🏠", answer: "spread", path: "Публикацию увидели → копия попала незнакомцу" },
  { title: "Результат школьного проекта", icon: "🏆", answer: "limited", path: "Учитель разрешил → увидел только класс" },
  { title: "Обидная шутка", icon: "😞", answer: "spread", path: "Сообщение переслали → вред усилился" },
  { title: "Неотправленный черновик", icon: "📝", answer: "draft", path: "Черновик не отправлен → никто не увидел" },
];

const TRACE_ORDER = ["Неотправленный черновик", "Устный разговор", "Личное сообщение", "Комментарий", "Публичная публикация", "Пересланная фотография", "Скриншот"];

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("ru-RU");
}

function cleanName(value) {
  return value.replace(/<[^>]*>/g, "").replace(/[<>"'`={}\\/;]/g, "").replace(/\s+/g, " ").trimStart().slice(0, 20);
}

function validName(value) {
  const cleaned = value.trim();
  return (
    cleaned.length >= 2 &&
    cleaned.length <= 20 &&
    /^[A-Za-zА-Яа-яЁё\u0531-\u0587]+(?:[ -][A-Za-zА-Яа-яЁё\u0531-\u0587]+)*$/u.test(cleaned)
  );
}

function newProfile(name, settings) {
  return {
    version: 3,
    name: name.trim().replace(/\s+/g, " "),
    currentMission: 1,
    completed: [],
    available: [1],
    flags: {},
    attempts: {},
    hints: {},
    sound: settings.sound,
    reduceMotion: settings.reduceMotion,
    updatedAt: new Date().toISOString(),
  };
}

function migrateProfile(saved, fallbackName, settings) {
  if (!saved || typeof saved !== "object") return newProfile(fallbackName, settings);
  const completed = Array.from(new Set((Array.isArray(saved.completed) ? saved.completed : [])
    .map(Number).filter((id) => id >= 1 && id <= 12))).sort((a, b) => a - b);
  const contiguous = completed.reduce((last, id) => id === last + 1 ? id : last, 0);
  const nextMission = Math.min(contiguous + 1, 12);
  const available = Array.from(new Set([
    1,
    ...(Array.isArray(saved.available) ? saved.available : []).map(Number).filter((id) => id >= 1 && id <= 12),
    ...completed,
    ...(contiguous < 12 ? [nextMission] : []),
  ])).sort((a, b) => a - b);
  const flags = { ...(saved.flags && typeof saved.flags === "object" ? saved.flags : {}) };
  completed.forEach((id) => { if (!flags[id] && MISSIONS[id - 1]) flags[id] = MISSIONS[id - 1].flag; });
  return {
    ...newProfile(saved.name || fallbackName, settings),
    ...saved,
    version: 3,
    name: String(saved.name || fallbackName).trim().replace(/\s+/g, " "),
    currentMission: Math.min(Math.max(Number(saved.currentMission) || 1, 1), 12),
    completed,
    available,
    flags,
    attempts: saved.attempts && typeof saved.attempts === "object" ? saved.attempts : {},
    hints: saved.hints && typeof saved.hints === "object" ? saved.hints : {},
    sound: typeof saved.sound === "boolean" ? saved.sound : settings.sound,
    reduceMotion: typeof saved.reduceMotion === "boolean" ? saved.reduceMotion : settings.reduceMotion,
  };
}

function loadSettings() {
  if (typeof window === "undefined") return { sound: true, reduceMotion: false };
  try {
    return {
      sound: true,
      reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ...JSON.parse(localStorage.getItem(GENERAL_SETTINGS) || "{}"),
    };
  } catch {
    return { sound: true, reduceMotion: false };
  }
}

function storageKey(name) {
  return `${SAVE_PREFIX}${normalizeName(name)}`;
}

function loadProfile(name) {
  try {
    const raw = localStorage.getItem(storageKey(name));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const migrated = migrateProfile(parsed, name, loadSettings());
    saveProfile(migrated);
    return migrated;
  } catch {
    return null;
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(
      storageKey(profile.name),
      JSON.stringify({ ...profile, updatedAt: new Date().toISOString() })
    );
  } catch {
    // The game remains playable if browser storage is unavailable.
  }
}

export default function Home() {
  const [screen, setScreen] = useState("landing");
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [profile, setProfile] = useState(null);
  const [hasSave, setHasSave] = useState(false);
  const [missionId, setMissionId] = useState(null);
  const [missionStage, setMissionStage] = useState(0);
  const [settings, setSettings] = useState({ sound: true, reduceMotion: false });
  const [toast, setToast] = useState("");

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = settings.reduceMotion ? "true" : "false";
    try {
      localStorage.setItem(GENERAL_SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  function updateProfile(update) {
    setProfile((current) => {
      const next = typeof update === "function" ? update(current) : { ...current, ...update };
      if (next) saveProfile(next);
      return next;
    });
  }

  function submitName(event) {
    event.preventDefault();
    const value = cleanName(nameInput);
    setNameInput(value);
    if (!validName(value)) {
      setNameError("Введи от 2 до 20 букв. Можно использовать пробел или дефис.");
      return;
    }
    setNameError("");
    const saved = loadProfile(value);
    setHasSave(Boolean(saved));
    setProfile(saved || newProfile(value, settings));
    setScreen("choice");
  }

  function confirmNewGame() {
    const fresh = newProfile(profile.name, settings);
    saveProfile(fresh);
    setProfile(fresh);
    setHasSave(true);
    setScreen("welcome");
  }

  function openMission(id) {
    if (id > 12 || !profile.available.includes(id)) return;
    updateProfile((p) => ({ ...p, currentMission: id }));
    setMissionId(id);
    setMissionStage(0);
    setScreen("mission");
  }

  function toggleSetting(key) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
    if (profile) updateProfile((p) => ({ ...p, [key]: !settings[key] }));
  }

  return (
    <main className="app-shell">
      <CyberSky />
      <header className="topbar">
        <button className="brand" onClick={() => profile && setScreen("map")} aria-label="Открыть карту Кибергорода">
          <span className="brand-shield">C</span>
          <span><b>Защитники</b><small>Кибергорода</small></span>
        </button>
        <div className="top-actions">
          {profile && <span className="player-chip">🛡️ {profile.name}</span>}
          <button className="icon-button" aria-pressed={!settings.sound} onClick={() => toggleSetting("sound")}>
            <span aria-hidden="true">{settings.sound ? "🔊" : "🔇"}</span><span className="icon-label">Звук</span>
          </button>
          <button className="icon-button" aria-pressed={settings.reduceMotion} onClick={() => toggleSetting("reduceMotion")}>
            <span aria-hidden="true">✨</span><span className="icon-label">Анимация</span>
          </button>
        </div>
      </header>

      <div className="content-wrap">
        {screen === "landing" && (
          <Landing
            name={nameInput}
            setName={(v) => { setNameInput(cleanName(v)); setNameError(""); }}
            error={nameError}
            onSubmit={submitName}
          />
        )}
        {screen === "choice" && (
          <Choice
            name={profile.name}
            hasSave={hasSave}
            onNew={() => setScreen("confirm")}
            onRecover={() => setScreen("recover")}
            onSaved={() => { setSettings({ sound: profile.sound, reduceMotion: profile.reduceMotion }); setScreen("map"); }}
            onBack={() => setScreen("landing")}
          />
        )}
        {screen === "confirm" && (
          <Panel icon="↻" eyebrow="Новое приключение" title="Начать с первой миссии?">
            <p>Сохранённый прогресс с именем <b>{profile.name}</b> на этом устройстве будет удалён.</p>
            <div className="button-row">
              <button className="button primary" onClick={confirmNewGame}>Да, начать заново</button>
              <button className="button secondary" onClick={() => setScreen("choice")}>Вернуться</button>
            </div>
          </Panel>
        )}
        {screen === "welcome" && (
          <Panel icon="🛡️" eyebrow="Команда собрана" title={`${profile.name}, добро пожаловать в команду защитников!`}>
            <p>Тебя ждут <b>24 миссии</b>. За каждую выполненную миссию ты получишь специальный флаг. Флаг откроет следующую часть Кибергорода.</p>
            <p className="kind-note">Ошибаться не страшно. Ты всегда сможешь прочитать подсказку и попробовать снова.</p>
            <button className="button primary" onClick={() => setScreen("map")}>Открыть карту <span aria-hidden="true">→</span></button>
          </Panel>
        )}
        {screen === "recover" && (
          <Recovery
            name={profile.name}
            settings={settings}
            onRecovered={(restored, id) => {
              saveProfile(restored);
              setProfile(restored);
              setHasSave(true);
              setMissionId(id);
              setMissionStage(0);
              setScreen("mission");
            }}
            onNew={() => setScreen("confirm")}
            onBack={() => setScreen("choice")}
          />
        )}
        {screen === "map" && profile && (
          <CityMap profile={profile} onOpen={openMission} onHome={() => setScreen("choice")} />
        )}
        {screen === "mission" && profile && (
          <Mission
            mission={MISSIONS[missionId - 1]}
            stage={missionStage}
            setStage={setMissionStage}
            profile={profile}
            updateProfile={updateProfile}
            onMap={() => setScreen("map")}
            onNext={() => {
              if (missionId === 8) setScreen("district2");
              else if (missionId === 12) setScreen("district3");
              else openMission(missionId + 1);
            }}
            notify={setToast}
          />
        )}
        {screen === "district2" && profile && (
          <DistrictTwoComplete profile={profile} onMap={() => setScreen("map")} onRepeat={openMission} />
        )}
        {screen === "district3" && profile && (
          <DistrictThreeComplete profile={profile} onMap={() => setScreen("map")} onRepeat={openMission} />
        )}
      </div>
      <footer><span>🛡️ Данные остаются на этом устройстве</span><span>Расширенный прототип · 12 из 24 миссий</span></footer>
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

function CyberSky() {
  return (
    <div className="cyber-sky" aria-hidden="true">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="city city-back">▥ ▤ ▥ ▦ ▤ ▥ ▦ ▤</div>
      <div className="grid-floor" />
    </div>
  );
}

function Landing({ name, setName, error, onSubmit }) {
  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <div className="eyebrow-pill"><span /> СРОЧНАЯ МИССИЯ</div>
        <h1>Кибергород<br /><em>просит о помощи!</em></h1>
        <p>Цифровой щит города повреждён. Опасные сообщения, вирусы и хитрые ИИ-ловушки пытаются проникнуть внутрь.</p>
        <p className="hero-callout">Но у города появился новый защитник. <b>Это ты!</b></p>
        <form className="name-card" onSubmit={onSubmit} noValidate>
          <label htmlFor="hero-name">Как тебя зовут?</label>
          <div className={`input-wrap ${error ? "has-error" : ""}`}>
            <span aria-hidden="true">👤</span>
            <input
              id="hero-name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введи своё имя"
              aria-describedby="name-help name-error"
              aria-invalid={Boolean(error)}
            />
          </div>
          <small id="name-help">Только имя · от 2 до 20 букв</small>
          {error && <p className="field-error" id="name-error" role="alert">{error}</p>}
          <button className="button primary wide" type="submit">Начать приключение <span aria-hidden="true">→</span></button>
          <p className="privacy-note">🔒 Имя и прогресс сохраняются только в твоём браузере</p>
        </form>
      </div>
      <div className="hero-art" aria-label="Футуристический Кибергород под цифровым щитом">
        <div className="shield-ring ring-a" />
        <div className="shield-ring ring-b" />
        <div className="city-core">
          <div className="tower tall"><i /><i /><i /></div>
          <div className="tower"><i /><i /></div>
          <div className="tower mid"><i /><i /><i /></div>
          <div className="tower short"><i /></div>
        </div>
        <div className="mascot-card"><span>🦝</span><b>Енот-Хитрец</b><small>уже рядом…</small></div>
        <div className="mission-bubble">24<br /><small>миссии</small></div>
      </div>
    </section>
  );
}

function Choice({ name, hasSave, onNew, onRecover, onSaved, onBack }) {
  return (
    <Panel icon="👋" eyebrow="Рад знакомству" title={`Привет, ${name}!`}>
      <p>Ты начинаешь новое приключение или уже выполнял миссии Кибергорода?</p>
      <div className="choice-grid">
        <button className="choice-card" onClick={onNew}><span>🚀</span><b>Начать заново</b><small>Отправиться к первой миссии</small></button>
        <button className="choice-card" onClick={onRecover}><span>🏁</span><b>Продолжить приключение</b><small>Выбрать миссию и ввести флаг</small></button>
        {hasSave && <button className="choice-card saved" onClick={onSaved}><span>💾</span><b>Продолжить сохранённую игру</b><small>Открыть прогресс на этом устройстве</small></button>}
      </div>
      <button className="text-button" onClick={onBack}>← Изменить имя</button>
    </Panel>
  );
}

function Panel({ icon, eyebrow, title, children }) {
  return (
    <section className="panel centered-panel">
      <div className="panel-icon" aria-hidden="true">{icon}</div>
      <span className="panel-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <div className="panel-body">{children}</div>
    </section>
  );
}

function Recovery({ name, settings, onRecovered, onNew, onBack }) {
  const [selected, setSelected] = useState(1);
  const [flag, setFlag] = useState("");
  const [error, setError] = useState(false);

  function recover(event) {
    event.preventDefault();
    const needed = selected === 1 ? "" : MISSIONS[selected - 2].flag;
    if (selected > 1 && flag.trim().toLocaleUpperCase("ru-RU") !== needed) {
      setError(true);
      return;
    }
    const restored = newProfile(name, settings);
    restored.completed = Array.from({ length: selected - 1 }, (_, i) => i + 1);
    restored.available = Array.from({ length: selected }, (_, i) => i + 1);
    restored.flags = Object.fromEntries(MISSIONS.slice(0, selected - 1).map((m) => [m.id, m.flag]));
    restored.currentMission = selected;
    onRecovered(restored, selected);
  }

  return (
    <section className="panel recovery-panel">
      <div className="section-heading">
        <span className="panel-eyebrow">Восстановление</span>
        <h1>Где ты остановился?</h1>
        <p>Выбери миссию и введи флаг предыдущей миссии.</p>
      </div>
      <form onSubmit={recover}>
        <div className="recovery-missions" role="radiogroup" aria-label="Выбор миссии">
          {MISSIONS.map((m) => (
            <label key={m.id} className={selected === m.id ? "selected" : ""}>
              <input type="radio" name="mission" value={m.id} checked={selected === m.id} onChange={() => { setSelected(m.id); setError(false); setFlag(""); }} />
              <span>{m.icon}</span><b>Миссия {m.id}</b><small>{m.title}</small>
            </label>
          ))}
        </div>
        {selected === 1 ? (
          <div className="info-banner">✨ Первая миссия открывается без флага.</div>
        ) : (
          <label className="flag-field">Введи предыдущий флаг
            <input value={flag} onChange={(e) => { setFlag(e.target.value); setError(false); }} placeholder="FLAG-••••••-00" autoComplete="off" />
          </label>
        )}
        {error && (
          <div className="error-box" role="alert">
            <b>Этот флаг не подходит к выбранной миссии.</b>
            <span>Проверь номер миссии и попробуй ещё раз.</span>
            <div className="mini-actions">
              <button type="button" className="text-button" onClick={() => { setFlag(""); setError(false); }}>Попробовать снова</button>
              <button type="button" className="text-button" onClick={() => { setSelected(1); setFlag(""); setError(false); }}>Выбрать другую миссию</button>
              <button type="button" className="text-button" onClick={onNew}>Начать заново</button>
            </div>
          </div>
        )}
        <div className="button-row">
          <button className="button primary" type="submit">Проверить и продолжить</button>
          <button className="button secondary" type="button" onClick={onBack}>Вернуться</button>
        </div>
      </form>
    </section>
  );
}

function CityMap({ profile, onOpen, onHome }) {
  const completed = profile.completed.length;
  const firstProtected = [1, 2, 3, 4].every((id) => profile.completed.includes(id));
  const secondProtected = [5, 6, 7, 8].every((id) => profile.completed.includes(id));
  const thirdProtected = [9, 10, 11, 12].every((id) => profile.completed.includes(id));
  return (
    <section className="map-screen">
      <div className="map-heading">
        <div>
          <span className="panel-eyebrow">Карта приключения</span>
          <h1>Кибергород ждёт защитника</h1>
          <p>Проходи районы по порядку. Каждый флаг зажигает новую цифровую дорогу.</p>
        </div>
        <div className="progress-card">
          <div className="progress-number"><b>{completed}</b><span>из 24</span></div>
          <div><b>Выполнено: {completed} из 24 миссий</b><div className="progress-track"><i style={{ width: `${(completed / 24) * 100}%` }} /></div></div>
        </div>
      </div>
      <div className={`district-label ${firstProtected ? "protected" : ""}`}><span>Район 01</span><b>Цифровая набережная</b><small>{firstProtected ? "✓ Защищён" : "4 игровые миссии"}</small></div>
      <MissionDistrict missions={MISSIONS.slice(0, 4)} profile={profile} onOpen={onOpen} restored={firstProtected} />
      <div className={`district-label district-two-label ${secondProtected ? "protected" : ""}`}><span>Район 02</span><b>Квартал цифровой устойчивости</b><small>{secondProtected ? "✓ Защищён и восстановлен" : "4 игровые миссии"}</small></div>
      <MissionDistrict missions={MISSIONS.slice(4, 8)} profile={profile} onOpen={onOpen} restored={secondProtected} />
      <div className={`district-label district-two-label ${thirdProtected ? "protected" : ""}`}><span>Район 03</span><b>Квартал разумной защиты</b><small>{thirdProtected ? "✓ Защищён и восстановлен" : "4 игровые миссии"}</small></div>
      <MissionDistrict missions={MISSIONS.slice(8, 12)} profile={profile} onOpen={onOpen} restored={thirdProtected} />
      <div className="future-districts">
        {[4, 5, 6].map((district) => (
          <div className="future-district" key={district}>
            <div className="future-title"><span>🔒</span><b>Район {String(district).padStart(2, "0")}</b><small>Скоро откроется</small></div>
            <div className="future-nodes">
              {Array.from({ length: 4 }, (_, i) => (district - 1) * 4 + i + 1).map((id) => <span key={id}>{id}</span>)}
            </div>
          </div>
        ))}
      </div>
      <button className="text-button" onClick={onHome}>← К выбору игры</button>
    </section>
  );
}

function MissionDistrict({ missions, profile, onOpen, restored }) {
  return (
    <div className={`mission-path ${restored ? "district-restored" : ""}`}>
      {missions.map((mission, index) => {
          const done = profile.completed.includes(mission.id);
          const available = profile.available.includes(mission.id);
          const started = !done && available && profile.currentMission === mission.id && mission.id !== 1;
          return (
            <div className="path-segment" key={mission.id}>
              <button
                className={`mission-node ${mission.color} ${done ? "done" : ""} ${available ? "available" : "locked"}`}
                onClick={() => onOpen(mission.id)}
                disabled={!available}
              >
                <span className="node-number">{done ? "✓" : mission.id}</span>
                <span className="node-icon">{available ? mission.icon : "🔒"}</span>
                <span className="node-copy"><small>МИССИЯ {mission.id}</small><b>{mission.title}</b><em>{done ? "Выполнена" : started ? "Начата" : available ? "Доступна" : "Заблокирована"}</em></span>
              </button>
              {index < missions.length - 1 && <div className={`path-line ${done ? "lit" : ""}`}><i /><i /><i /></div>}
            </div>
          );
      })}
    </div>
  );
}

const STAGES = ["История", "Учимся", "Проверяем", "Играем", "Награда"];

function Mission({ mission, stage, setStage, profile, updateProfile, onMap, onNext, notify }) {
  const completed = profile.completed.includes(mission.id);
  const [checkChoice, setCheckChoice] = useState(null);
  const [checkError, setCheckError] = useState(false);

  useEffect(() => { setCheckChoice(null); setCheckError(false); }, [mission.id, stage]);

  function passCheck() {
    if (checkChoice === mission.check.correct) {
      setCheckError(false);
      setStage(3);
    } else {
      setCheckError(true);
    }
  }

  function completeMission() {
    updateProfile((p) => {
      const completedIds = Array.from(new Set([...p.completed, mission.id])).sort((a, b) => a - b);
      const nextAvailable = mission.id < 12 ? [...p.available, mission.id + 1] : p.available;
      return {
        ...p,
        completed: completedIds,
        available: Array.from(new Set(nextAvailable)).sort((a, b) => a - b),
        flags: { ...p.flags, [mission.id]: mission.flag },
        currentMission: Math.min(mission.id + 1, 12),
      };
    });
    setStage(4);
  }

  return (
    <section className={`mission-screen theme-${mission.color}`}>
      <div className="mission-topline">
        <button className="text-button" onClick={onMap}>← Карта города</button>
        <div className="mission-tag">{mission.icon} Миссия {mission.id} · {mission.district}</div>
      </div>
      <ol className="stage-indicator" aria-label="Этапы миссии">
        {STAGES.map((label, index) => (
          <li key={label} className={index === stage ? "current" : index < stage ? "complete" : ""}>
            <span>{index < stage ? "✓" : index + 1}</span><b>{label}</b>
          </li>
        ))}
      </ol>

      {stage === 0 && (
        <div className="mission-card story-card">
          <div className="story-art"><span>{mission.icon}</span><div className="villain"><i>!</i><b>{mission.villain}</b></div></div>
          <div><span className="panel-eyebrow">Сигнал тревоги</span><h1>{mission.title}</h1><p>{mission.story}</p><button className="button primary" onClick={() => setStage(1)}>Принять миссию →</button></div>
        </div>
      )}
      {stage === 1 && (
        <div className="mission-card lesson-card">
          <div className="lesson-icon">💡</div>
          <span className="panel-eyebrow">Разберём правило</span>
          <h1>{mission.title}</h1>
          {mission.id === 3 && <div className="warning-banner">⚠️ Не вводи здесь настоящий пароль от своего аккаунта. Это только учебная игра.</div>}
          <p>{mission.lesson}</p>
          <blockquote><span>Главное правило</span>{mission.rule}</blockquote>
          <button className="button primary" onClick={() => setStage(2)}>Проверить себя →</button>
        </div>
      )}
      {stage === 2 && (
        <div className="mission-card check-card">
          <span className="panel-eyebrow">Один короткий вопрос</span>
          <h1>{mission.check.question}</h1>
          <div className="answer-stack" role="radiogroup">
            {mission.check.options.map((option, index) => (
              <label key={option} className={checkChoice === index ? "selected" : ""}>
                <input type="radio" name="check" checked={checkChoice === index} onChange={() => { setCheckChoice(index); setCheckError(false); }} />
                <span>{String.fromCharCode(65 + index)}</span>{option}
              </label>
            ))}
          </div>
          {checkError && <div className="error-inline" role="alert">Почти получилось. Вспомни главное правило и попробуй ещё раз.</div>}
          <div className="button-row"><button className="button primary" onClick={passCheck} disabled={checkChoice === null}>Проверить ответ</button><button className="button secondary" onClick={() => setStage(1)}>Вернуться к объяснению</button></div>
        </div>
      )}
      {stage === 3 && mission.id === 1 && <ProfileGame profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 2 && <FactGame profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 3 && <PasswordGame name={profile.name} profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 4 && <ChatGame profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 5 && <WifiMazeGame profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 6 && <ImageDetectiveGame profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 7 && <ShieldRepairGame profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 8 && <KindReplyGame profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 9 && <TwoKeyWorkshop profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 10 && <AiPrivacyEditor profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 11 && <ArchiveRescueGame profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 3 && mission.id === 12 && <DigitalTraceGame profile={profile} updateProfile={updateProfile} onSuccess={completeMission} onLesson={() => setStage(1)} />}
      {stage === 4 && (
        <Reward mission={mission} name={profile.name} completed={completed} onMap={onMap} onNext={onNext} notify={notify} />
      )}
    </section>
  );
}

function recordMistake(profile, updateProfile, missionId) {
  const count = (profile.attempts[missionId] || 0) + 1;
  updateProfile((p) => ({
    ...p,
    attempts: { ...p.attempts, [missionId]: count },
    hints: count >= 2 ? { ...p.hints, [missionId]: true } : p.hints,
  }));
  return count;
}

function GameError({ showHint, hint, onRetry, onLesson }) {
  return (
    <div className="game-error" role="alert">
      <span className="error-character">🛰️</span>
      <div><b>Почти получилось.</b><p>Здесь спряталась цифровая ловушка. Давай ещё раз посмотрим правило.</p>{showHint && <div className="extra-hint">💡 Подсказка: {hint}</div>}
        <div className="button-row"><button className="button primary" onClick={onRetry}>Попробовать снова</button><button className="button secondary" onClick={onLesson}>Вернуться к объяснению</button></div>
      </div>
    </div>
  );
}

function ProfileGame({ profile, updateProfile, onSuccess, onLesson }) {
  const [placed, setPlaced] = useState({});
  const [selected, setSelected] = useState(null);
  const [showError, setShowError] = useState(false);
  const [dragging, setDragging] = useState(null);

  function place(bucket, cardId) {
    const id = cardId ?? selected;
    if (id === null || id === undefined) return;
    setPlaced((p) => ({ ...p, [id]: bucket }));
    setSelected(null);
    setDragging(null);
  }
  function check() {
    const allPlaced = PROFILE_CARDS.every((c) => placed[c.id]);
    const correct = allPlaced && PROFILE_CARDS.every((c) => placed[c.id] === c.answer);
    if (correct) onSuccess();
    else { recordMistake(profile, updateProfile, 1); setShowError(true); }
  }
  function retry() { setPlaced({}); setSelected(null); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[1] || 0) >= 2} hint="Адрес, телефон, документы, пароли, QR-коды и планы семьи оставляй личными." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;
  const unplaced = PROFILE_CARDS.filter((c) => !placed[c.id]);
  return (
    <div className="mission-card game-card">
      <span className="panel-eyebrow">Интерактивная игра</span><h1>Очисти опасный профиль</h1>
      <p>Перетащи карточки или нажми на карточку, а затем на нужную область.</p>
      <div className="profile-cards" aria-label="Карточки профиля">
        {unplaced.map((card) => <button key={card.id} draggable onDragStart={() => setDragging(card.id)} onClick={() => setSelected(card.id)} className={selected === card.id ? "selected" : ""}><span>{card.icon}</span>{card.label}</button>)}
        {!unplaced.length && <span className="empty-note">Все карточки распределены</span>}
      </div>
      <div className="drop-zones">
        {["public", "private"].map((bucket) => (
          <button key={bucket} className={`drop-zone ${bucket}`} onDragOver={(e) => e.preventDefault()} onDrop={() => place(bucket, dragging)} onClick={() => place(bucket)}>
            <span>{bucket === "public" ? "🌈" : "🔒"}</span><b>{bucket === "public" ? "Можно показать" : "Нужно оставить личным"}</b>
            <div>{PROFILE_CARDS.filter((c) => placed[c.id] === bucket).map((c) => <i key={c.id}>{c.icon} {c.label}</i>)}</div>
          </button>
        ))}
      </div>
      <button className="button primary" onClick={check}>Проверить профиль</button>
    </div>
  );
}

function FactGame({ profile, updateProfile, onSuccess, onLesson }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showError, setShowError] = useState(false);
  const card = FACT_CARDS[index];
  function choose(answer) {
    const next = [...answers, answer];
    if (index < FACT_CARDS.length - 1) { setAnswers(next); setIndex(index + 1); }
    else if (FACT_CARDS.every((c, i) => c.answer === next[i])) onSuccess();
    else { recordMistake(profile, updateProfile, 2); setShowError(true); }
  }
  function retry() { setIndex(0); setAnswers([]); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[2] || 0) >= 2} hint="Если источник отсутствует или по нему нельзя сделать точный вывод, выбирай «Нужно проверить»." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;
  return (
    <div className="mission-card game-card fact-game">
      <div className="game-counter"><span>Карточка {index + 1} из {FACT_CARDS.length}</span><div>{FACT_CARDS.map((_, i) => <i key={i} className={i <= index ? "active" : ""} />)}</div></div>
      <div className="ai-avatar">🤖<span>?</span></div>
      <h1>«{card.text}»</h1>
      <div className="source-card"><small>ВСТРОЕННЫЙ ИСТОЧНИК</small><p>{card.source}</p></div>
      <div className="three-actions"><button onClick={() => choose("confirmed")}>✅<b>Подтверждено</b></button><button onClick={() => choose("check")}>🔎<b>Нужно проверить</b></button><button onClick={() => choose("false")}>❌<b>Неправда</b></button></div>
    </div>
  );
}

function PasswordGame({ name, profile, updateProfile, onSuccess, onLesson }) {
  const words = ["Комета", "Лимон", "Робот", "Океан", "Кактус", "Ракета"];
  const digits = ["3", "7", "9"];
  const symbols = ["!", "#", "?"];
  const [chosenWords, setChosenWords] = useState([]);
  const [digit, setDigit] = useState("");
  const [symbol, setSymbol] = useState("");
  const [showError, setShowError] = useState(false);
  const phrase = `${chosenWords.join("")}${digit}${symbol}`;
  const safe = phrase.length >= 12 && chosenWords.length >= 2 && digit && symbol && !phrase.toLocaleLowerCase("ru-RU").includes(normalizeName(name));
  function toggleWord(word) { setChosenWords((current) => current.includes(word) ? current.filter((w) => w !== word) : current.length < 3 ? [...current, word] : current); }
  function check() { if (safe) onSuccess(); else { recordMistake(profile, updateProfile, 3); setShowError(true); } }
  function retry() { setChosenWords([]); setDigit(""); setSymbol(""); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[3] || 0) >= 2} hint="Выбери 2–3 слова, одну цифру и один символ. Следи, чтобы получилось не меньше 12 знаков." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;
  return (
    <div className="mission-card game-card password-game">
      <div className="warning-banner">⚠️ Не вводи настоящий пароль. Собери учебную фразу только из кнопок ниже.</div>
      <h1>Собери цифровой ключ</h1>
      <div className="phrase-display"><span>{phrase || "Твоя учебная фраза появится здесь"}</span><small>{phrase.length} / 12+ символов</small></div>
      <BuilderRow title="1. Выбери два или три слова">{words.map((word) => <button key={word} className={chosenWords.includes(word) ? "active" : ""} onClick={() => toggleWord(word)}>{word}</button>)}</BuilderRow>
      <BuilderRow title="2. Добавь цифру">{digits.map((n) => <button key={n} className={digit === n ? "active" : ""} onClick={() => setDigit(n)}>{n}</button>)}</BuilderRow>
      <BuilderRow title="3. Добавь специальный символ">{symbols.map((s) => <button key={s} className={symbol === s ? "active" : ""} onClick={() => setSymbol(s)}>{s}</button>)}</BuilderRow>
      <div className="strength-list"><span className={phrase.length >= 12 ? "ok" : ""}>✓ Не менее 12 знаков</span><span className={chosenWords.length >= 2 ? "ok" : ""}>✓ Несколько разных частей</span><span className={digit && symbol ? "ok" : ""}>✓ Цифра и символ</span></div>
      <button className="button primary" onClick={check}>Испытать замок</button>
    </div>
  );
}

function BuilderRow({ title, children }) { return <div className="builder-row"><b>{title}</b><div>{children}</div></div>; }

function ChatGame({ profile, updateProfile, onSuccess, onLesson }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showError, setShowError] = useState(false);
  const message = CHAT_CARDS[index];
  function choose(action) {
    const next = [...answers, action];
    if (index < CHAT_CARDS.length - 1) { setAnswers(next); setIndex(index + 1); }
    else if (CHAT_CARDS.every((m, i) => m.safe.includes(next[i]))) onSuccess();
    else { recordMistake(profile, updateProfile, 4); setShowError(true); }
  }
  function retry() { setIndex(0); setAnswers([]); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[4] || 0) >= 2} hint="Безопасны действия, при которых ты не открываешь ссылку и не отдаёшь код: проверка, блокировка или помощь взрослого." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;
  return (
    <div className="mission-card game-card chat-game">
      <div className="chat-window">
        <div className="chat-header"><span>🏙️</span><div><b>Городской чат</b><small>Сообщение {index + 1} из {CHAT_CARDS.length}</small></div><i /></div>
        <div className="chat-body"><div className="sender-avatar">?</div><div className="message"><small>{message.from}</small><p>{message.text}</p><time>сейчас</time></div></div>
      </div>
      <h2>Как поступить безопасно?</h2>
      <div className="chat-actions">{ACTIONS.map(([id, label]) => <button key={id} className={id === "open" || id === "send" ? "danger-choice" : ""} onClick={() => choose(id)}>{label}</button>)}</div>
      <p className="safe-reminder">🛡️ Для некоторых сообщений подходит несколько безопасных действий.</p>
    </div>
  );
}

const MAZE_DIRECTIONS = ["right", "down", "right", "up", "right", "down", "down", "right", "up"];
const DIRECTION_LABELS = { up: "↑", right: "→", down: "↓", left: "←" };

function WifiMazeGame({ profile, updateProfile, onSuccess, onLesson }) {
  const [index, setIndex] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const situation = WIFI_SITUATIONS[index];

  function choose(action) {
    if (situation.safe.includes(action)) {
      setResolved(true);
      setMessage(action === "connect" ? "Сеть подтверждена. Можно продолжать без передачи секретных данных." : "Безопасное решение: сначала проверить сеть или не подключаться.");
    } else {
      recordMistake(profile, updateProfile, 5);
      setShowError(true);
    }
  }

  function move(direction) {
    if (!resolved) { setMessage("Сначала реши, как поступить с точкой Wi-Fi."); return; }
    if (direction !== MAZE_DIRECTIONS[index]) { setMessage("Эта дорожка ведёт в тупик. Попробуй другое направление."); return; }
    if (index === WIFI_SITUATIONS.length - 1) { onSuccess(); return; }
    setIndex((value) => value + 1);
    setResolved(false);
    setMessage("");
  }

  function retry() { setIndex(0); setResolved(false); setMessage(""); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[5] || 0) >= 2} hint="Сравни Airport_Free_WiFi и Airport_Free_WiF1: цифра 1 маскируется под букву i. Замок не подтверждает владельца сети." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;

  return (
    <div className="mission-card game-card wifi-game">
      <div className="game-counter"><span>Точка {index + 1} из {WIFI_SITUATIONS.length}</span><b>Безопасных решений: {index}</b></div>
      <h1>Лабиринт публичного Wi-Fi</h1>
      <div className="wifi-maze" aria-label="Маршрут через точки Wi-Fi">
        <div className="maze-track" />
        {WIFI_SITUATIONS.map((point, pointIndex) => (
          <div key={point.name} className={`maze-point ${pointIndex < index ? "passed" : ""} ${pointIndex === index ? "current" : ""} ${point.tricky && (profile.attempts[5] || 0) >= 2 ? "hinted" : ""}`}>
            <span>{pointIndex === index ? "🧒" : point.icon}</span><small>{point.name}</small>
          </div>
        ))}
      </div>
      <div className="wifi-situation"><span>{situation.icon}</span><div><b>{situation.name}</b><p>{situation.text}</p></div></div>
      <div className="wifi-actions">{WIFI_ACTIONS.map(([id, label]) => <button key={id} disabled={resolved} onClick={() => choose(id)} className={resolved && situation.safe.includes(id) ? "safe-picked" : ""}>{label}</button>)}</div>
      {message && <div className={`route-feedback ${resolved ? "good" : ""}`} role="status">{message}</div>}
      <div className="maze-controls" aria-label="Кнопки направления">
        {Object.entries(DIRECTION_LABELS).map(([direction, label]) => <button key={direction} onClick={() => move(direction)} aria-label={`Двигаться ${direction}`}>{label}</button>)}
      </div>
      <p className="safe-reminder">🔐 Значок замка означает пароль, но не доказывает, кому принадлежит сеть.</p>
    </div>
  );
}

function ImageDetectiveGame({ profile, updateProfile, onSuccess, onLesson }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [found, setFound] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [verification, setVerification] = useState([]);
  const [showError, setShowError] = useState(false);
  const scene = IMAGE_SCENES[sceneIndex];
  const suspicious = scene.details.filter((detail) => detail.correct);
  const allFound = suspicious.every((detail) => found.includes(detail.id));

  function inspect(detail) {
    if (detail.correct) {
      setFound((current) => Array.from(new Set([...current, detail.id])));
      setFeedback(`Замечено: ${detail.label}. Это повод проверить картинку, но ещё не доказательство.`);
    } else {
      const count = recordMistake(profile, updateProfile, 6);
      setFeedback(`${detail.label}. Это обычная художественная деталь, она сама по себе ничего не доказывает.`);
      if (count >= 2) setShowError(true);
    }
  }

  function toggleVerify(action) {
    setVerification((current) => current.includes(action) ? current.filter((id) => id !== action) : [...current, action]);
  }

  function nextScene() {
    if (!["source", "confirm", "adult"].every((id) => verification.includes(id))) {
      setFeedback("Перед выводом нужны источник, подтверждение и помощь взрослого для важной картинки.");
      return;
    }
    if (sceneIndex === IMAGE_SCENES.length - 1) { onSuccess(); return; }
    setSceneIndex((value) => value + 1);
    setFound([]); setFeedback(""); setVerification([]);
  }

  function retry() { setSceneIndex(0); setFound([]); setFeedback(""); setVerification([]); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[6] || 0) >= 2} hint="Ищи нарушения логики: отражение, направление тени, лишнее колесо, странные буквы или точные повторы. Необычный цвет может быть просто стилем." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;

  return (
    <div className="mission-card game-card image-game">
      <div className="game-counter"><span>Сцена {sceneIndex + 1} из {IMAGE_SCENES.length}</span><b>Найдено {found.length} из {suspicious.length}</b></div>
      <h1>{scene.title}</h1>
      <p>Нажимай на конкретные области сцены. Не каждая необычная деталь является ошибкой ИИ.</p>
      <div className={`detective-scene scene-${scene.backdrop}`}>
        <div className="scene-city">▥ ▤ ▦</div>
        {scene.details.map((detail) => (
          <button key={detail.id} style={{ left: `${detail.x}%`, top: `${detail.y}%` }} onClick={() => inspect(detail)} className={`detail-spot ${found.includes(detail.id) ? "found" : ""} ${(profile.attempts[6] || 0) >= 2 && detail.correct ? "soft-hint" : ""}`} aria-label={`Проверить область: ${detail.label}`}>
            <span>{detail.icon}</span>
          </button>
        ))}
      </div>
      {feedback && <div className="route-feedback" role="status">{feedback}</div>}
      {allFound && <div className="verify-source"><h2>Что сделать перед тем, как поверить изображению?</h2><div>{[["source", "Проверить источник"], ["confirm", "Найти подтверждение"], ["adult", "Спросить взрослого"]].map(([id, label]) => <button key={id} className={verification.includes(id) ? "active" : ""} onClick={() => toggleVerify(id)}>✓ {label}</button>)}</div><button className="button primary" onClick={nextScene}>{sceneIndex < IMAGE_SCENES.length - 1 ? "Следующая сцена →" : "Завершить расследование"}</button></div>}
    </div>
  );
}

function ShieldRepairGame({ profile, updateProfile, onSuccess, onLesson }) {
  const [repaired, setRepaired] = useState({});
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [showError, setShowError] = useState(false);
  const repairedCount = Object.keys(repaired).length;

  function repair(damageId, cardId) {
    const chosen = cardId ?? selected;
    if (!chosen || repaired[damageId]) return;
    const damage = SHIELD_DAMAGE.find((item) => item.id === damageId);
    if (damage.correct === chosen) {
      const next = { ...repaired, [damageId]: chosen };
      setRepaired(next); setSelected(null); setDragging(null);
      if (Object.keys(next).length === SHIELD_DAMAGE.length) onSuccess();
    } else {
      recordMistake(profile, updateProfile, 7);
      setShowError(true);
    }
  }

  function retry() { setRepaired({}); setSelected(null); setDragging(null); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[7] || 0) >= 2} hint="Безопасные источники — официальные настройки и магазин приложений. Файл из чата не является надёжным обновлением." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;

  return (
    <div className="mission-card game-card shield-game">
      <div className="repair-progress"><b>Щит восстановлен на {repairedCount} из 6 частей</b><div><i style={{ width: `${(repairedCount / 6) * 100}%` }} /></div></div>
      <h1>Почини цифровой щит</h1>
      <p>Перетащи карточку к трещине или выбери карточку, а затем нажми на нужную часть щита.</p>
      <div className="update-cards">{UPDATE_CARDS.map(([id, label, safe]) => <button key={id} draggable onDragStart={() => setDragging(id)} onClick={() => setSelected(id)} className={`${selected === id ? "selected" : ""} ${(profile.attempts[7] || 0) >= 2 && safe ? "safe-source" : ""}`}>{safe ? "🔧" : "⚠️"} {label}</button>)}</div>
      <div className="digital-shield">
        {SHIELD_DAMAGE.map((damage) => <button key={damage.id} disabled={Boolean(repaired[damage.id])} onDragOver={(event) => event.preventDefault()} onDrop={() => repair(damage.id, dragging)} onClick={() => repair(damage.id)} className={repaired[damage.id] ? "repaired" : "cracked"}><span>{repaired[damage.id] ? "✓" : damage.icon}</span><b>{damage.title}</b><small>{repaired[damage.id] ? "Восстановлено" : "Нужна заплатка"}</small></button>)}
      </div>
    </div>
  );
}

function KindReplyGame({ profile, updateProfile, onSuccess, onLesson }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showError, setShowError] = useState(false);
  const scene = BULLY_SCENES[index];

  function toggle(action) {
    setSelected((current) => current.includes(action) ? current.filter((id) => id !== action) : [...current, action]);
  }

  function check() {
    const correct = selected.length === scene.safe.length && scene.safe.every((action) => selected.includes(action));
    if (!correct) { recordMistake(profile, updateProfile, 8); setShowError(true); return; }
    if (index === BULLY_SCENES.length - 1) { onSuccess(); return; }
    setIndex((value) => value + 1); setSelected([]);
  }

  function retry() { setIndex(0); setSelected([]); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[8] || 0) >= 2} hint="Ищи действия, которые останавливают распространение, сохраняют доказательства и привлекают помощь взрослого. При спокойном несогласии можно уточнить смысл." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;

  return (
    <div className="mission-card game-card kindness-game">
      <div className="game-counter"><span>Ситуация {index + 1} из {BULLY_SCENES.length}</span><b>{scene.type}</b></div>
      <div className="school-chat"><div className="chat-header"><span>🏫</span><div><b>Чат класса</b><small>Учимся различать конфликт, шутку и травлю</small></div><i /></div><div className="chat-body"><div className="sender-avatar">{scene.from[0]}</div><div className="message"><small>{scene.from}</small><p>{scene.text}</p><time>сейчас</time></div></div></div>
      <h2>Выбери одно или несколько безопасных действий</h2>
      <div className="multi-actions">{BULLY_ACTIONS.map(([id, label]) => <button key={id} aria-pressed={selected.includes(id)} onClick={() => toggle(id)} className={selected.includes(id) ? "selected" : ""}>{selected.includes(id) ? "✓ " : ""}{label}</button>)}</div>
      <button className="button primary" disabled={!selected.length} onClick={check}>Проверить действия</button>
      <p className="safe-reminder">Если есть прямая угроза причинить вред, нужно сразу показать её взрослому.</p>
    </div>
  );
}

function TwoKeyWorkshop({ profile, updateProfile, onSuccess, onLesson }) {
  const [phase, setPhase] = useState("sort");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [protectedCount, setProtectedCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const card = MFA_CARDS[index];

  function fail() { recordMistake(profile, updateProfile, 9); setShowError(true); }
  function classify(group) {
    if (group !== card.group) { fail(); return; }
    if (index === MFA_CARDS.length - 1) { setPhase("accounts"); setIndex(0); }
    else setIndex((value) => value + 1);
  }
  function toggle(id) { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 2 ? [...current, id] : current); }
  function secure() {
    const factors = selected.map((id) => MFA_FACTORS.find((factor) => factor.id === id));
    const valid = factors.length === 2 && factors.some((factor) => factor.group === "know") && factors.some((factor) => factor.group === "have" || factor.group === "are");
    if (!valid) { fail(); return; }
    if (protectedCount === 5) { onSuccess(); return; }
    setProtectedCount((value) => value + 1); setSelected([]);
  }
  function retry() { setPhase("sort"); setIndex(0); setSelected([]); setProtectedCount(0); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[9] || 0) >= 2} hint="Посмотри на категории: пароль и контрольный вопрос — оба «знаю». Для второго фактора нужен предмет или биометрический признак." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;

  return (
    <div className="mission-card game-card mfa-game">
      <div className="game-counter"><span>{phase === "sort" ? "Этап 1 · Разбери факторы" : "Этап 2 · Закрой ворота"}</span><b>{phase === "sort" ? `${index + 1} из ${MFA_CARDS.length}` : `Защищено аккаунтов: ${protectedCount} из 6`}</b></div>
      {phase === "sort" ? <>
        <h1>К какой категории относится карточка?</h1>
        <div className="factor-card"><span>{card.icon}</span><b>{card.label}</b></div>
        <div className="factor-zones">{[["know","Знаю","💭"],["have","Имею","📱"],["are","Являюсь","☝️"],["none","Не является фактором","⛔"]].map(([id,label,icon]) => <button key={id} onClick={() => classify(id)}><span>{icon}</span><b>{label}</b></button>)}</div>
      </> : <>
        <h1>Защити аккаунт жителя {protectedCount + 1}</h1>
        <p>Выбери ровно два независимых способа: один из категории «знаю» и второй из другой категории.</p>
        <div className="account-gate"><i style={{width:`${(protectedCount / 6) * 100}%`}} /><span>🏰</span></div>
        <div className="factor-options">{MFA_FACTORS.map((factor) => <button key={factor.id} onClick={() => toggle(factor.id)} className={selected.includes(factor.id) ? "selected" : ""}>{selected.includes(factor.id) ? "✓ " : ""}{factor.label}<small>{(profile.attempts[9] || 0) >= 2 ? ({know:"ЗНАЮ",have:"ИМЕЮ",are:"ЯВЛЯЮСЬ",none:"НЕ ФАКТОР"}[factor.group]) : ""}</small></button>)}</div>
        <button className="button primary" disabled={selected.length !== 2} onClick={secure}>Установить два ключа</button>
      </>}
      <p className="safe-reminder">🔐 Здесь нет настоящих паролей, телефонов или биометрических данных.</p>
    </div>
  );
}

function AiPrivacyEditor({ profile, updateProfile, onSuccess, onLesson }) {
  const [phase, setPhase] = useState("traffic");
  const [index, setIndex] = useState(0);
  const [removed, setRemoved] = useState([]);
  const [showError, setShowError] = useState(false);
  const card = AI_TRAFFIC_CARDS[index];
  const request = AI_CLEAN_REQUESTS[index];

  function fail() { recordMistake(profile, updateProfile, 10); setShowError(true); }
  function sort(level) {
    if (level !== card.level) { fail(); return; }
    if (index === AI_TRAFFIC_CARDS.length - 1) { setPhase("clean"); setIndex(0); }
    else setIndex((value) => value + 1);
  }
  function togglePart(partIndex) { setRemoved((current) => current.includes(partIndex) ? current.filter((id) => id !== partIndex) : [...current, partIndex]); }
  function clean() {
    const correct = request.parts.every((part, partIndex) => part[1] === removed.includes(partIndex));
    if (!correct) { fail(); return; }
    if (index === AI_CLEAN_REQUESTS.length - 1) { onSuccess(); return; }
    setIndex((value) => value + 1); setRemoved([]);
  }
  function retry() { setPhase("traffic"); setIndex(0); setRemoved([]); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[10] || 0) >= 2} hint="Опасная категория — сведения, по которым можно узнать человека, войти в его аккаунт или прочитать чужую личную информацию." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;

  return (
    <div className="mission-card game-card ai-editor-game">
      <div className="game-counter"><span>{phase === "traffic" ? "Часть 1 · Светофор запросов" : "Часть 2 · Очисти запрос"}</span><b>{index + 1} из {phase === "traffic" ? AI_TRAFFIC_CARDS.length : AI_CLEAN_REQUESTS.length}</b></div>
      {phase === "traffic" ? <>
        <h1>Можно ли отправить это ИИ?</h1><div className="prompt-ticket">{card.text}</div>
        <div className="traffic-actions"><button className="green" onClick={() => sort("green")}>🟢 Можно отправить</button><button className="yellow" onClick={() => sort("yellow")}>🟡 Сначала очистить</button><button className="red" onClick={() => sort("red")}>🔴 Нельзя отправлять</button></div>
      </> : <>
        <h1>Нажми на опасные фрагменты</h1><p>Удали личные сведения, сохранив полезную просьбу.</p>
        <div className="editable-prompt">{request.parts.map(([text], partIndex) => <button key={partIndex} onClick={() => togglePart(partIndex)} className={removed.includes(partIndex) ? "removed" : ""}>{removed.includes(partIndex) ? <del>{text}</del> : text}</button>)}</div>
        <div className="safe-preview"><small>БЕЗОПАСНАЯ ВЕРСИЯ</small><p>{request.parts.filter((_, partIndex) => !removed.includes(partIndex)).map(([text]) => text).join("") || "Сначала оставь полезную часть запроса."}</p></div>
        <button className="button primary" onClick={clean}>Проверить и отправить безопасно</button>
      </>}
    </div>
  );
}

function ArchiveRescueGame({ profile, updateProfile, onSuccess, onLesson }) {
  const [phase, setPhase] = useState("importance");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(0);
  const [storm, setStorm] = useState(false);
  const [showError, setShowError] = useState(false);
  const file = ARCHIVE_FILES[index];
  const rescueFiles = ["Семейные фотографии", "Школьный проект", "Рисунок", "Сохранение игры", "Важный документ", "Учебное расписание"];

  function fail() { recordMistake(profile, updateProfile, 11); setShowError(true); }
  function classify(group) {
    if (group !== file.group) { fail(); return; }
    if (index === ARCHIVE_FILES.length - 1) { setPhase("copies"); setIndex(0); }
    else setIndex((value) => value + 1);
  }
  function backup(targetId) {
    const target = BACKUP_TARGETS.find(([id]) => id === targetId);
    if (!target[2]) { fail(); return; }
    if (index === rescueFiles.length - 1) { setSaved(6); setPhase("storm"); setIndex(0); }
    else { setSaved((value) => value + 1); setIndex((value) => value + 1); }
  }
  function retry() { setPhase("importance"); setIndex(0); setSaved(0); setStorm(false); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[11] || 0) >= 2} hint="Две папки на одном устройстве пропадут вместе с ним. Безопасная дополнительная копия находится на отдельном носителе взрослого или в семейном облаке." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;

  return (
    <div className="mission-card game-card archive-game">
      <div className="game-counter"><span>{phase === "importance" ? "Этап 1 · Важность" : phase === "copies" ? "Этап 2 · Безопасные копии" : "Этап 3 · Цифровая буря"}</span><b>Сохранено файлов: {saved} из 6</b></div>
      {phase === "importance" && <><h1>Что делать с этим файлом?</h1><div className="archive-file"><span>{file.icon}</span><b>{file.label}</b></div><div className="archive-categories"><button onClick={() => classify("backup")}>🛟 Нужна резервная копия</button><button onClick={() => classify("again")}>↻ Можно скачать или создать снова</button><button onClick={() => classify("adult")}>🧑 Сначала спросить взрослого</button></div></>}
      {phase === "copies" && <><h1>Создай копию: {rescueFiles[index]}</h1><p>Основная копия уже на компьютере. Выбери ещё одно безопасное место.</p><div className="backup-map"><div className="device main-device">💻<b>Основной компьютер</b></div><div className="backup-arrow">＋</div><div className="target-list">{BACKUP_TARGETS.map(([id,label]) => <button key={id} onClick={() => backup(id)}>{label}</button>)}</div></div></>}
      {phase === "storm" && <div className={`storm-simulation ${storm ? "active" : ""}`}><h1>{storm ? "Файлы восстановлены!" : "Запустить безопасную симуляцию бури?"}</h1><div className="storm-city"><span>💻</span><i>⚡</i><span>☁️</span><b>{storm ? "✓ 6 файлов восстановлено из копий" : "Основной компьютер может сломаться"}</b></div>{storm ? <button className="button primary" onClick={onSuccess}>Завершить спасение архива</button> : <button className="button primary" onClick={() => setStorm(true)}>Запустить цифровую бурю</button>}</div>}
    </div>
  );
}

function DigitalTraceGame({ profile, updateProfile, onSuccess, onLesson }) {
  const [phase, setPhase] = useState("paths");
  const [index, setIndex] = useState(0);
  const [path, setPath] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [showError, setShowError] = useState(false);
  const scene = DIGITAL_SCENARIOS[index];
  const draftSteps = [
    { title: "Личные данные", options: ["Оставить адрес", "Удалить личные данные"], correct: 1 },
    { title: "Фото друга", options: ["Спросить разрешение", "Публиковать без спроса"], correct: 0 },
    { title: "Аудитория", options: ["Все пользователи", "Только подходящая группа"], correct: 1 },
    { title: "Тон", options: ["Проверить, что текст добрый", "Добавить обидную шутку"], correct: 0 },
  ];
  function fail() { recordMistake(profile, updateProfile, 12); setShowError(true); }
  function choosePath(answer) {
    if (answer !== scene.answer) { fail(); return; }
    setPath(scene.path);
  }
  function nextPath() {
    if (index === DIGITAL_SCENARIOS.length - 1) { setPhase("draft"); setIndex(0); setPath(""); }
    else { setIndex((value) => value + 1); setPath(""); }
  }
  function draft(answerIndex) {
    if (answerIndex !== draftSteps[index].correct) { fail(); return; }
    if (index === draftSteps.length - 1) { setPhase("time"); setIndex(0); }
    else setIndex((value) => value + 1);
  }
  function addTime(item) {
    const expected = TRACE_ORDER[timeline.length];
    if (item !== expected) { fail(); return; }
    const next = [...timeline, item]; setTimeline(next);
    if (next.length === TRACE_ORDER.length) onSuccess();
  }
  function retry() { setPhase("paths"); setIndex(0); setPath(""); setTimeline([]); setShowError(false); }
  if (showError) return <GameError showHint={(profile.attempts[12] || 0) >= 2} hint="Проследи линии: отправленное сообщение могут переслать или сохранить. Неотправленный черновик не покидает устройство, а срок жизни копии заранее неизвестен." onRetry={() => { retry(); onLesson(); }} onLesson={onLesson} />;

  return (
    <div className="mission-card game-card trace-game">
      <div className="game-counter"><span>{phase === "paths" ? "Часть 1 · Куда ушла публикация" : phase === "draft" ? "Часть 2 · Безопасная публикация" : "Часть 3 · Шкала времени"}</span><b>{phase === "paths" ? `${index + 1} из ${DIGITAL_SCENARIOS.length}` : "Цифровой парк"}</b></div>
      {phase === "paths" && <><h1>{scene.title}</h1><div className="trace-map"><div className="post-origin"><span>{scene.icon}</span><b>Начальная публикация</b></div><div className={`trace-lines ${path ? "visible" : ""}`}><i/><i/><i/></div><div className="trace-result">{path || "Выбери наиболее вероятный маршрут"}</div></div>{!path ? <div className="trace-actions"><button onClick={() => choosePath("spread")}>Могли переслать и сохранить</button><button onClick={() => choosePath("positive")}>Создал добрый след</button><button onClick={() => choosePath("limited")}>Разрешено для ограниченной группы</button><button onClick={() => choosePath("draft")}>Никто не увидел: это черновик</button></div> : <button className="button primary" onClick={nextPath}>Следующий след →</button>}</>}
      {phase === "draft" && <><h1>Собери безопасную публикацию</h1><div className="draft-card"><small>ШАГ {index + 1} ИЗ {draftSteps.length}</small><b>{draftSteps[index].title}</b>{draftSteps[index].options.map((option, optionIndex) => <button key={option} onClick={() => draft(optionIndex)}>{option}</button>)}</div></>}
      {phase === "time" && <><h1>Расположи следы от менее распространяемого к более копируемому</h1><p>Точный срок неизвестен: он зависит от копий и действий других людей.</p><div className="timeline-built">{timeline.map((item, itemIndex) => <span key={item}>{itemIndex + 1}. {item}</span>)}</div><div className="timeline-options">{TRACE_ORDER.filter((item) => !timeline.includes(item)).sort().map((item) => <button key={item} onClick={() => addTime(item)}>{item}</button>)}</div></>}
    </div>
  );
}

function DistrictTwoComplete({ profile, onMap, onRepeat }) {
  const [showFlags, setShowFlags] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const districtMissions = MISSIONS.slice(4, 8);

  return (
    <section className="district-finale">
      <div className="district-glow" aria-hidden="true">✦</div>
      <div className="finale-shield" aria-hidden="true">🛡️</div>
      <span className="panel-eyebrow">Район восстановлен</span>
      <h1>Второй район Кибергорода защищён!</h1>
      <p><b>{profile.name}</b>, теперь ты умеешь безопаснее пользоваться Wi-Fi, проверять подозрительные изображения, устанавливать обновления и помогать людям в сложной ситуации.</p>
      <div className="finale-stats"><b>8</b><span>миссий выполнено</span><i>из 24</i></div>

      <div className="finale-actions">
        <button className="button primary" onClick={onMap}>Вернуться на карту</button>
        <button className="button secondary" onClick={() => setShowFlags((value) => !value)}>{showFlags ? "Скрыть мои флаги" : "Посмотреть мои флаги"}</button>
        <button className="button secondary" onClick={() => setShowRepeat((value) => !value)}>Повторить любимую миссию</button>
      </div>

      {showRepeat && <div className="favorite-missions" aria-label="Выбери миссию для повторения">{districtMissions.map((mission) => <button key={mission.id} onClick={() => onRepeat(mission.id)}><span>{mission.icon}</span><b>{mission.id}. {mission.title}</b></button>)}</div>}

      {showFlags && (
        <div className="district-flags">
          {districtMissions.map((mission) => (
            <article key={mission.id} className={`district-flag ${mission.color}`}>
              <span>{mission.icon}</span>
              <div><small>МИССИЯ {mission.id}</small><b>{mission.title}</b><code>{profile.flags[mission.id] || mission.flag}</code></div>
              <button className="text-button" onClick={() => onRepeat(mission.id)}>Повторить</button>
            </article>
          ))}
        </div>
      )}

      <div className="next-district-note"><span>🗝️</span><div><b>Третий район открыт</b><small>Миссия 9 уже доступна на карте.</small></div></div>
    </section>
  );
}

function DistrictThreeComplete({ profile, onMap, onRepeat }) {
  const [showFlags, setShowFlags] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const districtMissions = MISSIONS.slice(8, 12);
  return (
    <section className="district-finale district-three-finale">
      <div className="district-glow" aria-hidden="true">✦</div><div className="finale-shield" aria-hidden="true">🏰</div>
      <span className="panel-eyebrow">Район восстановлен</span><h1>Третий район Кибергорода защищён!</h1>
      <p><b>{profile.name}</b>, теперь ты умеешь усиливать защиту аккаунтов, безопасно пользоваться ИИ, сохранять важные файлы и управлять своим цифровым следом.</p>
      <div className="finale-stats"><b>12</b><span>миссий выполнено</span><i>из 24</i></div>
      <div className="finale-actions"><button className="button primary" onClick={onMap}>Вернуться на карту</button><button className="button secondary" onClick={() => setShowFlags((value) => !value)}>{showFlags ? "Скрыть мои флаги" : "Посмотреть мои флаги"}</button><button className="button secondary" onClick={() => setShowRepeat((value) => !value)}>Повторить любимую миссию</button></div>
      {showRepeat && <div className="favorite-missions">{districtMissions.map((mission) => <button key={mission.id} onClick={() => onRepeat(mission.id)}><span>{mission.icon}</span><b>{mission.id}. {mission.title}</b></button>)}</div>}
      {showFlags && <div className="district-flags">{districtMissions.map((mission) => <article key={mission.id} className={`district-flag ${mission.color}`}><span>{mission.icon}</span><div><small>МИССИЯ {mission.id}</small><b>{mission.title}</b><code>{profile.flags[mission.id] || mission.flag}</code></div><button className="text-button" onClick={() => onRepeat(mission.id)}>Повторить</button></article>)}</div>}
      <div className="next-district-note"><span>🔒</span><div><b>Следующий район готовится к открытию</b><small>Миссии 13–24 пока заблокированы.</small></div></div>
    </section>
  );
}

function Reward({ mission, name, onMap, onNext, notify }) {
  const [large, setLarge] = useState(false);
  async function copyFlag() {
    try { await navigator.clipboard.writeText(mission.flag); notify("Флаг скопирован!"); }
    catch { notify("Выдели флаг и скопируй его вручную"); }
  }
  return (
    <div className="mission-card reward-card">
      <div className="confetti" aria-hidden="true">✦ <i>◆</i> ● <em>▲</em> ✦</div>
      <div className="reward-shield">🏁</div>
      <span className="panel-eyebrow">Миссия выполнена</span>
      <h1>Отличная работа, {name}!</h1>
      <p>Ты защитил часть Кибергорода и запомнил важное правило:</p>
      {mission.success && <p className="mission-success">{mission.success}</p>}
      <blockquote>{mission.rule}</blockquote>
      <div className={`flag-box ${large ? "large" : ""}`}><small>ТВОЙ НОВЫЙ ФЛАГ</small><code>{mission.flag}</code></div>
      <p className="flag-help">Запиши, скопируй или сфотографируй этот флаг. Он поможет продолжить приключение на другом устройстве.</p>
      {mission.id === 4 && <div className="district-complete"><b>Первый район Кибергорода защищён!</b><span>Новый маршрут открыт: переходи к миссии 5.</span></div>}
      {mission.id === 8 && <div className="district-complete"><b>Все четыре миссии второго района выполнены!</b><span>Забери флаг и посмотри, как изменился Кибергород.</span></div>}
      {mission.id === 12 && <div className="district-complete"><b>Все четыре миссии третьего района выполнены!</b><span>Забери флаг и восстанови новый район.</span></div>}
      <div className="reward-actions"><button className="button primary" onClick={copyFlag}>📋 Скопировать флаг</button><button className="button secondary" onClick={() => setLarge(!large)}>🔍 Показать флаг крупно</button><button className="button secondary" onClick={onNext}>{mission.id === 8 ? "Защитить второй район →" : mission.id === 12 ? "Защитить третий район →" : "Открыть следующую миссию →"}</button><button className="text-button" onClick={onMap}>Вернуться на карту</button></div>
    </div>
  );
}
