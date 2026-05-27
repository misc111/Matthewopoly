import { STORAGE_KEY, TIMER_CONFIG } from "./config.js";

function createTimerState() {
  return {
    lottery: { remaining: 6 * 60 + 32, lastCompletedAt: null },
    voting: { remaining: 6 * 60 + 32, lastCompletedAt: null },
    propertyTax: { remaining: 1 * 60 + 32, lastCompletedAt: null },
  };
}

function createReferenceLoans(now = Date.now()) {
  return [
    {
      id: "reference-alex",
      player: "Alex W.",
      principal: 1500,
      payoff: 1575,
      createdAt: now - 27 * 60 * 1000,
      dueAt: now + (1 * 60 * 60 + 32 * 60 + 15) * 1000,
    },
    {
      id: "reference-maya",
      player: "Maya C.",
      principal: 3000,
      payoff: 3150,
      createdAt: now - 41 * 60 * 1000,
      dueAt: now + (18 * 60 + 42) * 1000,
    },
    {
      id: "reference-jordan",
      player: "Jordan D.",
      principal: 2000,
      payoff: 2100,
      createdAt: now - 57 * 60 * 1000,
      dueAt: now + (2 * 60 + 31) * 1000,
    },
  ];
}

export function createInitialState() {
  const now = Date.now();
  return {
    running: false,
    startedAt: null,
    gameElapsed: 1 * 60 * 60 + 24 * 60 + 37,
    alertsMuted: false,
    timers: createTimerState(),
    tickets: { tobl: true, cc: true },
    loans: createReferenceLoans(now),
    loanMessage: "",
    repairs: { houses: 1, hotels: 1 },
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
