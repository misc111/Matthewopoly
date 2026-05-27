import { TIMER_CONFIG, TIMER_KEYS } from "./config.js?v=20260527c";
import { byId } from "./dom.js";
import { escapeHtml, formatClock, formatTime, money } from "./formatters.js";
import { svgIcon } from "./icons.js?v=20260527c";
import { nextDueTableTimer, timerProgress, timerStatus } from "./selectors.js?v=20260527c";
import { state } from "./state.js?v=20260527c";

function applyTheme(els) {
  document.documentElement.dataset.theme = "classic";
  els.appShell.dataset.theme = "classic";
}

function formatClockMeta() {
  return "Today • 5:24 PM";
}

function renderTimer(key) {
  const card = document.querySelector(`[data-timer-card="${key}"]`);
  const orb = byId(`${key}Orb`) || card?.querySelector(".progress-orb");
  const time = byId(`${key}Time`);
  const mirror = byId(`${key}Mirror`);
  const status = byId(`${key}Status`);
  if (orb) orb.style.setProperty("--progress", `${timerProgress(key)}deg`);
  if (time) time.textContent = formatTime(state.timers[key].remaining);
  if (mirror) mirror.textContent = formatTime(state.timers[key].remaining);
  if (status) status.textContent = timerStatus(key);
  if (card) card.classList.toggle("is-due", state.timers[key].remaining <= 0);
}

function formatDueAt(timestamp) {
  return new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
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
        <strong>${formatClock(secondsLeft)}</strong>
        <small>Due: Today, ${escapeHtml(loan.dueLabel || formatDueAt(loan.dueAt))}</small>
      </div>
      <div class="loan-interest">
        <span>Interest</span>
        <strong>5%</strong>
        <small>(${money(loan.payoff - loan.principal)})</small>
      </div>
      <button class="loan-menu" type="button" data-clear-loan="${loan.id}" aria-label="Mark ${escapeHtml(loan.player)} loan paid">⋮</button>
    `;
    if (secondsLeft <= 0) {
      card.querySelector(".loan-due").innerHTML = "<span>Deadline</span><strong>Bankrupt</strong><small>Due now</small>";
    }
    els.loanList.append(card);
  });
}

function renderNextAction(els) {
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

function renderCalculators(els) {
  const houses = Number(state.repairs.houses || 0);
  const hotels = Number(state.repairs.hotels || 0);
  const repairCost = Number.isFinite(state.repairs.costOverride)
    ? state.repairs.costOverride
    : houses * 250 + hotels * 1000;
  const caught = Number(state.jailCaught || 0);
  els.housesCount.textContent = String(houses);
  els.hotelsCount.textContent = String(hotels);
  els.repairCostTotal.textContent = money(repairCost);
  els.caughtCount.textContent = String(caught);
  els.caughtPenaltyTotal.textContent = money(caught * 1000);
  els.caughtPenaltyNote.textContent = caught === 1 ? "($1,000 per catch)" : "($1,000 per catch)";
}

export function render(els) {
  applyTheme(els);
  els.gameClock.textContent = formatClock(state.gameElapsed);
  els.clockMeta.textContent = formatClockMeta();
  els.alertMuteButton.classList.toggle("is-muted", state.alertsMuted);
  els.alertMuteButton.setAttribute("aria-pressed", String(state.alertsMuted));
  els.alertMuteButton.setAttribute("aria-label", state.alertsMuted ? "Unmute timer sound" : "Mute timer sound");
  els.alertMuteButton.querySelector(".utility-label").textContent = state.alertsMuted ? "Muted" : "Sound";
  els.alertMuteButton.querySelector("[data-icon]").innerHTML = svgIcon(state.alertsMuted ? "volume-x" : "volume-2");
  els.toblTickets.checked = state.tickets.tobl;
  els.ccTickets.checked = state.tickets.cc;
  TIMER_KEYS.forEach(renderTimer);
  renderLoans(els);
  renderNextAction(els);
  els.loanCount.textContent = `${state.loans.length} active loan${state.loans.length === 1 ? "" : "s"}`;
  renderCalculators(els);
}
