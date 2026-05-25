import { GLOBAL_TIMER_KEYS, SECOND, TIMER_CONFIG } from "./config.js";
import { state, resetState } from "./state.js";
import { hasLotteryTickets } from "./selectors.js";

export function setRunning(running) {
  state.running = running;
  state.startedAt = running ? Date.now() : null;
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
  if (key === "turn") state.timers.turn.running = false;
}

export function addPlayer(name) {
  const playerName = name.trim();
  if (!playerName) return false;
  state.players.push(playerName);
  if (state.activePlayerIndex === -1) state.activePlayerIndex = 0;
  return true;
}

export function selectPlayer(index) {
  state.activePlayerIndex = index;
  resetTimer("turn");
}

export function startTurn(nameFallback = "") {
  if (!state.players.length) addPlayer(nameFallback);
  if (!state.players.length) return;
  if (state.activePlayerIndex < 0) state.activePlayerIndex = 0;
  state.timers.turn.remaining = TIMER_CONFIG.turn.duration;
  state.timers.turn.running = true;
}

export function nextTurn() {
  if (!state.players.length) return;
  state.activePlayerIndex = (state.activePlayerIndex + 1) % state.players.length;
  state.timers.turn.remaining = TIMER_CONFIG.turn.duration;
  state.timers.turn.running = false;
}

export function pickDrawer() {
  if (!state.players.length) {
    state.drawerMessage = "Add players to pick a drawer.";
    return;
  }
  const picked = state.players[Math.floor(Math.random() * state.players.length)];
  state.drawerMessage = `${picked} draws the next lottery number.`;
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

export function setTheme(theme) {
  state.theme = theme;
}

export function tick() {
  if (state.running) {
    state.gameElapsed += 1;
    GLOBAL_TIMER_KEYS.forEach((key) => {
      if (key === "lottery" && !hasLotteryTickets()) return;
      state.timers[key].remaining = Math.max(0, state.timers[key].remaining - 1);
    });
  }

  if (state.timers.turn.running) {
    state.timers.turn.remaining = Math.max(0, state.timers.turn.remaining - 1);
    if (state.timers.turn.remaining === 0) state.timers.turn.running = false;
  }
}
