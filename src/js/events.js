import {
  addLoan,
  addPlayer,
  clearLoan,
  completeTimer,
  nextTurn,
  pickDrawer,
  resetAll,
  resetTimer,
  selectPlayer,
  setRunning,
  setTheme,
  setTicket,
  startTurn,
} from "./actions.js";

export function bindEvents(els, afterChange, renderOnly) {
  document.getElementById("startAllButton").addEventListener("click", () => {
    setRunning(true);
    afterChange();
  });
  document.getElementById("pauseAllButton").addEventListener("click", () => {
    setRunning(false);
    afterChange();
  });
  document.getElementById("resetAllButton").addEventListener("click", () => {
    resetAll();
    els.loanForm.reset();
    els.playerName.value = "";
    afterChange();
  });
  document.getElementById("addPlayerButton").addEventListener("click", () => {
    if (addPlayer(els.playerName.value)) els.playerName.value = "";
    afterChange();
  });
  els.playerName.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    if (addPlayer(els.playerName.value)) els.playerName.value = "";
    afterChange();
  });
  document.getElementById("startTurnButton").addEventListener("click", () => {
    startTurn(els.playerName.value);
    els.playerName.value = "";
    afterChange();
  });
  document.getElementById("nextTurnButton").addEventListener("click", () => {
    nextTurn();
    afterChange();
  });
  document.getElementById("resetTurnButton").addEventListener("click", () => {
    resetTimer("turn");
    afterChange();
  });
  document.getElementById("randomDrawerButton").addEventListener("click", () => {
    pickDrawer();
    afterChange();
  });
  els.playerRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-player-index]");
    if (!button) return;
    selectPlayer(Number(button.dataset.playerIndex));
    afterChange();
  });
  els.loanForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (addLoan(els.loanPlayer.value, els.loanAmount.value)) els.loanForm.reset();
    afterChange();
  });
  els.loanList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-clear-loan]");
    if (!button) return;
    clearLoan(button.dataset.clearLoan);
    afterChange();
  });
  document.querySelectorAll("[data-complete-timer]").forEach((button) => {
    button.addEventListener("click", () => {
      completeTimer(button.dataset.completeTimer);
      afterChange();
    });
  });
  els.toblTickets.addEventListener("change", () => {
    setTicket("tobl", els.toblTickets.checked);
    afterChange();
  });
  els.ccTickets.addEventListener("change", () => {
    setTicket("cc", els.ccTickets.checked);
    afterChange();
  });
  els.themeButtons.addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme]");
    if (!button) return;
    setTheme(button.dataset.theme);
    afterChange();
  });
  ["defraudAmount", "taxSpaces", "taxRate"].forEach((id) => {
    els[id].addEventListener("input", renderOnly);
  });
}
