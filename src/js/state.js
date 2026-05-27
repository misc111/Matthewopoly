import { STORAGE_KEY, TIMER_CONFIG } from "./config.js";

function createTimerState() {
  return {
    lottery: { remaining: TIMER_CONFIG.lottery.duration, lastCompletedAt: null },
    voting: { remaining: TIMER_CONFIG.voting.duration, lastCompletedAt: null },
    propertyTax: { remaining: TIMER_CONFIG.propertyTax.duration, lastCompletedAt: null },
  };
}

export function createInitialState() {
  return {
    running: false,
    startedAt: null,
    gameElapsed: 0,
    alertsMuted: false,
    timers: createTimerState(),
    tickets: { tobl: false, cc: false },
    loans: [],
    loanMessage: "",
    repairs: { houses: 3, hotels: 1 },
    jailCaught: 2,
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
      },
      tickets: { ...defaults.tickets, ...saved.tickets },
      running: false,
      startedAt: null,
      alertsMuted: Boolean(saved.alertsMuted),
      repairs: { ...defaults.repairs, ...saved.repairs },
      jailCaught: Number.isFinite(saved.jailCaught) ? saved.jailCaught : defaults.jailCaught,
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
