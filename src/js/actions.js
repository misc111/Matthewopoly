import { GLOBAL_TIMER_KEYS, SECOND, TIMER_CONFIG } from "./config.js?v=20260527c";
import { state, resetState } from "./state.js?v=20260527c";
import { hasLotteryTickets } from "./selectors.js?v=20260527c";

export function setRunning(running) {
  state.running = running;
  state.startedAt = running ? Date.now() : null;
}

export function setAlertsMuted(muted) {
  state.alertsMuted = muted;
}

export function resetAll() {
  resetState();
}

export function completeTimer(key) {
  state.timers[key].remaining = TIMER_CONFIG[key].duration;
  state.timers[key].lastCompletedAt = Date.now();
}

export function resetTimer(key) {
  state.timers[key].remaining = TIMER_CONFIG[key].duration;
}

export function setTicket(pool, checked) {
  state.tickets[pool] = checked;
}

export function addLoan(playerName, principalValue) {
  const player = playerName.trim();
  const principal = Number(principalValue);
  if (!player || !principal || principal < 1) return false;

  const hasActiveBankLoan = state.loans.some(
    (loan) => loan.player.toLowerCase() === player.toLowerCase(),
  );

  if (hasActiveBankLoan) {
    state.loanMessage = `${player} already has an active bank loan. Pay it back before starting another.`;
    return false;
  }

  state.loanMessage = "";
  state.loans.push({
    id: crypto.randomUUID(),
    player,
    principal,
    payoff: Math.ceil(principal * 1.05),
    createdAt: Date.now(),
    dueAt: Date.now() + 60 * 60 * SECOND,
  });
  return true;
}

export function clearLoan(id) {
  state.loans = state.loans.filter((loan) => loan.id !== id);
}

export function adjustRepair(kind, delta) {
  if (!["houses", "hotels"].includes(kind)) return;
  delete state.repairs.costOverride;
  state.repairs[kind] = Math.max(0, Number(state.repairs[kind] || 0) + delta);
}

export function adjustJailCaught(delta) {
  state.jailCaught = Math.max(0, Number(state.jailCaught || 0) + delta);
}

export function tick() {
  const dueTimers = [];

  if (state.running) {
    state.gameElapsed += 1;
    GLOBAL_TIMER_KEYS.forEach((key) => {
      if (key === "lottery" && !hasLotteryTickets()) return;
      const wasRemaining = state.timers[key].remaining;
      state.timers[key].remaining = Math.max(0, state.timers[key].remaining - 1);
      if (wasRemaining > 0 && state.timers[key].remaining === 0) dueTimers.push(key);
    });
  }

  return dueTimers;
}
