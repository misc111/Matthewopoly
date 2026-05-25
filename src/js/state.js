import { STORAGE_KEY, TIMER_CONFIG } from "./config.js";

function createTimerState() {
  return {
    lottery: { remaining: TIMER_CONFIG.lottery.duration, lastCompletedAt: null },
    voting: { remaining: TIMER_CONFIG.voting.duration, lastCompletedAt: null },
    propertyTax: { remaining: TIMER_CONFIG.propertyTax.duration, lastCompletedAt: null },
    turn: { remaining: TIMER_CONFIG.turn.duration, running: false },
  };
}

export function createInitialState() {
  return {
    running: false,
    startedAt: null,
    gameElapsed: 0,
    theme: "classic",
    timers: createTimerState(),
    tickets: { tobl: false, cc: false },
    players: [],
    activePlayerIndex: -1,
    loans: [],
    drawerMessage: "Add players to pick a drawer.",
    loanMessage: "",
  };
}

export const state = createInitialState();

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return;
    const defaults = createInitialState();
    Object.assign(state, defaults, saved, {
      timers: {
        ...defaults.timers,
        ...saved.timers,
        turn: { ...defaults.timers.turn, ...saved.timers?.turn, running: false },
      },
      tickets: { ...defaults.tickets, ...saved.tickets },
      running: false,
      startedAt: null,
    });
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  Object.assign(state, createInitialState());
}
