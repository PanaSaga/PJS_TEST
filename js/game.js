import { saveScore, getTop } from "./db.js";

const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 12000;
const RANKING_SIZE = 10;

const screen = document.getElementById("screen");
const panels = {
  idle: document.querySelector(".panel--idle"),
  waiting: document.querySelector(".panel--waiting"),
  ready: document.querySelector(".panel--ready"),
  fail: document.querySelector(".panel--fail"),
  result: document.querySelector(".panel--result"),
};

const startBtn = document.getElementById("start-btn");
const retryBtn = document.getElementById("retry-btn");
const restartBtn = document.getElementById("restart-btn");
const saveForm = document.getElementById("save-form");
const nicknameInput = document.getElementById("nickname-input");
const saveBtn = document.getElementById("save-btn");
const saveStatus = document.getElementById("save-status");
const resultMsEl = document.getElementById("result-ms");
const rankingList = document.getElementById("ranking-list");

let state = "idle";
let readyTimeoutId = null;
let readyStartTime = 0;
let lastReactionMs = 0;

function setState(next) {
  state = next;
  Object.entries(panels).forEach(([name, el]) => {
    el.hidden = name !== next;
  });
  screen.className = `screen screen--${next}`;
}

function startGame() {
  setState("waiting");
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
  readyTimeoutId = setTimeout(() => {
    setState("ready");
    readyStartTime = performance.now();
  }, delay);
}

function handleFail() {
  clearTimeout(readyTimeoutId);
  setState("fail");
}

function handleSuccess() {
  lastReactionMs = Math.round(performance.now() - readyStartTime);
  resultMsEl.textContent = lastReactionMs;
  nicknameInput.value = "";
  saveBtn.disabled = false;
  saveStatus.hidden = true;
  setState("result");
  renderRanking();
}

screen.addEventListener("click", (event) => {
  if (state === "waiting") {
    handleFail();
    return;
  }
  if (state === "ready") {
    handleSuccess();
    return;
  }
});

startBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  startGame();
});

retryBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  setState("idle");
});

restartBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  setState("idle");
});

saveForm.addEventListener("click", (event) => event.stopPropagation());

saveForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nickname = nicknameInput.value.trim();
  if (!nickname) return;

  saveBtn.disabled = true;
  saveStatus.hidden = false;
  saveStatus.textContent = "저장 중...";

  try {
    await saveScore(nickname, lastReactionMs);
    saveStatus.textContent = "저장 완료!";
    await renderRanking();
  } catch (error) {
    console.error(error);
    saveStatus.textContent = "저장 실패. 잠시 후 다시 시도해주세요.";
    saveBtn.disabled = false;
  }
});

async function renderRanking() {
  try {
    const top = await getTop(RANKING_SIZE);
    rankingList.innerHTML = "";
    top.forEach((record) => {
      const li = document.createElement("li");
      li.textContent = `${record.nickname} - ${record.ms}ms`;
      rankingList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    rankingList.innerHTML = "<li>랭킹을 불러올 수 없습니다.</li>";
  }
}
