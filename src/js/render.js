import { TIMER_CONFIG, TIMER_KEYS, THEMES } from "./config.js";
import { byId } from "./dom.js";
import { escapeHtml, formatClock, formatTime, money } from "./formatters.js";
import { nextDueTableTimer, timerProgress, timerStatus } from "./selectors.js";
import { state } from "./state.js";

function applyTheme(els) {
  const theme = THEMES[state.theme] ? state.theme : "classic";
  document.documentElement.dataset.theme = theme;
  els.appShell.dataset.theme = theme;
  els.themeButtons.querySelectorAll("[data-theme]").forEach((button) => {
    const isActive = button.dataset.theme === state.theme;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateCalculators(els) {
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

function renderPlayers(els) {
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
    chip.dataset.playerIndex = String(index);
    chip.textContent = player;
    els.playerRail.append(chip);
  });

  els.currentTurnLabel.textContent = state.players[state.activePlayerIndex] || "No player selected";
}

function renderLoans(els) {
  els.loanList.innerHTML = "";
  if (!state.loans.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = state.loanMessage || "No active bank loans. Player loans and bribes stay off this clock.";
    els.loanList.append(empty);
    return;
  }

  state.loans.forEach((loan) => {
    const secondsLeft = Math.ceil((loan.dueAt - Date.now()) / 1000);
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

function renderNextAction(els) {
  const dueTurn = state.timers.turn.running && state.timers.turn.remaining <= 0;
  if (dueTurn) {
    els.nextAction.textContent = `${state.players[state.activePlayerIndex] || "Current player"} turn is over`;
    return;
  }

  const next = nextDueTableTimer();
  if (!next) {
    els.nextAction.textContent = "No table events until someone buys a lottery ticket";
    return;
  }
  if (next.remaining <= 0) {
    els.nextAction.textContent = `${TIMER_CONFIG[next.key].label} is due now`;
    return;
  }
  els.nextAction.textContent = `${TIMER_CONFIG[next.key].label} in ${formatTime(next.remaining)}`;
}

export function render(els) {
  applyTheme(els);
  els.gameClock.textContent = formatClock(state.gameElapsed);
  els.toblTickets.checked = state.tickets.tobl;
  els.ccTickets.checked = state.tickets.cc;
  els.drawerOutput.textContent = state.drawerMessage;
  renderPlayers(els);
  TIMER_KEYS.forEach(renderTimer);
  renderLoans(els);
  renderNextAction(els);
  els.loanCount.textContent = `${state.loans.length} active loan${state.loans.length === 1 ? "" : "s"}`;
  updateCalculators(els);
}
