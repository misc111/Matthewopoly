import {
  addLoan,
  adjustJailCaught,
  adjustRepair,
  clearLoan,
  completeTimer,
  resetAll,
  setAlertsMuted,
  setRunning,
  setTicket,
} from "./actions.js?v=20260527c";

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
    afterChange();
  });
  els.alertMuteButton.addEventListener("click", () => {
    setAlertsMuted(els.alertMuteButton.getAttribute("aria-pressed") !== "true");
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
  document.querySelectorAll("[data-adjust-repair]").forEach((button) => {
    button.addEventListener("click", () => {
      adjustRepair(button.dataset.adjustRepair, Number(button.dataset.delta));
      afterChange();
    });
  });
  document.querySelectorAll("[data-adjust-caught]").forEach((button) => {
    button.addEventListener("click", () => {
      adjustJailCaught(Number(button.dataset.adjustCaught));
      afterChange();
    });
  });
  document.getElementById("rulesButton").addEventListener("click", () => {
    document.getElementById("rulesPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
