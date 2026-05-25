const SECOND = 1000;

const TIMER_CONFIG = {
  lottery: { label: "Lottery Drawing", duration: 10 * 60, idle: "No tickets yet" },
  voting: { label: "Voting Window", duration: 10 * 60, idle: "Ready" },
  propertyTax: { label: "Property Tax Check", duration: 15 * 60, idle: "Ready" },
  turn: { label: "Turn Timer", duration: 2 * 60, idle: "Ready" },
};

const state = {
  running: false,
  startedAt: null,
  gameElapsed: 0,
  timers: {
    lottery: { remaining: TIMER_CONFIG.lottery.duration, lastCompletedAt: null },
    voting: { remaining: TIMER_CONFIG.voting.duration, lastCompletedAt: null },
    propertyTax: { remaining: TIMER_CONFIG.propertyTax.duration, lastCompletedAt: null },
    turn: { remaining: TIMER_CONFIG.turn.duration, running: false },
  },
  tickets: { tobl: false, cc: false },
  players: [],
  activePlayerIndex: -1,
  loans: [],
};

const els = {};

function byId(id) {
  return document.getElementById(id);
}

function cacheElements() {
  [
    "gameClock",
    "nextAction",
    "loanCount",
    "currentTurnLabel",
    "turnTime",
    "turnState",
    "playerName",
    "playerRail",
    "toblTickets",
    "ccTickets",
    "drawerOutput",
    "lotteryTime",
    "lotteryStatus",
    "votingTime",
    "votingStatus",
    "propertyTaxTime",
    "propertyTaxStatus",
    "loanForm",
    "loanPlayer",
    "loanAmount",
    "loanList",
    "defraudAmount",
    "caughtTotal",
    "taxSpaces",
    "taxRate",
    "spaceTaxTotal",
  ].forEach((id) => {
    els[id] = byId(id);
  });
}

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return [hrs, mins, secs].map((part) => String(part).padStart(2, "0")).join(":");
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatClock(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs].map((part) => String(part).padStart(2, "0")).join(":");
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function svgIcon(name) {
  const icons = {
    play: '<path d="M7 5v14l11-7-11-7Z" fill="currentColor"/>',
    pause: '<path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" fill="currentColor"/>',
    rotate:
      '<path d="M20 12a8 8 0 1 1-2.35-5.65M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    timer:
      '<path d="M10 2h4M12 14l3-3M12 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "arrow-right":
      '<path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    plus:
      '<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}

function installIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = svgIcon(node.dataset.icon);
  });
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("matthew-opoly-timers") || "null");
    if (!saved) return;
    Object.assign(state, saved);
    state.running = false;
    state.startedAt = null;
    state.timers.turn.running = false;
  } catch {
    localStorage.removeItem("matthew-opoly-timers");
  }
}

function saveState() {
  localStorage.setItem("matthew-opoly-timers", JSON.stringify(state));
}

function setRunning(running) {
  state.running = running;
  state.startedAt = running ? Date.now() : null;
  saveState();
  render();
}

function resetAll() {
  state.running = false;
  state.startedAt = null;
  state.gameElapsed = 0;
  state.tickets = { tobl: false, cc: false };
  state.players = [];
  state.activePlayerIndex = -1;
  state.loans = [];
  Object.keys(TIMER_CONFIG).forEach((key) => {
    state.timers[key].remaining = TIMER_CONFIG[key].duration;
  });
  state.timers.turn.running = false;
  state.timers.lottery.lastCompletedAt = null;
  state.timers.voting.lastCompletedAt = null;
  state.timers.propertyTax.lastCompletedAt = null;
  els.playerName.value = "";
  els.loanForm.reset();
  els.loanPlayer.value = "";
  els.loanAmount.value = "";
  saveState();
  render();
}

function clearTransientForms() {
  els.playerName.value = "";
  els.loanForm.reset();
  els.loanPlayer.value = "";
  els.loanAmount.value = "";
}

function hasLotteryTickets() {
  return state.tickets.tobl || state.tickets.cc;
}

function timerProgress(key) {
  const config = TIMER_CONFIG[key];
  const timer = state.timers[key];
  return ((config.duration - timer.remaining) / config.duration) * 360;
}

function timerStatus(key) {
  if (key === "lottery" && !hasLotteryTickets()) return "No tickets";
  if (state.timers[key].remaining <= 0) return "Due now";
  return state.running || (key === "turn" && state.timers.turn.running) ? "Running" : TIMER_CONFIG[key].idle;
}

function completeTimer(key) {
  if (key === "lottery" && !hasLotteryTickets()) {
    state.timers.lottery.remaining = TIMER_CONFIG.lottery.duration;
  } else {
    state.timers[key].remaining = TIMER_CONFIG[key].duration;
  }
  state.timers[key].lastCompletedAt = Date.now();
  saveState();
  render();
}

function resetTimer(key) {
  state.timers[key].remaining = TIMER_CONFIG[key].duration;
  if (key === "turn") state.timers.turn.running = false;
  saveState();
  render();
}

function addPlayer() {
  const name = els.playerName.value.trim();
  if (!name) return;
  state.players.push(name);
  if (state.activePlayerIndex === -1) state.activePlayerIndex = 0;
  els.playerName.value = "";
  saveState();
  render();
}

function startTurn() {
  if (!state.players.length) {
    addPlayer();
  }
  if (!state.players.length) return;
  if (state.activePlayerIndex < 0) state.activePlayerIndex = 0;
  state.timers.turn.remaining = TIMER_CONFIG.turn.duration;
  state.timers.turn.running = true;
  saveState();
  render();
}

function nextTurn() {
  if (!state.players.length) return;
  state.activePlayerIndex = (state.activePlayerIndex + 1) % state.players.length;
  state.timers.turn.remaining = TIMER_CONFIG.turn.duration;
  state.timers.turn.running = false;
  saveState();
  render();
}

function pickDrawer() {
  if (!state.players.length) {
    els.drawerOutput.textContent = "Add players to pick a drawer.";
    return;
  }
  const picked = state.players[Math.floor(Math.random() * state.players.length)];
  els.drawerOutput.textContent = `${picked} draws the next lottery number.`;
}

function addLoan(event) {
  event.preventDefault();
  const player = els.loanPlayer.value.trim();
  const principal = Number(els.loanAmount.value);
  if (!player || !principal || principal < 1) return;
  const hasActiveBankLoan = state.loans.some(
    (loan) => loan.player.toLowerCase() === player.toLowerCase(),
  );
  if (hasActiveBankLoan) {
    const empty = els.loanList.querySelector(".empty-state");
    if (empty) {
      empty.textContent = `${player} already has an active bank loan. Pay it back before starting another.`;
    }
    return;
  }
  state.loans.push({
    id: crypto.randomUUID(),
    player,
    principal,
    payoff: Math.ceil(principal * 1.05),
    createdAt: Date.now(),
    dueAt: Date.now() + 60 * 60 * SECOND,
  });
  els.loanForm.reset();
  els.loanPlayer.value = "";
  els.loanAmount.value = "";
  saveState();
  render();
}

function clearLoan(id) {
  state.loans = state.loans.filter((loan) => loan.id !== id);
  saveState();
  render();
}

function updateCalculators() {
  const defraud = Number(els.defraudAmount.value) || 0;
  els.caughtTotal.textContent = `Return ${money(defraud)}, jail bailout is ${money(defraud * 10)}`;

  const spaces = Number(els.taxSpaces.value) || 0;
  const rate = Number(els.taxRate.value) || 0;
  els.spaceTaxTotal.textContent = `${money(spaces * rate)} total tax`;
}

function renderTimer(key) {
  const card = document.querySelector(`[data-timer-card="${key}"]`);
  const orb = byId(`${key}Orb`) || card?.querySelector(".progress-orb");
  const time = byId(`${key}Time`);
  const mirror = byId(`${key}Mirror`);
  const status = byId(`${key}Status`) || byId("turnState");
  if (orb) orb.style.setProperty("--progress", `${timerProgress(key)}deg`);
  if (time) time.textContent = formatTime(state.timers[key].remaining);
  if (mirror) mirror.textContent = formatTime(state.timers[key].remaining);
  if (status) status.textContent = timerStatus(key);
  if (card) card.classList.toggle("is-due", state.timers[key].remaining <= 0);
}

function renderPlayers() {
  els.playerRail.innerHTML = "";
  if (!state.players.length) {
    const empty = document.createElement("span");
    empty.className = "soft-output";
    empty.textContent = "No players yet.";
    els.playerRail.append(empty);
    els.currentTurnLabel.textContent = "No player selected";
    return;
  }

  state.players.forEach((player, index) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `player-chip${index === state.activePlayerIndex ? " is-active" : ""}`;
    chip.textContent = player;
    chip.addEventListener("click", () => {
      state.activePlayerIndex = index;
      resetTimer("turn");
    });
    els.playerRail.append(chip);
  });

  els.currentTurnLabel.textContent = state.players[state.activePlayerIndex] || "No player selected";
}

function renderLoans() {
  els.loanCount.textContent = String(state.loans.length);
  els.loanList.innerHTML = "";
  if (!state.loans.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No active bank loans. Player loans and bribes stay off this clock.";
    els.loanList.append(empty);
    return;
  }

  state.loans.forEach((loan) => {
    const secondsLeft = Math.ceil((loan.dueAt - Date.now()) / SECOND);
    const initials = loan.player
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
    const card = document.createElement("article");
    card.className = `loan-card${secondsLeft <= 5 * 60 ? " is-warning" : ""}`;
    card.innerHTML = `
      <div class="loan-avatar">${escapeHtml(initials || "?")}</div>
      <div class="loan-top">
        <span class="loan-name">${escapeHtml(loan.player)}</span>
        <div class="loan-meta">
          <span>Loan Amount</span>
          <strong>${money(loan.principal)}</strong>
        </div>
      </div>
      <div class="loan-due">
        <span>Due In</span>
        <strong>${formatTime(secondsLeft)}</strong>
      </div>
      <div class="loan-interest">
        <span>Interest</span>
        <strong>5%</strong>
        <span>${money(loan.payoff - loan.principal)}</span>
      </div>
      <button class="text-button" type="button" data-clear-loan="${loan.id}">Paid</button>
    `;
    if (secondsLeft <= 0) {
      card.querySelector(".loan-due").innerHTML = "<span>Deadline</span><strong>Bankrupt</strong>";
    }
    els.loanList.append(card);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return entities[char];
  });
}

function renderNextAction() {
  const actions = ["lottery", "voting", "propertyTax"]
    .filter((key) => key !== "lottery" || hasLotteryTickets())
    .map((key) => ({ key, remaining: state.timers[key].remaining }))
    .sort((a, b) => a.remaining - b.remaining);

  const dueTurn = state.timers.turn.running && state.timers.turn.remaining <= 0;
  if (dueTurn) {
    els.nextAction.textContent = `${state.players[state.activePlayerIndex] || "Current player"} turn is over`;
    return;
  }

  const due = actions.find((action) => action.remaining <= 0);
  if (due) {
    els.nextAction.textContent = `${TIMER_CONFIG[due.key].label} is due now`;
    return;
  }

  if (!actions.length) {
    els.nextAction.textContent = "No table events until someone buys a lottery ticket";
    return;
  }

  els.nextAction.textContent = `${TIMER_CONFIG[actions[0].key].label} in ${formatTime(actions[0].remaining)}`;
}

function render() {
  els.gameClock.textContent = formatClock(state.gameElapsed);
  els.toblTickets.checked = state.tickets.tobl;
  els.ccTickets.checked = state.tickets.cc;
  renderPlayers();
  ["turn", "lottery", "voting", "propertyTax"].forEach(renderTimer);
  renderLoans();
  renderNextAction();
  els.loanCount.textContent = `${state.loans.length} active loan${state.loans.length === 1 ? "" : "s"}`;
  updateCalculators();
}

function tick() {
  if (state.running) {
    state.gameElapsed += 1;
    ["lottery", "voting", "propertyTax"].forEach((key) => {
      if (key === "lottery" && !hasLotteryTickets()) return;
      state.timers[key].remaining = Math.max(0, state.timers[key].remaining - 1);
    });
  }

  if (state.timers.turn.running) {
    state.timers.turn.remaining = Math.max(0, state.timers.turn.remaining - 1);
    if (state.timers.turn.remaining === 0) {
      state.timers.turn.running = false;
    }
  }

  render();
  saveState();
}

function bindEvents() {
  byId("startAllButton").addEventListener("click", () => setRunning(true));
  byId("pauseAllButton").addEventListener("click", () => setRunning(false));
  byId("resetAllButton").addEventListener("click", resetAll);
  byId("addPlayerButton").addEventListener("click", addPlayer);
  els.playerName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addPlayer();
  });
  byId("startTurnButton").addEventListener("click", startTurn);
  byId("nextTurnButton").addEventListener("click", nextTurn);
  byId("resetTurnButton").addEventListener("click", () => resetTimer("turn"));
  byId("randomDrawerButton").addEventListener("click", pickDrawer);
  els.loanForm.addEventListener("submit", addLoan);
  els.loanList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-clear-loan]");
    if (button) clearLoan(button.dataset.clearLoan);
  });
  document.querySelectorAll("[data-complete-timer]").forEach((button) => {
    button.addEventListener("click", () => completeTimer(button.dataset.completeTimer));
  });
  document.querySelectorAll("[data-reset-timer]").forEach((button) => {
    button.addEventListener("click", () => resetTimer(button.dataset.resetTimer));
  });
  els.toblTickets.addEventListener("change", () => {
    state.tickets.tobl = els.toblTickets.checked;
    saveState();
    render();
  });
  els.ccTickets.addEventListener("change", () => {
    state.tickets.cc = els.ccTickets.checked;
    saveState();
    render();
  });
  ["defraudAmount", "taxSpaces", "taxRate"].forEach((id) => {
    els[id].addEventListener("input", updateCalculators);
  });
}

cacheElements();
installIcons();
loadState();
clearTransientForms();
bindEvents();
render();
setInterval(tick, SECOND);
