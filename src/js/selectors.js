import { GLOBAL_TIMER_KEYS, TIMER_CONFIG } from "./config.js";
import { state } from "./state.js";

export function hasLotteryTickets() {
  return state.tickets.tobl || state.tickets.cc;
}

export function timerProgress(key) {
  const config = TIMER_CONFIG[key];
  const timer = state.timers[key];
  return ((config.duration - timer.remaining) / config.duration) * 360;
}

export function timerStatus(key) {
  if (key === "lottery" && !hasLotteryTickets()) return "No tickets";
  if (state.timers[key].remaining <= 0) return "Due now";
  return state.running ? "Running" : TIMER_CONFIG[key].idle;
}

export function nextDueTableTimer() {
  return GLOBAL_TIMER_KEYS.filter((key) => key !== "lottery" || hasLotteryTickets())
    .map((key) => ({ key, remaining: state.timers[key].remaining }))
    .sort((a, b) => a.remaining - b.remaining)[0];
}
