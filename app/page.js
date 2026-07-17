"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
    version: 1,
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
    return raw ? JSON.parse(raw) : null;
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

  useEffect(() => setSettings(loadSettings()), []);

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
    if (id > 4 || !profile.available.includes(id)) return;
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
              if (missionId < 4) openMission(missionId + 1);
              else setScreen("map");
            }}
            notify={setToast}
          />
        )}
      </div>
      <footer><span>🛡️ Данные остаются на этом устройстве</span><span>Первый рабочий прототип · 4 из 24 миссий</span></footer>
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
          <div><b>миссий выполнено</b><div className="progress-track"><i style={{ width: `${(completed / 24) * 100}%` }} /></div></div>
        </div>
      </div>
      <div className="district-label"><span>Район 01</span><b>Цифровая набережная</b><small>4 игровые миссии</small></div>
      <div className="mission-path">
        {MISSIONS.map((mission, index) => {
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
              {index < 3 && <div className={`path-line ${done ? "lit" : ""}`}><i /><i /><i /></div>}
            </div>
          );
        })}
      </div>
      <div className="future-districts">
        {[2, 3, 4, 5, 6].map((district) => (
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
      const nextAvailable = mission.id < 4 ? [...p.available, mission.id + 1] : p.available;
      return {
        ...p,
        completed: completedIds,
        available: Array.from(new Set(nextAvailable)).sort((a, b) => a - b),
        flags: { ...p.flags, [mission.id]: mission.flag },
        currentMission: Math.min(mission.id + 1, 4),
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
      <blockquote>{mission.rule}</blockquote>
      <div className={`flag-box ${large ? "large" : ""}`}><small>ТВОЙ НОВЫЙ ФЛАГ</small><code>{mission.flag}</code></div>
      <p className="flag-help">Запиши, скопируй или сфотографируй этот флаг. Он поможет продолжить приключение на другом устройстве.</p>
      {mission.id === 4 && <div className="district-complete"><b>Первый район Кибергорода защищён!</b><span>Ты выполнил четыре миссии. Остальные районы откроются на следующем этапе разработки.</span></div>}
      <div className="reward-actions"><button className="button primary" onClick={copyFlag}>📋 Скопировать флаг</button><button className="button secondary" onClick={() => setLarge(!large)}>🔍 Показать флаг крупно</button><button className="button secondary" onClick={onNext}>{mission.id < 4 ? "Открыть следующую миссию →" : "Открыть карту"}</button><button className="text-button" onClick={onMap}>Вернуться на карту</button></div>
    </div>
  );
}
