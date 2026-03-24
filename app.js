const STORAGE_KEYS = {
  missed: "grade4-kanji-missed",
  correct: "grade4-kanji-correct",
  open: "grade4-kanji-open",
  settings: "grade4-kanji-settings",
};

const state = {
  missed: new Set(loadArray(STORAGE_KEYS.missed)),
  correct: new Set(loadArray(STORAGE_KEYS.correct)),
  open: new Set(loadArray(STORAGE_KEYS.open)),
  settings: {
    term: "all",
    size: 50,
    mode: "all",
    sort: "random",
    ...loadObject(STORAGE_KEYS.settings),
  },
  seed: Date.now(),
};

const termFilter = document.querySelector("#termFilter");
const pageSize = document.querySelector("#pageSize");
const modeFilter = document.querySelector("#modeFilter");
const sortOrder = document.querySelector("#sortOrder");
const shuffleButton = document.querySelector("#shuffleButton");
const resetMissedButton = document.querySelector("#resetMissedButton");
const questionList = document.querySelector("#questionList");
const visibleCount = document.querySelector("#visibleCount");
const missedCount = document.querySelector("#missedCount");
const correctCount = document.querySelector("#correctCount");
const contentNote = document.querySelector("#contentNote");
const emptyState = document.querySelector("#emptyState");

termFilter.value = state.settings.term;
pageSize.value = String(state.settings.size);
modeFilter.value = state.settings.mode;
sortOrder.value = state.settings.sort;

termFilter.addEventListener("change", () => {
  state.settings.term = termFilter.value;
  persistSettings();
  render();
});

pageSize.addEventListener("change", () => {
  state.settings.size = Number(pageSize.value);
  persistSettings();
  render();
});

modeFilter.addEventListener("change", () => {
  state.settings.mode = modeFilter.value;
  closeAllAnswers();
  persistSettings();
  render();
});

sortOrder.addEventListener("change", () => {
  state.settings.sort = sortOrder.value;
  persistSettings();
  render();
});

shuffleButton.addEventListener("click", () => {
  state.seed = Date.now();
  render();
});

resetMissedButton.addEventListener("click", () => {
  state.missed.clear();
  state.correct.clear();
  closeAllAnswers();
  persistSet(STORAGE_KEYS.missed, state.missed);
  persistSet(STORAGE_KEYS.correct, state.correct);
  render();
});

function loadArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function loadObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function persistSet(key, value) {
  localStorage.setItem(key, JSON.stringify([...value]));
}

function persistSettings() {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
}

function closeAllAnswers() {
  state.open.clear();
  persistSet(STORAGE_KEYS.open, state.open);
}

function buildQuestions() {
  const questions = [];

  for (const item of window.GRADE4_KANJI) {
    const term = item.order <= 67 ? 1 : item.order <= 134 ? 2 : 3;
    const prefix = `${item.kanji}-${item.order}`;

    questions.push({
      id: `${prefix}-write`,
      term,
      order: item.order * 10 + 1,
      type: "かき",
      text: buildPrompt(item, "write"),
      answer: item.writeAnswer,
      meaning: item.writeMeaning || window.WORD_MEANINGS?.[item.writeAnswer] || "",
    });

    questions.push({
      id: `${prefix}-read`,
      term,
      order: item.order * 10 + 2,
      type: "よみ",
      text: buildPrompt(item, "read"),
      answer: item.readAnswer,
      meaning: item.readMeaning || window.WORD_MEANINGS?.[item.readWord] || "",
    });

    if (item.okuriPrompt && item.okuriAnswer) {
      questions.push({
        id: `${prefix}-okuri`,
        term,
        order: item.order * 10 + 3,
        type: "おくりがな",
        text: buildPrompt(item, "okuri"),
        answer: item.okuriAnswer,
        meaning: item.okuriMeaning || "",
      });
    }
  }

  return questions;
}

function buildPrompt(item, mode) {
  const directPrompt =
    (mode === "write" && item.writePrompt) ||
    (mode === "read" && item.readPrompt) ||
    (mode === "okuri" && item.okuriPromptSentence);

  if (directPrompt) {
    return directPrompt;
  }

  const word = mode === "write" ? item.writeAnswer : mode === "read" ? item.readWord : item.okuriAnswer;
  const display = mode === "write" ? item.writeKana : mode === "read" ? item.readWord : item.okuriPrompt;
  const template = window.WORD_EXAMPLES?.[word];

  if (template) {
    return template.replace("{}", mode === "read" ? `「${display}」` : `（${display}）`);
  }

  const meaning = window.WORD_MEANINGS?.[word];
  if (meaning) {
    return buildMeaningPrompt(meaning, display, mode);
  }

  return defaultPrompt(display, mode);
}

function buildMeaningPrompt(meaning, display, mode) {
  const cleaned = meaning.replace(/。$/, "").replace(/こと$/, "");

  if (mode === "read") {
    return `${cleaned}ものを「${display}」という。`;
  }

  if (mode === "okuri") {
    return `${cleaned}とき、（${display}）。`;
  }

  return `${cleaned}ものを（${display}）という。`;
}

function defaultPrompt(display, mode) {
  if (mode === "read") {
    return `この 文の 中の「${display}」を 読む。`;
  }

  return `この 文の 中の（${display}）を たしかめる。`;
}

function seededShuffle(items, seed) {
  const list = [...items];
  let currentSeed = seed;

  for (let i = list.length - 1; i > 0; i -= 1) {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    const j = currentSeed % (i + 1);
    [list[i], list[j]] = [list[j], list[i]];
  }

  return list;
}

function getVisibleQuestions() {
  const all = buildQuestions().filter((question) => {
    if (state.settings.term !== "all" && question.term !== Number(state.settings.term)) {
      return false;
    }

    if (state.settings.mode === "missed" && !state.missed.has(question.id)) {
      return false;
    }

    if (state.settings.mode === "correct" && !state.correct.has(question.id)) {
      return false;
    }

    if (state.settings.mode === "hideCorrect" && state.correct.has(question.id)) {
      return false;
    }

    return true;
  });

  const arranged =
    state.settings.sort === "ordered"
      ? [...all].sort((a, b) => a.order - b.order)
      : seededShuffle(all, state.seed);

  return arranged.slice(0, state.settings.size);
}

function render() {
  const visible = getVisibleQuestions();
  questionList.innerHTML = "";

  if (!visible.length) {
    questionList.appendChild(emptyState.content.cloneNode(true));
  } else {
    for (const [index, question] of visible.entries()) {
      questionList.appendChild(renderCard(question, index));
    }
  }

  visibleCount.textContent = String(visible.length);
  missedCount.textContent = String(state.missed.size);
  correctCount.textContent = String(state.correct.size);

  if (state.settings.mode === "missed") {
    contentNote.textContent = "まちがえた もんだいだけを ひょうじしています。";
    return;
  }

  if (state.settings.mode === "correct") {
    contentNote.textContent = "せいかいした もんだいだけを ひょうじしています。";
    return;
  }

  if (state.settings.mode === "hideCorrect") {
    contentNote.textContent = "せいかいした もんだいを のぞいて ひょうじしています。";
    return;
  }

  contentNote.textContent =
    state.settings.sort === "ordered"
      ? "じゅんばんに ひょうじしています。"
      : "ランダムに ひょうじしています。";
}

function renderCard(question, index) {
  const card = document.createElement("article");
  card.className = "questionCard";

  if (state.missed.has(question.id)) {
    card.classList.add("is-missed");
  }

  if (state.correct.has(question.id)) {
    card.classList.add("is-correct");
  }

  if (state.open.has(question.id)) {
    card.classList.add("is-open");
  }

  const top = document.createElement("div");
  top.className = "questionTop";

  const tag = document.createElement("span");
  tag.className = "questionTag";
  tag.textContent = `${question.term}がっき / ${question.type}`;

  const meta = document.createElement("span");
  meta.className = "questionMeta";
  meta.textContent = `No.${index + 1}`;

  top.append(tag, meta);

  const text = document.createElement("p");
  text.className = "questionText";
  text.textContent = question.text;

  const answer = document.createElement("div");
  answer.className = "questionAnswer";
  answer.innerHTML = `<strong>こたえ:</strong> ${question.answer}${
    question.meaning ? `<br><strong>いみ:</strong> ${question.meaning}` : ""
  }`;

  const actions = document.createElement("div");
  actions.className = "questionActions";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "button button--primary toggleAnswer";
  toggle.textContent = state.open.has(question.id) ? "こたえを とじる" : "こたえを みる";
  toggle.addEventListener("click", () => {
    if (state.open.has(question.id)) {
      state.open.delete(question.id);
    } else {
      state.open.add(question.id);
    }
    persistSet(STORAGE_KEYS.open, state.open);
    render();
  });

  const missLabel = document.createElement("label");
  missLabel.className = "missToggle";
  const missInput = document.createElement("input");
  missInput.type = "checkbox";
  missInput.checked = state.missed.has(question.id);
  missInput.addEventListener("change", () => {
    if (missInput.checked) {
      state.missed.add(question.id);
      state.correct.delete(question.id);
    } else {
      state.missed.delete(question.id);
    }

    persistSet(STORAGE_KEYS.missed, state.missed);
    persistSet(STORAGE_KEYS.correct, state.correct);
    render();
  });
  const missText = document.createElement("span");
  missText.textContent = "まちがえた";
  missLabel.append(missInput, missText);

  const correctLabel = document.createElement("label");
  correctLabel.className = "correctToggle";
  const correctInput = document.createElement("input");
  correctInput.type = "checkbox";
  correctInput.checked = state.correct.has(question.id);
  correctInput.addEventListener("change", () => {
    if (correctInput.checked) {
      state.correct.add(question.id);
      state.missed.delete(question.id);
    } else {
      state.correct.delete(question.id);
    }

    persistSet(STORAGE_KEYS.correct, state.correct);
    persistSet(STORAGE_KEYS.missed, state.missed);
    render();
  });
  const correctText = document.createElement("span");
  correctText.textContent = "せいかい";
  correctLabel.append(correctInput, correctText);

  actions.append(toggle, missLabel, correctLabel);
  card.append(top, text, answer, actions);
  return card;
}

render();
