export const SECOND = 1000;
export const STORAGE_KEY = "matthew-opoly-timers-v7";

export const TIMER_CONFIG = {
  lottery: { label: "Lottery Drawing", duration: 10 * 60, idle: "No tickets yet" },
  voting: { label: "Voting Window", duration: 10 * 60, idle: "Ready" },
  propertyTax: { label: "Property Tax Check", duration: 5 * 60, idle: "Ready" },
};

export const TIMER_KEYS = ["lottery", "voting", "propertyTax"];
export const GLOBAL_TIMER_KEYS = ["lottery", "voting", "propertyTax"];
